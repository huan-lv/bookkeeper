import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getUserId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "记账本",
  description: "简洁的个人记账工具",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await getUserId();

  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col bg-zinc-50">
        <Navbar isLoggedIn={userId} />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
