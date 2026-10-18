import type { MetadataRoute } from "next";
import { projects, hasStory } from "./data/projects";
import { isPreview, siteUrl } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base || isPreview) return [];
  return [
    "/",
    "/about",
    "/projects",
    ...projects
      .filter(({ content }) => hasStory(content))
      .map(({ slug }) => `/projects/${slug}`),
  ].map((path) => ({ url: new URL(path, base).href }));
}
