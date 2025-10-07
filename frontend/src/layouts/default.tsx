import { defineComponent } from 'vue';

export const DefaultLayout = defineComponent({
    setup(_, ctx) {
        return () => (
            <div class={`relative w-screen h-screen overflow-auto`}>
                {ctx.slots.default?.()}
            </div>
        );
    },
});
