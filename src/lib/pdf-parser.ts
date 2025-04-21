import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import fs from "fs";
import path from "path";

export const parsePdf = async (pdfPath: string): Promise<string> => {
    // Normalize path for cross-platform compatibility
    const normalizedPath = path.normalize(pdfPath);
    console.log(`Attempting to parse PDF at: ${normalizedPath}`);

    if (!fs.existsSync(normalizedPath)) {
        console.error(`PDF file not found at path: ${normalizedPath}`);
        throw new Error(`PDF file not found at path: ${normalizedPath}`);
    }

    try {
        const loader = new PDFLoader(normalizedPath);
        const documents = await loader.load();

        const text = documents.map((doc) => doc.pageContent).join("\n");
        console.log(`Successfully parsed PDF with ${documents.length} pages`);
        return text;
    } catch (error) {
        console.error(`Error parsing PDF: ${error}`);
        throw error;
    }
};

export const parsePdfAndSplit = async (pdfPath: string): Promise<{ text: string, chunks: string[] }> => {
    // Normalize path for cross-platform compatibility
    const normalizedPath = path.normalize(pdfPath);
    console.log(`Attempting to parse and split PDF at: ${normalizedPath}`);

    if (!fs.existsSync(normalizedPath)) {
        console.error(`PDF file not found at path: ${normalizedPath}`);
        throw new Error(`PDF file not found at path: ${normalizedPath}`);
    }

    try {
        const loader = new PDFLoader(normalizedPath);
        const documents = await loader.load();

        const fullText = documents.map((doc) => doc.pageContent).join("\n");
        console.log(`Successfully loaded PDF with ${documents.length} pages and ${fullText.length} characters`);

        // Split text into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const chunks = await textSplitter.splitText(fullText);
        console.log(`Split text into ${chunks.length} chunks`);

        return {
            text: fullText,
            chunks: chunks
        };
    } catch (error) {
        console.error(`Error parsing and splitting PDF: ${error}`);
        throw error;
    }
};
