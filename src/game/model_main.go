package game

import (
	"time"

	pb "github.com/bbanez/catan/gen/proto_game"
	"github.com/bbanez/catan/src/account"
	"github.com/bbanez/catan/src/utils"
	"github.com/nrednav/cuid2"
)

type Game struct {
	Id              string
	CreatedAt       uint64
	Password        string
	MapType         pb.GameMapType
	HostId          string
	Players         []*GamePlayer
	ActivePlayerIdx uint32
	Bank            *pb.GameBank
	ProgressCards   []*GameCardProgress
	Tiles           []*GameMapTile
	Nodes           []*GameMapNode
	Edges           []*GameMapEdge
}

func New(account *account.Account) *Game {
	progressCards := []*GameCardProgress{}
	progressCards = GameCardProgressGenerateSet(progressCards, pb.GameCardProgressType_GAME_CARD_PROGRESS_POINT, 5)
	progressCards = GameCardProgressGenerateSet(progressCards, pb.GameCardProgressType_GAME_CARD_PROGRESS_ROAD_BUILD, 2)
	progressCards = GameCardProgressGenerateSet(progressCards, pb.GameCardProgressType_GAME_CARD_PROGRESS_MONOPOLY, 2)
	progressCards = GameCardProgressGenerateSet(progressCards, pb.GameCardProgressType_GAME_CARD_PROGRESS_INVENTION, 2)
	progressCards = GameCardProgressGenerateSet(progressCards, pb.GameCardProgressType_GAME_CARD_PROGRESS_KNIGHT, 14)
	utils.Shuffle(progressCards)
	availableTileTypes := []pb.GameCardResourceType{}
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 1)...)
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_ORE, 3)...)
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_WHEAT, 4)...)
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_SHEEP, 4)...)
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_WOOD, 4)...)
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_CLAY, 3)...)
	utils.Shuffle(availableTileTypes)
	tileNumbers := []uint32{5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11}
	tileNumberIdx := 0
	nodes := []*GameMapNode{}
	nodeWidthCount := uint32(11)
	edges := []*GameMapEdge{}
	edgeWidthCount := nodeWidthCount*2 - 1
	tiles := GameMapGenerate4PlayerTiles()
	// Assign tile resource type to tile object and generate nodes
	for i := 0; i < len(availableTileTypes); i++ {
		tile := tiles[i]
		tile.ResourceType = availableTileTypes[i]
		if availableTileTypes[i] != pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT {
			tile.Num = tileNumbers[tileNumberIdx]
			tileNumberIdx++
		}
		tmpNodes := []*GameMapNode{
			GameMapNodeNew(&tile.Pos, utils.NewPointInt(1, 0), nodeWidthCount),
			GameMapNodeNew(&tile.Pos, utils.NewPointInt(1, 0), nodeWidthCount),
			GameMapNodeNew(&tile.Pos, utils.NewPointInt(2, 1), nodeWidthCount),
			GameMapNodeNew(&tile.Pos, utils.NewPointInt(2, 2), nodeWidthCount),
			GameMapNodeNew(&tile.Pos, utils.NewPointInt(1, 3), nodeWidthCount),
			GameMapNodeNew(&tile.Pos, utils.NewPointInt(0, 2), nodeWidthCount),
		}
		// NOTE: It should be better to use hashmap for node initialization
		// but in this case it should not add a lot of overhead since
		// map is very small and there are less then 100 nodes
		for _, node := range tmpNodes {
			tile.NodeIds = append(tile.NodeIds, node.Id)
			existingNode := utils.FindRef(nodes, func(n *GameMapNode) bool {
				return n.Id == node.Id
			})
			if existingNode.Available {
				continue
			}
			nodes = append(nodes, node)
		}
		tmpEdges := []*GameMapEdge{
			GameMapEdgeNew(tile.Pos, *utils.NewPointInt(0, 1), edgeWidthCount, &[]uint32{
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(0, 2),
					nodeWidthCount,
				),
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(0, 1),
					nodeWidthCount,
				),
			}),
			GameMapEdgeNew(tile.Pos, *utils.NewPointInt(1, 0), edgeWidthCount, &[]uint32{
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(0, 1),
					nodeWidthCount,
				),
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(1, 2),
					nodeWidthCount,
				),
			}),
			GameMapEdgeNew(tile.Pos, *utils.NewPointInt(2, 0), edgeWidthCount, &[]uint32{
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(1, 0),
					nodeWidthCount,
				),
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(2, 1),
					nodeWidthCount,
				),
			}),
			GameMapEdgeNew(tile.Pos, *utils.NewPointInt(3, 1), edgeWidthCount, &[]uint32{
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(2, 1),
					nodeWidthCount,
				),
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(2, 2),
					nodeWidthCount,
				),
			}),
			GameMapEdgeNew(tile.Pos, *utils.NewPointInt(2, 2), edgeWidthCount, &[]uint32{
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(2, 2),
					nodeWidthCount,
				),
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(1, 3),
					nodeWidthCount,
				),
			}),
			GameMapEdgeNew(tile.Pos, *utils.NewPointInt(1, 2), edgeWidthCount, &[]uint32{
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(1, 3),
					nodeWidthCount,
				),
				GameMapNodeCalcIdFromRelativePos(
					&tile.Pos,
					utils.NewPointInt(0, 2),
					nodeWidthCount,
				),
			}),
		}
		for _, edge := range tmpEdges {
			tile.EdgeIds = append(tile.EdgeIds, edge.Id)
			existingEdge := utils.FindRef(edges, func(e *GameMapEdge) bool {
				return e.Id == edge.Id
			})
			if existingEdge.Available {
				continue
			}
			edges = append(edges, edge)
		}
	}
	return &Game{
		Id:        cuid2.Generate(),
		CreatedAt: uint64(time.Now().Unix()),
		Password:  cuid2.Generate(),
		MapType:   pb.GameMapType_GAME_MAP_TYPE_BASE,
		HostId:    account.Id,
		Players: []*GamePlayer{
			GamePlayerNew(
				account.Id,
				account.Username,
				pb.GamePlayerColor_GAME_PLAYER_COLOR_RED,
			),
		},
		ActivePlayerIdx: 0,
		Bank: &pb.GameBank{
			Ore:   19,
			Wood:  19,
			Wheat: 19,
			Sheep: 19,
			Clay:  19,
		},
		ProgressCards: progressCards,
		Tiles:         tiles,
		Nodes:         nodes,
		Edges:         edges,
	}
}

