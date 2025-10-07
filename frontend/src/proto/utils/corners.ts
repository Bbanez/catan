import { create } from '@bufbuild/protobuf';
import {
    CornersSchema,
    type Corners as ProtoCorners,
} from '@proto/proto_utils/corners_pb';
import { Point } from '@root/proto/utils/point';

export class Corners {
    constructor(
        public topLeft: Point,
        public topRight: Point,
        public bottomRight: Point,
        public bottomLeft: Point,
    ) {}

    copy(): Corners {
        return new Corners(
            this.topLeft.copy(),
            this.topRight.copy(),
            this.bottomRight.copy(),
            this.bottomLeft.copy(),
        );
    }

    static toProto(corners: Corners): ProtoCorners {
        return create(CornersSchema, {
            topLeft: Point.toProto(corners.topLeft),
            topRight: Point.toProto(corners.topRight),
            bottomRight: Point.toProto(corners.bottomRight),
            bottomLeft: Point.toProto(corners.bottomLeft),
        });
    }

    static fromProto(proto: ProtoCorners): Corners {
        if (!proto.topLeft) {
            throw new Error('Property "topLeft" is required');
        }
        if (!proto.topRight) {
            throw new Error('Property "topRight" is required');
        }
        if (!proto.bottomRight) {
            throw new Error('Property "bottomRight" is required');
        }
        if (!proto.bottomLeft) {
            throw new Error('Property "bottomLeft" is required');
        }
        return new Corners(
            Point.fromProto(proto.topLeft),
            Point.fromProto(proto.topRight),
            Point.fromProto(proto.bottomRight),
            Point.fromProto(proto.bottomLeft),
        );
    }
}
