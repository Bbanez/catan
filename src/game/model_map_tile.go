package game

import (
	pb "github.com/bbanez/catan/gen/proto_game"
	pu "github.com/bbanez/catan/gen/proto_utils"
	"github.com/bbanez/catan/src/utils"
)

type GameMapTile struct {
	Id           uint32
	Pos          utils.PointInt
	ResourceType pb.GameCardResourceType
	Num          uint32
	Blocked      bool
	NodeIds      []uint32
	EdgeIds      []uint32
}

func GameMapGenerate4PlayerTiles() []*GameMapTile {
	return []*GameMapTile{
		GameMapTileNew(2, 0, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(4, 0, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(6, 0, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(7, 1, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(8, 2, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(7, 3, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(6, 4, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(4, 4, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(2, 4, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(1, 3, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(0, 2, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(1, 1, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(3, 1, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(5, 1, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(6, 2, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(5, 3, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(3, 3, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(2, 2, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
		GameMapTileNew(4, 2, 9, pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 0),
	}
}

func GameMapTileNew(x int32, y int32, mapWdth int32, resourceType pb.GameCardResourceType, num uint32) *GameMapTile {
	blocked := false
	if resourceType == pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT {
		blocked = true
	}
	return &GameMapTile{
		Id:           uint32(utils.XYToIdx(x, y, mapWdth)),
		Pos:          *utils.NewPointInt(x, y),
		ResourceType: resourceType,
		Num:          num,
		Blocked:      blocked,
		NodeIds:      []uint32{},
		EdgeIds:      []uint32{},
	}
}

func GameMapTileFromProto(tile *pb.GameMapTile) *GameMapTile {
	return &GameMapTile{
		Id:           tile.Id,
		Pos:          *utils.NewPointInt(tile.Pos.X, tile.Pos.Y),
		ResourceType: tile.ResourceType,
		Num:          tile.Num,
		Blocked:      tile.Blocked,
		NodeIds:      tile.NodeIds,
		EdgeIds:      tile.EdgeIds,
	}
}

func (tile *GameMapTile) ToProto() *pb.GameMapTile {
	return &pb.GameMapTile{
		Id: tile.Id,
		Pos: &pu.PointInt{
			X: tile.Pos.X,
			Y: tile.Pos.Y,
		},
		ResourceType: tile.ResourceType,
		Num:          tile.Num,
		Blocked:      tile.Blocked,
		NodeIds:      tile.NodeIds,
		EdgeIds:      tile.EdgeIds,
	}
}
func GameMapTileToProto(tile *GameMapTile) *pb.GameMapTile {
	return tile.ToProto()
}
