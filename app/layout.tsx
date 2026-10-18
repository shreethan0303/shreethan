import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shreethan Palla",
  description:
    "A personal collection of projects, experiments, and ideas. Built with curiosity. Always evolving.",
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
