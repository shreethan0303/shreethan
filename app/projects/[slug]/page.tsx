import Link from "next/link";
import { notFound } from "next/navigation";
import Assembly from "./viewer";
const projects = {
  robotics: "Robotics",
  mechanisms: "Mechanisms",
  research: "Research",
  "rc-car": "RC car",
  "cube-solver": "Cube-solving robot",
  "tennis-software": "Tennis & software",
};
export function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in projects)) notFound();
  const name = projects[slug as keyof typeof projects];
  return (
    <main className="project-page">
      <Link href="/" className="text-link">
        ← Back to the workshop
      </Link>
      <span className="kicker">CONCEPT STUDY / ILLUSTRATIVE PLACEHOLDER</span>
      <h1>
        {name}
        <em> / inside the build.</em>
      </h1>
      <p className="project-lead">
        {slug === "robotics"
          ? "Explore a sample rover assembly. Separate the components to see how the mechanical base, control board, and sensor housing fit together."
          : "A space for your real project: the question, the prototypes, and the engineering decisions behind the result."}
      </p>
      {slug === "robotics" ? (
        <Assembly />
      ) : (
        <div className="project-coming">
          Your {name.toLowerCase()} story belongs here.
          <p>
            We’ll use your actual models, drawings, and findings to design this
            view.
          </p>
        </div>
      )}
      <div className="project-story">
        <section>
          <span className="kicker">01 / THE QUESTION</span>
          <h2>Start with the why.</h2>
          <p>
            Your problem statement and constraints will go here. What did you
            want to find out, and why did it matter?
          </p>
        </section>
        <section>
          <span className="kicker">02 / THE PROCESS</span>
          <h2>Show the thinking.</h2>
          <p>
            Sketches, Onshape models, failed attempts, and the choices that
            shaped the build.
          </p>
        </section>
        <section>
          <span className="kicker">03 / THE EVIDENCE</span>
          <h2>Make the results real.</h2>
          <p>
            Test footage, measurements, your contribution, and what you would
            change in the next version.
          </p>
        </section>
      </div>
    </main>
  );
}
