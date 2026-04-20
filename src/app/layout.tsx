import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Providers } from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OMC Leads",
  description: "Gestión de leads — One Million Copy SAS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${plusJakartaSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex bg-background font-[family-name:var(--font-sans)]" suppressHydrationWarning>
        <Providers>
          <Sidebar />
          <main className="flex-1 overflow-auto pt-14 md:pt-0">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
