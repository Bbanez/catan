import { computed, defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { InputProps, InputWrapper } from '@root/components/inputs/_wrapper';
import { SimpleLinear2DFn } from '@root/proto/utils/linear-2d';
import { Point } from '@root/proto/utils/point';
import { stlx } from '@root/utils/style';

export const SliderInput = defineComponent({
    props: {
        ...InputProps,
        value: {
            type: Number,
            required: true,
        },
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
    },
    emits: {
        input: (_value: number) => true,
    },
    setup(props, ctx) {
        let changeValue = false;
        let bBox: DOMRect | null = null;
        let mousePositionToValue: SimpleLinear2DFn | null = null;
        const toPercent = computed(
            () =>
                new SimpleLinear2DFn(
                    new Point(props.min, 0),
                    new Point(props.max, 100),
                ),
        );

        function onMouseUp() {
            changeValue = false;
            bBox = null;
            mousePositionToValue = null;
        }

        function onMouseMove(event: MouseEvent) {
            if (changeValue && mousePositionToValue) {
                let value = mousePositionToValue.calc(event.clientX);
                if (value < props.min) {
                    value = props.min;
                } else if (value > props.max) {
                    value = props.max;
                }
                ctx.emit('input', value);
            }
        }

        function onMouseDown(event: MouseEvent) {
            const target = event.currentTarget as HTMLElement;
            if (target && target.parentElement) {
                changeValue = true;
                bBox = target.parentElement.getBoundingClientRect();
                mousePositionToValue = new SimpleLinear2DFn(
                    new Point(bBox.left, props.min),
                    new Point(bBox.right, props.max),
                );
                onMouseMove(event);
            }
        }

        onMounted(() => {
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('mousemove', onMouseMove);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
        });

        return () => (
            <InputWrapper {...props}>
                <div
                    id={props.id}
                    style={props.style}
                    class={`relative h-4 w-full flex items-center ${props.class}`}
                    onMousedown={onMouseDown}
                >
                    <div class={`h-1 w-full bg-secondary-700`}></div>
                    <button
                        onMousedown={onMouseDown}
                        class={`absolute w-2 h-full bg-gray-500`}
                        style={stlx({
                            left: `${toPercent.value.calc(props.value)}%`,
                        })}
                    ></button>
                </div>
            </InputWrapper>
        );
    },
});
