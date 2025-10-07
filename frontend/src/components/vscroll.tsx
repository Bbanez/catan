import { findParent } from '@root/utils/dom';
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

export const VScroll = defineComponent({
    name: 'VScroll',
    emits: {
        scroll: (_event: WheelEvent) => true,
        ready: (_containerRef: HTMLDivElement) => true,
    },
    setup(_, ctx) {
        const containerRef = ref<HTMLDivElement>();

        function onScroll(event: WheelEvent) {
            if (!containerRef.value) {
                return;
            }
            if (
                !findParent(
                    event.target as HTMLElement,
                    (e) => e === containerRef.value,
                )
            ) {
                return;
            }
            containerRef.value.scrollTop += event.deltaY;
            ctx.emit('scroll', event);
        }

        onMounted(() => {
            if (!containerRef.value) {
                return;
            }
            ctx.emit('ready', containerRef.value);
            window.addEventListener('wheel', onScroll);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('wheel', onScroll);
        });

        return () => (
            <div
                ref={containerRef}
                class={`absolute top-0 left-0 size-full overflow-hidden`}
            >
                {ctx.slots.default?.()}
            </div>
        );
    },
});
