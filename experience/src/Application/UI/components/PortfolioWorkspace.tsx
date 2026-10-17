import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import UIEventBus from '../EventBus';
import { cubeProject } from '../../../cube-project';
import {
    frcProject,
    elevatorProject,
    rcProject,
} from '../../../workshop-projects';
import { portfolioCopy } from '../../../portfolio-copy';
import { ProjectContent } from '../../../project-story';

const projects: ProjectContent[] = [
    cubeProject,
    rcProject,
    frcProject,
    elevatorProject,
];
type Tab = 'projects' | 'about' | 'resume';

/** CAD-inspired navigation using the same real project data as the desk. */
export default function PortfolioWorkspace() {
    const [open, setOpen] = useState(false),
        [covered, setCovered] = useState(false);
    const [selected, setSelected] = useState(0),
        [tab, setTab] = useState<Tab>('projects');
    const panel = useRef<HTMLElement>(null),
        read = useRef<HTMLButtonElement>(null);
    const project = projects[selected];
    const close = () => {
        setOpen(false);
        UIEventBus.dispatch('workspace:close', {});
    };
    useEffect(() => {
        const enter = () => {
            setCovered(false);
            setOpen(true);
        };
        const projectOpen = () => setCovered(true),
            projectClose = () => setCovered(false);
        document.addEventListener('workspace:open', enter);
        document.addEventListener('project:open', projectOpen);
        document.addEventListener('project:close', projectClose);
        return () => {
            document.removeEventListener('workspace:open', enter);
            document.removeEventListener('project:open', projectOpen);
            document.removeEventListener('project:close', projectClose);
        };
    }, []);
    useLayoutEffect(() => {
        if (!open || covered || !panel.current) return;
        const sheet = panel.current;
        const controls = () =>
            Array.from(
                sheet.querySelectorAll<HTMLElement>(
                    'button:not(:disabled),a[href]',
                ),
            );
        (read.current || controls()[0])?.focus({ preventScroll: true });
        const key = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                close();
                return;
            }
            if (event.key !== 'Tab') return;
            const buttons = controls(),
                first = buttons[0],
                last = buttons[buttons.length - 1];
            if (!buttons.includes(document.activeElement as HTMLElement)) {
                event.preventDefault();
                (event.shiftKey ? last : first)?.focus();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };
        document.addEventListener('keydown', key);
        return () => document.removeEventListener('keydown', key);
    }, [open, covered]);
    if (!open || covered) return null;
    const choose = (index: number) => {
        setSelected(index);
        setTab('projects');
    };
    const showProject = () => {
        const bounds = panel.current!.getBoundingClientRect();
        UIEventBus.dispatch('project:open', {
            project,
            rect: {
                x: bounds.x,
                y: bounds.y,
                width: bounds.width,
                height: bounds.height,
            },
        });
    };
    return (
        <div className="cad-overlay" data-no-camera="true">
            <section
                className="cad-workspace"
                ref={panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="workspace-title"
            >
                <header className="cad-header">
                    <div>
                        <span className="cad-monogram" aria-hidden="true">
                            SP
                        </span>
                        <h2 id="workspace-title">Shreethan Palla</h2>
                        <span className="cad-document">Portfolio</span>
                    </div>
                    <button type="button" onClick={close}>
                        ← Back to desk
                    </button>
                </header>
                <div className="cad-toolbar">
                    <span>
                        {tab === 'projects'
                            ? project.title
                            : tab === 'about'
                              ? 'About'
                              : 'Résumé'}
                    </span>
                    {tab === 'projects' && <span>{project.date}</span>}
                </div>
                <div className="cad-body">
                    <nav className="cad-tree" aria-label="Portfolio projects">
                        <h3>Projects</h3>
                        {projects.map((item, index) => (
                            <button
                                key={item.title}
                                type="button"
                                aria-current={
                                    tab === 'projects' && selected === index
                                        ? 'page'
                                        : undefined
                                }
                                onClick={() => choose(index)}
                            >
                                <span
                                    className="cad-tree-icon"
                                    aria-hidden="true"
                                >
                                    ◇
                                </span>
                                <span>
                                    {item.title}
                                    <small>{item.date}</small>
                                </span>
                            </button>
                        ))}
                    </nav>
                    <main className="cad-viewport">
                        {tab === 'projects' && (
                            <div className="cad-project-preview">
                                <img
                                    src={
                                        project.videoPoster ||
                                        project.previewImage
                                    }
                                    alt={
                                        project.previewAlt ||
                                        `${project.title} project preview`
                                    }
                                />
                                <div>
                                    <p className="cad-eyebrow">
                                        {project.date}
                                    </p>
                                    <h3>{project.title}</h3>
                                    <p>{project.brief}</p>
                                    <button
                                        ref={read}
                                        className="cad-primary"
                                        type="button"
                                        onClick={showProject}
                                    >
                                        Read project
                                    </button>
                                </div>
                            </div>
                        )}
                        {tab === 'about' && (
                            <article className="cad-document-page">
                                <h3>About</h3>
                                <p>{portfolioCopy.intro.replace('\n', ' ')}</p>
                            </article>
                        )}
                        {tab === 'resume' && (
                            <article className="cad-document-page">
                                <h3>Résumé</h3>
                                <p className="cad-eyebrow">Placeholder</p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua.
                                </p>
                                <a
                                    className="cad-primary"
                                    href="/resume/shreethan-palla-placeholder.pdf"
                                    download
                                >
                                    Download PDF ↓
                                </a>
                            </article>
                        )}
                    </main>
                </div>
                <nav className="cad-tabs" aria-label="Workspace sections">
                    {(['projects', 'about', 'resume'] as Tab[]).map((item) => (
                        <button
                            key={item}
                            type="button"
                            aria-current={tab === item ? 'page' : undefined}
                            onClick={() => setTab(item)}
                        >
                            {item === 'projects'
                                ? 'Projects'
                                : item === 'about'
                                  ? 'About'
                                  : 'Résumé'}
                        </button>
                    ))}
                </nav>
            </section>
        </div>
    );
}
