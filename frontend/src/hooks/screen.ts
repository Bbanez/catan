import { ref } from 'vue';

export interface Screen {
    width: number;
    height: number;
    aspect: number;
}

export const screen = ref<Screen>({
    width: window.innerWidth,
    height: window.innerHeight,
    aspect: window.innerWidth / window.innerHeight,
});

export function createScreen() {
    window.addEventListener('resize', () => {
        screen.value = {
            width: window.innerWidth,
            height: window.innerHeight,
            aspect: window.innerWidth / window.innerHeight,
        };
    });
}
