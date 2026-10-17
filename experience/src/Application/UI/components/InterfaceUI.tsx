import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import InfoOverlay from './InfoOverlay';

/** Henry's original bars/typing, started by the actual desk approach. */
const InterfaceUI: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const interfaceRef = useRef<HTMLElement | null>(null);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    useEffect(() => {
        interfaceRef.current = document.getElementById('ui-interactive');
        const loaded = () => setLoading(false);
        const camera = (event: Event) => {
            const { view, moving } = (event as CustomEvent).detail;
            if (view === 'desk' && moving) setVisible(true);
        };
        const enter = () => {
            setVisible(false);
            if (interfaceRef.current) interfaceRef.current.style.pointerEvents = 'none';
        };
        const leave = () => {
            setVisible(true);
            if (interfaceRef.current) interfaceRef.current.style.pointerEvents = 'auto';
        };
        document.addEventListener('loadingScreenDone', loaded);
        document.addEventListener('cameraViewChanged', camera);
        document.addEventListener('enterMonitor', enter);
        document.addEventListener('leftMonitor', leave);
        return () => {
            document.removeEventListener('loadingScreenDone', loaded);
            document.removeEventListener('cameraViewChanged', camera);
            document.removeEventListener('enterMonitor', enter);
            document.removeEventListener('leftMonitor', leave);
        };
    }, []);
    return !loading ? (
        <motion.div className="interface-wrapper" id="prevent-click"
            initial="hide" animate={visible ? 'visible' : 'hide'}
            variants={{
                visible: { opacity: 1, x: 0, transition: { duration: reduced ? 0 : .5, delay: reduced ? 0 : .3, ease: 'easeOut' } },
                hide: { opacity: 0, x: reduced ? 0 : -32, transition: { duration: reduced ? 0 : .3, ease: 'easeOut' } },
            }}
            style={{ width: '100%', display: 'flex', position: 'absolute', boxSizing: 'border-box' }}>
            <InfoOverlay visible={visible} />
        </motion.div>
    ) : null;
};
export default InterfaceUI;
