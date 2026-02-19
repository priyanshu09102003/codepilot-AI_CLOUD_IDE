import { inngest } from "@/inngest/client";
import { Id } from "../../../../convex/_generated/dataModel";
import { NonRetriableError } from "inngest";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";

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
    ]
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

        await step.sleep("wait-for-ai-processing", "5s");

        await step.run("update-assistant-message", async() => {
            await convex.mutation(api.system.updateMessageContent,{
                internalKey,
                messageId,
                content: "AI PROCESSED MESSAGE"
            })
        })
    }
)