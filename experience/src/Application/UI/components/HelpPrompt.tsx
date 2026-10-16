import React, { useEffect, useRef, useState } from 'react';
import UIEventBus from '../EventBus';
import Application from '../../Application';
import { CameraKey } from '../../Camera/Camera';

/** One immediately available prompt, tied to the actual camera view. */
const HelpPrompt: React.FC = () => {
    const [visible, setVisible] = useState(true);
    const button = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const change = (event: Event) => {
            const { view, moving } = (event as CustomEvent).detail;
            setVisible(view === 'idle' && !moving);
        };
        document.addEventListener('cameraViewChanged', change);
        const camera = new Application().camera;
        const overview = camera.currentKeyframe === CameraKey.IDLE && !camera.targetKeyframe;
        setVisible(overview);
        if (overview) button.current?.focus({ preventScroll: true });
        return () => document.removeEventListener('cameraViewChanged', change);
    }, []);
    return visible ? (
        <button ref={button} className="room-approach" onClick={() => UIEventBus.dispatch('approachDesk', {})}>
            Click anywhere to begin
        </button>
    ) : null;
};
export default HelpPrompt;
