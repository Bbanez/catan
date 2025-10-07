export async function waitUntil(
    checkInterval: number,
    check: () => boolean,
    /**
     * Default 30s
     */
    timeout?: number,
): Promise<void> {
    if (timeout) {
        timeout = Date.now() + timeout;
    } else {
        timeout = Date.now() + 30000;
    }
    return await new Promise<void>((resolve, reject) => {
        const interval = setInterval(() => {
            if (check()) {
                clearInterval(interval);
                resolve();
            } else if (Date.now() < timeout) {
                clearInterval(interval);
                reject('Timeout');
            }
        }, checkInterval);
    });
}
