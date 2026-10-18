import type { Metadata } from "next";
import "./globals.css";
import { pageMetadata, siteDescription, siteUrl } from "./lib/site";

export const metadata: Metadata = {
  ...pageMetadata("Shreethan Palla", siteDescription, "/"),
  ...(siteUrl() ? { metadataBase: siteUrl() } : {}),
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
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
