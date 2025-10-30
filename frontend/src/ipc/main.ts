import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import { SettingsHandler } from '@root/ipc/handlers/settings';
import type { OmittedMessage } from '@root/types/omitted-message';
import {
    bytesFromIpcMessage,
    newIpcMessage,
    type IpcMessage,
} from '@root/ipc/message';
import { GameHandler } from '@root/ipc/handlers/game';

export class Ipc {
    private static showTimig = true;

    static createCall<ReqData = unknown, ResData = unknown>(
        reqSchema: any,
        resSchema: any,
        fn: any,
    ): (data?: OmittedMessage<ReqData>) => Promise<ResData> {
        return async (data) => {
            try {
                const timeOffset = Date.now();
                let reqBytes: Uint8Array | undefined = undefined;
                if (data) {
                    const reqData = create(reqSchema, data);
                    reqBytes = toBinary(reqSchema, reqData);
                }
                const resMessage: IpcMessage = await fn(
                    reqBytes ? newIpcMessage(reqBytes) : undefined,
                );
                const resBytes = bytesFromIpcMessage(resMessage);
                const result = fromBinary(resSchema, resBytes) as ResData;
                if (Ipc.showTimig) {
                    console.debug(
                        `${fn.name} took ${Date.now() - timeOffset}ms`,
                    );
                }
                return result;
            } catch (e) {
                console.error(e);
                throw e;
            }
        };
    }

    settings = new SettingsHandler();
    game = new GameHandler();
}

export const ipc = new Ipc();
