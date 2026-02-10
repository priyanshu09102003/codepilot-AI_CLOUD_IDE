import { generateText } from "ai";
import { inngest } from "./client";
import { groq } from "@ai-sdk/groq";
import { firecrawl } from "@/lib/firecrawl";

const URL_REGEX = /https?:\/\/[^\s]+/g;

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ event , step }) => {

    const {prompt} = event.data as {prompt: string}

    //STEP1: GETTING ALL THE URLS from THE USER's QUERY
    const urls = await step.run("extract-urls", async() => {


      return prompt.match(URL_REGEX) ?? [];

    }) as string[];

    //STEP2: Scraping the URLs using the firecrawl api to LLM-ready DATA

    const scrapedContent = await step.run("scrape-urls", async() => {
      const results = await Promise.all(
        urls.map(async(url) => {
          const result = await firecrawl.scrape(
            url,
            {formats: ["markdown"]}
          );

          return result.markdown ?? null;
        })
      )

      return results.filter(Boolean).join("\n\n")
    })


    //STEP3:  Structuring the prompt of the user so tht the ai can read documentations and gather info from the urls to prevent knowledge cutoff

    const finalPrompt = scrapedContent
     ? `Context:\n${scrapedContent}\n\nQuestion: ${prompt}`
    : prompt;


    //STEP4: Putting the prompt to the LLM

    await step.run("generate-text" , async()=> {
        return await generateText({
            model: groq("llama-3.3-70b-versatile"),
            prompt: finalPrompt,
        });
    })
  },
);