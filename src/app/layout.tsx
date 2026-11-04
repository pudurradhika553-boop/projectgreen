import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenRise Expo 2027",
  description: "Where Innovation Meets Impact – Sustainability & Social Entrepreneurship Expo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
