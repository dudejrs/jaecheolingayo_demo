import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavLink from "@/components/navLink"

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
  title: "제철인가요 개발",
  description: "제철인가요에 들어갈 여러 컴포넌트들을 개발하는 페이지입니다.",
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
        <div className="py-12">
          <div className="px-12 flex justify-between mb-6"> 
              <NavLink href="/" activeClassName="" className="font-bold text-3xl"> 제철인가요 개발 </NavLink>
              <div className="mr-16 text-lg flex gap-4">
                <NavLink href="/map">지도</NavLink>
                <NavLink href="/data">데이터</NavLink>
              </div>
          </div>
          <div className="py-6">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
