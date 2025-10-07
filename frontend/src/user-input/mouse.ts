import { createId } from '@paralleldrive/cuid2';

export interface MouseState {
    left: boolean;
    middle: boolean;
    right: boolean;
    x: number;
    y: number;
    delta: {
        x: number;
        y: number;
    };
    el_under_cursor: HTMLElement | null;
    scrollX: number;
    scrollY: number;
}

export type MouseEventType =
    | 'MOUSE_DOWN'
    | 'MOUSE_UP'
    | 'MOUSE_MOVE'
    | 'MOUSE_SCROLL'
    | 'ALL';

export interface MouseEventCallback {
    (state: MouseState, event: MouseEvent | WheelEvent): void;
}

export interface MouseSubscription {
    id: string;
    callback: MouseEventCallback;
}

export interface MouseUnsubscribe {
    (): void;
}

export class Mouse {
    static state: MouseState = Mouse.initState();

    private static subs: {
        ALL: MouseSubscription[];
        MOUSE_DOWN: MouseSubscription[];
        MOUSE_MOVE: MouseSubscription[];
        MOUSE_UP: MouseSubscription[];
        MOUSE_SCROLL: MouseSubscription[];
    } = {
        ALL: [],
        MOUSE_DOWN: [],
        MOUSE_MOVE: [],
        MOUSE_UP: [],
        MOUSE_SCROLL: [],
    };

    private static initState(): MouseState {
        return {
            left: false,
            middle: false,
            right: false,
            x: 0,
            y: 0,
            delta: {
                x: 0,
                y: 0,
            },
            el_under_cursor: null,
            scrollX: 0,
            scrollY: 0,
        };
    }

    private static trigger(
        type: MouseEventType,
        event: MouseEvent | WheelEvent,
    ) {
        for (let i = 0; i < Mouse.subs[type].length; i++) {
            const sub = Mouse.subs[type][i];
            sub.callback(Mouse.state, event);
        }
        for (let i = 0; i < Mouse.subs.ALL.length; i++) {
            const sub = Mouse.subs.ALL[i];
            sub.callback(Mouse.state, event);
        }
    }

    private static onMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            if (!Mouse.state.left) {
                Mouse.state.left = true;
                Mouse.trigger('MOUSE_DOWN', event);
            }
        } else if (event.button === 1) {
            if (!Mouse.state.middle) {
                Mouse.state.middle = true;
                Mouse.trigger('MOUSE_DOWN', event);
            }
        } else if (event.button === 2) {
            if (!Mouse.state.right) {
                Mouse.state.right = true;
                Mouse.trigger('MOUSE_DOWN', event);
            }
        }
    }

    private static onMouseUp(event: MouseEvent) {
        if (event.button === 0) {
            if (Mouse.state.left) {
                Mouse.state.left = false;
                Mouse.trigger('MOUSE_UP', event);
            }
        } else if (event.button === 1) {
            if (Mouse.state.middle) {
                Mouse.state.middle = false;
                Mouse.trigger('MOUSE_UP', event);
            }
        } else if (event.button === 2) {
            if (Mouse.state.right) {
                Mouse.state.right = false;
                Mouse.trigger('MOUSE_UP', event);
            }
        }
    }

    private static onMouseMove(event: MouseEvent) {
        Mouse.state.el_under_cursor = event.target as HTMLElement;
        Mouse.state.delta.x = event.clientX - Mouse.state.x;
        Mouse.state.delta.y = event.clientY - Mouse.state.y;
        Mouse.state.x = event.clientX;
        Mouse.state.y = event.clientY;
        Mouse.trigger('MOUSE_MOVE', event);
    }
    private static onContext(_event: MouseEvent) {
        // event.preventDefault();
    }

    private static onMouseScroll(event: WheelEvent) {
        Mouse.state.scrollY = event.deltaY;
        Mouse.state.scrollX = event.deltaX;
        Mouse.trigger('MOUSE_SCROLL', event);
    }

    static init() {
        Mouse.destroy();
        window.addEventListener('mousedown', Mouse.onMouseDown);
        window.addEventListener('mouseup', Mouse.onMouseUp);
        window.addEventListener('mousemove', Mouse.onMouseMove);
        window.addEventListener('contextmenu', Mouse.onContext);
        window.addEventListener('wheel', Mouse.onMouseScroll);
    }

    static destroy() {
        window.removeEventListener('mousedown', Mouse.onMouseDown);
        window.removeEventListener('mouseup', Mouse.onMouseUp);
        window.removeEventListener('mousemove', Mouse.onMouseMove);
        window.removeEventListener('contextmenu', Mouse.onContext);
        window.removeEventListener('wheel', Mouse.onMouseScroll);
        this.state = Mouse.initState();
        for (const k in Mouse.subs) {
            const key = k as keyof typeof Mouse.subs;
            Mouse.subs[key] = [];
        }
    }

    static subscribe(
        type: MouseEventType,
        callback: MouseEventCallback,
    ): () => void {
        const id = createId();
        Mouse.subs[type].push({ id, callback });
        return () => {
            for (let i = 0; i < Mouse.subs[type].length; i++) {
                const sub = Mouse.subs[type][i];
                if (sub.id === id) {
                    Mouse.subs[type].splice(i, 1);
                    break;
                }
            }
        };
    }
}
