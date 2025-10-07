export interface QueueHandler<Output> {
    (): Promise<Output>;
}

export interface QueueData<Output = unknown> {
    wait: Promise<[QueueResult<Output>, QueueError | undefined]>;
    stop: () => void;
}

export class QueueError {
    constructor(public error: unknown) {}
}

export class QueueResult<Output> {
    constructor(public data: Output) {}
}

export class Queue {
    private busy = false;
    private items: Array<{
        id: string;
        handler(callback: () => void): void;
    }> = [];

    private nextItem() {
        const data = this.items.pop();
        if (data) {
            data.handler(() => {
                this.nextItem();
            });
        } else {
            this.busy = false;
        }
    }

    add<Output = unknown>(
        handler: QueueHandler<Output>,
        priority?: boolean,
    ): QueueData<Output> {
        const id = crypto.randomUUID();

        let resolve: (
            value: [QueueResult<Output>, QueueError | undefined],
        ) => void;
        const promise = new Promise<
            [QueueResult<Output>, QueueError | undefined]
        >((res) => {
            resolve = res;
        });

        if (priority) {
            this.items.push({
                id,
                handler: (callback) => {
                    handler()
                        .then((value) => {
                            resolve([
                                new QueueResult<Output>(value),
                                undefined,
                            ]);
                            callback();
                        })
                        .catch((error: any) => {
                            resolve([
                                undefined as never,
                                new QueueError(error),
                            ]);
                            callback();
                        });
                },
            });
        } else {
            this.items.splice(0, 0, {
                id,
                handler: (callback) => {
                    handler()
                        .then((value) => {
                            resolve([
                                new QueueResult<Output>(value),
                                undefined,
                            ]);
                            callback();
                        })
                        .catch((error: Error) => {
                            resolve([
                                undefined as never,
                                new QueueError(error),
                            ]);
                            callback();
                        });
                },
            });
        }
        if (!this.busy) {
            this.busy = true;
            this.nextItem();
        }
        return {
            wait: promise,
            stop: () => {
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].id === id) {
                        this.items.splice(i, 1);
                        resolve([
                            undefined as never,
                            new QueueError(
                                Error('Queue item has been canceled by user'),
                            ),
                        ]);
                    }
                }
            },
        };
    }
}
