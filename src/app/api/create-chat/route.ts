import { LoadBucketIntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { file_key, file_name } = body;
        console.log("Processing file:", { file_key, file_name });

        const { pages, rawText } = await LoadBucketIntoPinecone(file_key);

        return NextResponse.json({
            success: true,
            pageCount: pages.length,
            rawText
        });
    } catch (error) {
        console.error("Error in create-chat API:", error);
        return NextResponse.json(
            { error: "Failed to process PDF" },
            { status: 500 }
        );
    }
}