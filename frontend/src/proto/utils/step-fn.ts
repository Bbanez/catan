import { create } from '@bufbuild/protobuf';
import {
    StepFnU32F32Schema,
    type StepFnU32F32 as ProtoStepFnU32F32,
} from '@proto/proto_utils/step_fn_pb';
import { TupleU32F32Schema } from '@root/gen/proto_utils/tuple_pb';
import { Point } from '@root/proto/utils/point';

export class StepFn {
    steps: Point[] = [];

    constructor(steps: Point[]) {
        if (steps.length === 0) {
            throw new Error('At least one step is required');
        }
        this.steps = steps;
    }

    copy(): StepFn {
        return new StepFn(this.steps.map((step) => step.copy()));
    }

    calc(x: number): number {
        if (x < this.steps[0].x) {
            return this.steps[0].y;
        }
        for (let i = 1; i < this.steps.length - 1; i++) {
            if (x < this.steps[i].x) {
                return this.steps[i].y;
            }
        }
        return this.steps[this.steps.length - 1].y;
    }

    calcInv(y: number): number {
        if (y < this.steps[0].y) {
            return this.steps[0].x;
        }
        for (let i = 1; i < this.steps.length - 1; i++) {
            if (y < this.steps[i].y) {
                return this.steps[i].x;
            }
        }
        return this.steps[this.steps.length - 1].x;
    }

    toProto(): ProtoStepFnU32F32 {
        return create(StepFnU32F32Schema, {
            steps: this.steps.map((step) => {
                return create(TupleU32F32Schema, {
                    x: step.x,
                    y: step.y,
                });
            }),
        });
    }

    static fromProto(proto: ProtoStepFnU32F32): StepFn {
        if (!proto.steps) {
            throw new Error('Property "steps" is required');
        }
        return new StepFn(
            proto.steps.map((step) => {
                return new Point(step.x, step.y);
            }),
        );
    }
}
