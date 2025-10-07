import { InputProps, InputWrapper } from '@root/components/inputs/_wrapper';
import { TextInput } from '@root/components/inputs/text';
import type { Point } from '@root/proto/utils/point';
import { defineComponent, type PropType } from 'vue';
import XIcon from '@root/assets/icons/feather/x.svg?component';
import { Button } from '@root/components/button';
import { LinearChart } from '@root/components/chart/linear';

export const LinearFnInput = defineComponent({
    props: {
        ...InputProps,
        value: {
            type: Array as PropType<Point[]>,
            required: true,
        },
    },
    emits: {
        input: (_x: number, _y: number, _pointIdx: number) => true,
        addPoint: () => true,
        remove: (_pointIdx: number) => true,
    },
    setup(props, ctx) {
        function renderInput(point: Point, pointIdx: number) {
            return (
                <div class={`flex items-center gap-2`}>
                    <div
                        class={`font-mono text-xs mt-[4px] border-r border-r-gray-600 pr-2`}
                    >
                        {pointIdx + 1}.
                    </div>
                    <div>x:</div>
                    <TextInput
                        value={point.x + ''}
                        size={`sm`}
                        onInput={(value) => {
                            const num = parseFloat(value);
                            if (isNaN(num)) {
                                return;
                            }
                            ctx.emit('input', num, point.y, pointIdx);
                        }}
                    />
                    <div>y:</div>
                    <TextInput
                        value={point.y + ''}
                        size={`sm`}
                        onInput={(value) => {
                            const num = parseFloat(value);
                            if (isNaN(num)) {
                                return;
                            }
                            ctx.emit('input', point.x, num, pointIdx);
                        }}
                    />
                    <button
                        class={`hover:text-red-400`}
                        onClick={() => {
                            ctx.emit('remove', pointIdx);
                        }}
                    >
                        <XIcon class={`size-4`} />
                    </button>
                </div>
            );
        }
        return () => (
            <InputWrapper
                id={props.id}
                label={props.label}
                description={props.description}
                error={props.error}
                class={props.class}
                style={props.style}
            >
                <LinearChart
                    class={`text-primary-500`}
                    axisColor={'#fff'}
                    value={props.value}
                />
                <div class={`flex flex-col gap-2 mt-4`}>
                    {props.value.map((point, pointIdx) => {
                        return renderInput(point, pointIdx);
                    })}
                    <Button
                        class={`mt-3`}
                        onClick={() => {
                            ctx.emit('addPoint');
                        }}
                    >
                        Add point
                    </Button>
                </div>
            </InputWrapper>
        );
    },
});
