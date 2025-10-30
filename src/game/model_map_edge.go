package game

import (
	pb "github.com/bbanez/catan/gen/proto_game"
	"github.com/bbanez/catan/src/utils"
)

type GameMapEdge struct {
	Id       uint32
	Pos      utils.PointInt
	NodeIds  []uint32
	HasRode  bool
	PlayerId string
}

func GameMapEdgeNew(
	tilePos utils.PointInt,
	relativeNodePos utils.PointInt,
	width uint32,
	nodeIds *[]uint32,
) *GameMapEdge {
	x := tilePos.X + relativeNodePos.X
	y := (tilePos.Y * 2) + relativeNodePos.Y
	nids := []uint32{}
	if nodeIds != nil {
		nids = *nodeIds
	}
	return &GameMapEdge{
		Id:       uint32(utils.XYToIdx(x, y, int32(width))),
		NodeIds:  nids,
		HasRode:  false,
		PlayerId: "",
	}
}

func GameMapEdgeFromProto(edge *pb.GameMapEdge) *GameMapEdge {
	return &GameMapEdge{
		Id:       edge.Id,
		NodeIds:  edge.NodeIds,
		HasRode:  edge.HasRode,
		PlayerId: edge.PlayerId,
	}
}

func (e *GameMapEdge) ToProto() *pb.GameMapEdge {
	return &pb.GameMapEdge{
		Id:       e.Id,
		NodeIds:  e.NodeIds,
		HasRode:  e.HasRode,
		PlayerId: e.PlayerId,
	}
}
func GameMapEdgeToProto(edge *GameMapEdge) *pb.GameMapEdge {
	return edge.ToProto()
}
