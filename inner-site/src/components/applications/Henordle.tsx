import React from 'react';
import Window from '../os/Window';
import Wordle from '../wordle/Wordle';

export interface IslamleAppProps extends WindowAppProps {}

const IslamleApp: React.FC<IslamleAppProps> = (props) => {
    return (
        <Window
            top={20}
            left={300}
            width={600}
            height={860}
            windowBarIcon="windowGameIcon"
            windowTitle="Islamle"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={'© Copyright 2026 Mohamed Islam'}
        >
            <div className="site-page">
                <Wordle />
            </div>
        </Window>
    );
};

export default IslamleApp;
