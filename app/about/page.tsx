import Link from "next/link";
import { jsonLd, pageMetadata, siteDescription, siteUrl } from "../lib/site";

export const metadata = pageMetadata(
  "About Shreethan Palla",
  siteDescription,
  "/about",
);

export default function About() {
  const base = siteUrl();
  return (
    <main className="build-page">
      {base && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Shreethan Palla",
              url: base.href,
              description: siteDescription,
              sameAs: ["https://github.com/shreethan0303"],
            }),
          }}
        />
      )}
      <nav className="build-nav">
        <Link href="/">← Workshop</Link>
        <Link href="/projects">Projects</Link>
      </nav>
      <header>
        <h1>Shreethan Palla</h1>
        <p className="build-lead">
          I build robots and software and enjoy learning new things.
        </p>
      </header>
      <p>
        I’m interested in robotics, cars, bikes, tennis, and building things
        that move.
      </p>
      <p>
        My projects include a Rubik’s Cube solving robot, a custom RC car, and
        FRC robotics.
      </p>
      <nav className="build-links">
        <Link href="/projects">Explore my projects →</Link>
        <a
          href="https://github.com/shreethan0303"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
      </nav>
    </main>
  );
}
