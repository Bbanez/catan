export async function tryCatch<Result = unknown, Err extends Error = Error>(
    exec: () => Promise<Result>,
): Promise<[Result, Err | null]> {
    try {
        return [await exec(), null];
    } catch (err) {
        return [null as never, err as Err];
    }
}

export function tryCatchSync<Result = unknown, Err extends Error = Error>(
    exec: () => Result,
): [Result, Err | null] {
    try {
        return [exec(), null];
    } catch (err) {
        return [null as never, err as Err];
    }
}

export function tryCatchCallback<Result = unknown, Err extends Error = Error>(
    exec: () => Result,
    callback: (result: Result, error: Err | null) => void,
): void {
    try {
        callback(exec(), null);
    } catch (err) {
        callback(null as never, err as Err);
    }
}
