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
	Bank            pb.GameBank
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
	tiles := GameMapGenerate4PlayerTiles()
	availableTileTypes := []pb.GameCardResourceType{}
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 1)...)
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_ORE, 3)...)
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_WHEAT, 4)...)
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_SHEEP, 4)...)
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_WOOD, 4)...)
	availableTileTypes = append(availableTileTypes, utils.NewArrayWithValue(pb.GameCardResourceType_GAME_CARD_RESOURCE_CLAY, 3)...)
	utils.Shuffle(availableTileTypes)
	tileNumbers := []uint32{5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11}
	nodes := []*GameMapNode{}
	// Assign tile resource type to tile object and generate nodes
	for i := 0; i < len(availableTileTypes); i++ {
		tile := tiles[i]
		tile.ResourceType = availableTileTypes[i]
		if availableTileTypes[i] != pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT {
			tile.Num = tileNumbers[i]
		}
		tmpNodes := []*GameMapNode{
			GameMapNodeNew(tile.Pos, *utils.NewPointInt(0, 0), 9),
			GameMapNodeNew(tile.Pos, *utils.NewPointInt(1, 0), 9),
			GameMapNodeNew(tile.Pos, *utils.NewPointInt(2, 1), 9),
			GameMapNodeNew(tile.Pos, *utils.NewPointInt(2, 2), 9),
			GameMapNodeNew(tile.Pos, *utils.NewPointInt(1, 3), 9),
			GameMapNodeNew(tile.Pos, *utils.NewPointInt(0, 2), 9),
		}
		for _, node := range tmpNodes {
			existingNode := utils.FindRef(nodes, func(n *GameMapNode) bool {
				return n.Id == node.Id
			})
			if existingNode.Available {
				continue
			}
			nodes = append(nodes, node)
		}
	}
	edges := []*GameMapEdge{}
	return &Game{
		Id:        cuid2.Generate(),
		CreatedAt: uint64(time.Now().Unix()),
		Password:  cuid2.Generate(),
		MapType:   pb.GameMapType_GAME_MAP_TYPE_BASE,
		HostId:    account.Id,
		Players: []*GamePlayer{
			GamePlayerNew(account.Id, account.Username, pb.GamePlayerColor_GAME_PLAYER_COLOR_RED),
		},
		ActivePlayerIdx: 0,
		Bank:            pb.GameBank{},
		ProgressCards:   progressCards,
		Tiles:           tiles,
		Nodes:           nodes,
		Edges:           edges,
	}
}
