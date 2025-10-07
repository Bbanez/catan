import { createId } from '@paralleldrive/cuid2';
import { filterNonGameAreaEvents } from '@root/game/utils/dom';
import { Mouse } from '@root/user-input/mouse';

export interface KeyboardState {
    [key: string]: boolean;
}

export type KeyboardEventType = 'KEY_UP' | 'KEY_DOWN' | 'ALL';

export interface KeyboardEventCallback {
    (state: KeyboardState, event: KeyboardEvent, type: KeyboardEventType): void;
}

export interface KeyboardUnsubscribe {
    (): void;
}

export class Keyboard {
    private static subs: Array<{
        id: string;
        type: KeyboardEventType;
        cb: KeyboardEventCallback;
    }> = [];
    static state: KeyboardState = {};

    private static trigger(type: KeyboardEventType, event: KeyboardEvent) {
        // if (this.shouldEmit()) {
        for (let i = 0; i < Keyboard.subs.length; i++) {
            const sub = Keyboard.subs[i];
            if (sub.type === type || sub.type === 'ALL') {
                sub.cb(Keyboard.state, event, type);
            }
        }
        // }
    }
    private static onKeyDown(event: KeyboardEvent) {
        if (filterNonGameAreaEvents(Mouse.state.el_under_cursor)) {
            event.preventDefault();
        }
        const key = event.key.toLowerCase();
        if (!Keyboard.state[key]) {
            Keyboard.state[key] = true;
            Keyboard.trigger('KEY_DOWN', event);
        }
    }
    private static onKeyUp(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        if (Keyboard.state[key]) {
            Keyboard.state[key] = false;
            Keyboard.trigger('KEY_UP', event);
        }
    }
    static init() {
        window.addEventListener('keydown', Keyboard.onKeyDown);
        window.addEventListener('keyup', Keyboard.onKeyUp);
    }
    static destroy() {
        window.removeEventListener('keydown', Keyboard.onKeyDown);
        window.removeEventListener('keyup', Keyboard.onKeyUp);
        this.state = {};
    }
    static subscribe(
        type: KeyboardEventType,
        callback: KeyboardEventCallback,
    ): KeyboardUnsubscribe {
        const id = createId();
        Keyboard.subs.push({
            id,
            type,
            cb: callback,
        });
        return () => {
            for (let i = 0; i < Keyboard.subs.length; i++) {
                const sub = Keyboard.subs[i];
                if (sub.id === id) {
                    Keyboard.subs.splice(i, 1);
                    break;
                }
            }
        };
    }
}
