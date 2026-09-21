import * as THREE from 'three';
import Application from '../Application';
import { AmbienceAudio, ComputerAudio } from './AudioSources';
import UIEventBus from '../UI/EventBus';
import { isMobileExperience } from '../Utils/Viewport';

const POS_DEBUG = false;
const DEFAULT_REF_DISTANCE = 10000;
export default class Audio {
    application: Application;
    listener: THREE.AudioListener;
    context: AudioContext;
    loadedAudio: { [key in string]: LoadedAudio };
    audioPool: { [key in string]: THREE.PositionalAudio | THREE.Audio };
    audioSources: {
        computer: ComputerAudio;
        ambience: AmbienceAudio;
    };
    scene: THREE.Scene;
    sceneReady: boolean;
    audioUnlocked: boolean;
    mobileAmbience: HTMLAudioElement | null;
    mobileStartup: HTMLAudioElement | null;
    mobileStartupPlayed: boolean;
    muted: boolean;

    constructor() {
        this.application = new Application();
        this.listener = new THREE.AudioListener();
        this.application.camera.instance.add(this.listener);
        this.loadedAudio = this.application.resources.items.audio;
        this.scene = this.application.scene;
        this.audioPool = {};
        this.sceneReady = false;
        this.audioUnlocked = false;
        this.mobileAmbience = null;
        this.mobileStartup = null;
        this.mobileStartupPlayed = false;
        this.muted = false;
        this.context = this.listener.context;

        this.audioSources = {
            computer: new ComputerAudio(this),
            ambience: new AmbienceAudio(this),
        };

        UIEventBus.on('loadingScreenDone', () => {
            this.sceneReady = true;
            this.startAmbienceWhenReady();
        });

        const unlock = () => this.unlockAudio();
        UIEventBus.on('unlockAudio', unlock);
        document.addEventListener('pointerdown', unlock, {
            capture: true,
            passive: true,
        });
        document.addEventListener('touchend', unlock, {
            capture: true,
            passive: true,
        });

        UIEventBus.on('muteToggle', (mute: boolean) => {
            this.muted = mute;
            this.listener.setMasterVolume(mute ? 0 : 1);
            if (this.mobileAmbience) this.mobileAmbience.muted = mute;
            if (this.mobileStartup) this.mobileStartup.muted = mute;
        });
    }

    unlockAudio() {
        this.audioUnlocked = true;
        this.playUnlockPulse();
        const resume = this.context.state === 'running'
            ? Promise.resolve()
            : this.context.resume();
        this.startAmbienceWhenReady();
        if (resume) {
            resume.then(() => this.startAmbienceWhenReady()).catch(() => {});
        }
    }

    startAmbienceWhenReady() {
        if (!this.sceneReady || !this.audioUnlocked) return;
        if (isMobileExperience()) {
            this.startMobileAmbience();
            return;
        }
        if (this.context.state !== 'running') return;
        this.audioSources.ambience.start();
    }

