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
        if (!immediate) timer.current = window.setTimeout(() => setPhase('done'), 1800);
    };

    if (phase === 'done') return null;
    return (
        <div className={`garage-entry garage-entry--${phase}`} aria-label="Workshop entrance">
            <div className="garage-door" aria-hidden={phase === 'opening'}>
                <div className="garage-panels" aria-hidden="true">
                    {Array.from({ length: 8 }, (_, i) => <div key={i} className="garage-panel" />)}
                </div>
                <section className="garage-nameplate" aria-label="Shreethan Palla portfolio">
                    <h1 className="garage-name">Shreethan Palla</h1>
                    <p className="garage-subtitle">Portfolio</p>
                    <button className="garage-start" onClick={start} disabled={!ready}>Start</button>
                    <p className="garage-sr-only" role="status">{failed ? 'Unable to load the workshop.' : ready ? 'Ready when you are.' : 'Loading workshop.'}</p>
                    {failed && <a className="garage-direct" href="/desktop">Open portfolio</a>}
                </section>
            </div>
        </div>
    );
};
export default LoadingScreen;
