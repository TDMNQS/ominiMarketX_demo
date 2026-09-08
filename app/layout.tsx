import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniMarketX Next — Product Redesign by Numan Qureshi",
  description: "A responsive candidate prototype improving prediction-market trading, portfolio actions, transaction clarity, and social discovery.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
