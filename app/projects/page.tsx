import Link from "next/link";
import { projects } from "../data/projects";
import { pageMetadata } from "../lib/site";

export const metadata = pageMetadata(
  "Projects | Shreethan Palla",
  "Robotics and engineering projects by Shreethan Palla, with build photos, testing footage, and lessons learned.",
  "/projects",
);

export default function Projects() {
  return (
    <main className="build-page">
      <nav className="build-nav">
        <Link href="/">← Workshop</Link>
        <Link href="/about">About Shreethan</Link>
      </nav>
      <header>
        <p className="build-eyebrow">Shreethan Palla</p>
        <h1>Projects</h1>
        <p>Robots, mechanisms, and the things I learned while building them.</p>
      </header>
      <div className="build-project-list">
        {projects.map(({ slug, content }) => (
          <article key={slug}>
            <p className="build-eyebrow">{content.date}</p>
            <h2>
              <Link href={`/projects/${slug}`}>{content.title} ↗</Link>
            </h2>
            <p>{content.brief}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
