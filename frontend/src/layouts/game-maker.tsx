import { defineComponent } from 'vue';
import clsx from 'clsx';
import { GameTitle } from '@root/components/game-title.tsx';
import { VScroll } from '@root/components/vscroll';

export const MainLayout = defineComponent({
    setup(_, ctx) {
        return () => (
            <div class={`relative w-screen h-screen flex flex-col`}>
                <img
                    class={clsx(`absolute top-0 left-0 size-full object-cover`)}
                    src={`/splash.jpg`}
                    alt={`Splash screen`}
                />
                <GameTitle />
                <div class={`relative flex-1`}>
                    <div
                        class={clsx(
                            `absolute top-0 left-0 size-full`,
                            `transition-opacity duration-1000`,
                        )}
                    >
                        <VScroll>{ctx.slots.default?.()}</VScroll>
                    </div>
                </div>
            </div>
        );
    },
});
