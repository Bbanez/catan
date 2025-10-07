package utils

func CollisionWithBbAndPoint(cubic *Cubic, point *Point) bool {
	return point.X > cubic.B && point.X < cubic.D && point.Y > cubic.A && point.Y < cubic.C
}

func CollisionWithBbAndBb(bb1 *Cubic, bb2 *Cubic) bool {
	return CollisionWithBbAndPoint(bb1, &Point{X: bb2.D, Y: bb2.A}) ||
		CollisionWithBbAndPoint(bb1, &Point{X: bb2.B, Y: bb2.A}) ||
		CollisionWithBbAndPoint(bb1, &Point{X: bb2.B, Y: bb2.C}) ||
		CollisionWithBbAndPoint(bb1, &Point{X: bb2.D, Y: bb2.C})
}
