import { createId } from '@paralleldrive/cuid2';

export class WatchTimer {
    private static interval: NodeJS.Timeout | undefined = undefined;
    private static subs: Array<{ id: string; handler: () => void }> = [];

    static init() {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            for (let i = 0; i < this.subs.length; i++) {
                this.subs[i].handler();
            }
        }, 100);
    }

    static destroy() {
        this.subs = [];
        clearInterval(this.interval);
    }

    static register(handler: () => void): () => void {
        const id = createId();
        this.subs.push({ id, handler });
        return () => {
            for (let i = 0; i < this.subs.length; i++) {
                if (this.subs[i].id === id) {
                    this.subs.splice(i, 1);
                    break;
                }
            }
        };
    }
}

export class TimeLogger {
    private time_offset = Date.now();

    log(...message: any[]) {
        console.debug(`TT:`, Date.now() - this.time_offset, '->', ...message);
    }
}
