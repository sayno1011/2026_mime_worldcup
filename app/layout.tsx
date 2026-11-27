import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource/archivo-black/latin-400.css";
import "@fontsource-variable/noto-sans-kr";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 밈 월드컵",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
