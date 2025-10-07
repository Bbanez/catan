import { defineComponent, type PropType } from 'vue';
import { InputProps } from '@root/components/inputs/_wrapper';
import { TextInput, type TextInputSize } from '@root/components/inputs/text';

export const NumberInput = defineComponent({
    inheritAttrs: true,
    props: {
        ...InputProps,
        value: Number,
        focus: Boolean,
        placeholder: String,
        size: {
            type: String as PropType<TextInputSize>,
            default: 'lg',
        },
        type: {
            type: String as PropType<'text' | 'email'>,
            default: 'text',
        },
        disabled: Boolean,
    },
    emits: {
        enter: (_event: Event) => {
            return true;
        },
        input: (_value: number, _event?: Event) => {
            return true;
        },
    },
    setup(props, ctx) {
        function inputHandler(value: string, event?: Event) {
            const num = parseFloat(value);
            if (isNaN(num)) {
                return;
            }
            ctx.emit('input', num, event);
        }

        return () => (
            <TextInput
                id={props.id}
                class={props.class}
                style={props.style}
                label={props.label}
                description={props.description}
                error={props.error}
                size={props.size}
                type={props.type}
                disabled={props.disabled}
                value={props.value ? props.value + '' : ''}
                placeholder={props.placeholder}
                required={props.required}
                onEnter={(event) => {
                    ctx.emit('enter', event);
                }}
                onInput={inputHandler}
            />
        );
    },
});
