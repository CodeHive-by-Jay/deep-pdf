import { NextResponse } from "next/server";
import { downloadPdfToTemp } from "@/lib/supabase-download";
import { parsePdfAndSplit } from "@/lib/pdf-parser";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { verifyToken } from "@/lib/auth-helpers";
// You'll need to import your database operations
// import { createChatInDB, storePdfChunks } from "@/lib/db";

export async function POST(req: Request) {
    try {
        // Extract the authorization header
        const authHeader = req.headers.get("authorization");
        console.log("Auth header present:", !!authHeader);

        // First try using Clerk's built-in auth
        const { userId: clerkUserId } = await auth();
        console.log("Auth userId from Clerk auth():", clerkUserId);

        let userId = clerkUserId;

        // If Clerk auth failed, try manual token verification
        if (!userId && authHeader) {
            const token = authHeader.replace("Bearer ", "");
            try {
                // Try to manually verify the token and extract user info
                const tokenUserId = await verifyToken(token);
                if (tokenUserId) {
                    userId = tokenUserId;
                    console.log("Authenticated via manual token verification:", userId);
                }
            } catch (error) {
                console.error("Token verification failed:", error);
            }
        }

        // If we still don't have a userId, return unauthorized
        if (!userId) {
            console.error("Unauthorized: No valid user ID found in any auth context");
            return NextResponse.json(
                { error: "Unauthorized - Please sign in" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { file_key, file_name } = body;

        if (!file_key || !file_name) {
            return NextResponse.json(
                { error: "Missing required fields: file_key or file_name" },
                { status: 400 }
            );
        }

        console.log("Processing file:", { file_key, file_name, userId });

        // Step 1: Download the file from Supabase to /tmp
        const tempPath = await downloadPdfToTemp("user-files", file_key);

        // Step 2: Extract the text from the PDF and split into chunks
        const { text, chunks } = await parsePdfAndSplit(tempPath);

        // Step 3: Create chat in database and store chunks
        // This is where you'd store the chat and chunks in your database
        // const chatId = await createChatInDB({
        //     userId,
        //     fileKey: file_key,
        //     fileName: file_name,
        //     fullText: text
        // });

        // await storePdfChunks(chatId, chunks);

        // For now, just log and return
        console.log(`Extracted ${chunks.length} chunks from PDF`);

        return NextResponse.json({
            message: "Chat created successfully",
            file_key,
            file_name,
            preview: text.slice(0, 500),
            chunkCount: chunks.length,
            firstChunk: chunks[0]?.slice(0, 200) || ''
        });
    } catch (error) {
        console.error("Error in create-chat API:", error);
        return NextResponse.json(
            { error: "Failed to create chat" },
            { status: 500 }
        );
    }
}
