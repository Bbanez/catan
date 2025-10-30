package game

import (
	pb "github.com/bbanez/catan/gen/proto_game"
	"github.com/bbanez/catan/src/utils"
)

/*
Relative node position to tile position
Each tile is a hexagon but we can create a
grid lines which are behaving like squares,
therefore we don't need to work with fractions.

Nodes between tiles can overlap and should have
same absolute position, therefore we can merge
them. This should be done on node creation level.

		1,0
	 0,1 /\ 2,1
	 0,2 || 2,2
		 \/
		1,3
*/
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

func GameMapNodeCalcPosition(
	tilePos *utils.PointInt,
	relativeNodePos *utils.PointInt,
) (int32, int32) {
	x := tilePos.X + relativeNodePos.X
	y := (tilePos.Y * 2) + relativeNodePos.Y
	return x, y
}

func GameMapNodeCalcId(
	x int32,
	y int32,
	mapWidthForNodes uint32,
) uint32 {
	return uint32(utils.XYToIdx(x, y, int32(mapWidthForNodes)))
}

func GameMapNodeCalcIdFromRelativePos(
	tilePos *utils.PointInt,
	relativeNodePos *utils.PointInt,
	mapWidthForNodes uint32,
) uint32 {
	x, y := GameMapNodeCalcPosition(tilePos, relativeNodePos)
	return GameMapNodeCalcId(x, y, mapWidthForNodes)
}

func GameMapNodeFindByRelativePos(
	nodes []*GameMapNode,
	tilePos *utils.PointInt,
	relativeNodePos *utils.PointInt,
) *GameMapNode {
	for _, node := range nodes {
		x, y := GameMapNodeCalcPosition(tilePos, relativeNodePos)
		if node.Pos.X == x && node.Pos.Y == y {
			return node
		}
	}
	return nil
}

func GameMapNodeNew(
	tilePos *utils.PointInt,
	relativeNodePos *utils.PointInt,
	mapWidthForNodes uint32,
) *GameMapNode {
	x, y := GameMapNodeCalcPosition(tilePos, relativeNodePos)
	id := GameMapNodeCalcId(x, y, mapWidthForNodes)
	return &GameMapNode{
		Id:          id,
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
		Pos:         *utils.PointIntFromProto(node.Pos),
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
		Pos:         n.Pos.ToProto(),
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
