import { defineComponent, onMounted, ref } from 'vue';
import { TextInput } from '@root/components/inputs/text';
import {
    getModalDefaultProps,
    ModalWrapper,
} from '@root/components/modals/_wrapper';
import type { ModalHandlerOptions } from '@root/services/modal.tsx';
import {
    createRefValidator,
    createValidationItem,
} from '@root/utils/validation';

export interface ModalGameLevelCreateOutput {
    name: string;
    desc: string;
}

export const ModalGameLevelCreate = defineComponent({
    props: getModalDefaultProps<void, ModalGameLevelCreateOutput>(),
    setup(props) {
        const data = ref<ModalHandlerOptions>({
            title: '',
        });
        const inputs = ref(getInputs());
        const inputsValid = createRefValidator(inputs);

        function getInputs() {
            return {
                name: createValidationItem({
                    value: '',
                    handler(value) {
                        if (!value.replace(/ /g, '')) {
                            return 'Game level name is required';
                        }
                    },
                }),
                desc: createValidationItem({
                    value: '',
                }),
            };
        }

        onMounted(() => {
            const handler = props.handler;
            handler._onOpen = (event) => {
                if (event?.data) {
                    data.value = event.data;
                    inputs.value = getInputs();
                }
            };
            handler._onDone = async () => {
                if (!inputsValid()) {
                    return [false, undefined as never];
                }
                return [
                    true,
                    {
                        name: inputs.value.name.value,
                        desc: inputs.value.desc.value,
                    },
                ];
            };
            handler._onCancel = async () => {
                return true;
            };
        });

        return () => (
            <ModalWrapper
                title={data.value.title || 'Create game level'}
                handler={props.handler}
                doneText={'Create'}
            >
                <div class={`flex flex-col gap-4`}>
                    <TextInput
                        label={`Game level name`}
                        value={inputs.value.name.value}
                        error={inputs.value.name.error}
                        placeholder={`Level name`}
                        onInput={(value) => {
                            inputs.value.name.value = value;
                        }}
                    />
                </div>
            </ModalWrapper>
        );
    },
});
