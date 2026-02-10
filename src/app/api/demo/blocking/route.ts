//localhost:3000/api/demo/blocking

import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY
})


export async function POST(){
    const response = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });

    return Response.json({response})
}