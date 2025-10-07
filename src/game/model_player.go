package game

import (
	pb "github.com/bbanez/catan/gen/proto_game"
	"github.com/bbanez/catan/src/utils"
)

type GamePlayer struct {
	Id                string
	Username          string
	Color             pb.GamePlayerColor
	AchievementCards  []*GameCardAchievement
	ResourceCards     []*GameCardResource
	ProgressCards     []*GameCardProgress
	AvailableRoads    uint32
	AvailableVillages uint32
	AvailableCities   uint32
}

func GamePlayerNew(id string, username string, color pb.GamePlayerColor) *GamePlayer {
	return &GamePlayer{
		Id:                id,
		Username:          username,
		Color:             color,
		AchievementCards:  []*GameCardAchievement{},
		ResourceCards:     []*GameCardResource{},
		ProgressCards:     []*GameCardProgress{},
		AvailableRoads:    15,
		AvailableVillages: 5,
		AvailableCities:   4,
	}
}

func GamePlayerFromProto(player *pb.GamePlayer) *GamePlayer {
	return &GamePlayer{
		Id:                player.Id,
		Username:          player.Username,
		Color:             player.Color,
		AchievementCards:  utils.MapRef(player.AchievementCards, GameCardAchievementFromProto),
		ResourceCards:     utils.MapRef(player.ResourceCards, GameCardResourceFromProto),
		ProgressCards:     utils.MapRef(player.ProgressCards, GameCardProgressFromProto),
		AvailableRoads:    player.AvailableRoads,
		AvailableVillages: player.AvailableVillages,
		AvailableCities:   player.AvailableCities,
	}
}

func (p *GamePlayer) ToProto() *pb.GamePlayer {
	return &pb.GamePlayer{
		Id:                p.Id,
		Username:          p.Username,
		Color:             p.Color,
		AchievementCards:  utils.MapRef(p.AchievementCards, GameCardAchievementToProto),
		ResourceCards:     utils.MapRef(p.ResourceCards, GameCardResourceToProto),
		ProgressCards:     utils.MapRef(p.ProgressCards, GameCardProgressToProto),
		AvailableRoads:    p.AvailableRoads,
		AvailableVillages: p.AvailableVillages,
		AvailableCities:   p.AvailableCities,
	}
}
func GamePlayerToProto(player *GamePlayer) *pb.GamePlayer {
	return player.ToProto()
}
