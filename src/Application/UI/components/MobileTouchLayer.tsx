import React, { useEffect, useRef, useState } from 'react';
import UIEventBus from '../EventBus';
import { getExperienceViewport } from '../../Utils/Viewport';

type SceneMode = 'desk' | 'monitor';

const MobileTouchLayer: React.FC = () => {
    const [mobile, setMobile] = useState(getExperienceViewport().isMobile);
    const [mode, setMode] = useState<SceneMode>('desk');
    const [muted, setMuted] = useState(false);
    const dragging = useRef(false);
    const moved = useRef(false);
    const start = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const resize = () => setMobile(getExperienceViewport().isMobile);
        const enter = () => setMode('monitor');
        const leave = () => setMode('desk');

        window.addEventListener('resize', resize);
        window.addEventListener('orientationchange', resize);
        UIEventBus.on('enterMonitor', enter);
        UIEventBus.on('leftMonitor', leave);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('orientationchange', resize);
            UIEventBus.remove('enterMonitor', enter);
            UIEventBus.remove('leftMonitor', leave);
        };
    }, []);

    if (!mobile) return null;

    const sendPosition = (event: React.PointerEvent<HTMLDivElement>) => {
        UIEventBus.dispatch('mobileTouchMove', {
            clientX: event.clientX,
            clientY: event.clientY,
        });
    };

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if ((event.target as Element).closest('button')) return;
        dragging.current = true;
        moved.current = false;
        start.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
        sendPosition(event);
        UIEventBus.dispatch('unlockAudio', {});
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        if (
            Math.abs(event.clientX - start.current.x) > 8 ||
            Math.abs(event.clientY - start.current.y) > 8
        ) {
            moved.current = true;
        }
        sendPosition(event);
    };

    const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        dragging.current = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        if (mode === 'monitor' && !moved.current) openPortfolio();
    };

    const action = (callback: () => void) => (
        event: React.PointerEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        event.stopPropagation();
        UIEventBus.dispatch('unlockAudio', {});
        callback();
    };

    const zoomToComputer = () => {
        setMode('monitor');
        UIEventBus.dispatch('mobileEnterMonitor', {});
    };

    const backToDesk = () => {
        setMode('desk');
        UIEventBus.dispatch('mobileLeaveMonitor', {});
    };

    const openPortfolio = () => window.location.assign('/os/?mobile=1');

    const toggleSound = () => {
        const nextMuted = !muted;
        setMuted(nextMuted);
        UIEventBus.dispatch('muteToggle', nextMuted);
    };

    return (
        <div
            className="mobile-touch-layer"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (dragging.current = false)}
        >
            <div className="mobile-touch-rail">
                <div className="mobile-touch-status">
                    <strong>{mode === 'monitor' ? 'COMPUTER' : '3D DESK'}</strong>
                    <span>
                        {mode === 'monitor'
                            ? 'Tap the screen to open it'
                            : 'Drag anywhere to move'}
                    </span>
                </div>
                <div className="mobile-touch-actions">
                    {mode === 'desk' ? (
                        <button type="button" onPointerUp={action(zoomToComputer)}>
                            <span>ZOOM TO COMPUTER</span>
                        </button>
                    ) : (
                        <button type="button" onPointerUp={action(backToDesk)}>
                            <span>BACK TO DESK</span>
                        </button>
                    )}
                    <button
                        type="button"
                        className="mobile-touch-primary"
                        onPointerUp={action(openPortfolio)}
                    >
                        <span>OPEN PORTFOLIO</span>
                    </button>
                    <button type="button" onPointerUp={action(toggleSound)}>
                        <span>{muted ? 'SOUND OFF' : 'SOUND ON'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileTouchLayer;
