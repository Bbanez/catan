import { ipc } from '@root/ipc/main';
import { computed, defineComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export const GamePreStartView = defineComponent({
    name: 'GamePreStartView',
    setup() {
        const route = useRoute();
        const params = computed(
            () =>
                route.params as {
                    gameId: string;
                },
        );
        const gameData = computed(() => ipc.game.cache.value);

        onMounted(async () => {
            await ipc.game.get({
                id: params.value.gameId,
            });
        });

        return () => (
            <div>
                <pre>{JSON.stringify(gameData.value || {}, null, 4)}</pre>
            </div>
        );
    },
});
export default GamePreStartView;
