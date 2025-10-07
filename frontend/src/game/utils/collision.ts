import type { Cubic } from '@root/proto/utils/cubic';
import { Point } from '@root/proto/utils/point';

export class Collision {
    static withBoxAndPoint(cubic: Cubic, point: Point): boolean {
        return (
            point.x > cubic.d &&
            point.x < cubic.b &&
            point.y > cubic.a &&
            point.y < cubic.c
        );
    }

    static withBoxAndBox(cubic1: Cubic, cubic2: Cubic): boolean {
        return (
            Collision.withBoxAndPoint(cubic1, new Point(cubic2.d, cubic2.a)) ||
            Collision.withBoxAndPoint(cubic1, new Point(cubic2.b, cubic2.a)) ||
            Collision.withBoxAndPoint(cubic1, new Point(cubic2.b, cubic2.c)) ||
            Collision.withBoxAndPoint(cubic1, new Point(cubic2.d, cubic2.c))
        );
    }
}
