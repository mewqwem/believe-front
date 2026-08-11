import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { SocketProvider } from "@/components/SocketProvider";

// Initialize Fraunces for card ranks and distinctive titles
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["600", "700"],
});

// Initialize Inter for highly legible interface text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bluff Card Game",
  description: "Online multiplayer Cheat/Bluff card game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${fraunces.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-felt font-sans text-lg text-ivory antialiased">
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
