import { defineComponent, onMounted, type PropType, ref } from 'vue';
import { InputProps, InputWrapper } from '@root/components/inputs/_wrapper';
import clsx from 'clsx';

export type TextInputSize = 'sm' | 'md' | 'lg';

export const TextInput = defineComponent({
    inheritAttrs: true,
    props: {
        ...InputProps,
        value: String,
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
        input: (_value: string, _event?: Event) => {
            return true;
        },
    },
    setup(props, ctx) {
        const inputRef = ref<HTMLInputElement | null>(null);

        function inputHandler(event: Event) {
            const element = event.target as HTMLInputElement;
            if (!element) {
                return;
            }
            ctx.emit('input', element.value, event);
        }

        onMounted(async () => {
            if (props.focus && inputRef.value) {
                inputRef.value.focus();
            }
        });

        return () => {
            return (
                <InputWrapper
                    id={props.id}
                    class={props.class}
                    label={props.label}
                    description={props.description}
                    error={props.error}
                >
                    <input
                        ref={inputRef}
                        type={props.type}
                        class={clsx(
                            `bg-black/0 w-full text-center`,
                            props.size === 'sm' && `px-2 py-1 text-sm`,
                            props.size === 'md' && `px-4 py-2 text-md`,
                            props.size === 'lg' && `px-6 py-4 text-xl`,
                            `border-gray-400 border-[2px]`,
                            `caret-primary`,
                            `outline-none`,
                            `transition-all duration-300`,
                            props.error ? `border border-red-500` : ``,
                        )}
                        value={props.value}
                        placeholder={props.placeholder}
                        disabled={props.disabled}
                        onFocus={(event) => {
                            const el = event.target as HTMLInputElement;
                            el.scrollIntoView({
                                behavior: 'smooth',
                            });
                        }}
                        onInput={inputHandler}
                        onKeydown={(event) => {
                            if (event.key === 'Enter') {
                                ctx.emit('enter', event);
                            }
                        }}
                    />
                </InputWrapper>
            );
        };
    },
});
