import { defineComponent } from 'vue';
import { Button } from '@root/components/button.tsx';
import { useRouter } from 'vue-router';
import clsx from 'clsx';
import { ipc } from '@root/ipc/main';

interface Item {
    text: string;
    onClick: () => Promise<void>;
}

export const HomeView = defineComponent({
    setup() {
        const router = useRouter();

        const items: Item[] = [
            {
                text: 'Start Game',
                async onClick() {
                    const gameData = await ipc.game.create();
                    await router.push(`/game/${gameData.id}/pre`);
                },
            },
            {
                text: 'Settings',
                async onClick() {
                    await router.push('/settings');
                },
            },
        ];

        return () => (
            <div class={clsx(`flex flex-col gap-6 items-center mt-10`)}>
                {items.map((item) => {
                    return (
                        <Button class={`w-[250px]`} onClick={item.onClick}>
                            {item.text}
                        </Button>
                    );
                })}
            </div>
        );
    },
});
