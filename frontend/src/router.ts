import type { DefineComponent } from 'vue';
import {
    createRouter,
    createWebHashHistory,
    type RouteLocationNormalizedGeneric,
    type RouteRecordRaw,
} from 'vue-router';
import type { Layouts } from '@root/layouts';
import { P404View } from '@root/views/404';
import { HomeView } from '@root/views/home';
import { SettingsView } from '@root/views/settings';

export const views = {
    HomeView,
    SettingsView,

    P404View,
};

export type Views = keyof typeof views;

export interface RouteMeta {
    title?: string;
    layout?: Layouts;
    class?: string;
    overrideComponent?: DefineComponent<
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any
    >;
}

interface RouteRecordRawExtended
    extends Omit<RouteRecordRaw, 'name' | 'children' | 'meta'> {
    name?: Views;
    children?: Array<RouteRecordRawExtended>;
    meta?: RouteMeta;
}

const routes: Array<RouteRecordRawExtended> = [
    {
        path: '/',
        name: 'HomeView',
        meta: {
            title: 'Home',
            layout: 'MainLayout',
        },
        component: HomeView,
    },
    {
        path: '/settings',
        name: 'SettingsView',
        meta: {
            title: 'Settings',
            layout: 'MainLayout',
        },
        component: SettingsView,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'P404View',
        component: P404View,
    },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes as any,
});

const routeHistory: RouteLocationNormalizedGeneric[] = [];
export function getRouteHistory() {
    return routeHistory;
}

router.beforeEach(async (_to, from, next) => {
    routeHistory.push(from);
    next();
});
