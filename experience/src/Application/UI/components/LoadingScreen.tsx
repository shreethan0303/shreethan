import React, { useEffect, useRef, useState } from 'react';
import Application from '../../Application';
import eventBus from '../EventBus';
import { portfolioCopy } from '../../../portfolio-copy';

/** Real asset loading, then text moves away before the sectional door opens. */
const LoadingScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [failed, setFailed] = useState(false);
    const [rendered, setRendered] = useState(false);
    const [phase, setPhase] = useState<'closed' | 'opening' | 'done'>('closed');
    const panels = useRef<(HTMLDivElement | null)[]>([]);
    const copy = useRef<HTMLElement>(null);
    const motion = useRef({ current: 0, target: 0, finished: false });

    useEffect(() => {
        const update = (event: Event) => setProgress(Math.min(1, (event as CustomEvent).detail.progress || 0));
        const error = () => setFailed(true);
        const firstFrame = () => setRendered(true);
        document.addEventListener('loadedSource', update);
        document.addEventListener('resourceLoadFailed', error);
        document.addEventListener('workspaceReady', firstFrame);
        const application = new Application();
        application.camera.interactionLocked = true;
        const resources = application.resources;
        setRendered(application.workspaceReady);
        if (resources.failed) setFailed(true);
        if (resources.toLoad > 0) setProgress(resources.loaded / resources.toLoad);
        return () => {
            document.removeEventListener('loadedSource', update);
            document.removeEventListener('resourceLoadFailed', error);
            document.removeEventListener('workspaceReady', firstFrame);
        };
    }, []);

    const ready = progress >= 1 && rendered && !failed;
    useEffect(() => {
        if (!ready || motion.current.finished) return;
        const state = motion.current;
        let frame = 0;
        let previous = performance.now();
        let touchY = 0;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const removeListeners = () => {
            document.removeEventListener('wheel', wheel);
            document.removeEventListener('touchstart', touchStart);
            document.removeEventListener('touchmove', touchMove);
            document.removeEventListener('keydown', keyboard);
            window.removeEventListener('resize', resize);
        };
        const finish = () => {
            state.finished = true;
            setPhase('done');
            const application = new Application();
            application.camera.interactionLocked = false;
            eventBus.dispatch('loadingScreenDone', { immediate: reduced });
            const ui = document.getElementById('ui');
            if (ui) ui.style.pointerEvents = 'none';
            removeListeners();
        };
        const draw = (value: number) => {
            // The first 30% is only the introduction; the door stays closed.
            const textProgress = Math.min(1, value / .30);
            if (copy.current) {
                copy.current.style.transform = `translateY(${-textProgress * innerHeight * .6}px)`;
                copy.current.style.opacity = `${1 - Math.max(0, (textProgress - .2) / .8)}`;
            }
            const doorProgress = Math.max(0, (value - .30) / .70);
            const height = window.innerHeight;
            const panelHeight = height / 4;
            const radius = panelHeight * 1.15;
            const lift = doorProgress * (height + Math.PI * radius / 2 + height * .25);
            const bend = Math.min(1, lift / radius);
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
        };
        const animate = (now: number) => {
            frame = 0;
            if (state.finished) return;
            const blend = 1 - Math.exp(-Math.min(64, now - previous) / 70);
            state.current += (state.target - state.current) * blend;
            previous = now;
            draw(state.current);
            if (state.target >= 1 && state.current > .999) { finish(); return; }
            if (state.target === 0 && state.current < .001) {
                state.current = 0;
                draw(0);
                setPhase('closed');
                return;
            }
            if (Math.abs(state.target - state.current) > .0001) frame = requestAnimationFrame(animate);
        };
        const schedule = () => {
            if (!frame) { previous = performance.now(); frame = requestAnimationFrame(animate); }
        };
        const advance = (amount: number) => {
            if (state.finished) return;
            if (reduced && amount > 0) { finish(); return; }
            state.target = Math.max(0, Math.min(1, state.target + amount));
            if (state.target > 0) setPhase('opening');
            schedule();
        };
        function resize() { draw(state.current); }
        function wheel(event: WheelEvent) {
            if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
            event.preventDefault();
            const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
            advance(pixels / Math.max(500, innerHeight * .85));
        }
        function touchStart(event: TouchEvent) { touchY = event.touches[0]?.clientY || 0; }
        function touchMove(event: TouchEvent) {
            if (event.touches.length !== 1) return;
            event.preventDefault();
            const y = event.touches[0].clientY;
            advance((touchY - y) / Math.max(400, innerHeight * .65));
            touchY = y;
        }
        function keyboard(event: KeyboardEvent) {
            if ((event.target as Element).closest('a,button,input')) return;
            if (['ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); advance(.25); }
            if (['ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); advance(-.25); }
            if (['Enter', 'End'].includes(event.key)) { event.preventDefault(); advance(1); }
        }
        window.addEventListener('resize', resize);
        document.addEventListener('wheel', wheel, { passive: false });
        document.addEventListener('touchstart', touchStart, { passive: true });
        document.addEventListener('touchmove', touchMove, { passive: false });
        document.addEventListener('keydown', keyboard);
        return () => { removeListeners(); cancelAnimationFrame(frame); };
    }, [ready]);

    if (phase === 'done') return null;
    const loadingText = progress < .35 ? portfolioCopy.loading.projects : progress < .8 ? portfolioCopy.loading.cad : portfolioCopy.loading.graphics;
    return (
        <div className={`garage-entry garage-entry--${phase}`} aria-label="Workshop entrance">
            <div className="garage-door" aria-hidden="true">
                <div className="garage-panels">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div key={i} ref={node => { panels.current[i] = node; }} style={{ top: `${i * 25}%` }} className="garage-panel" />
                    ))}
                </div>
            </div>
            {!ready && <div className="workspace-loading">
                {failed ? <>
                    <p className="workspace-load-error" role="alert">The workspace couldn’t load.</p>
                    <button className="workspace-retry" onClick={() => window.location.reload()}>Reload</button>
                </> : <>
                    <svg className="workspace-spinner" viewBox="0 0 40 40" role="progressbar" aria-label="Loading website" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                        <circle className="workspace-track" cx="20" cy="20" r="17" />
                        <circle className="workspace-progress" cx="20" cy="20" r="17" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress * 100} transform="rotate(-90 20 20)" />
                    </svg>
                    <p className="workspace-load-message" role="status">{loadingText}</p>
                </>}
            </div>}
            {ready && <section className="garage-copy" ref={copy} aria-label="About Shreethan">
                <h1 className="garage-intro">{portfolioCopy.intro}</h1>
                <p className="garage-hint">{portfolioCopy.scrollHint}</p>
                <p className="garage-sr-only">Scroll, swipe up, or use Page Down to open. Press End to continue directly.</p>
            </section>}
        </div>
    );
};
export default LoadingScreen;
