import {
    Audio,
    type AudioListener,
    type Object3D,
    PositionalAudio,
} from 'three';
import type { Ticker } from '@root/utils/ticker';

export class AudioComponent {
    static globalFromAudioBuffer(
        listener: AudioListener,
        buffer: AudioBuffer,
        ticker: Ticker,
    ): AudioComponent {
        const audio = new Audio(listener);
        audio.setBuffer(buffer);
        audio.setVolume(1);
        return new AudioComponent(audio, 1, ticker);
    }

    static positionalFromAudioBuffer(
        listener: AudioListener,
        buffer: AudioBuffer,
        attachTo: Object3D,
        ticker: Ticker,
    ) {
        const audio = new PositionalAudio(listener);
        audio.setBuffer(buffer);
        audio.setVolume(1);
        attachTo.add(audio);
        return new AudioComponent(audio, 1, ticker);
    }

    constructor(
        public audio: Audio | PositionalAudio,
        public maximum_volume: number,
        private ticker: Ticker,
    ) {}

    play(fromStart?: boolean): void {
        if (fromStart) {
            this.audio.stop();
            this.audio.play();
        } else {
            this.audio.play();
        }
    }

    pause(): void {
        this.audio.pause();
    }

    stop() {
        this.audio.stop();
    }

    loop(value: boolean) {
        this.audio.setLoop(value);
    }

    fadeOut(time: number, onDone?: () => void) {
        if (time === 0) {
            this.audio.stop();
            return;
        }
        const stepCount = time / this.ticker.getTickTime();
        const volumeStep = this.audio.getVolume() / stepCount;
        const unsub = this.ticker.subscribe(() => {
            const currentVolume = this.audio.getVolume();
            const newVolume = currentVolume - volumeStep;
            if (newVolume <= 0) {
                unsub();
                this.audio.stop();
                onDone?.();
                return;
            }
            this.audio.setVolume(newVolume);
        });
    }
    async fadeOutAsync(time: number) {
        if (time === 0) {
            this.audio.stop();
            return;
        }
        await new Promise<void>((resolve) => {
            this.fadeOut(time, resolve);
        });
    }

    fadeIn(time: number, onDone?: () => void) {
        if (time === 0) {
            this.audio.stop();
            this.audio.setVolume(this.maximum_volume);
            this.audio.play();
            return;
        }
        const stepCount = time / this.ticker.getTickTime();
        const volumeStep = this.maximum_volume / stepCount;
        this.audio.stop();
        this.audio.setVolume(0);
        this.audio.play();
        const unsub = this.ticker.subscribe(() => {
            const currentVolume = this.audio.getVolume();
            const newVolume = currentVolume + volumeStep;
            if (newVolume >= this.maximum_volume) {
                unsub();
                onDone?.();
                return;
            }
            this.audio.setVolume(newVolume);
        });
    }
    async fadeInAsync(time: number) {
        if (time === 0) {
            this.audio.stop();
            this.audio.setVolume(this.maximum_volume);
            this.audio.play();
            return;
        }
        await new Promise<void>((resolve) => {
            this.fadeIn(time, resolve);
        });
    }

    stopAndPlay(
        component: AudioComponent,
        fadeMs: number,
        onDone?: () => void,
    ) {
        if (fadeMs === 0) {
            this.stop();
            component.play();
            return;
        }
        let doneCount = 0;
        this.fadeOut(fadeMs, () => {
            doneCount++;
            if (doneCount === 2) {
                onDone?.();
                return;
            }
        });
        component.fadeIn(fadeMs, () => {
            doneCount++;
            if (doneCount === 2) {
                onDone?.();
                return;
            }
        });
    }
    async stopAndPlayAsync(component: AudioComponent, fadeMs: number) {
        if (fadeMs === 0) {
            this.stop();
            component.play();
            return;
        }
        await new Promise<void>((resolve) => {
            this.stopAndPlay(component, fadeMs, resolve);
        });
    }

    destroy() {
        this.audio.stop();
    }
}
