import React, { useEffect, useRef, useState } from 'react';

import { DosPlayer as Instance, DosPlayerFactoryType } from 'js-dos';

declare const Dos: DosPlayerFactoryType;

interface PlayerProps {
    width: number;
    height: number;
    bundleUrl: string;
}

export default function DosPlayer(props: PlayerProps) {
    const rootRef = useRef<HTMLDivElement>(null);

    const [dos, setDos] = useState<Instance | null>(null);

    useEffect(() => {
        if (rootRef === null || rootRef.current === null) {
            return;
        }

        const root = rootRef.current as HTMLDivElement;
        const instance = Dos(root);

        setDos(instance);
        const elements = rootRef.current.getElementsByClassName('flex-grow-0');

        while (elements.length > 0) {
            elements[0].remove();
        }

        return () => {
            const commandInterface = instance.ciPromise;
            if (commandInterface) {
                commandInterface
                    .then((ci: any) => {
                        ci.mute && ci.mute();
                        ci.exit && ci.exit();
                    })
                    .catch(() => {});
            }
            instance.stop().catch(() => {});
            root.querySelectorAll('audio, video').forEach((media) => {
                const element = media as HTMLMediaElement;
                element.pause();
                element.muted = true;
                element.src = '';
            });
            root.replaceChildren();
        };
    }, [rootRef]);

    useEffect(() => {
        if (dos !== null) {
            dos.run(new URL('/os/' + props.bundleUrl, window.location.origin).href);
        }
    }, [dos, props.bundleUrl]);
    return (
        <div
            ref={rootRef}
            style={{
                width: props.width,
                height: props.height,
                position: 'absolute',
            }}
        ></div>
    );
}
