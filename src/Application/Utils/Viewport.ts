export type ExperienceViewport = {
    width: number;
    height: number;
    isMobile: boolean;
    isPortrait: boolean;
    forceLandscape: boolean;
};

const MOBILE_BREAKPOINT = 900;

const hasTouchInput = () =>
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches;

export const getExperienceViewport = (): ExperienceViewport => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isPortrait = screenHeight > screenWidth;
    const isMobile =
        screenWidth < MOBILE_BREAKPOINT ||
        (hasTouchInput() &&
            Math.min(screenWidth, screenHeight) < MOBILE_BREAKPOINT);
    const forceLandscape = isMobile && isPortrait;

    return {
        width: forceLandscape ? screenHeight : screenWidth,
        height: forceLandscape ? screenWidth : screenHeight,
        isMobile,
        isPortrait,
        forceLandscape,
    };
};

export const syncExperienceViewport = () => {
    const viewport = getExperienceViewport();
    const root = document.documentElement;

    root.classList.toggle('force-landscape', viewport.forceLandscape);
    root.style.setProperty('--experience-width', `${viewport.width}px`);
    root.style.setProperty('--experience-height', `${viewport.height}px`);
    root.style.setProperty('--screen-width', `${window.innerWidth}px`);

    return viewport;
};

export const isMobileExperience = () => getExperienceViewport().isMobile;

export const clientPointToExperience = (clientX: number, clientY: number) => {
    const viewport = getExperienceViewport();

    if (viewport.forceLandscape) {
        return {
            x: Math.max(0, Math.min(viewport.width, clientY)),
            y: Math.max(
                0,
                Math.min(viewport.height, window.innerWidth - clientX)
            ),
        };
    }

    return {
        x: Math.max(0, Math.min(viewport.width, clientX)),
        y: Math.max(0, Math.min(viewport.height, clientY)),
    };
};
