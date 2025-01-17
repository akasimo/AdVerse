import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import Navbar from "@/components/shared/Navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolScout",
  description: "SolScout is a wallet tracking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex h-dvh min-h-dvh flex-col bg-primary/10",
          inter.className,
        )}
      >
        <Providers>
          <Navbar />
          {children}
          <p className="m-2 text-center">All rights reserved | 2024</p>
        </Providers>
      </body>
    </html>
  );
}
