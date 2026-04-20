import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PLG Photography",
  description: "Street photography by Pierre-Louis Gaultier",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased`}>
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
          <a href="/" className="text-sm font-medium tracking-[0.25em] uppercase text-white hover:opacity-60 transition-opacity">
            PLG
          </a>
          <nav className="flex gap-8 text-xs tracking-widest uppercase text-neutral-400">
            <a href="/" className="hover:text-white transition-colors">Work</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
