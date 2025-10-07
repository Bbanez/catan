import type { Directive } from 'vue';
import { createId } from '@paralleldrive/cuid2';

const handlers: {
    [id: string]: {
        callback: (event: MouseEvent) => void;
    };
} = {};

interface OnClickOutside {
    /* Do something when clicked outside. */
    (): void;
}

export const clickOutside: Directive<HTMLElement, OnClickOutside> = {
    mounted(el, binding) {
        const id = createId();
        el.setAttribute('data-dir-id', id);

        let latch = false;

        handlers[id] = {
            callback: (event: MouseEvent) => {
                if (latch) {
                    const clickedEl = event.target as HTMLElement;
                    if (!clickedEl) {
                        return;
                    }
                    if (!el.contains(clickedEl)) {
                        binding.value();
                    }
                } else {
                    latch = true;
                }
            },
        };

        document.addEventListener('click', handlers[id].callback);
    },
    unmounted(el) {
        const id = el.getAttribute('data-dir-id');
        if (id) {
            document.removeEventListener('click', handlers[id].callback);
            delete handlers[id];
        }
    },
};
