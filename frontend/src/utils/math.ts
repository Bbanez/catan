import { SimpleLinear2DFn } from '@root/proto/utils/linear-2d';
import { Point } from '@root/proto/utils/point';

export const PI14 = Math.PI / 4;
export const PI12 = Math.PI / 2;
export const PI32 = (3 * Math.PI) / 2;
export const PI34 = (3 * Math.PI) / 4;
export const PI54 = (5 * Math.PI) / 4;
export const PI74 = (7 * Math.PI) / 4;
export const PI13 = Math.PI / 3;
export const PI_2 = 2 * Math.PI;

export type RectCornersType = [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
];

export function remap(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
): number {
    const f = new SimpleLinear2DFn(
        new Point(inMin, outMin),
        new Point(inMax, outMax),
    );
    const result = f.calc(value);
    if (result < outMin) {
        return outMin;
    } else if (result > outMax) {
        return outMax;
    }
    return result;
}

export function normalizeToShader(
    value: number,
    inMin: number,
    inMax: number,
): number {
    return remap(value, inMin, inMax, 0, 1);
}

export function distanceBetweenPoints(start: Point, end: Point): number {
    const x = Math.abs(end.x - start.x);
    const y = Math.abs(end.y - start.y);
    return Math.sqrt(x * x + y * y);
}

export function floatSnapping2Dec(
    value: number,
    max: number,
    min: number,
    decimalStep: number,
): number {
    let whole = Math.floor(value);
    if (whole > max) {
        whole = max;
    } else if (whole < min) {
        whole = min;
    }
    let dec = Math.floor((value - whole) * 100);
    if (dec < decimalStep) {
        dec = 0;
    } else {
        dec = dec - (dec % decimalStep);
    }
    dec = dec / 100;
    return whole + dec;
}

export function getFloatParts(
    value: number,
    decimalSteps: number,
): [number, number] {
    const whole = Math.floor(value);
    return [whole, Math.floor(((value - whole) * 100) / decimalSteps)];
}

export function getAngle(position: Point, target: Point): number {
    const dx = target.x - position.x;
    const dz = target.y - position.y;
    let angle = 0.0;
    if (dx === 0.0) {
        angle = PI12;
        if (dz < 0.0) {
            angle = PI32;
        }
    } else if (dz === 0.0) {
        if (dx < 0.0) {
            angle = Math.PI;
        }
    } else {
        angle = Math.atan(dz / dx);
        if (dx < 0.0 && dz > 0.0) {
            angle = Math.PI + angle;
        } else if (dx < 0.0 && dz < 0.0) {
            angle = Math.PI + angle;
        } else if (dx > 0.0 && dz < 0.0) {
            angle = 2.0 * Math.PI + angle;
        }
    }
    return angle;
}

export function radToDeg(rad: number): number {
    return (180.0 * rad) / Math.PI;
}

export function degToRad(deg: number): number {
    return (Math.PI * deg) / 180.0;
}

export function getRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function xyToIdx(x: number, y: number, width: number): number {
    return x + y * width;
}

export function idxToXy(idx: number, width: number): [number, number] {
    const x = idx % width;
    return [x, (idx - x) / width];
}

export function floatToInt(num: number): number {
    return num | 0;
}

export function floatToFloat(num: number, decimals: number) {
    return floatToInt(num * decimals) / decimals;
}