    playUnlockPulse() {
        try {
            const buffer = this.context.createBuffer(1, 1, 22050);
            const source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.context.destination);
            source.start(0);
        } catch {}
    }

    startMobileAmbience() {
        if (!this.mobileAmbience) {
            const ambience = document.createElement('audio');
            ambience.src = '/audio/atmosphere/office.mp3';
            ambience.loop = true;
            ambience.preload = 'auto';
            ambience.volume = 0.15;
            ambience.muted = this.muted;
            ambience.setAttribute('playsinline', '');
            this.mobileAmbience = ambience;
        }

        if (this.mobileAmbience.paused) {
            this.mobileAmbience.play().catch(() => {});
        }

        if (!this.mobileStartup) {
            const startup = document.createElement('audio');
            startup.src = '/audio/startup/startup.mp3';
            startup.preload = 'auto';
            startup.volume = 0.4;
            startup.muted = this.muted;
            startup.setAttribute('playsinline', '');
            this.mobileStartup = startup;
        }

        if (!this.mobileStartupPlayed) {
            this.mobileStartupPlayed = true;
            this.mobileStartup.play().catch(() => {
                this.mobileStartupPlayed = false;
            });
        }
    }

    playAudio(
        sourceName: string,
        options: {
            volume?: number;
            randDetuneScale?: number;
            loop?: boolean;
            filter?: {
                type: BiquadFilterType;
                frequency: number;
            };
            position?: THREE.Vector3;
            refDistance?: number;
            pitch?: number;
        } = {}
    ) {
        // Resume context if it's suspended
        if (this.context && this.context.state === 'suspended') {
            this.context.resume().catch(() => {});
        }

        // Get the audio source
        sourceName = this.getRandomVariant(sourceName);

        // Setup
        const buffer = this.loadedAudio[sourceName];
        const poolKey = sourceName + '_' + Object.keys(this.audioPool).length;

        let audio: THREE.Audio<any> | THREE.PositionalAudio = new THREE.Audio(
            this.listener
        );

        if (options.position) {
            audio = new THREE.PositionalAudio(this.listener);

            // @ts-ignore
            audio.setRefDistance(options.refDistance || DEFAULT_REF_DISTANCE);
            // @ts-ignore
            // audio.setDistanceModel('linear');

            const extraMaterialOptions = !POS_DEBUG
                ? {
                      transparent: true,
                      opacity: 0,
                  }
                : {};

            const sphere = new THREE.SphereGeometry(100, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                ...extraMaterialOptions,
            });
            const mesh = new THREE.Mesh(sphere, material);

            mesh.position.copy(options.position);
            mesh.name = poolKey;
            this.scene.add(mesh);
        }
        audio.setBuffer(buffer);

        if (options.filter) {
            const ac = audio.context;
            const filter = ac.createBiquadFilter();
            filter.type = options.filter.type; // Low pass filter
            filter.frequency.setValueAtTime(
                options.filter.frequency,
                ac.currentTime
            );
            // filter.frequency.linearRampToValueAtTime(2400, ac.currentTime + 2);

            audio.setFilter(filter);
        }

        // Set options
        audio.setLoop(options.loop ? true : false);
        audio.setVolume(options.volume || 1);

        audio.play();

        // add a filter to the audio

        // Calculate detune
        const detuneAmount =
            (Math.random() * 200 - 100) *
            (options.randDetuneScale ? options.randDetuneScale : 0);

        // Set detune after .play is called
        audio.setDetune(detuneAmount);

        if (options.pitch) {
            audio.setDetune(options.pitch * 100);
        }

        // Add to pool
        if (audio.source) {
            audio.source.onended = () => {
                delete this.audioPool[poolKey];
                if (options.position) {
                    const positionalObject =
                        this.scene.getObjectByName(poolKey);
                    if (positionalObject) {
                        this.scene.remove(positionalObject);
                    }
                }
            };
            this.audioPool[poolKey] = audio;
        }
        return poolKey;
    }

    setAudioFilterFrequency(audio: string, frequency: number) {
        const a = this.audioPool[audio];

        if (a) {
            const ac = a.context;
            const filter = a.getFilter() as BiquadFilterNode;
            // clamp the frequency between 0 and 22500
            const f = Math.max(0, Math.min(22050, frequency));

            filter.frequency.setValueAtTime(f, ac.currentTime);
        }
    }

    setAudioVolume(audio: string, volume: number) {
        const a = this.audioPool[audio];
        if (a) {
            a.setVolume(volume);
        }
    }

    getRandomVariant(sourceName: string) {
        const variants = [];
        for (const key in this.loadedAudio) {
            if (key.includes(sourceName)) {
                variants.push(key);
            }
        }
        return variants[Math.floor(Math.random() * variants.length)];
    }

    update() {
        for (const key in this.audioSources) {
            const _key = key as keyof typeof this.audioSources;
            this.audioSources[_key].update();
        }
    }
}
