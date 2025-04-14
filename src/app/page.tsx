"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
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
    <div className="w-screen min-h-screen bg-[#2C1810] text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 md:px-0 md:w-auto">
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <h1 className="text-3xl md:text-5xl font-semibold bg-gradient-to-r from-amber-100 to-white bg-clip-text text-transparent">
              Chat with any PDF
            </h1>
            {isAuth && <UserButton afterSignOutUrl="/" />}
          </div>

          <div className="flex mt-4">
            {isAuth && (
              <Button className="cursor-pointer bg-[#8B4513] hover:bg-[#A0522D] text-white border border-amber-100/20">
                Go to Chats
              </Button>
            )}
          </div>

          <p className="max-w-[320px] md:max-w-xl mt-4 text-base md:text-lg text-amber-100/70 px-4 md:px-0">
            Join millions of students, researchers, and professionals to quickly answer questions and research with AI
          </p>

          <div className="w-full mt-6 max-w-sm">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in" className="w-full">
                <Button className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-white border border-amber-100/20">
                  Login to get Started <LogIn className="ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
