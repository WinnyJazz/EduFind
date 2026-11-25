import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import SharedLayout from "@/components/layout/SharedLayout";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduFind | University Discovery Platform",
  description: "Discover your future university.",
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
        <SharedLayout>
          {children}
        </SharedLayout>
      </body>
    </html>
  );
}