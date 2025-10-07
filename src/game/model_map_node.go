package game

import (
	pb "github.com/bbanez/catan/gen/proto_game"
	"github.com/bbanez/catan/src/utils"
)

type GameMapNode struct {
	Id          uint32
	Pos         utils.PointInt
	OnSea       bool
	OreDock     bool
	WoodDock    bool
	WheatDock   bool
	SheepDock   bool
	ClayDock    bool
	GeneralDock bool
	HasVillage  bool
	HasCity     bool
	PlayerId    string
}

func GameMapNodeNew(tilePos utils.PointInt, relativeNodePos utils.PointInt, width uint32) *GameMapNode {
	x := tilePos.X + relativeNodePos.X
	y := (tilePos.Y * 2) + relativeNodePos.Y
	return &GameMapNode{
		Id:          uint32(utils.XYToIdx(x, y, int32(width))),
		Pos:         *utils.NewPointInt(x, y),
		OnSea:       false,
		OreDock:     false,
		WoodDock:    false,
		WheatDock:   false,
		SheepDock:   false,
		ClayDock:    false,
		GeneralDock: false,
		HasVillage:  false,
		HasCity:     false,
		PlayerId:    "",
	}
}

func GameMapNodeFromProto(node *pb.GameMapNode) *GameMapNode {
	return &GameMapNode{
		Id:          node.Id,
		OnSea:       node.OnSea,
		OreDock:     node.OreDock,
		WoodDock:    node.WoodDock,
		WheatDock:   node.WheatDock,
		SheepDock:   node.SheepDock,
		ClayDock:    node.ClayDock,
		GeneralDock: node.GeneralDock,
		HasVillage:  node.HasVillage,
		HasCity:     node.HasCity,
		PlayerId:    node.PlayerId,
	}
}

func (n *GameMapNode) ToProto() *pb.GameMapNode {
	return &pb.GameMapNode{
		Id:          n.Id,
		OnSea:       n.OnSea,
		OreDock:     n.OreDock,
		WoodDock:    n.WoodDock,
		WheatDock:   n.WheatDock,
		SheepDock:   n.SheepDock,
		ClayDock:    n.ClayDock,
		GeneralDock: n.GeneralDock,
		HasVillage:  n.HasVillage,
		HasCity:     n.HasCity,
		PlayerId:    n.PlayerId,
	}
}
func GameMapNodeToProto(node *GameMapNode) *pb.GameMapNode {
	return node.ToProto()
}
