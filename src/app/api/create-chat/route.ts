import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { file_key, file_name } = body;

        console.log("Received file:", { file_key, file_name });

        return NextResponse.json({
            message: "Chat created successfully",
            file_key,
            file_name
        });
    } catch (error) {
        console.error("Error in create-chat API:", error);
        return NextResponse.json(
            { error: "Failed to create chat" },
            { status: 500 }
        );
    }
}
