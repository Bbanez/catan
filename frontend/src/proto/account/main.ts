import { create } from '@bufbuild/protobuf';
import {
    AccountSchema,
    type Account as ProtoAccount,
} from '@proto/proto_account/main_pb';

export interface Account {
    id: string;
    createdAt: number;
    updatedAt: number;
    username: string;
    active: boolean;
}

export function accountToProto(account: Account): ProtoAccount {
    return create(AccountSchema, {
        id: account.id,
        createdAt: BigInt(account.createdAt),
        updatedAt: BigInt(account.updatedAt),
        username: account.username,
        active: account.active,
    });
}

export function accountFromProto(proto: ProtoAccount): Account {
    return {
        id: proto.id,
        createdAt: Number(proto.createdAt),
        updatedAt: Number(proto.updatedAt),
        username: proto.username,
        active: proto.active,
    };
}
