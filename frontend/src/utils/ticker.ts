import { createId } from '@paralleldrive/cuid2';

export type TickerCallback = (
    time_since_start: number,
    tick_count: number,
    tick_time: number,
) => void;

export class Ticker {
    private subs: Array<{ id: string; callback: TickerCallback }> = [];
    private time = Date.now();
    private time_since_start = 0;
    private tick_count = 0;
    private tick_time = 0;
    private last_tick_at = Date.now();
    private paused = false;

    tte = 0;

    constructor() {}

    getTime() {
        return this.time;
    }

    getTickCount() {
        return this.tick_count;
    }

    getTickTime() {
        return this.tick_time;
    }

    getTimeSinceStart() {
        return this.time_since_start;
    }

    tick() {
        this.time_since_start = Date.now() - this.time;
        const timeOffset = Date.now();
        if (!this.paused) {
            this.tick_count++;
            this.tick_time = Date.now() - this.last_tick_at;
            this.time_since_start = Date.now() - this.time;
            for (let i = 0; i < this.subs.length; i++) {
                this.subs[i].callback(
                    this.time_since_start,
                    this.tick_count,
                    this.tick_time,
                );
            }
            this.last_tick_at = Date.now();
        }
        this.tte = Date.now() - timeOffset;
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    reset() {
        this.time = Date.now();
        this.time_since_start = 0;
        this.tick_time = Date.now();
        this.tick_count = 0;
    }

    subscribe(callback: TickerCallback): () => void {
        const id = createId();
        this.subs.push({ id, callback });
        return () => {
            for (let i = 0; i < this.subs.length; i++) {
                const sub = this.subs[i];
                if (sub.id === id) {
                    this.subs.splice(i, 1);
                    break;
                }
            }
        };
    }

    clear() {
        this.subs = [];
    }
}
