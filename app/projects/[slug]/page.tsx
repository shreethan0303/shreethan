import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, hasStory } from "../../data/projects";
import { jsonLd, pageMetadata, siteUrl } from "../../lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = projects.find((project) => project.slug === slug);
  if (!item) return {};
  return pageMetadata(
    `${item.content.title} | Shreethan Palla`,
    item.content.brief,
    `/projects/${slug}`,
    hasStory(item.content),
  );
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = projects.find((project) => project.slug === slug);
  if (!item) notFound();
  const project = item.content;
  const base = siteUrl();
  const preview = project.previewImage || project.videoPoster;
  return (
    <main className="build-page">
      {base && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: project.title,
              description: project.brief,
              url: new URL(`/projects/${slug}`, base).href,
              author: {
                "@type": "Person",
                name: "Shreethan Palla",
                url: base.href,
              },
            }),
          }}
        />
      )}
      <nav className="build-nav">
        <Link href="/projects">← All projects</Link>
        <Link href="/">3D workshop ↗</Link>
      </nav>
      <header>
        <p className="build-eyebrow">Shreethan Palla · {project.date}</p>
        <h1>{project.title}</h1>
        <p className="build-lead">{project.brief}</p>
        <p>{project.details}</p>
      </header>
      {preview && (
        <img
          className="build-hero"
          src={preview}
          alt={project.previewAlt || `${project.title} project preview`}
        />
      )}
      <nav className="build-links" aria-label="Project resources">
        {project.cadUrl && (
          <a href={project.cadUrl} target="_blank" rel="noopener noreferrer">
            View CAD ↗
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        )}
        {project.models?.map((model) => (
          <a key={model.href} href={model.href} download>
            {model.title} ↓
          </a>
        ))}
      </nav>
      {project.story.length > 0 && (
        <section aria-labelledby="build-story">
          <h2 id="build-story">Build story</h2>
          <nav className="build-chapters" aria-label="Build story chapters">
            {project.story.map((stage) => (
              <a key={stage.id} href={`#${stage.id}`}>
                {stage.title}
              </a>
            ))}
          </nav>
          {project.story.map((stage) => (
            <section className="build-chapter" id={stage.id} key={stage.id}>
              <h3>{stage.title}</h3>
              <div className="build-columns">
                <div className="build-notes">
                  {stage.summary && <p>{stage.summary}</p>}
                  {stage.challenge && (
                    <p>
                      <strong>The issue</strong>
                      {stage.challenge}
                    </p>
                  )}
                  {stage.change && (
                    <p>
                      <strong>What changed</strong>
                      {stage.change}
                    </p>
                  )}
                  {stage.learning && (
                    <p>
                      <strong>What I learned</strong>
                      {stage.learning}
                    </p>
                  )}
                </div>
                <div className="build-media">
                  {stage.media.map((media) => (
                    <figure key={media.src}>
                      {media.type === "video" ? (
                        <video
                          src={media.src}
                          poster={media.poster}
                          controls
                          playsInline
                          preload="none"
                          aria-label={media.caption}
                        />
                      ) : (
                        <img
                          src={media.src}
                          alt={media.caption}
                          loading="lazy"
                        />
                      )}
                      <figcaption>{media.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </section>
      )}
      {project.reflections.length > 0 && (
        <section className="build-reflections">
          <h2>Looking back and ahead</h2>
          {project.reflections.map(
            (reflection) =>
              reflection.text && (
                <section key={reflection.title}>
                  <h3>{reflection.title}</h3>
                  <p>{reflection.text}</p>
                </section>
              ),
          )}
        </section>
      )}
      <footer className="build-nav">
        <Link href="/projects">All projects</Link>
        <Link href="/about">About Shreethan</Link>
      </footer>
    </main>
  );
}
