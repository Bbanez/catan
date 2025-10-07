import { create } from '@bufbuild/protobuf';
import {
    BoundingBoxSchema,
    type BoundingBox as ProtoBoundingBox,
} from '@proto/proto_utils/bounding_box_pb';
import { Point } from '@root/proto/utils/point';
import { Size } from '@root/proto/utils/size';
import { Cubic } from '@root/proto/utils/cubic';
import { Collision } from '@root/game/utils/collision';

export class BoundingBox {
    halfSize = new Size(0, 0);
    edges = new Cubic(0, 0, 0, 0);

    constructor(
        public position: Point,
        public size: Size,
    ) {
        this.update();
    }

    private update() {
        this.halfSize.width = this.size.width / 2;
        this.halfSize.height = this.size.height / 2;
        this.edges.a = this.position.y - this.halfSize.height;
        this.edges.b = this.position.x + this.halfSize.width;
        this.edges.c = this.position.y + this.halfSize.height;
        this.edges.d = this.position.x - this.halfSize.width;
    }

    copy(): BoundingBox {
        return new BoundingBox(this.position.copy(), this.size.copy());
    }

    setSize(width: number, height: number) {
        this.size.width = width;
        this.size.height = height;
        this.update();
    }

    setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
        this.update();
    }

    isPointInside(x: number, y: number): boolean {
        return Collision.withBoxAndPoint(this.edges, new Point(x, y));
    }

    doesIntersect(other: Cubic): boolean {
        return Collision.withBoxAndBox(this.edges, other);
    }

    toProto(): ProtoBoundingBox {
        return create(BoundingBoxSchema, {
            position: Point.toProto(this.position),
            size: Size.toProto(this.size),
        });
    }

    static fromProto(proto: ProtoBoundingBox): BoundingBox {
        if (!proto.position) {
            throw new Error('Property "position" is required');
        }
        if (!proto.size) {
            throw new Error('Property "size" is required');
        }
        return new BoundingBox(
            Point.fromProto(proto.position),
            Size.fromProto(proto.size),
        );
    }

    static newEmpty(): BoundingBox {
        return new BoundingBox(new Point(0, 0), new Size(0, 0));
    }
}
