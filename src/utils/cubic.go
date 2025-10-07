package utils

import (
	pb "github.com/bbanez/catan/gen/proto_utils"
)

type Cubic struct {
	A float32
	B float32
	C float32
	D float32
}

func NewCubic(a, b, c, d float32) *Cubic {
	return &Cubic{a, b, c, d}
}

func (c *Cubic) Copy() *Cubic {
	return &Cubic{c.A, c.B, c.C, c.D}
}

func CubicFromProto(c *pb.Cubic) *Cubic {
	return &Cubic{c.A, c.B, c.C, c.D}
}

func CubicToProto(c *Cubic) *pb.Cubic {
	return &pb.Cubic{A: c.A, B: c.B, C: c.C, D: c.D}
}

func (c *Cubic) ToProto() *pb.Cubic {
	return CubicToProto(c)
}
