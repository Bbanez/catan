import { create } from '@bufbuild/protobuf';
import {
    CubicSchema,
    type Cubic as ProtoCubic,
} from '@proto/proto_utils/cubic_pb';
import { Collision } from '@root/game/utils/collision';
import type { Point } from '@root/proto/utils/point';

export class Cubic {
    constructor(
        public a: number,
        public b: number,
        public c: number,
        public d: number,
    ) {}

    copy(): Cubic {
        return new Cubic(this.a, this.b, this.c, this.d);
    }

    isPointInside(x: number, y: number): boolean {
        return x >= this.d && x <= this.b && y >= this.a && y <= this.c;
    }

    isPointInside2(point: Point): boolean {
        return (
            point.x >= this.d &&
            point.x <= this.b &&
            point.y >= this.a &&
            point.y <= this.c
        );
    }

    doesIntersect(other: Cubic): boolean {
        return Collision.withBoxAndBox( other, this);
    }

    static toProto(cubic: Cubic): ProtoCubic {
        return create(CubicSchema, {
            a: cubic.a,
            b: cubic.b,
            c: cubic.c,
            d: cubic.d,
        });
    }

    static fromProto(proto: ProtoCubic): Cubic {
        return new Cubic(proto.a, proto.b, proto.c, proto.d);
    }
}
