import type { Router } from 'vue-router';
import { onBeforeUnmount, ref, type Ref } from 'vue';
import { createId } from '@paralleldrive/cuid2';
import { delay } from '@root/utils/delay.ts';

export type ComponentTransitionState =
    | 'in'
    | 'in-prepare'
    | 'out'
    | 'out-prepare'
    | 'in-done'
    | 'out-done'
    | 'wait';

export interface ComponentTransitionHandler {
    (state: ComponentTransitionState): Promise<void>;
}

export interface ComponentTransitionSub {
    id: string;
    state: Ref<ComponentTransitionState>;
    handler: ComponentTransitionHandler;
}

export interface ComponentTransitionOptions {
    disableOut?: boolean;
}

export class ComponentTransition {
    private subs: ComponentTransitionSub[] = [];
    private onDone: (() => void) | null = null;
    private isInTransition = false;
    private router_unsub: () => void;

    constructor(
        private router: Router,
        public options?: ComponentTransitionOptions,
    ) {
        this.router_unsub = this.router.beforeEach(async (_to, _from, next) => {
            await this.triggerOut();
            next();
        });
        onBeforeUnmount(() => {
            this.destroy();
        });
    }

    async triggerOut() {
        try {
            if (this.options?.disableOut) {
                return;
            }
            if (this.isInTransition) {
                return;
            }
            this.isInTransition = true;
            for (let i = this.subs.length - 1; i > -1; i--) {
                const sub = this.subs[i];
                if (!sub) {
                    continue;
                }
                sub.state.value = 'out-prepare';
                await delay(1);
                sub.state.value = 'out';
                try {
                    await sub.handler('out');
                } catch (err) {
                    console.error(err);
                }
                sub.state.value = 'out-done';
                this.subs.splice(i, 1);
            }
            if (this.onDone) {
                this.onDone();
                this.onDone = null;
            }
            this.isInTransition = false;
        } catch (err) {
            console.error(err);
        }
    }

    async triggerIn(skip?: boolean) {
        try {
            if (this.isInTransition) {
                return;
            }
            this.isInTransition = true;
            for (let i = 0; i < this.subs.length; i++) {
                const sub = this.subs[i];
                if (!sub) {
                    continue;
                }
                if (skip) {
                    sub.state.value = 'in-done';
                    continue;
                }
                sub.state.value = 'in-prepare';
                await delay(1);
                sub.state.value = 'in';
                try {
                    await sub.handler('in');
                } catch (err) {
                    console.error(err);
                }
                sub.state.value = 'in-done';
            }
            this.isInTransition = false;
        } catch (err) {
            console.error(err);
        }
    }

    register(
        handler: ComponentTransitionHandler,
    ): [state: Ref<ComponentTransitionState>, () => void] {
        const id = createId();
        const state = ref<ComponentTransitionState>('wait');
        this.subs.push({
            id,
            state,
            handler,
        });
        return [
            state,
            () => {
                for (let i = 0; i < this.subs.length; i++) {
                    if (this.subs[i].id === id) {
                        this.subs.splice(i, 1);
                        break;
                    }
                }
            },
        ];
    }

    destroy() {
        this.subs = [];
        this.router_unsub();
    }
}
