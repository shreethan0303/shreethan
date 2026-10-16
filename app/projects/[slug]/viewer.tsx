"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
const Scene = dynamic(() => import("../../components/assembly-scene"), {
  ssr: false,
  loading: () => <p className="assembly-fallback">Loading assembly…</p>,
});
export default function Assembly() {
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!section.current) return;
        const rect = section.current.getBoundingClientRect();
        const distance = Math.max(1, rect.height - innerHeight);
        setProgress(Math.max(0, Math.min(1, -rect.top / distance)));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const adjust = (value: number) => {
    if (!section.current) return;
    const rect = section.current.getBoundingClientRect();
    window.scrollTo({
      top: scrollY + rect.top + (value / 100) * (rect.height - innerHeight),
      behavior: "instant",
    });
    setProgress(value / 100);
  };
  return (
    <section
      className="scroll-assembly"
      ref={section}
      aria-label="Scroll-controlled sample exploded assembly"
    >
      <div className="assembly-sticky">
        <div className="assembly-heading">
          <span className="kicker">
            ILLUSTRATIVE ROVER / NOT ACTUAL PROJECT CAD
          </span>
          <h2>
            {progress < 0.05
              ? "Scroll to look inside."
              : progress > 0.95
                ? "Every layer has a purpose."
                : "One system. Three assemblies."}
          </h2>
          <p>Scroll down to separate. Scroll back up to reassemble.</p>
        </div>
        <div className="assembly-stage">
          <Scene progress={progress} />
        </div>
        <div className="assembly-status">
          <label htmlFor="assembly-progress">
            Assembly separation <output>{Math.round(progress * 100)}%</output>
          </label>
          <input
            id="assembly-progress"
            type="range"
            min="0"
            max="100"
            value={Math.round(progress * 100)}
            aria-label="Assembly separation"
            onChange={(e) => adjust(Number(e.target.value))}
          />
          <ol>
            <li>
              <strong>01 / Chassis</strong>
              <span>Mechanical base and wheels.</span>
            </li>
            <li>
              <strong>02 / Control board</strong>
              <span>Electronics and connections.</span>
            </li>
            <li>
              <strong>03 / Housing</strong>
              <span>Protection and sensor opening.</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
