import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import UIEventBus from '../EventBus';
import Application from '../../Application';
import { CameraKey } from '../../Camera/Camera';

const HELP_TEXT = 'Click anywhere to begin';

/** The original black typing prompt begins once, after the garage is gone. */
const HelpPrompt: React.FC = () => {
    const [text, setText] = useState('');
    const [visible, setVisible] = useState(true);
    const [dismissed, setDismissed] = useState(false);
    const active = useRef(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    useEffect(() => {
        let timer = 0;
        const dismiss = () => {
            active.current = false;
            clearTimeout(timer);
            setVisible(false);
        };
        const camera = (event: Event) => {
            if ((event as CustomEvent).detail.view !== 'idle') dismiss();
        };
        document.addEventListener('cameraViewChanged', camera);
        const current = new Application().camera;
        if (current.currentKeyframe !== CameraKey.IDLE || current.targetKeyframe) dismiss();
        else if (reduced) setText(HELP_TEXT);
        else {
            const type = (index: number) => {
                if (!active.current) return;
                setText(HELP_TEXT.slice(0, index + 1));
                window.postMessage({ type: 'keydown', key: `_AUTO_${HELP_TEXT[index]}` }, '*');
                if (index + 1 < HELP_TEXT.length) timer = window.setTimeout(() => type(index + 1), Math.random() * 120 + 50);
            };
            timer = window.setTimeout(() => type(0), 500);
        }
        return () => {
            active.current = false;
            clearTimeout(timer);
            document.removeEventListener('cameraViewChanged', camera);
        };
    }, []);
    return text && !dismissed ? (
        <motion.button type="button" className="henry-room-prompt" aria-label={HELP_TEXT}
            aria-hidden={!visible} tabIndex={visible ? 0 : -1}
            onClick={() => UIEventBus.dispatch('approachDesk', {})}
            initial="hidden" animate={visible ? 'visible' : 'hidden'}
            onAnimationComplete={() => { if (!visible) setDismissed(true); }}
            variants={{
                visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : .3 } },
                hidden: { opacity: 0, y: reduced ? 0 : 8, transition: { duration: reduced ? 0 : .3 } },
            }} style={{ pointerEvents: visible ? 'auto' : 'none' }}>
            <p>{text}</p><span className="blinking-cursor" aria-hidden="true" />
        </motion.button>
    ) : null;
};
export default HelpPrompt;
