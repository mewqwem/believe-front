// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { SocketProvider } from "@/components/SocketProvider";

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
    <html lang="uk" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
