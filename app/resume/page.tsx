"use client";
import Link from "next/link";
export default function Resume() {
  return (
    <main className="content-page print-page">
      <Link className="no-print" href="/desktop">
        ← Desktop
      </Link>
      <h1>Shreethan Palla</h1>
      <p>Robotics · Engineering · Software · Tennis</p>
      <h2>Projects</h2>
      <p>RC car · Cube-solving robot · FRC robotics · Tennis and software</p>
      <p>
        This is a profile draft. Education, dates, skills and individual
        contributions await verification from my records.
      </p>
      <a href="https://github.com/shreethan0303">github.com/shreethan0303</a>
      <button className="no-print" onClick={() => window.print()}>
        Print / Save as PDF
      </button>
    </main>
  );
}
