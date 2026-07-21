import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Legion Revenue Recovery Engine",
  description: "Interactive SaaS prototype for MedSpa revenue recovery."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
