import Link from "next/link";
import { projects } from "./data/projects";

export default function Home() {
  return (
    <main className="reference-root">
      <h1 className="sr-only">Shreethan Palla</h1>
      <Link href="/projects" className="workshop-reading-link" prefetch={false}>
        Read project stories
      </Link>
      <iframe
        className="reference-frame"
        src="/experience/index.html"
        title="Shreethan Palla workshop"
        allow="autoplay; fullscreen"
      />
      <noscript>
        <style>
          {
            ".reference-root{position:static}.reference-frame,.workshop-reading-link{display:none}"
          }
        </style>
        <div className="build-page">
          <h2>Shreethan Palla</h2>
          <p>I build robots and software and enjoy learning new things.</p>
          <p>Explore my projects without the 3D workshop:</p>
          <ul>
            {projects.map(({ slug, content }) => (
              <li key={slug}>
                <Link href={`/projects/${slug}`}>{content.title}</Link>
                <p>{content.brief}</p>
              </li>
            ))}
          </ul>
          <Link href="/about">About Shreethan Palla</Link>
        </div>
      </noscript>
    </main>
  );
}
