package utils

import (
	pb "github.com/bbanez/catan/gen/proto_utils"
)

type Size struct {
	Width  float32
	Height float32
}

func NewSize(width, height float32) *Size {
	return &Size{width, height}
}

func (s *Size) Copy() *Size {
	return &Size{s.Width, s.Height}
}

func SizeFromProto(s *pb.Size) *Size {
	return &Size{s.Width, s.Height}
}

func SizeToProto(s *Size) *pb.Size {
	return &pb.Size{Width: s.Width, Height: s.Height}
}

func (s *Size) ToProto() *pb.Size {
	return SizeToProto(s)
}

type Size3 struct {
	Width  float32
	Height float32
	Depth  float32
}

func NewSize3(width, height, depth float32) *Size3 {
	return &Size3{width, height, depth}
}

func (s *Size3) Copy() *Size3 {
	return &Size3{s.Width, s.Height, s.Depth}
}

func Size3FromProto(s *pb.Size3) *Size3 {
	return &Size3{s.Width, s.Height, s.Depth}
}

func Size3ToProto(s *Size3) *pb.Size3 {
	return &pb.Size3{Width: s.Width, Height: s.Height, Depth: s.Depth}
}

func (s *Size3) ToProto() *pb.Size3 {
	return Size3ToProto(s)
}
