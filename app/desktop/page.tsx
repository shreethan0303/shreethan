"use client";
import { useEffect } from "react";
import Desktop from "../components/desktop";
export default function DesktopPage() {
  useEffect(() => {
    if (parent === window) return;
    const forward = (event: Event) => {
      const pointer = event as MouseEvent;
      const key = event as KeyboardEvent;
      parent.postMessage(
        {
          type: event.type,
          clientX: pointer.clientX,
          clientY: pointer.clientY,
          key: key.key,
        },
        location.origin,
      );
    };
    const events = ["mousemove", "mousedown", "mouseup", "keydown", "keyup"];
    events.forEach((type) => document.addEventListener(type, forward));
    return () =>
      events.forEach((type) => document.removeEventListener(type, forward));
  }, []);
  return (
    <main className="standalone-desktop">
      <Desktop
        onProjects={() => location.assign("/projects")}
        onResume={() => location.assign("/resume")}
        onInterests={() => location.assign("/about")}
        onBack={() => location.assign("/about")}
      />
      <p className="reference-credit">
        3D reference:{" "}
        <a
          href="https://github.com/henryjeff/portfolio-website"
          target="_blank"
          rel="noreferrer"
        >
          Henry Heffernan
        </a>{" "}
        · <a href="/projects">Projects</a> · <a href="/resume">Résumé draft</a>
      </p>
    </main>
  );
}
