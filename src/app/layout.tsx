import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, UserButton } from '@clerk/nextjs'
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeepPDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
          >
            <Toaster position="top-center" />
            <div className="fixed top-6 right-6 z-50">
              <UserButton afterSignOutUrl="/" />
            </div>
            {children}
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
