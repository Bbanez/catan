import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import clsx from 'clsx';
import { Button } from '@root/components/button.tsx';
import { screen } from '@root/hooks/screen.ts';
import { throwable } from '@root/utils/throwable.ts';
import { Select } from '@root/components/select/main.tsx';
import { NotificationService } from '@root/services/notification.ts';
import { ipc } from '@root/ipc/main';
import { floatToInt } from '@root/utils/math';
import { Toggle } from '@root/components/inputs/toggle';

export const SettingsView = defineComponent({
    setup() {
        const router = useRouter();

        const selectedScalingIdx = ref(0);
        const resolutionScaling = [1, 1.5, 2, 2.5, 3, 3.5, 4];
        const useServer = ref(!!ipc.settings.cache.value.useServer);

        async function choseBestScaling() {
            let delta = Math.abs(
                screen.value.width - ipc.settings.cache.value.renderWidth,
            );
            for (let i = 1; i < resolutionScaling.length; i++) {
                const newDelta = Math.abs(
                    screen.value.width / resolutionScaling[i] -
                        ipc.settings.cache.value.renderWidth,
                );
                if (newDelta < delta) {
                    delta = newDelta;
                    selectedScalingIdx.value = i;
                }
            }
            if (
                ipc.settings.cache.value.renderWidth ===
                screen.value.width / resolutionScaling[selectedScalingIdx.value]
            ) {
                return;
            }
            await throwable(async () => {
                ipc.settings.set({
                    renderWidth:
                        screen.value.width /
                        resolutionScaling[selectedScalingIdx.value],
                    useServer: useServer.value,
                });
            });
        }

        onMounted(async () => {
            await throwable(async () => {
                await ipc.settings.get();
                await choseBestScaling();
            });
        });

        return () => (
            <div class={clsx(`flex flex-col gap-6`)}>
                <div
                    class={`flex items-center border-b border-b-primary px-10`}
                >
                    <div class={`text-3xl uppercase`}>Settings</div>
                    <Button
                        class={`ml-auto`}
                        onClick={async () => {
                            router.back();
                        }}
                    >
                        Back
                    </Button>
                </div>
                <div class={`flex flex-col gap-6 items-center`}>
                    <Select
                        class={`max-w-[300px]`}
                        searchable
                        label={`Resolution`}
                        placeholder="Select resolution"
                        selected={selectedScalingIdx.value + ''}
                        options={resolutionScaling.map((scale, scaleIdx) => {
                            const width = parseInt(
                                (screen.value.width / scale).toFixed(0),
                            );
                            const height = parseInt(
                                (width / screen.value.aspect).toFixed(0),
                            );
                            return {
                                label: `${width}x${height}`,
                                value: scaleIdx + '',
                            };
                        })}
                        onChange={(option) => {
                            if (!option) {
                                return;
                            }
                            selectedScalingIdx.value = parseInt(option.value);
                        }}
                    />
                    <div class={`flex items-center w-[300px]`}>
                        <Toggle
                            label="Use server"
                            value={useServer.value}
                            onInput={(value) => {
                                useServer.value = value;
                            }}
                        />
                        {useServer.value && (
                            <div class={`mt-2 text-sm`}>
                                Server is available on port 41234
                            </div>
                        )}
                    </div>
                    <Button
                        onClick={async () => {
                            await throwable(
                                async () => {
                                    await ipc.settings.set({
                                        renderWidth: floatToInt(
                                            screen.value.width /
                                                resolutionScaling[
                                                    selectedScalingIdx.value
                                                ],
                                        ),
                                        useServer: useServer.value,
                                    });
                                },
                                async () => {
                                    NotificationService.push(
                                        'success',
                                        'Settings updated successfully',
                                    );
                                },
                            );
                        }}
                    >
                        Save changes
                    </Button>
                </div>
            </div>
        );
    },
});
