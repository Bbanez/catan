import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import {
    AssetLoader,
    type AssetLoaderCallbackData,
} from '@root/utils/asset-loader';
import {
    callAndClearUnsubscribeFns,
    type UnsubscribeFns,
} from '@root/utils/sub';

export const AssetLoaderBar = defineComponent({
    setup() {
        const loaderData = ref<AssetLoaderCallbackData>({
            items: [],
            loadedItemsCount: 1,
            type: 'done',
        });
        const unsubs: UnsubscribeFns = [];

        onMounted(() => {
            unsubs.push(
                AssetLoader.subscribe((data) => {
                    loaderData.value = data;
                }),
            );
        });

        onBeforeUnmount(() => {
            callAndClearUnsubscribeFns(unsubs);
        });

        return () => (
            <>
                {loaderData.value &&
                    loaderData.value.item &&
                    loaderData.value.type === 'progress' && (
                        <div
                            class={`fixed bottom-0 right-0 p-4 flex flex-col text-xs w-[350px]`}
                        >
                            <div
                                class={`flex gap-1 items-center justify-between`}
                            >
                                <span>
                                    [{loaderData.value.loadedItemsCount}/
                                    {loaderData.value.items.length}]
                                </span>
                                <span>{loaderData.value.item.name}</span>
                            </div>
                            <div
                                class={`w-full border border-gray-800 p-[1px]`}
                            >
                                <div
                                    class={`bg-primary-500 h-1`}
                                    style={`
                                        width: ${loaderData.value.item.progress}%;
                                    `}
                                ></div>
                            </div>
                        </div>
                    )}
            </>
        );
    },
});
