
import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduFind | University Discovery Platform",
  description:
    "Discover and explore higher education institutions across Jabodetabek.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sourceSerif.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
