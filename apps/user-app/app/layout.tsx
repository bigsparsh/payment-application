import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Chivo, Libre_Franklin } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Suspense } from "react";

const chivo = Chivo({
  subsets: ["latin"],
  variable: "--font-chivo",
});
const judson = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${judson.variable} ${chivo.variable}`}>
        <Suspense fallback={<div>Loading....</div>}>
          <Providers attribute="class" defaultTheme="dark">
            {children}
          </Providers>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
