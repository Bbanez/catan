import { create } from '@bufbuild/protobuf';
import {
    PointSchema,
    type Point as ProtoPoint,
    Point3Schema,
    type Point3 as ProtoPoint3,
} from '@proto/proto_utils/point_pb';

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

    toProto(): ProtoPoint {
        return create(PointSchema, {
            x: this.x,
            y: this.y,
        });
    }

    static toProto(point: Point): ProtoPoint {
        return create(PointSchema, {
            x: point.x,
            y: point.y,
        });
    }

    static fromProto(proto: ProtoPoint): Point {
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

    toProto(): ProtoPoint3 {
        return create(Point3Schema, {
            x: this.x,
            y: this.y,
            z: this.z,
        });
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

    static toProto(point: Point3): ProtoPoint3 {
        return create(Point3Schema, {
            x: point.x,
            y: point.y,
            z: point.z,
        });
    }

    static fromProto(proto: ProtoPoint3): Point3 {
        return new Point3(proto.x, proto.y, proto.z);
    }
}
