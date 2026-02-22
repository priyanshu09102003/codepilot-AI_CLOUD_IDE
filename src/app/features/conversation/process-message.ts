import { inngest } from "@/inngest/client";
import { Id } from "../../../../convex/_generated/dataModel";
import { NonRetriableError } from "inngest";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";
import { CODING_AGENT_SYSTEM_PROMPT, DEFAULT_CONVERSATION_TITLE, TITLE_GENERATOR_SYSTEM_PROMPT } from "./constants";
import { createAgent, gemini } from '@inngest/agent-kit'


interface MessageEvent{
    messageId: Id<"messages">;
    conversationId: Id<"conversations">;
    projectId: Id<"projects">;
    message: string
}

export const processMessage = inngest.createFunction(
    {
        id: "process-message",
        cancelOn: [
        {

            event: "message/cancel",
            if: "event.data.messageId == async.data.messageId"

        }
    ],
    onFailure: async({event, step}) => {
        const {messageId} = event.data.event.data as MessageEvent;
        const internalKey = process.env.CONVEX_INTERNAL_KEY;

        //Update the message with error content

        if(internalKey){
            await step.run("update-message-on-failure", async() => {
                await convex.mutation(api.system.updateMessageContent, {
                    internalKey,
                    messageId,
                    content: "My apologies, I encountered an error while processing your request. Please try again later."
                });
            })
        }
    },
    },
    {
        event: "message/sent"
    },

    async({event, step}) => {
        const {
            messageId,
            conversationId,
            projectId,
            message
        } = event.data as MessageEvent;

        const internalKey = process.env.CONVEX_INTERNAL_KEY;

        if(!internalKey){
            throw new NonRetriableError("CONVEX_INTERNAL_KEY is not configured")
        }



        await step.sleep("wait-database-sync", "3s");

        //Get the conversation to change the title
        const conversation = await step.run("get-conversation", async() => {
            return await convex.query(api.system.getConversationById, {
                internalKey,
                conversationId
            })
        })
        
        if(!conversation){
            throw new NonRetriableError("Conversation not found")
        }

        //Fetch the recent mesaages

        const recentMessages = await step.run("get-recent-messages", async()=>{
            return await convex.query(api.system.getRecentMessages, {
                internalKey,
                conversationId,
                limit: 10 //Giving context to the ai model of the previous messages
            })
        });

        //Build the system prompt with the conversation history
        let systemPrompt = CODING_AGENT_SYSTEM_PROMPT;

        //Filter out the current processing messages and empty messages

        const contextMessages = recentMessages.filter(
            (msg) => msg._id !== messageId && msg.content.trim()!== ""
        );

        
        if(contextMessages.length > 0){
            const historyText = contextMessages
                .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                .join("\n\n");

            systemPrompt += `\n\n## Previous Conversation (for context only - do NOT repeat these responses):\n${historyText}\n\n## Current Request:\nRespond ONLY to the user's new message below. Do not repeat or reference your previous responses.`;
        }

        //Generate conversation title 
        const shouldGenerateTitle = conversation.title === DEFAULT_CONVERSATION_TITLE;

        if(shouldGenerateTitle){
            //creating a title agent
            const titleAgent = createAgent({
                name: "title-generator",
                system: TITLE_GENERATOR_SYSTEM_PROMPT,
                model: gemini({
                    model: "gemini-2.5-flash",
                    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
                })
            });

            const {output} = await titleAgent.run(message, {step});

            const textMessage = output.find(
                (m) => m.type === "text" && m.role === "assistant"
            );

            if(textMessage?.type === "text"){
                const title = 
                        typeof textMessage.content === "string"
                            ? textMessage.content.trim()
                            : textMessage.content
                            .map((c) => c.text)
                            .join("")
                            .trim();

                    if(title){
                        await step.run("update-conversation-title", async() => {
                            await convex.mutation(api.system.updateConversationTitle, {
                                internalKey,
                                conversationId,
                                title
                            })
                        })
                    }
            }
        }

        await step.run("update-assistant-message", async() => {
            await convex.mutation(api.system.updateMessageContent,{
                internalKey,
                messageId,
                content: "AI PROCESSED MESSAGE"
            })
        })
    }
)