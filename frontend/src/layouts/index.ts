import { DefaultLayout } from '@root/layouts/default.tsx';
import { MainLayout } from '@root/layouts/game-maker';

export const layouts = {
    DefaultLayout,
    MainLayout,
};

export type Layouts = keyof typeof layouts;
