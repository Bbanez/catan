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

export interface ModalHeroCreateOutput {
    name: string;
}

export const ModalHeroCreate = defineComponent({
    props: getModalDefaultProps<void, ModalHeroCreateOutput>(),
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
                            return 'Hero name is required';
                        }
                    },
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
                    },
                ];
            };
            handler._onCancel = async () => {
                return true;
            };
        });

        return () => (
            <ModalWrapper
                title={data.value.title || 'Create hero'}
                handler={props.handler}
                doneText={'Create'}
            >
                <div class={`flex flex-col gap-4`}>
                    <TextInput
                        label={`Hero name`}
                        value={inputs.value.name.value}
                        error={inputs.value.name.error}
                        placeholder={`Hero name`}
                        onInput={(value) => {
                            inputs.value.name.value = value;
                        }}
                    />
                </div>
            </ModalWrapper>
        );
    },
});
