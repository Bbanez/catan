import { defineComponent } from 'vue';
import clsx from 'clsx';
import { InputProps, InputWrapper } from '@root/components/inputs/_wrapper.tsx';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Toggle = defineComponent({
    props: {
        ...InputProps,
        value: {
            type: Boolean,
            required: true,
        },
        placeholder: String,
    },
    emits: {
        input: (_value: boolean, _event: MouseEvent) => true,
    },
    setup(props, ctx) {
        return () => (
            <InputWrapper
                id={props.id}
                style={props.style}
                class={props.class}
                label={props.label}
                error={props.error}
                description={props.description}
            >
                <div class={`flex items-center gap-3`}>
                    <button
                        class={clsx(
                            `relative w-10 h-5 rounded-full overflow-hidden`,
                            `transition-all duration-300`,
                            props.value ? `bg-primary` : `bg-gray-900`,
                        )}
                        onClick={(event) => {
                            ctx.emit('input', !props.value, event);
                        }}
                    >
                        <div
                            class={clsx(
                                `absolute top-0 size-5 rounded-full shadow`,
                                `transition-all duration-300 bg-gray-300`,
                                props.value ? `left-5` : `left-0`,
                            )}
                        />
                    </button>
                    {props.placeholder && (
                        <div class={`text-xs text-gray-200`}>
                            {props.placeholder}
                        </div>
                    )}
                </div>
            </InputWrapper>
        );
    },
});
