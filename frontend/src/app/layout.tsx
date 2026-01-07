import type { Metadata } from "next";
import { Outfit, Fjalla_One } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
});

const fjalla = Fjalla_One({
  variable: "--font-display",
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Invento | The Ultimate Design Hackathon",
  description: "Join the ultimate 48-hour creative showdown.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${fjalla.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
