import Link from "next/link";
export default function About() {
  return (
    <main className="content-page">
      <Link href="/desktop">← Desktop</Link>
      <h1>Shreethan Palla</h1>
      <p>
        I’m interested in robotics, cars, bikes, tennis, and building things
        that move.
      </p>
      <p>
        This portfolio is being rebuilt from a licensed reference before adding
        my own models and stories.
      </p>
      <a
        href="https://github.com/shreethan0303"
        target="_blank"
        rel="noreferrer"
      >
        GitHub ↗
      </a>
    </main>
  );
}
