package utils

import (
	pb "github.com/bbanez/catan/gen/proto_utils"
)

type Point struct {
	X float32
	Y float32
}

func NewPoint(x, y float32) *Point {
	return &Point{x, y}
}
func (p *Point) Copy() *Point {
	return &Point{p.X, p.Y}
}
func PointFromProto(p *pb.Point) *Point {
	return &Point{p.X, p.Y}
}
func PointToProto(p *Point) *pb.Point {
	return &pb.Point{X: p.X, Y: p.Y}
}
func (p *Point) ToProto() *pb.Point {
	return PointToProto(p)
}

type PointInt struct {
	X int32
	Y int32
}

func NewPointInt(x, y int32) *PointInt {
	return &PointInt{x, y}
}
func (p *PointInt) Copy() *PointInt {
	return &PointInt{p.X, p.Y}
}
func PointIntFromProto(p *pb.PointInt) *PointInt {
	return &PointInt{p.X, p.Y}
}
func PointIntToProto(p *PointInt) *pb.PointInt {
	return &pb.PointInt{X: p.X, Y: p.Y}
}
func (p *PointInt) ToProto() *pb.PointInt {
	return PointIntToProto(p)
}

type Point3 struct {
	X float32
	Y float32
	Z float32
}

func NewPoint3(x, y, z float32) *Point3 {
	return &Point3{x, y, z}
}

func (p *Point3) Copy() *Point3 {
	return &Point3{p.X, p.Y, p.Z}
}
func Point3FromProto(p *pb.Point3) *Point3 {
	return &Point3{p.X, p.Y, p.Z}
}
func Point3ToProto(p *Point3) *pb.Point3 {
	return &pb.Point3{X: p.X, Y: p.Y, Z: p.Z}
}
func (p *Point3) ToProto() *pb.Point3 {
	return Point3ToProto(p)
}

type Point3Int struct {
	X int32
	Y int32
	Z int32
}

func NewPoint3Int(x, y, z int32) *Point3Int {
	return &Point3Int{x, y, z}
}

func (p *Point3Int) Copy() *Point3Int {
	return &Point3Int{p.X, p.Y, p.Z}
}
func Point3IntFromProto(p *pb.Point3Int) *Point3Int {
	return &Point3Int{p.X, p.Y, p.Z}
}
func Point3IntToProto(p *Point3Int) *pb.Point3Int {
	return &pb.Point3Int{X: p.X, Y: p.Y, Z: p.Z}
}
func (p *Point3Int) ToProto() *pb.Point3Int {
	return Point3IntToProto(p)
}
