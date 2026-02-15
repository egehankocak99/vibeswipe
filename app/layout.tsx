import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "VibeSwipe — Discover Local Nightlife & Events",
  description: "Find the best bars, clubs, events, DJs & concerts wherever you are. Swipe, save, get alerts.",
  manifest: "/manifest.json",
  themeColor: "#a855f7",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1225',
              color: '#fff',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            },
          }}
        />
      </body>
    </html>
  );
}
