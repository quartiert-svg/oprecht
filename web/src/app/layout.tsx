import type { ReactNode } from "react";
import "./globals.css";

/** Root layout required by Next.js; locale-specific chrome lives under [locale]. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
