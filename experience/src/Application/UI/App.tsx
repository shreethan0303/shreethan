import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import LoadingScreen from './components/LoadingScreen';
import ResumePaper from './components/ResumePaper';
import ProjectReader from './components/ProjectReader';
import PortfolioWorkspace from './components/PortfolioWorkspace';
import HelpPrompt from './components/HelpPrompt';
import InterfaceUI from './components/InterfaceUI';
import eventBus from './EventBus';
import './style.css';

const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        eventBus.on('loadingScreenDone', () => {
            setLoading(false);
        });
    }, []);

    return (
        <div id="ui-app">
            {!loading && <HelpPrompt />}
            <LoadingScreen />
            <ResumePaper />
            <PortfolioWorkspace />
            <ProjectReader />
        </div>
    );
};

const createUI = () => {
    ReactDOM.render(<App />, document.getElementById('ui'));
};

const createVolumeUI = () => {
    ReactDOM.render(<InterfaceUI />, document.getElementById('ui-interactive'));
};

export { createUI, createVolumeUI };
