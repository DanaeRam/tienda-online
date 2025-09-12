import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppFrame from "@/components/AppFrame";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISORA",
  description: "Salud y bienestar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="bg-white">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full bg-white`}>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
