import { NextResponse } from "next/server";
import { downloadPdfToTemp } from "@/lib/supabase-download";
import { parsePdf } from "@/lib/pdf-parser"

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { file_key, file_name } = body;

        console.log("Received file:", { file_key, file_name });

        // Step 1: Download the file from Supabase to /tmp
        const tempPath = await downloadPdfToTemp("pdfs", file_key);

        // Step 2: Extract the text from the PDF
        const parsedText = await parsePdf(tempPath);

        // ✅ Step 3: Do something with parsedText here (e.g., embed, chat, etc.)
        console.log("Parsed text preview:", parsedText.slice(0, 300));

        return NextResponse.json({
            message: "Chat created successfully",
            file_key,
            file_name,
            preview: parsedText.slice(0, 500) // return a snippet
        });
    } catch (error) {
        console.error("Error in create-chat API:", error);
        return NextResponse.json(
            { error: "Failed to create chat" },
            { status: 500 }
        );
    }
}
