import { fromBinary } from '@bufbuild/protobuf';
import { IpcErrorSchema } from '@root/gen/proto_error/main_pb';
import { Buffer } from 'buffer';

export interface IpcMessage {
    err: boolean;
    bytes: string;
}

export function newIpcMessage(bytes: Uint8Array): IpcMessage {
    try {
        const s = Buffer.from(bytes).toString('base64');
        return {
            err: false,
            bytes: s,
        };
    } catch (e) {
        console.error(e);
        throw new Error('Create: Failed to convert IPC message to base64');
    }
}

export function bytesFromIpcMessage(message: IpcMessage): Uint8Array {
    let bytes: Buffer;
    try {
        bytes = Buffer.from(message.bytes, 'base64');
    } catch (e) {
        console.error(message, e);
        throw new Error('Read: Failed to convert IPC message from base64');
    }
    if (message.err) {
        const res = fromBinary(IpcErrorSchema, bytes);
        throw new Error(`L1 Error: ${res.code} -> ${res.message}`);
    }
    return bytes;
}
