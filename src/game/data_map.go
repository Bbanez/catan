package game

import (
	"math/rand"
	"time"

	pb "github.com/bbanez/catan/gen/proto_game"
)

func GameMapGenerate() []*GameMapTile {
	tiles := []*GameMapTile{}
	// Generate clay tiles
	for i := 0; i < 3; i++ {
		tiles = append(
			tiles,
			GameMapTileNew(uint32(i), pb.GameCardResourceType_GAME_CARD_RESOURCE_CLAY, 1),
		)
	}
	// Generate wood tiles
	for i := 0; i < 4; i++ {
		tiles = append(
			tiles,
			GameMapTileNew(uint32(i), pb.GameCardResourceType_GAME_CARD_RESOURCE_WOOD, 1),
		)
	}
	// Generate sheep tiles
	for i := 0; i < 4; i++ {
		tiles = append(
			tiles,
			GameMapTileNew(uint32(i), pb.GameCardResourceType_GAME_CARD_RESOURCE_SHEEP, 1),
		)
	}
	// Generate wheat tiles
	for i := 0; i < 4; i++ {
		tiles = append(
			tiles,
			GameMapTileNew(uint32(i), pb.GameCardResourceType_GAME_CARD_RESOURCE_WHEAT, 1),
		)
	}
	// Generate ore tiles
	for i := 0; i < 4; i++ {
		tiles = append(
			tiles,
			GameMapTileNew(uint32(i), pb.GameCardResourceType_GAME_CARD_RESOURCE_ORE, 1),
		)
	}
	// Generate desert tiles
	for i := 0; i < 1; i++ {
		tiles = append(
			tiles,
			GameMapTileNew(uint32(i), pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT, 1),
		)
	}
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	r.Shuffle(len(tiles), func(i, j int) {
		a := *tiles[j]
		b := *tiles[i]
		tiles[i], tiles[j] = &a, &b
	})
	tileNumArr := []uint32{5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11}
	tileNumIdx := 0
	for i := 0; i < len(tiles); i++ {
		tile := tiles[i]
		if tile.ResourceType == pb.GameCardResourceType_GAME_CARD_RESOURCE_DESERT {
			tile.Blocked = true
			continue
		}
		tile.Num = tileNumArr[tileNumIdx]
		tileNumIdx++
	}
	return tiles
}

type GenNode struct {
	*pb.GameMapNode
	TileIdx []uint32
}

func generateNodes(tiles []*GameMapTile) {
	
}
