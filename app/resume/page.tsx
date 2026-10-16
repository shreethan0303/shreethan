"use client";
import Link from "next/link";
export default function Resume() {
  return (
    <main className="content-page print-page">
      <Link className="no-print" href="/desktop">
        ← Desktop
      </Link>
      <h1>Shreethan Palla</h1>
      <p>Résumé · placeholder</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <p>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </p>
      <button className="no-print" onClick={() => window.print()}>
        Print / Save as PDF
      </button>
    </main>
  );
}
