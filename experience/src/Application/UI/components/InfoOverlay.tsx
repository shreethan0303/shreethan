import React, { useEffect, useState } from 'react';
import FreeCamToggle from './FreeCamToggle';
import MuteToggle from './MuteToggle';
import UIEventBus from '../EventBus';

const InfoOverlay: React.FC<{ showBack: boolean }> = ({ showBack }) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    useEffect(() => {
        const interval = window.setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="desk-info">
            <p>Shreethan Palla</p>
            <div className="desk-info-row">
                <time>{time}</time>
                <MuteToggle />
                <FreeCamToggle />
            </div>
            {showBack && <button className="desk-back" onClick={() => UIEventBus.dispatch('returnToOverview', {})}>Back to room</button>}
        </div>
    );
};
export default InfoOverlay;
