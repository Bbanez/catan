package game

import (
	pb "github.com/bbanez/catan/gen/proto_game"
	"github.com/bbanez/catan/src/utils"
)

type GameCardProgress struct {
	Type        pb.GameCardProgressType
	Active      bool
	CanActivate bool
}

func GameCardProgressGenerateSet(cards []*GameCardProgress, typee pb.GameCardProgressType, amount uint32) []*GameCardProgress {
	return append(
		cards,
		utils.NewArrayWithValue(
			GameCardProgressNew(
				pb.GameCardProgressType_GAME_CARD_PROGRESS_POINT,
			),
			5,
		)...,
	)
}

func GameCardProgressNew(progressType pb.GameCardProgressType) *GameCardProgress {
	return &GameCardProgress{
		Type:        progressType,
		Active:      false,
		CanActivate: false,
	}
}

func GameCardProgressFromProto(progress *pb.GameCardProgress) *GameCardProgress {
	return &GameCardProgress{
		Type:        progress.Type,
		Active:      progress.Active,
		CanActivate: progress.CanActivate,
	}
}

func (p *GameCardProgress) ToProto() *pb.GameCardProgress {
	return &pb.GameCardProgress{
		Type:        p.Type,
		Active:      p.Active,
		CanActivate: p.CanActivate,
	}
}
func GameCardProgressToProto(progress *GameCardProgress) *pb.GameCardProgress {
	return progress.ToProto()
}
