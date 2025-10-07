package game

import (
	pb "github.com/bbanez/catan/gen/proto_game"
)

type GameCardAchievement struct {
	Type pb.GameCardAchievementType
}

func GameCardAchievementNew(achievementType pb.GameCardAchievementType) *GameCardAchievement {
	return &GameCardAchievement{
		Type: achievementType,
	}
}

func GameCardAchievementFromProto(achievement *pb.GameCardAchievement) *GameCardAchievement {
	return &GameCardAchievement{
		Type: achievement.Type,
	}
}

func (a *GameCardAchievement) ToProto() *pb.GameCardAchievement {
	return &pb.GameCardAchievement{
		Type: a.Type,
	}
}
func GameCardAchievementToProto(achievement *GameCardAchievement) *pb.GameCardAchievement {
	return achievement.ToProto()
}
