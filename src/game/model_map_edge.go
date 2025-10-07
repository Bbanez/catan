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

func GameMapEdgeNew(id uint32, nodeIds []uint32, ) *GameMapEdge {
	return &GameMapEdge{
		Id:       id,
		NodeIds:  nodeIds,
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
