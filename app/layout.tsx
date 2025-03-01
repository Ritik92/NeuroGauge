import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neurogauge",
  description: "Transform your school with AI-powered psychometric assessments that provide deep insights into each student's unique learning style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
      
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         
        <Providers>
           {children}
           <Toaster position="top-right" richColors />
      </Providers>
     
      </body>

    </html>
  );
}
