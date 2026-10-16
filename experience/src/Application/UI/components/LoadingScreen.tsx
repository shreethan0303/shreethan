import React, { useEffect, useRef, useState } from 'react';
import Application from '../../Application';
import eventBus from '../EventBus';
import { portfolioCopy } from '../../../portfolio-copy';

/** One sequence: real loading, plain introduction, closed door, then room. */
const LoadingScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [failed, setFailed] = useState(false);
    const [rendered, setRendered] = useState(false);
    const [visualProgress, setVisualProgress] = useState(0);
    const [loader, setLoader] = useState<'loading' | 'leaving' | 'done'>('loading');
    const [step, setStep] = useState<'intro' | 'door' | 'done'>('intro');
    const loadState = useRef({ progress: 0, rendered: false, failed: false });
    loadState.current = { progress, rendered, failed };
    const panels = useRef<(HTMLDivElement | null)[]>([]);
    const copy = useRef<HTMLElement>(null);
    const hint = useRef<HTMLParagraphElement>(null);
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

    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const start = performance.now();
        let previous = start;
        let shown = 0;
        let frame = 0;
        // The presentation lasts at least 1.1 seconds; it never leads real progress.
        const animate = (now: number) => {
            const state = loadState.current;
            if (state.failed) return;
            const target = Math.min(state.progress, (now - start) / 900, 1);
            shown = reduced ? state.progress : shown + (target - shown) * (1 - Math.exp(-Math.min(64, now - previous) / 70));
            previous = now;
            setVisualProgress(shown);
            if (state.progress >= 1 && state.rendered && now - start >= 1100 && shown > .999) {
                setVisualProgress(1);
                setLoader('leaving');
                return;
            }
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (loader !== 'leaving') return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const timer = window.setTimeout(() => setLoader('done'), reduced ? 0 : 320);
        return () => clearTimeout(timer);
    }, [loader]);

    useEffect(() => {
        if (loader !== 'done' || motion.current.finished) return;
        const state = motion.current;
        const boundary = .4;
        let frame = 0;
        let previous = performance.now();
        let touchY = 0;
        let currentStep = 'intro';
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
            setStep('done');
            const application = new Application();
            application.camera.interactionLocked = false;
            eventBus.dispatch('loadingScreenDone', { immediate: reduced });
            const ui = document.getElementById('ui');
            if (ui) ui.style.pointerEvents = 'none';
            removeListeners();
        };
        const draw = (value: number) => {
            const textProgress = Math.min(1, value / boundary);
            if (copy.current) {
                copy.current.style.transform = `translateY(${-textProgress * innerHeight * .12}px)`;
                copy.current.style.opacity = `${1 - textProgress}`;
                copy.current.style.visibility = textProgress >= .999 ? 'hidden' : 'visible';
            }
            const doorProgress = Math.max(0, (value - boundary) / (1 - boundary));
            if (hint.current) {
                const opacity = Math.min(1, Math.max(0, (textProgress - .7) / .3)) * Math.max(0, 1 - doorProgress / .2);
                hint.current.style.opacity = `${opacity}`;
                hint.current.style.visibility = opacity > .01 ? 'visible' : 'hidden';
            }
            const nextStep = value >= boundary - .001 ? 'door' : 'intro';
            if (nextStep !== currentStep) { currentStep = nextStep; setStep(nextStep); }
            const height = innerHeight;
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
            if (Math.abs(state.target - state.current) > .0001) frame = requestAnimationFrame(animate);
        };
        const advance = (amount: number, skip = false) => {
            if (state.finished) return;
            let target = Math.max(0, Math.min(1, state.target + amount));
            // The first gesture reaches the closed door; another gesture opens it.
            if (!skip && amount > 0 && state.current < boundary - .001) target = Math.min(boundary, target);
            state.target = target;
            if (reduced) {
                state.current = target;
                draw(target);
                if (target >= 1) finish();
            } else if (!frame) {
                previous = performance.now();
                frame = requestAnimationFrame(animate);
            }
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
            if (['ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); advance(.4); }
            if (['ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); advance(-.4); }
            if (['Enter', 'End'].includes(event.key)) { event.preventDefault(); advance(1, true); }
        }
        draw(state.current);
        window.addEventListener('resize', resize);
        document.addEventListener('wheel', wheel, { passive: false });
        document.addEventListener('touchstart', touchStart, { passive: true });
        document.addEventListener('touchmove', touchMove, { passive: false });
        document.addEventListener('keydown', keyboard);
        return () => { removeListeners(); cancelAnimationFrame(frame); };
    }, [loader]);

    if (step === 'done') return null;
    const loadingText = progress < .35 ? portfolioCopy.loading.projects : progress < .8 ? portfolioCopy.loading.cad : portfolioCopy.loading.graphics;
    return (
        <div className="garage-entry" data-stage={loader === 'done' ? step : 'loading'} aria-label="Workshop entrance">
            <div className="garage-door" aria-hidden="true">
                <div className="garage-panels">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div key={i} ref={node => { panels.current[i] = node; }} style={{ top: `${i * 25}%` }} className="garage-panel" />
                    ))}
                </div>
            </div>
            {loader !== 'loading' && <section className="garage-copy" ref={copy} aria-label="About Shreethan">
                <h1 className="garage-intro">{portfolioCopy.intro}</h1>
                <p className="garage-sr-only">Scroll or swipe up to continue to the garage door. Press End to continue directly.</p>
            </section>}
            <p className="garage-hint" ref={hint}>{portfolioCopy.scrollHint}</p>
            {loader !== 'done' && <div className={`workspace-loading${loader === 'leaving' ? ' workspace-loading--leaving' : ''}`}>
                {failed ? <>
                    <p className="workspace-load-error" role="alert">The workspace couldn’t load.</p>
                    <button className="workspace-retry" onClick={() => window.location.reload()}>Reload</button>
                </> : <>
                    <svg className="workspace-spinner" viewBox="0 0 40 40" role="progressbar" aria-label="Loading website" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                        <circle className="workspace-track" cx="20" cy="20" r="17" />
                        <circle className="workspace-progress" cx="20" cy="20" r="17" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - visualProgress * 100} transform="rotate(-90 20 20)" />
                    </svg>
                    <p className="workspace-load-message" role="status">{loadingText}</p>
                </>}
            </div>}
        </div>
    );
};
export default LoadingScreen;
