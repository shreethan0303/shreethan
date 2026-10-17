import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cubeProject } from '../../../cube-project';
import UIEventBus from '../EventBus';
import ProjectStory from './ProjectStory';
import { ProjectContent } from '../../../project-story';

type SourceRect = { x: number; y: number; width: number; height: number };

export default function ProjectReader() {
    const [project, setProject] = useState<ProjectContent>(cubeProject);
    const [source, setSource] = useState<SourceRect | null>(null);
    const panel = useRef<HTMLElement>(null);
    const closing = useRef(false);
    const close = () => {
        if (closing.current) return;
        closing.current = true;
        const sheet = panel.current;
        sheet?.querySelectorAll('video').forEach(video => video.pause());
        if (!sheet || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setSource(null); return;
        }
        sheet.parentElement?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' });
        sheet.animate([{ transform: 'none' }, { transform: 'scale(.985)' }], {
            duration: 180, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards',
        }).finished.then(() => setSource(null), () => setSource(null));
    };

    useEffect(() => {
        const open = (event: Event) => {
            const detail = (event as CustomEvent).detail;
            closing.current = false;
            setProject(detail.project || cubeProject);
            setSource(detail.rect || detail);
        };
        document.addEventListener('project:open', open);
        return () => {
            document.removeEventListener('project:open', open);
        };
    }, []);

    // Attach focus and keyboard handling before the reader is painted.
    useLayoutEffect(() => {
        if (!source || !panel.current) return;
        const sheet = panel.current;
        const bounds = sheet.getBoundingClientRect();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const offsetX = Math.max(-24, Math.min(24, source.x + source.width / 2 - bounds.x - bounds.width / 2));
        const offsetY = Math.max(-24, Math.min(24, source.y + source.height / 2 - bounds.y - bounds.height / 2));
        const animation = reduced ? undefined : sheet.animate([
            { transform: `translate(${offsetX}px, ${offsetY}px) scale(.96)`, opacity: 0 },
            { transform: 'none', opacity: 1 },
        ], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' });
        const controls = () => Array.from(sheet.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],video[controls]'));
        controls()[0]?.focus({ preventScroll: true });
        const play = (event: Event) => {
            if (closing.current) { (event.target as HTMLVideoElement).pause(); return; }
            sheet.querySelectorAll('video').forEach(video => { if (video !== event.target) video.pause(); });
        };
        sheet.addEventListener('play', play, true);
        const keyboard = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { event.preventDefault(); close(); }
            if (event.key !== 'Tab') return;
            const elements = controls(); const first = elements[0], last = elements[elements.length - 1];
            if (!elements.includes(document.activeElement as HTMLElement)) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
            else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        };
        document.addEventListener('keydown', keyboard);
        return () => {
            animation?.cancel();
            sheet.removeEventListener('play', play, true);
            sheet.querySelectorAll('video').forEach(video => video.pause());
            document.removeEventListener('keydown', keyboard);
            UIEventBus.dispatch('project:close', {});
        };
    }, [source]);

    if (!source) return null;
    return <div className="project-overlay" data-no-camera="true"
        onClick={event => { if (event.currentTarget === event.target) close(); }}>
        <section className="project-card" ref={panel} role="dialog" aria-modal="true" aria-labelledby="project-reader-title">
            <header className="project-card-header">
                <div><h2 id="project-reader-title">{project.title}</h2>{project.date && <p>{project.date}</p>}</div>
                <button className="project-close" type="button" onClick={close} aria-label="Close project">×</button>
            </header>
            <div className="project-card-body">
                <div className="project-video">
                    {project.videoUrl
                        ? <video controls playsInline preload="none" poster={project.videoPoster} src={project.videoUrl} aria-label={`${project.title} demonstration`} />
                        : project.previewImage ? <img src={project.previewImage} alt={`${project.title} CAD assembly`} />
                        : <div className="project-video-placeholder"><span>Video coming soon</span></div>}
                </div>
                <div className="project-brief">
                    <h3>Project brief</h3>
                    <p>{project.brief}</p>
                    <p className="project-details">{project.details}</p>
                    <nav className="project-links" aria-label="Project links">
                        {project.cadUrl ? <a href={project.cadUrl} target="_blank" rel="noopener noreferrer">View CAD ↗</a>
                            : <span aria-disabled="true">CAD link coming soon</span>}
                        {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                            : <span aria-disabled="true">GitHub link coming soon</span>}
                        {project.models?.map(model => <a key={model.href} href={model.href} download>{model.title} ↓</a>)}
                    </nav>
                </div>
            </div>
            {(project.story.length > 0 || project.reflections.length > 0) && <ProjectStory stages={project.story} reflections={project.reflections} />}
        </section>
    </div>;
}
