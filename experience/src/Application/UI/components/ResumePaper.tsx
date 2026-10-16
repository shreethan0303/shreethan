import React, { useEffect, useRef, useState } from 'react';
import UIEventBus from '../EventBus';

type PaperRect = { x: number; y: number; width: number; height: number };

/** Readable HTML takes over from the small 3D sheet when it is opened. */
const ResumePaper: React.FC = () => {
    const [source, setSource] = useState<PaperRect | null>(null);
    const dialog = useRef<HTMLElement>(null);
    const access = useRef<HTMLButtonElement>(null);
    const close = () => setSource(null);

    useEffect(() => {
        const open = (event: Event) => setSource((event as CustomEvent<PaperRect>).detail);
        document.addEventListener('resume:open', open);
        return () => document.removeEventListener('resume:open', open);
    }, []);

    useEffect(() => {
        if (!source || !dialog.current) return;
        UIEventBus.dispatch('resume:visibility', true);
        const panel = dialog.current;
        const previous = document.activeElement as HTMLElement | null;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const bounds = panel.getBoundingClientRect();
        const animation = reduced ? undefined : panel.animate([
            { transform: `translate(${source.x + source.width / 2 - bounds.x - bounds.width / 2}px, ${source.y + source.height / 2 - bounds.y - bounds.height / 2}px) scale(${source.width / bounds.width}, ${source.height / bounds.height})`, opacity: .65 },
            { transform: 'none', opacity: 1 },
        ], { duration: 480, easing: 'cubic-bezier(.2,.8,.2,1)' });
        const controls = Array.from(panel.querySelectorAll<HTMLElement>('button,a[href]'));
        controls[0]?.focus({ preventScroll: true });
        const keyboard = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { event.preventDefault(); close(); }
            if (event.key !== 'Tab') return;
            const first = controls[0], last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', keyboard);
        return () => {
            animation?.cancel();
            document.removeEventListener('keydown', keyboard);
            UIEventBus.dispatch('resume:visibility', false);
            // Restore a meaningful target even when the sheet was opened with a mouse.
            const target = previous && previous !== document.body ? previous : access.current;
            requestAnimationFrame(() => target?.focus({ preventScroll: true }));
        };
    }, [source]);

    return <>
        <button
            id="resume-paper-access" className="paper-access" ref={access}
            hidden aria-label="Open résumé"
            onFocus={() => UIEventBus.dispatch('resume:focus', true)}
            onBlur={() => UIEventBus.dispatch('resume:focus', false)}
            onClick={() => UIEventBus.dispatch('resume:request', {})}
        >Open résumé</button>
        {source && <div className="resume-overlay" data-no-camera="true"
            onClick={event => { if (event.target === event.currentTarget) close(); }}>
            <section className="resume-sheet" role="dialog" aria-modal="true" aria-labelledby="resume-title" ref={dialog}>
                <div className="resume-actions">
                    <button type="button" onClick={close}>← Back to desk</button>
                    <a href="/resume/shreethan-palla-placeholder.pdf" download="Shreethan-Palla-Resume-Placeholder.pdf">Download PDF ↓</a>
                </div>
                <div className="resume-writing">
                    <h2 id="resume-title">Shreethan Palla</h2>
                    <p className="resume-note">Résumé · placeholder</p>
                    <p>Your final résumé will replace this sheet.</p>
                    <h3>Projects</h3>
                    <ul>
                        <li>RC car</li>
                        <li>Cube-solving robot</li>
                        <li>FRC robotics</li>
                        <li>Tennis and software</li>
                    </ul>
                    <h3>Contact</h3>
                    <a href="https://github.com/shreethan0303" target="_blank" rel="noreferrer">github.com/shreethan0303</a>
                    <p className="resume-note resume-footer">Education, experience and project details will be added with the final résumé.</p>
                </div>
            </section>
        </div>}
    </>;
};
export default ResumePaper;
