import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { MuteProvider } from "@/context/mute-context";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Scribbbly",
  description: "Retro drawing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MuteProvider>
        <body className='font-pixel h-screen min-h-screen flex flex-col '>{children}</body>
      </MuteProvider>
    </html>
  );
}
