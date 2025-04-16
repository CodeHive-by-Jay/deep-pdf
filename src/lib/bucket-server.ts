import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function downloadFromBucket(file_key: string): Promise<string> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
        // Create a temporary file path
        const tmpDir = os.tmpdir();
        const tmpFilePath = path.join(tmpDir, `pdf-${Date.now()}.pdf`);

        // Download file from Supabase bucket
        const { data, error } = await supabase
            .storage
            .from('pdfs') // Replace with your bucket name
            .download(file_key);

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error('No data received from Supabase');
        }

        // Write the file to temp directory
        fs.writeFileSync(tmpFilePath, Buffer.from(await data.arrayBuffer()));
        console.log('File downloaded to:', tmpFilePath);

        return tmpFilePath;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
}