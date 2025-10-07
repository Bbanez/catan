package utils

import (
	pb "github.com/bbanez/catan/gen/proto_utils"
)

type Tuple[T Number] [2]T

func NewTuple[T Number](x T, y T) *Tuple[T] {
	return &Tuple[T]{x, y}
}

func (tuple *Tuple[T]) ToPointInt() *PointInt {
	return NewPointInt(int32(tuple[0]), int32(tuple[1]))
}

type TupleU32F32 struct {
	X uint32
	Y float32
}

func NewTupleU32F32(x uint32, y float32) *TupleU32F32 {
	return &TupleU32F32{
		X: x,
		Y: y,
	}
}
func TupleU32F32FromProto(t *pb.TupleU32F32) *TupleU32F32 {
	return &TupleU32F32{
		X: t.X,
		Y: t.Y,
	}
}
func TupleU32F32ToProto(t *TupleU32F32) *pb.TupleU32F32 {
	return &pb.TupleU32F32{
		X: t.X,
		Y: t.Y,
	}
}
func (t *TupleU32F32) ToProto() *pb.TupleU32F32 {
	return TupleU32F32ToProto(t)
}

type TupleF32U32 struct {
	X float32
	Y uint32
}

func NewTupleF32U32(x float32, y uint32) *TupleF32U32 {
	return &TupleF32U32{
		X: x,
		Y: y,
	}
}
func TupleF32U32FromProto(t *pb.TupleF32U32) *TupleF32U32 {
	return &TupleF32U32{
		X: t.X,
		Y: t.Y,
	}
}
func TupleF32U32ToProto(t *TupleF32U32) *pb.TupleF32U32 {
	return &pb.TupleF32U32{
		X: t.X,
		Y: t.Y,
	}
}
func (t *TupleF32U32) ToProto() *pb.TupleF32U32 {
	return TupleF32U32ToProto(t)
}
