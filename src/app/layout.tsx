'use client';;
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideMenu, { SideMenuSection } from "./components/SideMenu/SideMenu";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const menuSections: SideMenuSection[] = [
  {
    label: "Main",
    items: [
      { label: "Chat", href: "/" },
      { label: "Reports", href: "/report" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "AE Studio", href: "https://ae.studio" },
      // {
      //   label: "Docs",
      //   children: [
      //     { label: "API Reference", href: "https://docs.ae.studio/api" },
      //     { label: "Guides", href: "https://docs.ae.studio/guides" },
      //   ],
      // },
    ],
  },
];

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
        <div className="flex min-h-screen">
          <SideMenu sections={menuSections} />
          <main className="flex-1 ml-64">{children}</main>
        </div>
      </body>
    </html>
  );
}
