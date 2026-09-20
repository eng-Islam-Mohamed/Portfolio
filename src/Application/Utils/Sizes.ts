import EventEmitter from './EventEmitter';
import { syncExperienceViewport } from './Viewport';

export default class Sizes extends EventEmitter {
    width: number;
    height: number;
    pixelRatio: number;

    constructor() {
        super();

        // Setup
        const viewport = syncExperienceViewport();
        this.width = viewport.width;
        this.height = viewport.height;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Resize event
        window.addEventListener('resize', () => {
            const nextViewport = syncExperienceViewport();
            this.width = nextViewport.width;
            this.height = nextViewport.height;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            this.trigger('resize');
        });
    }
}
