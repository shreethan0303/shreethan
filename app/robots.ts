import type { MetadataRoute } from "next";
import { isPreview, siteUrl } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(base && !isPreview
      ? { sitemap: new URL("/sitemap.xml", base).href }
      : {}),
  };
}
