import { createClient } from '@supabase/supabase-js';

// Create the Supabase client once outside the function
// This prevents multiple client instances from being created
const createSupabaseClient = (token: string) => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            },
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }
    );
};

export const uploadToSupabaseBucket = async (file: File, userId: string, token: string) => {
    try {
        if (!token) {
            throw new Error('No authentication token provided');
        }

        // Create a new Supabase client with the Clerk JWT
        const supabase = createSupabaseClient(token);

        // Clean the file name to prevent path traversal
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileKey = `uploads/${userId}/${Date.now()}-${safeFileName}`;

        const { data, error } = await supabase.storage
            .from('user-files')
            .upload(fileKey, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload failed:', error);
            throw error;
        }

        console.log('Upload success:', data);

        // Get the public URL
        const { data: urlData } = await supabase.storage
            .from('user-files')
            .getPublicUrl(fileKey);

        return {
            file_key: fileKey,
            file_name: safeFileName,
            url: urlData.publicUrl
        };
    } catch (error) {
        console.error('Error uploading to Supabase bucket:', error);
        throw error;
    }
};

export function getSupabaseFileUrl(fileKey: string) {
    // Create a simple client for public URL generation (no auth needed)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const bucketName = 'user-files';
    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileKey);

    if (!data.publicUrl) {
        throw new Error('Error generating public URL');
    }

    return data.publicUrl;
}