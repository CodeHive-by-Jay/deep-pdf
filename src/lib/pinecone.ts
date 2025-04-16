import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromBucket } from '@/lib/bucket-server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { Document } from 'langchain/document';
import fs from 'fs';

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
    if (!pinecone) {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });
    }
    return pinecone;
};

export async function LoadBucketIntoPinecone(fileKey: string) {
    try {
        console.log('Downloading PDF from Supabase bucket...');
        const filePath = await downloadFromBucket(fileKey);

        console.log('Loading PDF content...');
        const loader = new PDFLoader(filePath);
        const pages: Document[] = await loader.load();

        // Clean up temporary file
        fs.unlinkSync(filePath);

        return {
            pages,
            rawText: pages.map((page: Document) => page.pageContent).join('\n'),
        };
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw error;
    }
}
