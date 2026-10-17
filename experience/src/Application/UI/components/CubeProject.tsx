import React, { useEffect, useRef, useState } from 'react';
import { cubeProject } from '../../../cube-project';
import UIEventBus from '../EventBus';
import ProjectStory from './ProjectStory';

type SourceRect = { x: number; y: number; width: number; height: number };

export default function CubeProject() {
    const [source, setSource] = useState<SourceRect | null>(null);
    const panel = useRef<HTMLElement>(null);
    const close = () => {
        panel.current?.querySelectorAll('video').forEach(video => video.pause());
        setSource(null);
    };

    useEffect(() => {
        const open = (event: Event) => setSource((event as CustomEvent<SourceRect>).detail);
        document.addEventListener('cube-project:open', open);
        return () => document.removeEventListener('cube-project:open', open);
    }, []);

    useEffect(() => {
        if (!source || !panel.current) return;
        const sheet = panel.current;
        const bounds = sheet.getBoundingClientRect();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const animation = reduced ? undefined : sheet.animate([
            { transform: `translate(${source.x + source.width / 2 - bounds.x - bounds.width / 2}px, ${source.y + source.height / 2 - bounds.y - bounds.height / 2}px) scale(.35)`, opacity: 0 },
            { transform: 'none', opacity: 1 },
        ], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
        const controls = () => Array.from(sheet.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],video[controls]'));
        controls()[0]?.focus({ preventScroll: true });
        const play = (event: Event) => {
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
            UIEventBus.dispatch('cube-project:close', {});
        };
    }, [source]);

    if (!source) return null;
    return <div className="project-overlay" data-no-camera="true"
        onClick={event => { if (event.currentTarget === event.target) close(); }}>
        <section className="project-card" ref={panel} role="dialog" aria-modal="true" aria-labelledby="cube-project-title">
            <header className="project-card-header">
                <div><h2 id="cube-project-title">{cubeProject.title}</h2><p>{cubeProject.date}</p></div>
                <button className="project-close" type="button" onClick={close} aria-label="Close project">×</button>
            </header>
            <div className="project-card-body">
                <div className="project-video">
                    {cubeProject.videoUrl
                        ? <video controls playsInline preload="none" poster={cubeProject.videoPoster} src={cubeProject.videoUrl} aria-label="Rubik’s cube robot demonstration" />
                        : <div className="project-video-placeholder"><span>Video coming soon</span></div>}
                </div>
                <div className="project-brief">
                    <h3>Project brief</h3>
                    <p>{cubeProject.brief}</p>
                    <p className="project-details">{cubeProject.details}</p>
                    <nav className="project-links" aria-label="Project links">
                        {cubeProject.cadUrl ? <a href={cubeProject.cadUrl} target="_blank" rel="noopener noreferrer">View CAD ↗</a>
                            : <span aria-disabled="true">CAD link coming soon</span>}
                        {cubeProject.githubUrl ? <a href={cubeProject.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                            : <span aria-disabled="true">GitHub link coming soon</span>}
                    </nav>
                </div>
            </div>
            <ProjectStory stages={cubeProject.story} reflections={cubeProject.reflections} />
        </section>
    </div>;
}
