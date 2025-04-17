"use client";
import { uploadToSupabaseBucket } from "@/lib/bucket";
import { Inbox } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast"

const FileUpload = () => {
    const { userId, getToken } = useAuth();

    const { mutate } = useMutation({
        mutationFn: async ({ file_key, file_name }: { file_key: string, file_name: string }) => {
            const response = await axios.post("/api/create-chat", {
                file_key,
                file_name
            });
            return response.data;
        },
        onSuccess: (data) => {
            console.log("Chat created successfully:", data);
        },
        onError: (error) => {
            console.error("Error creating chat:", error);
        }
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file.size > 10 * 1024 * 1024) {
                toast.error("Max file size is 10MB.");
                return;
            }

            const toastId = toast.loading("Uploading PDF...");

            try {
                const token = await getToken({ template: "supabase" });
                const currentUserId = userId;

                if (!token || !currentUserId) throw new Error("Auth error");

                const data = await uploadToSupabaseBucket(file, currentUserId, token);

                toast.success("Upload successful!", { id: toastId });

                mutate({
                    file_key: data.file_key,
                    file_name: data.file_name,
                });
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("Something went wrong. Try again.", { id: toastId });
            }
        },
    });


    return (
        <div className="p-2 bg-[#2C1810]/50 rounded-xl border border-amber-100/20 w-full max-w-sm mx-auto">
            <div
                {...getRootProps({
                    className:
                        "border-dashed border-2 border-amber-100/30 rounded-xl cursor-pointer bg-[#8B4513]/10 hover:bg-[#8B4513]/20 transition-colors duration-200 py-6 md:py-8 flex justify-center items-center flex-col px-4",
                })}
            >
                <input {...getInputProps()} />
                <>
                    <Inbox className="w-8 h-8 md:w-10 md:h-10 text-amber-100/70" />
                    <p className="mt-2 text-sm md:text-base text-amber-100/70 text-center">
                        Drop PDF Here
                    </p>
                </>
            </div>
        </div>
    );
};

export default FileUpload;
