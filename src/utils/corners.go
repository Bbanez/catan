package utils

import (
	pb "github.com/bbanez/catan/gen/proto_utils"
)

type Corners struct {
	TopLeft     *Point
	TopRight    *Point
	BottomRight *Point
	BottomLeft  *Point
}

func NewCorners(topLeft *Point, topRight *Point, bottomRight *Point, bottomLeft *Point) *Corners {
	return &Corners{
		TopLeft:     topLeft,
		TopRight:    topRight,
		BottomRight: bottomRight,
		BottomLeft:  bottomLeft,
	}
}

func CornersFromProto(c *pb.Corners) *Corners {
	return &Corners{
		TopLeft:     PointFromProto(c.TopLeft),
		TopRight:    PointFromProto(c.TopRight),
		BottomRight: PointFromProto(c.BottomRight),
		BottomLeft:  PointFromProto(c.BottomLeft),
	}
}

func CornersToProto(c *Corners) *pb.Corners {
	return &pb.Corners{
		TopLeft:     PointToProto(c.TopLeft),
		TopRight:    PointToProto(c.TopRight),
		BottomRight: PointToProto(c.BottomRight),
		BottomLeft:  PointToProto(c.BottomLeft),
	}
}

func (c *Corners) ToProto() *pb.Corners {
	return CornersToProto(c)
}
