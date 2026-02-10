import { generateText } from "ai";
import { inngest } from "./client";
import { groq } from "@ai-sdk/groq";

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ step }) => {
    await step.run("generate-text" , async()=> {
        return await generateText({
            model: groq("llama-3.3-70b-versatile"),
            prompt: 'Write a vegetarian lasagna recipe for 4 people.',
        });
    })
  },
);