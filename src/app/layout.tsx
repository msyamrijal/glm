import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Academic Planner - Organize Your Studies",
  description: "A comprehensive academic planner to manage terms, courses, assignments, and events. Built with Next.js, TypeScript, and shadcn/ui.",
  keywords: ["academic planner", "student organizer", "course management", "assignment tracker", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  authors: [{ name: "Academic Planner Team" }],
  openGraph: {
    title: "Academic Planner",
    description: "Organize your academic life with our comprehensive planner",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Academic Planner",
    description: "Organize your academic life with our comprehensive planner",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
