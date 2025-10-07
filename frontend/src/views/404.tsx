import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export const P404View = defineComponent({
    setup() {
        const route = useRoute();

        return () => (
            <div
                class={`absolute top-0 left-0 size-full flex flex-col items-center justify-center`}
            >
                <div>Path: {route.path}</div>
                <div>404</div>
            </div>
        );
    },
});
