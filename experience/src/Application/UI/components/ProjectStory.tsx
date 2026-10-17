import React, { useEffect, useRef, useState } from 'react';
import { StoryMedia, StoryStage, StoryReflection } from '../../../project-story';

/** One mounted item per stage: avoid downloading every prototype video on entry. */
function StageGallery({ media, title }: { media: StoryMedia[]; title: string }) {
    const [index, setIndex] = useState(0);
    const video = useRef<HTMLVideoElement>(null);
    const item = media[index] || media[0];
    const select = (next: number) => { video.current?.pause(); setIndex(next); };
    useEffect(() => {
        const player = video.current;
        return () => { player?.pause(); };
    }, [item?.src]);
    if (!item) return <div className="story-media-empty">Photos and video coming soon</div>;
    return <figure className="story-gallery" aria-label={`${title} media`}>
        <div key={item.src} className="story-media-frame" style={item.aspectRatio ? { aspectRatio: item.aspectRatio } : undefined}>
            {item.type === 'video'
                ? <video key={item.src} ref={video} controls playsInline preload="none" src={item.src} poster={item.poster} aria-label={item.caption} />
                : <img key={item.src} src={item.src} alt={item.caption} loading="lazy" />}
        </div>
        <figcaption>
            <span aria-live="polite">{item.caption}</span>
            {media.length > 1 && <div className="story-gallery-controls">
                <button type="button" disabled={index === 0} onClick={() => select(index - 1)} aria-label={`Previous ${title} media`}>←</button>
                <span aria-label={`Item ${index + 1} of ${media.length}`}>{index + 1} / {media.length}</span>
                <button type="button" disabled={index === media.length - 1} onClick={() => select(index + 1)} aria-label={`Next ${title} media`}>→</button>
            </div>}
        </figcaption>
    </figure>;
}

export default function ProjectStory({ stages, reflections }: { stages: StoryStage[]; reflections: StoryReflection[] }) {
    return <div className="project-story">
        <h3 className="story-heading">Build story</h3>
        <nav className="story-jumps" aria-label="Build story chapters">
            {stages.map((stage, index) => <a key={stage.id} href={`#story-${stage.id}`}>{String(index + 1).padStart(2, '0')} {stage.title}</a>)}
            {reflections.length > 0 && <a href="#story-reflections">Reflections</a>}
        </nav>
        <ol className="story-timeline">
            {stages.map((stage, index) => <li key={stage.id} id={`story-${stage.id}`} className="story-stage">
                <span className="story-step" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h4>{stage.title}</h4>
                <div className="story-stage-content">
                <StageGallery media={stage.media} title={stage.title} />
                <div className="story-notes">
                    {stage.summary ? <p>{stage.summary}</p> : <p className="story-pending">Build notes coming soon.</p>}
                    {stage.challenge && <p><strong>The issue</strong>{stage.challenge}</p>}
                    {stage.change && <p><strong>What changed</strong>{stage.change}</p>}
                    {stage.learning && <p><strong>What I learned</strong>{stage.learning}</p>}
                </div>
                </div>
            </li>)}
        </ol>
        {reflections.length > 0 && <section className="story-reflections" id="story-reflections" aria-labelledby="story-reflections-title">
            <h3 id="story-reflections-title" className="story-heading">Looking back and ahead</h3>
            <div>{reflections.map(reflection => <section key={reflection.title}>
                <h4>{reflection.title}</h4>
                <p className={reflection.text ? '' : 'story-pending'}>{reflection.text || 'Notes coming soon.'}</p>
            </section>)}</div>
        </section>}
    </div>;
}