func FromProto(game *pb.Game) *Game {
	return &Game{
		Id:        game.Id,
		CreatedAt: game.CreatedAt,
		Password:  game.Password,
		MapType:   game.MapType,
		HostId:    game.HostId,
		Players: utils.MapRef(
			game.Players,
			func(item *pb.GamePlayer) *GamePlayer {
				return GamePlayerFromProto(item)
			},
		),
		ActivePlayerIdx: game.ActivePlayerIdx,
		Bank:            game.Bank,
		ProgressCards: utils.MapRef(
			game.ProgressCards,
			func(item *pb.GameCardProgress) *GameCardProgress {
				return GameCardProgressFromProto(item)
			},
		),
		Tiles: utils.MapRef(
			game.Tiles,
			func(item *pb.GameMapTile) *GameMapTile {
				return GameMapTileFromProto(item)
			},
		),
		Nodes: utils.MapRef(
			game.Nodes,
			func(item *pb.GameMapNode) *GameMapNode {
				return GameMapNodeFromProto(item)
			},
		),
		Edges: utils.MapRef(
			game.Edges,
			func(item *pb.GameMapEdge) *GameMapEdge {
				return GameMapEdgeFromProto(item)
			},
		),
	}
}

func (game *Game) ToProto() *pb.Game {
	return &pb.Game{
		Id:        game.Id,
		CreatedAt: game.CreatedAt,
		Password:  game.Password,
		MapType:   game.MapType,
		HostId:    game.HostId,
		Players: utils.MapRef(
			game.Players,
			func(item *GamePlayer) *pb.GamePlayer {
				return item.ToProto()
			},
		),
		ActivePlayerIdx: game.ActivePlayerIdx,
		Bank:            game.Bank,
		ProgressCards: utils.MapRef(
			game.ProgressCards,
			func(item *GameCardProgress) *pb.GameCardProgress {
				return item.ToProto()
			},
		),
		Tiles: utils.MapRef(
			game.Tiles,
			func(item *GameMapTile) *pb.GameMapTile {
				return item.ToProto()
			},
		),
		Nodes: utils.MapRef(
			game.Nodes,
			func(item *GameMapNode) *pb.GameMapNode {
				return item.ToProto()
			},
		),
		Edges: utils.MapRef(
			game.Edges,
			func(item *GameMapEdge) *pb.GameMapEdge {
				return item.ToProto()
			},
		),
	}
}

func ToProto(game *Game) *pb.Game {
	return game.ToProto()
}
