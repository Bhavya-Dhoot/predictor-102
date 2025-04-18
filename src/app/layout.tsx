import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MenuBar from "@/components/MenuBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Predictor 101",
  description: "Predict financial index closes with ML.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 min-h-screen`}
      >
        <MenuBar />
        <div className="pt-2">{children}</div>
      </body>
    </html>
  );
}
