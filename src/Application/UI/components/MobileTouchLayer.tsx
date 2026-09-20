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
    const computerTarget = useRef<HTMLElement | null>(null);

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

    const getComputerPoint = (clientX: number, clientY: number) => {
        const iframe = document.getElementById(
            'computer-screen'
        ) as HTMLIFrameElement | null;
        const iframeWindow = iframe?.contentWindow;
        const iframeDocument = iframe?.contentDocument;
        if (!iframe || !iframeWindow || !iframeDocument) return null;

        const rect = iframe.getBoundingClientRect();
        if (
            clientX < rect.left ||
            clientX > rect.right ||
            clientY < rect.top ||
            clientY > rect.bottom
        ) {
            return null;
        }

        const viewport = getExperienceViewport();
        let outerX: number;
        let outerY: number;

        if (viewport.forceLandscape) {
            outerX = ((clientY - rect.top) / rect.height) * iframe.clientWidth;
            outerY =
                (1 - (clientX - rect.left) / rect.width) *
                iframe.clientHeight;
        } else {
            outerX = ((clientX - rect.left) / rect.width) * iframe.clientWidth;
            outerY = ((clientY - rect.top) / rect.height) * iframe.clientHeight;
        }

        const style = getComputedStyle(iframe);
        const x = outerX - parseFloat(style.paddingLeft || '0');
        const y = outerY - parseFloat(style.paddingTop || '0');
        const target = iframeDocument.elementFromPoint(x, y) as HTMLElement | null;

        return { iframeWindow, target, x, y };
    };

    const dispatchComputerEvent = (
        type: 'down' | 'move' | 'up',
        clientX: number,
        clientY: number,
        allowClick = false
    ) => {
        const point = getComputerPoint(clientX, clientY);
        if (!point) return;

        const target =
            type === 'down'
                ? point.target
                : point.target || computerTarget.current;
        if (!target) return;
        if (type === 'down') computerTarget.current = target;

        const pointerName = `pointer${type}`;
        const mouseName = `mouse${type}`;
        const common = {
            bubbles: true,
            cancelable: true,
            clientX: point.x,
            clientY: point.y,
            button: 0,
            buttons: type === 'up' ? 0 : 1,
            view: point.iframeWindow,
        };
        const PointerEventCtor = (point.iframeWindow as any).PointerEvent;
        const MouseEventCtor = (point.iframeWindow as any).MouseEvent;
        if (PointerEventCtor) {
            target.dispatchEvent(
                new PointerEventCtor(pointerName, {
                    ...common,
                    pointerType: 'touch',
                    isPrimary: true,
                })
            );
        }
        target.dispatchEvent(
            new MouseEventCtor(mouseName, common)
        );

        if (type === 'up' && allowClick) {
            target.dispatchEvent(
                new MouseEventCtor('click', {
                    ...common,
                    buttons: 0,
                })
            );
        }
        if (type === 'up') computerTarget.current = null;
    };

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if ((event.target as Element).closest('button')) return;
        dragging.current = true;
        moved.current = false;
        start.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
        sendPosition(event);
        UIEventBus.dispatch('unlockAudio', {});
        if (mode === 'monitor') {
            dispatchComputerEvent('down', event.clientX, event.clientY);
        }
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
        if (mode === 'monitor') {
            dispatchComputerEvent('move', event.clientX, event.clientY);
        }
    };

    const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        dragging.current = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        if (mode === 'monitor') {
            dispatchComputerEvent(
                'up',
                event.clientX,
                event.clientY,
                !moved.current
            );
        }
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

    const toggleSound = () => {
        const nextMuted = !muted;
        setMuted(nextMuted);
        UIEventBus.dispatch('muteToggle', nextMuted);
    };

    return (
        <div
            className={`mobile-touch-layer mobile-touch-${mode}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
                dragging.current = false;
                computerTarget.current = null;
            }}
        >
            <div className="mobile-touch-rail">
                <div className="mobile-touch-status">
                    <strong>{mode === 'monitor' ? 'COMPUTER' : '3D DESK'}</strong>
                    <span>
                        {mode === 'monitor'
                            ? 'Use links inside the computer'
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
                    <button type="button" onPointerUp={action(toggleSound)}>
                        <span>{muted ? 'SOUND OFF' : 'SOUND ON'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileTouchLayer;
