import EventEmitter from './EventEmitter';
import Application from '../Application';
import {
    clientPointToExperience,
    getExperienceViewport,
    isMobileExperience,
} from './Viewport';
export default class Mouse extends EventEmitter {
    x: number;
    y: number;
    inComputer: boolean;
    application: Application;
    touchActive: boolean;

    constructor() {
        super();

        // Setup
        const viewport = getExperienceViewport();
        this.x = viewport.width / 2;
        this.y = viewport.height / 2;
        this.inComputer = false;
        this.touchActive = false;
        // this.application = new Application();
        // this.audio = this.application.world.audio;

        // Resize event
        this.on('mousemove', (event: any) => {
            if (event.clientX && event.clientY) {
                this.x = event.clientX;
                this.y = event.clientY;
            }
            this.inComputer = event.inComputer ? true : false;
        });

        const isInterfaceControl = (target: EventTarget | null) =>
            target instanceof Element &&
            Boolean(target.closest('#prevent-click, button, a, input, textarea'));

        const updateTouchPosition = (event: PointerEvent) => {
            const point = clientPointToExperience(event.clientX, event.clientY);
            this.x = point.x;
            this.y = point.y;
        };

        document.addEventListener(
            'pointerdown',
            (event) => {
                if (
                    event.pointerType !== 'touch' &&
                    !isMobileExperience()
                )
                    return;
                if (isInterfaceControl(event.target)) return;
                this.touchActive = true;
                updateTouchPosition(event);
            },
            true
        );

        document.addEventListener(
            'pointermove',
            (event) => {
                if (!this.touchActive) return;
                updateTouchPosition(event);
                event.preventDefault();
            },
            { capture: true, passive: false }
        );

        const endTouch = (event: PointerEvent) => {
            if (event.pointerType === 'touch' || isMobileExperience()) {
                this.touchActive = false;
            }
        };

        document.addEventListener('pointerup', endTouch, true);
        document.addEventListener('pointercancel', endTouch, true);
    }
}
