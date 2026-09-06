import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { SocketProvider } from "@/components/SocketProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getServerI18n } from "@/lib/i18n-server";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = await getServerI18n();
  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-felt font-sans text-lg text-ivory antialiased">
        <I18nProvider locale={locale}>
          <LanguageSwitcher />
          <SocketProvider>{children}</SocketProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
