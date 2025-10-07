import type { DefineComponent } from 'vue';
import {
    ModalConfirm,
    type ModalConfirmInput,
} from '@root/components/modals/confirm';
import {
    ModalGameLevelCreate,
    type ModalGameLevelCreateOutput,
} from '@root/components/modals/game-level/create';
import {
    ModalHeroCreate,
    type ModalHeroCreateOutput,
} from '@root/components/modals/hero/create';

export interface ModalHandlerOptions<Output = unknown> {
    title?: string;
    onDone?(output: Output): void | Promise<void>;
    onCancel?(): void | Promise<void>;
}

export class ModalHandler<Input = unknown, Output = unknown> {
    constructor(
        public element: DefineComponent<
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any
        >,
    ) {}

    public open: (
        options?: ModalHandlerOptions<Output> & {
            data?: Input;
        },
    ) => void = () => {
        throw Error('Method not implemented');
    };
    public close: (isDone?: boolean, doneValue?: Output) => void = async () => {
        throw Error('Method not implemented');
    };
    public _onOpen: (
        options?: ModalHandlerOptions<Output> & {
            data?: Input;
        },
    ) => void = () => {
        throw Error('Method not implemented');
    };
    public _onDone: () => Promise<[boolean, Output]> = async () => {
        throw Error('Method not implemented');
    };
    public _onCancel: () => Promise<boolean> = async () => {
        throw Error('Method not implemented');
    };
}

export class ModalService {
    handlers = {
        confirm: new ModalHandler<ModalConfirmInput>(ModalConfirm),
        gameLevelCreate: new ModalHandler<void, ModalGameLevelCreateOutput>(
            ModalGameLevelCreate,
        ),
        heroCreate: new ModalHandler<void, ModalHeroCreateOutput>(
            ModalHeroCreate,
        ),
    };

    mount() {
        const elementArr: Array<ModalHandler<any, any>> = [];
        for (const handlersKey in this.handlers) {
            elementArr.push(this.handlers[handlersKey as ModalHandlers]);
        }
        return (
            <>
                {elementArr.map((handler) => {
                    const El = handler.element;
                    return <El handler={handler} />;
                })}
            </>
        );
    }
}

export const modal = new ModalService();

export type ModalHandlers = keyof typeof modal.handlers;
