import Link from "next/link";
import { profile } from "../data/portfolio";
export default function Projects() {
  return (
    <main className="content-page">
      <Link href="/desktop">← Desktop</Link>
      <h1>Projects</h1>
      <p>Project notes and actual models are being prepared.</p>
      {profile.projects.map((project) => (
        <Link
          className="project-list-item"
          key={project.slug}
          href={`/projects/${project.slug}`}
        >
          <h2>{project.title} ↗</h2>
          <p>{project.summary}</p>
        </Link>
      ))}
    </main>
  );
}
