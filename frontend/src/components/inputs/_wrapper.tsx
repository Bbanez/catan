import { defineComponent } from 'vue';
import {
    DefaultComponentProps,
    type DefaultComponentPropsType,
    PropStringOrJsx,
    type PropStringOrJsxType,
} from '@root/components/_default';

export interface InputPropsType extends DefaultComponentPropsType {
    label?: PropStringOrJsxType;
    error?: PropStringOrJsxType;
    description?: PropStringOrJsxType;
}

export const InputProps = {
    ...DefaultComponentProps,
    label: PropStringOrJsx,
    error: PropStringOrJsx,
    description: PropStringOrJsx,
    required: Boolean,
};

export const InputWrapper = defineComponent({
    props: InputProps,
    emits: {
        click: (_event: Event) => {
            return true;
        },
    },
    setup(props, ctx) {
        return () => (
            <div
                class={`flex flex-col ${props.class || ''}`}
                style={props.style}
                onClick={(event) => {
                    ctx.emit('click', event);
                }}
            >
                {props.label && (
                    <label
                        class="flex items-center space-x-3 mb-1.5 justify-between"
                        for={
                            props.id
                                ? props.id
                                : typeof props.label === 'string'
                                  ? props.label
                                  : ''
                        }
                    >
                        <div
                            class={`font-normal not-italic text-xs leading-normal tracking-0.06 select-none uppercase block ${
                                props.error ? 'text-red-500' : ''
                            }`}
                        >
                            <span>
                                {typeof props.label === 'string'
                                    ? props.label
                                    : props.label()}
                            </span>
                            {props.required ? (
                                <span class={'text-red-500'}>*</span>
                            ) : (
                                ''
                            )}
                        </div>
                    </label>
                )}
                <div class="relative w-full">
                    {ctx.slots.default ? ctx.slots.default() : ''}
                    {props.description && (
                        <div class={`mt-2.5 text-sm leading-normal text-gray`}>
                            {typeof props.description === 'string'
                                ? props.description
                                : props.description()}
                        </div>
                    )}
                </div>
                {props.error && (
                    <div
                        class={`flex font-normal not-italic text-xs leading-normal tracking-0.06 select-none text-red-500 mt-1.5`}
                    >
                        {typeof props.error === 'string'
                            ? props.error
                            : props.error()}
                    </div>
                )}
            </div>
        );
    },
});
