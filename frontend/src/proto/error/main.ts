import { create } from '@bufbuild/protobuf';
import {
    IpcErrorSchema,
    type IpcError as ProtoIpcError,
} from '@proto/proto_error/main_pb';

export interface IpcError {
    code: number;
    message: string;
}

export function ipcErrorToProto(ipcError: IpcError): ProtoIpcError {
    return create(IpcErrorSchema, {
        code: ipcError.code,
        message: ipcError.message,
    });
}

export function ipcErrorFromProto(proto: ProtoIpcError): IpcError {
    return {
        code: proto.code,
        message: proto.message,
    };
}
