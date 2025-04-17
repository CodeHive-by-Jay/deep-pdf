import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const downloadPdfToTemp = async (bucket: string, filePath: string): Promise<string> => {
    const { data, error } = await supabase.storage.from(bucket).download(filePath);

    if (error || !data) throw new Error("Failed to download PDF from Supabase.");

    const tempFilePath = `/tmp/${Date.now()}-${filePath.split("/").pop()}`;
    await fs.writeFile(tempFilePath, Buffer.from(await data.arrayBuffer()));

    return tempFilePath;
};
