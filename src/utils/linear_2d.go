package utils

import (
	pb "github.com/bbanez/catan/gen/proto_utils"
)

type SimpleLinear2DFn struct {
	Start *Point
	End   *Point
	k     float32
	n     float32
}

func NewSimpleLinear2DFn(p1 *Point, p2 *Point) *SimpleLinear2DFn {
	fn := &SimpleLinear2DFn{
		Start: p1,
		End:   p2,
	}
	fn.k = (p2.Y - p1.Y) / (p2.X - p1.X)
	fn.n = p1.Y - fn.k*p1.X
	return fn
}

func SimpleLinear2DFnFromProto(in *pb.SimpleLinear2DFn) *SimpleLinear2DFn {
	return NewSimpleLinear2DFn(PointFromProto(in.Start), PointFromProto(in.End))
}

func SimpleLinear2DFnToProto(in *SimpleLinear2DFn) *pb.SimpleLinear2DFn {
	return &pb.SimpleLinear2DFn{
		Start: PointToProto(in.Start),
		End:   PointToProto(in.End),
	}
}

func (fn *SimpleLinear2DFn) ToProto() *pb.SimpleLinear2DFn {
	return SimpleLinear2DFnToProto(fn)
}

func (fn *SimpleLinear2DFn) Calc(x float32) float32 {
	return x*fn.k + fn.n
}

func (fn *SimpleLinear2DFn) CalcInv(y float32) float32 {
	return (y - fn.n) / fn.k
}

type Linear2DFn struct {
	Points []*Point
	ks     []float32
	ns     []float32
}

func NewLinear2DFn(points []*Point) *Linear2DFn {
	if len(points) < 2 {
		panic("Linear2DFn: points must have at least 2 points. Use SimpleLinear2DFn instead.")
	}
	out := &Linear2DFn{
		Points: points,
		ks:     []float32{},
		ns:     []float32{},
	}
	for i := 1; i < len(out.Points)-1; i++ {
		out.ks = append(
			out.ks,
			(out.Points[i].Y-out.Points[i-1].Y)/(out.Points[i].X-out.Points[i-1].X),
		)
		out.ns = append(
			out.ns,
			out.Points[i-1].Y-out.ks[i-1]*out.Points[i-1].X,
		)
	}
	return out
}

func Linear2DFnFromProto(in *pb.Linear2DFn) *Linear2DFn {
	points := make([]*Point, len(in.Points))
	for i, p := range in.Points {
		points[i] = PointFromProto(p)
	}
	return NewLinear2DFn(points)
}

func Linear2DFnToProto(in *Linear2DFn) *pb.Linear2DFn {
	points := make([]*pb.Point, len(in.Points))
	for i, p := range in.Points {
		points[i] = PointToProto(p)
	}
	return &pb.Linear2DFn{
		Points: points,
	}
}

func (fn *Linear2DFn) ToProto() *pb.Linear2DFn {
	return Linear2DFnToProto(fn)
}

func (fn *Linear2DFn) Calc(x float32) float32 {
	if x < fn.Points[0].X {
		return fn.ks[0]*x + fn.ns[0]
	}
	if x > fn.Points[len(fn.Points)-1].X {
		return fn.ks[len(fn.Points)-1]*x + fn.ns[len(fn.Points)-1]
	}
	bestIdx := 0
	for i := 0; i < len(fn.Points)-2; i++ {
		if x >= fn.Points[i].X && x <= fn.Points[i+1].X {
			bestIdx = i
			break
		}
	}
	return x*fn.ks[bestIdx] + fn.ns[bestIdx]
}

func (fn *Linear2DFn) CalcInv(y float32) float32 {
	bestIdx := 0
	for i := 0; i < len(fn.Points)-1; i++ {
		if y >= fn.Points[i].Y && y <= fn.Points[i+1].Y {
			bestIdx = i
			break
		}
	}
	return (y - fn.ns[bestIdx]) / fn.ks[bestIdx]
}
