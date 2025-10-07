export async function delay(time: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, time));
}

export async function awaitWithDelay(time: number, check: () => boolean) {
    await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
            if (check()) {
                clearInterval(interval);
                resolve();
            }
        }, time);
    });
}
