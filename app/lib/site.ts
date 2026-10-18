import type { Metadata } from "next";

export const siteDescription =
  "Shreethan Palla builds robots and software. Explore his Rubik’s Cube solving robot, custom RC car, and FRC robotics projects.";

// Never assume ownership of a domain merely because it is being considered.
// Set SITE_URL only after connecting the purchased domain to the chosen project.
export function siteUrl(): URL | undefined {
  const value = process.env.SITE_URL;
  if (!value) return undefined;
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "SITE_URL must be an HTTPS origin, such as https://your-domain.com",
    );
  }
  return url;
}

export const isPreview = process.env.VERCEL_ENV === "preview";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  index = true,
): Metadata {
  const base = siteUrl();
  return {
    title,
    description,
    ...(base ? { alternates: { canonical: new URL(path, base).href } } : {}),
    robots: { index: index && !isPreview, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Shreethan Palla",
      ...(base ? { url: new URL(path, base).href } : {}),
    },
    twitter: { card: "summary", title, description },
  };
}

export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
