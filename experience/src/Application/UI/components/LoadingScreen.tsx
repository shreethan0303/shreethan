import React, { useEffect, useRef, useState } from 'react';
import Application from '../../Application';
import eventBus from '../EventBus';

/** A lightweight screen-space door reveals the original 3D room and camera move. */
const LoadingScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [failed, setFailed] = useState(false);
    const [phase, setPhase] = useState<'closed' | 'opening' | 'done'>('closed');
    const started = useRef(false);
    const timer = useRef<number>();
    const panels = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const update = (event: Event) => {
            const data = (event as CustomEvent).detail;
            setProgress(Math.min(1, data.progress || 0));
        };
        const error = () => setFailed(true);
        document.addEventListener('loadedSource', update);
        document.addEventListener('resourceLoadFailed', error);
        // Cached files may finish before this effect subscribes.
        const resources = new Application().resources;
        if (resources.toLoad > 0) setProgress(resources.loaded / resources.toLoad);
        return () => {
            document.removeEventListener('loadedSource', update);
            document.removeEventListener('resourceLoadFailed', error);
            if (timer.current) window.clearTimeout(timer.current);
        };
    }, []);

    useEffect(() => {
        if (phase !== 'opening') return;
        const began = performance.now();
        let frame = 0;
        const animate = (now: number) => {
            const t = Math.max(0, Math.min(1, (now - began - 100) / 2200));
            const eased = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const height = window.innerHeight;
            const panelHeight = height / 4;
            const radius = panelHeight * 1.15;
            const lift = eased * (height + Math.PI * radius / 2 + height * .25);
            const bend = Math.min(1, lift / radius);
            // A vertical track curves into an overhead track. Each panel follows it.
            const track = (distance: number) => {
                const flatY = height - distance;
                const turn = distance - (height - radius);
                if (turn <= 0) return { y: flatY, z: 0 };
                const angle = Math.min(Math.PI / 2, turn / radius);
                const y = radius - radius * Math.sin(angle);
                const z = -radius * (1 - Math.cos(angle)) - Math.max(0, turn - Math.PI * radius / 2);
                return { y: flatY + (y - flatY) * bend, z: z * bend };
            };
            panels.current.forEach((panel, i) => {
                if (!panel) return;
                const top = track(height - i * panelHeight + lift);
                const bottom = track(height - (i + 1) * panelHeight + lift);
                const length = Math.hypot(bottom.y - top.y, bottom.z - top.z);
                const angle = Math.atan2(bottom.z - top.z, bottom.y - top.y);
                panel.style.top = '0px';
                panel.style.height = `${length + 1}px`;
                panel.style.transform = `translate3d(0,${(top.y + bottom.y) / 2 - (length + 1) / 2}px,${(top.z + bottom.z) / 2}px) rotateX(${angle}rad)`;
            });
            if (t < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [phase]);

    const ready = progress >= 1 && !failed;
    const start = () => {
        if (!ready || started.current) return;
        started.current = true;
        const immediate = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setPhase(immediate ? 'done' : 'opening');
        // The camera listens for the same event as the original boot screen.
        eventBus.dispatch('loadingScreenDone', { immediate });
        const ui = document.getElementById('ui');
        if (ui) ui.style.pointerEvents = 'none';
        if (!immediate) timer.current = window.setTimeout(() => setPhase('done'), 2400);
    };

    if (phase === 'done') return null;
    return (
        <div className={`garage-entry garage-entry--${phase}`} aria-label="Workshop entrance">
            <div className="garage-door" aria-hidden="true">
                <div className="garage-panels">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div key={i} ref={node => { panels.current[i] = node; }} style={{ top: `${i * 25}%` }} className="garage-panel">
                            {Array.from({ length: 4 }, (_, j) => <span key={j} className="garage-recess" />)}
                        </div>
                    ))}
                </div>
            </div>
            <section className="garage-nameplate" aria-label="Shreethan Palla portfolio">
                <h1 className="garage-name">Shreethan Palla</h1>
                <p className="garage-subtitle">Portfolio</p>
                <button className="garage-start" onClick={start} disabled={!ready}>Start</button>
                <p className="garage-sr-only" role="status">{failed ? 'Unable to load the workshop.' : ready ? 'Ready when you are.' : 'Loading workshop.'}</p>
                <a className="garage-direct" href="/desktop">Open without 3D</a>
            </section>
        </div>
    );
};
export default LoadingScreen;
