export function clone<T extends Record<any, any>>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
