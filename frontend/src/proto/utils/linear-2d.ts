import { create } from '@bufbuild/protobuf';
import {
    Linear2DFnSchema,
    type Linear2DFn as ProtoLinear2DFn,
    SimpleLinear2DFnSchema,
    type SimpleLinear2DFn as ProtoSimpleLinear2DFn,
} from '@proto/proto_utils/linear_2d_pb';
import { Point } from '@root/proto/utils/point';

export class SimpleLinear2DFn {
    private k: number;
    private n: number;

    constructor(
        public start: Point,
        public end: Point,
    ) {
        this.k = (this.end.y - this.start.y) / (this.end.x - this.start.x);
        this.n = this.start.y - this.k * this.start.x;
    }

    copy(): SimpleLinear2DFn {
        return new SimpleLinear2DFn(this.start.copy(), this.end.copy());
    }

    calc(x: number): number {
        return this.k * x + this.n;
    }

    calcInv(y: number): number {
        return (y - this.n) / this.k;
    }

    static toProto(linear2DFn: SimpleLinear2DFn): ProtoSimpleLinear2DFn {
        return create(SimpleLinear2DFnSchema, {
            start: Point.toProto(linear2DFn.start),
            end: Point.toProto(linear2DFn.end),
        });
    }

    static fromProto(proto: ProtoSimpleLinear2DFn): SimpleLinear2DFn {
        if (!proto.start) {
            throw new Error('Property "start" is required');
        }
        if (!proto.end) {
            throw new Error('Property "end" is required');
        }
        return new SimpleLinear2DFn(
            Point.fromProto(proto.start),
            Point.fromProto(proto.end),
        );
    }
}

export class Linear2DFn {
    private ks: number[] = [];
    private ns: number[] = [];

    constructor(public points: Point[]) {
        if (this.points.length < 2) {
            throw new Error(
                'At least 2 points are required, othervise use SimpleLinear2DFn',
            );
        }
        for (let i = 1; i < this.points.length - 1; i++) {
            this.ks.push(
                (this.points[i].y - this.points[i - 1].y) /
                    (this.points[i].x - this.points[i - 1].x),
            );
            this.ns.push(
                this.points[i - 1].y - this.ks[i - 1] * this.points[i - 1].x,
            );
        }
    }

    copy(): Linear2DFn {
        return new Linear2DFn(this.points.map((p) => p.copy()));
    }

    calc(x: number): number {
        if (x <= this.points[0].x) {
            return this.ks[0] * x + this.ns[0];
        }
        if (x >= this.points[this.points.length - 1].x) {
            return (
                this.ks[this.ks.length - 1] * x + this.ns[this.ns.length - 1]
            );
        }
        let bestIdx = 0;
        for (let i = 0; i < this.points.length - 1; i++) {
            const point = this.points[i];
            if (x >= point.x && x < this.points[i + 1].x) {
                bestIdx = i;
                break;
            }
        }
        return this.ks[bestIdx] * x + this.ns[bestIdx];
    }

    calcInv(y: number): number {
        if (y <= this.points[0].y) {
            return (y - this.ns[0]) / this.ks[0];
        }
        if (y >= this.points[this.points.length - 1].y) {
            return (
                (y - this.ns[this.ns.length - 1]) / this.ks[this.ks.length - 1]
            );
        }
        let bestIdx = 0;
        for (let i = 0; i < this.points.length - 1; i++) {
            const point = this.points[i];
            if (y >= point.y && y < this.points[i + 1].y) {
                bestIdx = i;
                break;
            }
        }
        return (y - this.ns[bestIdx]) / this.ks[bestIdx];
    }

    static toProto(linear2DFn: Linear2DFn): ProtoLinear2DFn {
        return create(Linear2DFnSchema, {
            points: linear2DFn.points.map((p) => Point.toProto(p)),
        });
    }

    static fromProto(proto: ProtoLinear2DFn): Linear2DFn {
        if (!proto.points) {
            throw new Error('Property "points" is required');
        }
        return new Linear2DFn(proto.points.map((p) => Point.fromProto(p)));
    }
}
