import { create } from '@bufbuild/protobuf';
import {
    SizeSchema,
    type Size as ProtoSize,
    Size3Schema,
    type Size3 as ProtoSize3,
} from '@proto/proto_utils/size_pb';

export class Size {
    constructor(
        public width: number,
        public height: number,
    ) {}

    copy(): Size {
        return new Size(this.width, this.height);
    }

    static toProto(size: Size): ProtoSize {
        return create(SizeSchema, {
            width: size.width,
            height: size.height,
        });
    }

    static fromProto(proto: ProtoSize): Size {
        return new Size(proto.width, proto.height);
    }
}

export class Size3 {
    constructor(
        public width: number,
        public height: number,
        public depth: number,
    ) {}

    copy(): Size3 {
        return new Size3(this.width, this.height, this.depth);
    }

    static toProto(size: Size3): ProtoSize3 {
        return create(Size3Schema, {
            width: size.width,
            height: size.height,
            depth: size.depth,
        });
    }

    static fromProto(proto: ProtoSize3): Size3 {
        return new Size3(proto.width, proto.height, proto.depth);
    }
}
