"use client";

import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { userId } = useAuth();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(!!userId);
  }, [userId]);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-[#2C1810] to-[#1a0f0a] text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-amber-100 via-amber-50 to-white bg-clip-text text-transparent">
              Chat with any PDF
            </h1>

            <p className="text-lg md:text-xl font-light max-w-2xl text-amber-100/80 leading-relaxed">
              Join millions of students, researchers, and professionals to quickly answer questions and research with AI
            </p>
          </div>

          <div className="flex items-center gap-4 mt-8">
            {isAuth && (
              <Button
                className="px-8 py-6 text-lg rounded-xl bg-[#8B4513] hover:bg-[#A0522D] text-white border border-amber-100/20 transition-all duration-200 shadow-lg hover:shadow-amber-900/20"
              >
                Go to Chats
              </Button>
            )}
          </div>

          <div className="w-full max-w-md mt-8">
            {isAuth ? (
              <div className="transform transition-all duration-200 hover:scale-[1.01]">
                <FileUpload />
              </div>
            ) : (
              <Link href="/sign-in" className="w-full block">
                <Button
                  className="w-full px-8 py-6 text-lg rounded-xl bg-[#8B4513] hover:bg-[#A0522D] text-white border border-amber-100/20 transition-all duration-200 shadow-lg hover:shadow-amber-900/20"
                >
                  Login to get Started
                  <LogIn className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
