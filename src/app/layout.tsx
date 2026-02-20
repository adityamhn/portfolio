import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import GlobalLoader from "@/components/GlobalLoader";
import { HoverImageProvider } from "@/context/HoverImageContext";
import BackgroundImages from "@/components/BackgroundImages";

export const metadata: Metadata = {
  title: "Aditya Peela",
  description: "Co-founder & Chief Technology Officer @ BugBase",
  icons: {
    icon: "/profile.jpg"
  },
  openGraph: {
    title: "Aditya Peela",
    url: "https://adityapeela.ai",
    siteName: "Aditya Peela",
    images: [
      {
        url: "/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Aditya Peela"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Peela",
    description:
      "Co-founder & Chief Technology Officer @ BugBase",
    images: ["/profile.jpg"]
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="scroll-smooth bg-[#030303] text-gray-100 antialiased">
          <GlobalLoader />
          {children}
      </body>
    </html>
  );
}
