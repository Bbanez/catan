package utils

import (
	pb "github.com/bbanez/catan/gen/proto_utils"
)

/*
	 10 |        ___
	 8  |      __|
	 6  |   __|
	 4  |  |
	 0  |------------

		0  1  2  3  4

x <= 0 -> y = 0
x = 1 -> y = 4
x = 1.5 -> y = 4
x >= 4 -> y = 10
*/
type StepFnU32F32 struct {
	Steps []*TupleU32F32
}

func NewStepFnU32F32(steps []*TupleU32F32) *StepFnU32F32 {
	return &StepFnU32F32{
		Steps: steps,
	}
}
func StepFnU32F32FromProto(in *pb.StepFnU32F32) *StepFnU32F32 {
	steps := make([]*TupleU32F32, len(in.Steps))
	for i, s := range in.Steps {
		steps[i] = TupleU32F32FromProto(s)
	}
	return NewStepFnU32F32(steps)
}
func StepFnU32F32ToProto(in *StepFnU32F32) *pb.StepFnU32F32 {
	steps := make([]*pb.TupleU32F32, len(in.Steps))
	for i, s := range in.Steps {
		steps[i] = TupleU32F32ToProto(s)
	}
	return &pb.StepFnU32F32{
		Steps: steps,
	}
}
func (fn *StepFnU32F32) ToProto() *pb.StepFnU32F32 {
	return StepFnU32F32ToProto(fn)
}
func (fn *StepFnU32F32) Calc(x uint32) float32 {
	if x <= fn.Steps[0].X {
		return fn.Steps[0].Y
	}
	for i := 1; i < len(fn.Steps); i++ {
		if x <= fn.Steps[i].X {
			return fn.Steps[i].Y
		}
	}
	return fn.Steps[len(fn.Steps)-1].Y
}
func (fn *StepFnU32F32) CalcInv(y float32) uint32 {
	if y <= fn.Steps[0].Y {
		return fn.Steps[0].X
	}
	for i := 1; i < len(fn.Steps); i++ {
		if y <= fn.Steps[i].Y {
			return fn.Steps[i].X
		}
	}
	return fn.Steps[len(fn.Steps)-1].X
}

type StepFnF32U32 struct {
	Steps []*TupleF32U32
}

func NewStepFnF32U32(steps []*TupleF32U32) *StepFnF32U32 {
	return &StepFnF32U32{
		Steps: steps,
	}
}
func StepFnF32U32FromProto(in *pb.StepFnF32U32) *StepFnF32U32 {
	steps := make([]*TupleF32U32, len(in.Steps))
	for i, s := range in.Steps {
		steps[i] = TupleF32U32FromProto(s)
	}
	return NewStepFnF32U32(steps)
}
func StepFnF32U32ToProto(in *StepFnF32U32) *pb.StepFnF32U32 {
	steps := make([]*pb.TupleF32U32, len(in.Steps))
	for i, s := range in.Steps {
		steps[i] = TupleF32U32ToProto(s)
	}
	return &pb.StepFnF32U32{
		Steps: steps,
	}
}
func (fn *StepFnF32U32) ToProto() *pb.StepFnF32U32 {
	return StepFnF32U32ToProto(fn)
}
func (fn *StepFnF32U32) Calc(x float32) uint32 {
	if x <= fn.Steps[0].X {
		return fn.Steps[0].Y
	}
	for i := 1; i < len(fn.Steps); i++ {
		if x <= fn.Steps[i].X {
			return fn.Steps[i].Y
		}
	}
	return fn.Steps[len(fn.Steps)-1].Y
}
func (fn *StepFnF32U32) CalcInv(y uint32) float32 {
	if y <= fn.Steps[0].Y {
		return fn.Steps[0].X
	}
	for i := 1; i < len(fn.Steps); i++ {
		if y <= fn.Steps[i].Y {
			return fn.Steps[i].X
		}
	}
	return fn.Steps[len(fn.Steps)-1].X
}
