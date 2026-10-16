import React, { useEffect, useState } from 'react';
import InfoOverlay from './InfoOverlay';

/** Show the complete interface once the first desk approach finishes. */
const InterfaceUI: React.FC = () => {
    const [entered, setEntered] = useState(false);
    const [view, setView] = useState('idle');
    const [moving, setMoving] = useState(false);
    useEffect(() => {
        const change = (event: Event) => {
            const detail = (event as CustomEvent).detail;
            setView(detail.view);
            setMoving(detail.moving);
            if (detail.view === 'desk' && !detail.moving) setEntered(true);
        };
        document.addEventListener('cameraViewChanged', change);
        return () => document.removeEventListener('cameraViewChanged', change);
    }, []);
    return entered && view !== 'monitor' ? (
        <div className="desk-interface" data-no-camera>
            <InfoOverlay showBack={view === 'desk' && !moving} />
        </div>
    ) : null;
};
export default InterfaceUI;
