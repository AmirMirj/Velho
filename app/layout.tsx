import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proof before pitch · Velho",
  description:
    "Internal Velho tool: public-signal opportunity map and draft outreach for established operators.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
