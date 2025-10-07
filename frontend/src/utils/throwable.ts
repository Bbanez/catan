import { NotificationService } from '@root/services/notification';

export interface Throwable {
    <ThrowableResult, OnSuccessResult, OnErrorResult>(
        throwableFn: () => Promise<ThrowableResult>,
        onSuccess?: (data: ThrowableResult) => Promise<OnSuccessResult>,
        onError?: (error: unknown) => Promise<OnErrorResult>,
    ): Promise<OnSuccessResult | OnErrorResult>;
}

export async function throwable<
    ThrowableResult,
    OnSuccessResult,
    OnErrorResult,
>(
    throwableFn: () => Promise<ThrowableResult>,
    onSuccess?: (data: ThrowableResult) => Promise<OnSuccessResult>,
    onError?: (error: unknown) => Promise<OnErrorResult>,
): Promise<OnSuccessResult | OnErrorResult> {
    let output: ThrowableResult;
    try {
        output = await throwableFn();
    } catch (e) {
        if (onError) {
            return await onError(e);
        } else {
            console.error(e);
            const err = e as Error;
            if (err && err.message) {
                NotificationService.push('error', err.message);
            }
            return e as OnErrorResult;
        }
    }
    if (onSuccess) {
        return await onSuccess(output);
    }
    return undefined as never;
}
