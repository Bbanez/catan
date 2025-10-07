import { DefaultComponentProps } from '@root/components/_default';
import { SimpleLinear2DFn } from '@root/proto/utils/linear-2d';
import { Point } from '@root/proto/utils/point';
import type { Tuple } from '@root/types/tuple';
import clsx from 'clsx';
import { computed, defineComponent, type PropType } from 'vue';

export const StepChart = defineComponent({
    props: {
        ...DefaultComponentProps,
        value: {
            type: Array as PropType<Point[]>,
            required: true,
        },
        width: Number,
        height: Number,
        dashX: Number,
        dashY: Number,
        dashWidth: { type: Number, default: 10 },
        lineWidth: {
            type: Number,
            default: 20,
        },
        lineColor: { type: String, default: 'currentColor' },
        axisWidth: { type: Number, default: 5 },
        axisColor: { type: String, default: 'currentColor' },
    },
    setup(props) {
        const margin = computed(() => {
            let yMax = 0;
            for (let i = 0; i < props.value.length; i++) {
                const point = props.value[i];
                if (point.y > yMax) {
                    yMax = point.y;
                }
            }
            return new Point(yMax.toString().length * 40, 100);
        });
        const svgSize = computed(
            () =>
                new Point(
                    (props.width || 2000) + margin.value.x,
                    (props.height || 1000) + margin.value.y,
                ),
        );
        const dashSize = computed(
            () => `${props.dashX || 20},${props.dashY || 30}`,
        );
        const valueTransform = computed(() => {
            let xMax = 0;
            let yMax = 0;
            let yMin = 10000000000;
            for (let i = 0; i < props.value.length; i++) {
                const point = props.value[i];
                if (point.x > xMax) {
                    xMax = point.x;
                }
                if (point.y > yMax) {
                    yMax = point.y;
                }
                if (point.y < yMin) {
                    yMin = point.y;
                }
            }
            const trans = {
                x: new SimpleLinear2DFn(
                    new Point(0, 0),
                    new Point(
                        xMax || 1,
                        svgSize.value.x - 100 - margin.value.x,
                    ),
                ),
                y: new SimpleLinear2DFn(
                    new Point(yMin, svgSize.value.y),
                    new Point(yMax || 1, margin.value.y * 2),
                ),
            };
            return {
                x: (x: number) => {
                    return trans.x.calc(x) + margin.value.x;
                },
                y: (y: number) => {
                    return trans.y.calc(y) - margin.value.y;
                },
            };
        });

        function renderAxis() {
            return (
                <>
                    <g>
                        <line
                            stroke={props.axisColor}
                            stroke-width={props.axisWidth}
                            fill="none"
                            x1={0 + margin.value.x}
                            y1={svgSize.value.y - margin.value.y}
                            x2={svgSize.value.x}
                            y2={svgSize.value.y - margin.value.y}
                        />
                        <line
                            stroke={props.axisColor}
                            stroke-width={props.axisWidth}
                            fill="none"
                            x1={margin.value.x}
                            y1={svgSize.value.y - margin.value.y}
                            x2={margin.value.x}
                            y2={0}
                        />
                    </g>
                    {props.value.map((point) => {
                        const pos: Tuple = [
                            valueTransform.value.x(point.x),
                            valueTransform.value.y(point.y),
                        ];
                        return (
                            <>
                                <text
                                    x={pos[0]}
                                    y={svgSize.value.y - 10}
                                    text-anchor="middle"
                                    fill={props.axisColor}
                                    font-size="50px"
                                >
                                    {point.x}
                                </text>
                                <text
                                    x={0}
                                    y={pos[1]}
                                    text-anchor="right"
                                    fill={props.axisColor}
                                    style={{ textAlign: 'right' }}
                                    font-size="50px"
                                >
                                    {point.y}
                                </text>
                            </>
                        );
                    })}
                </>
            );
        }

        function renderStep(
            point: Point,
            prevPoint?: Point,
            nextPoint?: Point,
        ) {
            const start: Tuple = [
                valueTransform.value.x(point.x),
                valueTransform.value.y(point.y),
            ];
            if (!nextPoint) {
                return (
                    <>
                        <line
                            stroke={props.axisColor}
                            stroke-width={props.dashWidth}
                            stroke-dasharray={dashSize.value}
                            fill="none"
                            x1={margin.value.x}
                            y1={start[1].toFixed(2)}
                            x2={start[0].toFixed(2)}
                            y2={start[1].toFixed(2)}
                        />
                        <line
                            stroke={props.lineColor}
                            stroke-width={props.lineWidth}
                            fill="none"
                            x1={
                                prevPoint ? start[0].toFixed(2) : margin.value.x
                            }
                            y1={start[1].toFixed(2)}
                            x2={svgSize.value.x + margin.value.x}
                            y2={start[1].toFixed(2)}
                        />
                    </>
                );
            }
            const end: Tuple = [
                valueTransform.value.x(nextPoint.x),
                valueTransform.value.y(nextPoint.y),
            ];
            return (
                <>
                    <line
                        stroke={props.axisColor}
                        stroke-width={props.dashWidth}
                        stroke-dasharray={dashSize.value}
                        fill="none"
                        x1={0 + margin.value.x}
                        y1={start[1].toFixed(2)}
                        x2={start[0].toFixed(2)}
                        y2={start[1].toFixed(2)}
                    />
                    <line
                        stroke={props.axisColor}
                        stroke-width={props.dashWidth}
                        stroke-dasharray={dashSize.value}
                        fill="none"
                        x1={end[0].toFixed(2)}
                        y1={start[1].toFixed(2)}
                        x2={end[0].toFixed(2)}
                        y2={svgSize.value.y - margin.value.y}
                    />
                    <line
                        stroke={props.lineColor}
                        stroke-width={props.lineWidth}
                        fill="none"
                        x1={prevPoint ? start[0].toFixed(2) : margin.value.x}
                        y1={start[1].toFixed(2)}
                        x2={end[0].toFixed(2)}
                        y2={start[1].toFixed(2)}
                    />
                    <line
                        stroke={props.lineColor}
                        stroke-width={props.lineWidth}
                        fill="none"
                        x1={end[0].toFixed(2)}
                        y1={start[1].toFixed(2)}
                        x2={end[0].toFixed(2)}
                        y2={end[1].toFixed(2)}
                    />
                </>
            );
        }

        return () => (
            <svg
                id={props.id}
                style={props.style}
                class={clsx(`font-mono`, props.class)}
                fill="none"
                stroke="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${svgSize.value.x} ${svgSize.value.y}`}
            >
                {renderAxis()}
                <g>
                    {props.value.map((point, pointIdx) => {
                        const nextPoint = props.value[pointIdx + 1];
                        const prevPoint = props.value[pointIdx - 1];
                        return renderStep(point, prevPoint, nextPoint);
                    })}
                </g>
            </svg>
        );
    },
});
