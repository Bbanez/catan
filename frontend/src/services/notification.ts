import type { JSX } from 'vue/jsx-runtime';
import { createId } from '@paralleldrive/cuid2';

export type NotificationMessageType = 'error' | 'info' | 'success' | 'warn';

export type NotificationMessageContent = string | JSX.Element;

export interface NotificationMessageHandler {
    (type: NotificationMessageType, content: NotificationMessageContent): void;
}

interface NotificationSub {
    id: string;
    on_message: NotificationMessageHandler;
}

export class NotificationService {
    private static subs: NotificationSub[] = [];

    static push(
        type: NotificationMessageType,
        content: NotificationMessageContent,
    ) {
        for (let i = 0; i < this.subs.length; i++) {
            try {
                this.subs[i].on_message(type, content);
            } catch (err) {
                console.error(err);
            }
        }
    }

    static onMessage(handler: NotificationMessageHandler): () => void {
        const id = createId();
        this.subs.push({ id, on_message: handler });
        return () => {
            for (let i = 0; i < this.subs.length; i++) {
                if (this.subs[i].id === id) {
                    this.subs.splice(i, 1);
                    break;
                }
            }
        };
    }
}
