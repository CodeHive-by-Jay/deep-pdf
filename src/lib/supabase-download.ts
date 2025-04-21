import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import os from "os";

// Create a Supabase client with the service role key for server-side operations
// Use a function to create the client to ensure proper module loading
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export const downloadPdfToTemp = async (bucket: string, filePath: string): Promise<string> => {
    try {
        console.log(`Downloading from bucket "${bucket}", path: "${filePath}"`);

        // Get the admin client for this specific request
        const supabase = getSupabaseAdmin();

        const { data, error } = await supabase.storage.from(bucket).download(filePath);

        if (error) {
            console.error("Supabase download error:", error);
            throw new Error(`Failed to download PDF from Supabase: ${error.message}`);
        }

        if (!data) {
            throw new Error("No data returned from Supabase");
        }

        // Use OS-specific temp directory instead of hardcoded /tmp which doesn't work on Windows
        const filename = `${Date.now()}-${filePath.split("/").pop()}`;
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, filename);

        console.log(`Using temp directory: ${tempDir}`);

        try {
            await fs.writeFile(tempFilePath, Buffer.from(await data.arrayBuffer()));
            console.log(`File downloaded successfully to: ${tempFilePath}`);
            return tempFilePath;
        } catch (fsError) {
            console.error("File system error writing temp file:", fsError);
            throw fsError;
        }
    } catch (error) {
        console.error("Download error:", error);
        throw error;
    }
};
