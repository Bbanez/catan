import { type PropType, defineComponent } from 'vue';
import { DefaultComponentProps } from './_default';
import { clsx } from 'clsx';

export const buttonStyle = {
    primary: {
        class: clsx(
            'bg-primary/70 px-4 py-2 hover:bg-primary transition-all uppercase font-bold',
        ),
    },
    ghost: {
        class: clsx(
            'text-primary-500 px-4 py-2 hover:text-primary-100 transition-all uppercase font-bold',
        ),
    },
};

export type ButtonType = keyof typeof buttonStyle;

export const Button = defineComponent({
    props: {
        ...DefaultComponentProps,
        kind: {
            type: String as PropType<keyof typeof buttonStyle>,
            default: 'primary',
        },
    },
    emits: {
        click: (_event: Event) => {
            return true;
        },
    },
    setup(props, ctx) {
        return () => (
            <button
                id={props.id}
                class={`bg-blur ${
                    buttonStyle[props.kind]
                        ? buttonStyle[props.kind].class
                        : buttonStyle.primary.class
                } ${props.class || ''}`}
                style={props.style}
                onClick={(event) => {
                    ctx.emit('click', event);
                }}
            >
                {ctx.slots.default ? ctx.slots.default() : ''}
            </button>
        );
    },
});
