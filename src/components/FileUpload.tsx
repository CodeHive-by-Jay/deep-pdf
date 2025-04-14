"use client";
import { uploadToSupabaseBucket } from "@/lib/bucket";
import { Inbox } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@clerk/nextjs";

const FileUpload = () => {
    const { userId, getToken } = useAuth();

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log("Accepted files:", acceptedFiles);
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                alert("Please upload a smaller file");
                return;
            }

            try {
                const token = await getToken({ template: "supabase" });
                if (!token || !userId) {
                    throw new Error("User is not authenticated");
                }

                const data = await uploadToSupabaseBucket(file, userId, token);
                console.log("Uploaded file data:", data);
            } catch (error) {
                console.error("Error uploading file:", error);
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