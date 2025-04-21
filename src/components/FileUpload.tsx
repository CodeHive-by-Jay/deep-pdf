"use client";
import { uploadToSupabaseBucket } from "@/lib/bucket";
import { Inbox } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CreateChatResponse {
    message: string;
    file_key: string;
    file_name: string;
    preview: string;
    chunkCount: number;
    firstChunk: string;
}

const FileUpload = () => {
    const { userId, getToken } = useAuth();
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    // Keep track of the token used for upload to reuse for processing
    const [currentToken, setCurrentToken] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async ({ file_key, file_name }: { file_key: string; file_name: string }) => {
            try {
                // Get a fresh token for the API request - this is critical for server-side auth
                // If we have a saved token from upload, use that for consistency
                const token = currentToken || await getToken({ template: "supabase" });

                console.log("Using auth token:", token ? "Token exists" : "No token");
                console.log("Current user ID:", userId);

                if (!token || !userId) {
                    throw new Error("Authentication required");
                }

                const response = await axios.post("/api/create-chat",
                    { file_key, file_name },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                return response.data as CreateChatResponse;
            } catch (error) {
                console.error("API call error:", error);
                throw error;
            }
        },
        onSuccess: (data) => {
            console.log("Chat created successfully:", data);
            toast.success(`PDF processed successfully! Extracted ${data.chunkCount} text chunks.`);

            // You can redirect to a chat page when you have one
            // router.push(`/chat/${data.chatId}`);
        },
        onError: (error) => {
            console.error("Error creating chat:", error);
            toast.error("Failed to process PDF. Please try again.");
        }
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        disabled: isUploading || mutation.status === 'pending',
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file.size > 10 * 1024 * 1024) {
                toast.error("Max file size is 10MB.");
                return;
            }

            setIsUploading(true);
            const toastId = toast.loading("Uploading PDF...");

            try {
                // Use template "supabase" for bucket uploads
                const token = await getToken({ template: "supabase" });
                const currentUserId = userId;

                if (!token || !currentUserId) throw new Error("Auth error");

                // Save the token for reuse in the mutation
                setCurrentToken(token);

                const data = await uploadToSupabaseBucket(file, currentUserId, token);

                toast.success("Upload successful! Processing PDF...", { id: toastId });
                setIsUploading(false);

                mutation.mutate({
                    file_key: data.file_key,
                    file_name: data.file_name,
                });
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("Something went wrong. Try again.", { id: toastId });
                setIsUploading(false);
            }
        },
    });

    const isProcessing = isUploading || mutation.status === 'pending';

    return (
        <div className="p-2 bg-[#2C1810]/50 rounded-xl border border-amber-100/20 w-full max-w-sm mx-auto">
            <div
                {...getRootProps({
                    className:
                        `border-dashed border-2 border-amber-100/30 rounded-xl cursor-pointer bg-[#8B4513]/10 hover:bg-[#8B4513]/20 transition-colors duration-200 py-6 md:py-8 flex justify-center items-center flex-col px-4 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`,
                })}
            >
                <input {...getInputProps()} />
                {isProcessing ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-100/70 mx-auto"></div>
                        <p className="mt-2 text-sm md:text-base text-amber-100/70">
                            {isUploading ? "Uploading PDF..." : "Processing PDF..."}
                        </p>
                    </div>
                ) : (
                    <>
                        <Inbox className="w-8 h-8 md:w-10 md:h-10 text-amber-100/70" />
                        <p className="mt-2 text-sm md:text-base text-amber-100/70 text-center">
                            {isDragActive ? "Drop PDF here..." : "Drop PDF Here"}
                        </p>
                        <p className="mt-1 text-xs text-amber-100/50 text-center">
                            Max size: 10MB
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
