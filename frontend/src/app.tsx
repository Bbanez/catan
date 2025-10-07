import {
    computed,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    ref,
} from 'vue';
import { RouterView, useRoute } from 'vue-router';
import type { RouteMeta } from '@root/router';
import { layouts } from '@root/layouts';
import { modal } from '@root/services/modal';
import { Toast } from '@root/components/toast';
import { WatchTimer } from '@root/utils/timers';
import { AssetLoaderBar } from '@root/components/asset-loader.tsx';
import { throwable } from '@root/utils/throwable.ts';
import { MetaService } from '@root/services/meta.ts';
import { ipc } from '@root/ipc/main';

export const App = defineComponent({
    setup() {
        const route = useRoute();
        const meta = computed(() => (route.meta as RouteMeta) || {});
        const Layout = computed(() =>
            meta.value.layout ? layouts[meta.value.layout] : ('div' as any),
        );
        WatchTimer.init();

        const ready = ref(false);

        onBeforeUnmount(() => {
            WatchTimer.destroy();
            if (meta.value.title) {
                MetaService.set({ title: meta.value.title });
            }
        });

        onMounted(async () => {
            await throwable(async () => {
                await ipc.settings.get();
                ready.value = true;
            });
        });

        return () => (
            <>
                {ready.value && (
                    <div class="root">
                        <Layout.value meta={meta.value}>
                            <RouterView />
                        </Layout.value>

                        {modal.mount()}
                        <Toast />
                        <AssetLoaderBar />
                    </div>
                )}
            </>
        );
    },
});
