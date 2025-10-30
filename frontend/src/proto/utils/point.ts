import { create } from '@bufbuild/protobuf';
import * as pb from '@proto/proto_utils/point_pb';

export class Point {
    constructor(
        public x: number,
        public y: number,
    ) {}

    copy(): Point {
        return new Point(this.x, this.y);
    }

    isNear(point: Point, delta: number): boolean {
        return (
            point.x >= this.x - delta &&
            point.x <= this.x + delta &&
            point.y >= this.y - delta &&
            point.y <= this.y + delta
        );
    }

    inNear2(point: Point, delta: Point): boolean {
        return (
            point.x >= this.x - delta.x &&
            point.x <= this.x + delta.x &&
            point.y >= this.y - delta.y &&
            point.y <= this.y + delta.y
        );
    }

    toProto(): pb.Point {
        return create(pb.PointSchema, {
            x: this.x,
            y: this.y,
        });
    }

    static toProto(point: Point): pb.Point {
        return point.toProto();
    }

    toProtoInt(): pb.PointInt {
        return create(pb.PointIntSchema, {
            x: this.x,
            y: this.y,
        });
    }

    static toProtoInt(point: Point): pb.PointInt {
        return point.toProtoInt();
    }

    static fromProto(proto: pb.Point | pb.PointInt): Point {
        return new Point(proto.x, proto.y);
    }
}

export class Point3 {
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) {}

    copy(): Point3 {
        return new Point3(this.x, this.y, this.z);
    }

    isNear(point: Point3, delta: number): boolean {
        return (
            point.x >= this.x - delta &&
            point.x <= this.x + delta &&
            point.y >= this.y - delta &&
            point.y <= this.y + delta &&
            point.z >= this.z - delta &&
            point.z <= this.z + delta
        );
    }

    inNear2(point: Point3, delta: Point3): boolean {
        return (
            point.x >= this.x - delta.x &&
            point.x <= this.x + delta.x &&
            point.y >= this.y - delta.y &&
            point.y <= this.y + delta.y &&
            point.z >= this.z - delta.z &&
            point.z <= this.z + delta.z
        );
    }

    toProto(): pb.Point3 {
        return create(pb.Point3Schema, {
            x: this.x,
            y: this.y,
            z: this.z,
        });
    }

    static toProto(point: Point3): pb.Point3 {
        return point.toProto();
    }

    toProtoInt(): pb.Point3Int {
        return create(pb.Point3IntSchema, {
            x: this.x,
            y: this.y,
            z: this.z,
        });
    }

    static toProtoInt(point: Point3): pb.Point3Int {
        return point.toProtoInt();
    }

    static fromProto(proto: pb.Point3 | pb.Point3Int): Point3 {
        return new Point3(proto.x, proto.y, proto.z);
    }
}
