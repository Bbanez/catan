import type { CSSProperties } from 'vue';

export function stlx(
    ...args: Array<CSSProperties | undefined | null | boolean | string>
): CSSProperties {
    let output: CSSProperties = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (typeof arg !== 'object') {
            continue;
        }
        output = { ...output, ...arg };
    }
    return output;
}
