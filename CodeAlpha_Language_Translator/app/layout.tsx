import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeAlpha Language Translator",
  description: "Translate text between languages using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
