import React, { useEffect, useState } from 'react';
import UIEventBus from '../EventBus';
import { getExperienceViewport } from '../../Utils/Viewport';

type SceneMode = 'desk' | 'monitor';

const MobileSceneControls: React.FC = () => {
    const [viewport, setViewport] = useState(getExperienceViewport);
    const [mode, setMode] = useState<SceneMode>('desk');

    useEffect(() => {
        const onResize = () => {
            setViewport(getExperienceViewport());
        };
        const onEnterMonitor = () => setMode('monitor');
        const onLeaveMonitor = () => setMode('desk');

        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
        UIEventBus.on('enterMonitor', onEnterMonitor);
        UIEventBus.on('leftMonitor', onLeaveMonitor);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
        };
    }, []);

    if (!viewport.isMobile) return <></>;

    const zoomToComputer = (
        event?: React.MouseEvent | React.PointerEvent | React.TouchEvent
    ) => {
        event?.preventDefault();
        event?.stopPropagation();
        setMode('monitor');
        UIEventBus.dispatch('mobileEnterMonitor', {});
    };

    const backToDesk = (
        event?: React.MouseEvent | React.PointerEvent | React.TouchEvent
    ) => {
        event?.preventDefault();
        event?.stopPropagation();
        setMode('desk');
        UIEventBus.dispatch('mobileLeaveMonitor', {});
    };

    const openFullscreen = (
        event?: React.MouseEvent | React.PointerEvent | React.TouchEvent
    ) => {
        event?.preventDefault();
        event?.stopPropagation();
        window.location.assign('/os/?mobile=1');
    };

    return (
        <div className="mobile-scene-controls" id="prevent-click">
            <div className="mobile-scene-status" id="prevent-click">
                <span id="prevent-click">
                    {mode === 'monitor' ? 'COMPUTER VIEW' : '3D DESK'}
                </span>
                <p id="prevent-click">
                    {mode === 'monitor'
                        ? 'Tap the screen links · return to the desk anytime'
                        : 'Drag anywhere to move the camera · tap Zoom for the screen'}
                </p>
            </div>
            <div className="mobile-scene-actions" id="prevent-click">
                {mode === 'desk' ? (
                    <button
                        id="prevent-click"
                        type="button"
                        onClick={zoomToComputer}
                        onTouchEnd={zoomToComputer}
                    >
                        ZOOM TO COMPUTER
                    </button>
                ) : (
                    <button
                        id="prevent-click"
                        type="button"
                        onClick={backToDesk}
                        onTouchEnd={backToDesk}
                    >
                        BACK TO DESK
                    </button>
                )}
                <button
                    id="prevent-click"
                    type="button"
                    className="mobile-fullscreen-button"
                    onClick={openFullscreen}
                    onTouchEnd={openFullscreen}
                >
                    MOBILE PORTFOLIO
                </button>
            </div>
        </div>
    );
};

export default MobileSceneControls;
