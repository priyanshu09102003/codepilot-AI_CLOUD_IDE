import z from "zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";

const requestSchema = z.object({
    conversationId: z.string(),
    message: z.string()
})

export async function POST(request: Request){
    const {userId} = await auth();

    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {
            status: 401
        })
    }

    const body = await request.json();
    const {conversationId, message} = requestSchema.parse(body);

    //Call convex mutation, query

    const conversation = await convex.query(api)

    //Invoke: Inngest background job
}