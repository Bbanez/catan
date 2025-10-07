package utils

import (
	pb "github.com/bbanez/catan/gen/proto_utils"
)

type BoundingBox struct {
	Size     *Size
	Position *Point
	HalfSize *Size
	Edges    *Cubic
}

func NewBoundingBox(size *Size, position *Point) *BoundingBox {
	bb := &BoundingBox{
		Size:     size,
		Position: position,
		HalfSize: NewSize(size.Width/2, size.Height/2),
		Edges:    NewCubic(0.0, 0.0, 0.0, 0.0),
	}
	bb.update()
	return bb
}

func NewEmptyBoundingBox() *BoundingBox {
	return NewBoundingBox(NewSize(0, 0), NewPoint(0, 0))
}

func BoundingBoxFromProto(bb *pb.BoundingBox) *BoundingBox {
	return NewBoundingBox(SizeFromProto(bb.Size), PointFromProto(bb.Position))
}

func BoundingBoxToProto(bb *BoundingBox) *pb.BoundingBox {
	return &pb.BoundingBox{
		Position: PointToProto(bb.Position),
		Size:     SizeToProto(bb.Size),
	}
}

func (bb *BoundingBox) ToProto() *pb.BoundingBox {
	return BoundingBoxToProto(bb)
}

func (bb *BoundingBox) update() {
	bb.HalfSize.Width = bb.Size.Width / 2
	bb.HalfSize.Height = bb.Size.Height / 2
	bb.Edges.A = bb.Position.Y - bb.HalfSize.Height
	bb.Edges.B = bb.Position.X + bb.HalfSize.Width
	bb.Edges.C = bb.Position.Y + bb.HalfSize.Height
	bb.Edges.D = bb.Position.X - bb.HalfSize.Width
}

func (bb *BoundingBox) SetSize(size *Size) {
	bb.Size.Width = size.Width
	bb.Size.Height = size.Height
	bb.update()
}

func (bb *BoundingBox) SetPosition(position *Point) {
	bb.Position.X = position.X
	bb.Position.Y = position.Y
	bb.update()
}

func (bb *BoundingBox) IsPointInside(point *Point) bool {
	return CollisionWithBbAndPoint(bb.Edges, point)
}

func (bb *BoundingBox) DoesIntersect(bb2 *Cubic) bool {
	return CollisionWithBbAndBb(bb.Edges, bb2)
}
