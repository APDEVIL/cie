// src/app/layout.tsx
import "@/styles/globals.css";
import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { Sidebar } from "./_components/Siedebar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "CIE Management System",
  description: "Continuous Internal Evaluation — Written, Skill & Pathway",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TRPCReactProvider>
          <div className="flex min-h-screen">
            {/* Fixed sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-1 flex-col pl-64">
              <main className="flex-1 p-8">
                {children}
              </main>
            </div>
          </div>
          <Toaster richColors position="top-right" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}