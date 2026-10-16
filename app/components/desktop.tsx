"use client";
import { useState } from "react";
export default function Desktop({
  onProjects,
  onInterests,
  onResume,
  onBack,
}: {
  onProjects: () => void;
  onInterests?: () => void;
  onResume?: () => void;
  onBack?: () => void;
}) {
  const [tab, setTab] = useState("welcome");
  const [power, setPower] = useState(true);
  return (
    <div className="retro-desktop">
      <div className="retro-title">
        <button aria-label="Back to room" onClick={onBack}>
          ←
        </button>
        <span>PALLA / OS</span>
        <button
          onClick={() => setPower((p) => !p)}
          aria-label={power ? "Shut down computer" : "Power on computer"}
        >
          ⏻
        </button>
      </div>
      {power ? (
        <>
          <div className="desktop-apps">
            <button aria-label="Projects" onClick={onProjects}>
              ▧<span>Projects</span>
            </button>
            <button aria-label="Interests" onClick={onInterests}>
              ◎<span>Interests</span>
            </button>
            <button aria-label="Résumé" onClick={onResume}>
              ▤<span>Résumé</span>
            </button>
            <button aria-label="About" onClick={() => setTab("about")}>
              ☺<span>About</span>
            </button>
            <button aria-label="Contact" onClick={() => setTab("contact")}>
              ↗<span>Contact</span>
            </button>
          </div>
          <div className="retro-window">
            <div className="retro-window-bar">
              {tab === "welcome"
                ? "Welcome to my workshop"
                : tab === "about"
                  ? "About Shreethan"
                  : "Let’s connect"}
              <button
                onClick={() => setTab("welcome")}
                aria-label="Close window"
              >
                ×
              </button>
            </div>
            <div className="retro-window-content">
              {tab === "welcome" ? (
                <>
                  <strong>Hello, I’m Shreethan.</strong>
                  <p>
                    I build things, take them apart, and figure out how to make
                    them better.
                  </p>
                  <button className="retro-action" onClick={onProjects}>
                    Explore the workbench ↗
                  </button>
                </>
              ) : tab === "about" ? (
                <>
                  <strong>A builder. Always curious.</strong>
                  <p>
                    Robotics, RC cars, tennis, and software. This is a growing
                    collection of the things I’m learning by making.
                  </p>
                </>
              ) : (
                <>
                  <strong>Find me on GitHub.</strong>
                  <p>Explore my code and follow what I’m building.</p>
                  <a
                    href="https://github.com/shreethan0303"
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.com/shreethan0303 ↗
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="retro-taskbar">
            WORKSHOP 01<span>SHREETHAN PALLA</span>
          </div>
        </>
      ) : (
        <div className="powered-off">
          <p>It’s quiet in here.</p>
          <button onClick={() => setPower(true)}>Power on ↗</button>
        </div>
      )}
    </div>
  );
}
