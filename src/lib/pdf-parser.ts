import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs";

export const parsePdf = async (pdfPath: string): Promise<string> => {
    if (!fs.existsSync(pdfPath)) throw new Error("PDF file not found.");

    const loader = new PDFLoader(pdfPath);
    const documents = await loader.load();

    const text = documents.map((doc) => doc.pageContent).join("\n");
    return text;
};
