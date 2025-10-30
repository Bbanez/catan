import { create } from '@bufbuild/protobuf';
import * as pb from '@proto/proto_game/player_pb';
import {
    GameCardAchievement,
    GameCardProgress,
    GameCardResource,
} from '@root/proto/game/card';

export type GamePlayerColor = 'red' | 'blue' | 'teal' | 'purple';

export function gamePlayerColorFromProto(data: pb.GamePlayerColor) {
    switch (data) {
        case pb.GamePlayerColor.RED:
            return 'red';
        case pb.GamePlayerColor.BLUE:
            return 'blue';
        case pb.GamePlayerColor.TEAL:
            return 'teal';
        case pb.GamePlayerColor.PURPLE:
            return 'purple';
    }
}

export function gamePlayerColorToProto(data: GamePlayerColor) {
    switch (data) {
        case 'red':
            return pb.GamePlayerColor.RED;
        case 'blue':
            return pb.GamePlayerColor.BLUE;
        case 'teal':
            return pb.GamePlayerColor.TEAL;
        case 'purple':
            return pb.GamePlayerColor.PURPLE;
    }
}

export class GamePlayer {
    constructor(
        public id: string,
        public username: string,
        public color: GamePlayerColor,
        public achievementCards: GameCardAchievement[],
        public resourceCards: GameCardResource[],
        public progressCards: GameCardProgress[],
        public availableRoads: number,
        public availableVillages: number,
        public availableCities: number,
    ) {}

    static fromProto(data: pb.GamePlayer) {
        return new GamePlayer(
            data.id,
            data.username,
            gamePlayerColorFromProto(data.color),
            data.achievementCards.map((e) => GameCardAchievement.fromProto(e)),
            data.resourceCards.map((e) => GameCardResource.fromProto(e)),
            data.progressCards.map((e) => GameCardProgress.fromProto(e)),
            data.availableRoads,
            data.availableVillages,
            data.availableCities,
        );
    }

    toProto(): pb.GamePlayer {
        return create(pb.GamePlayerSchema, {
            id: this.id,
            username: this.username,
            color: gamePlayerColorToProto(this.color),
            achievementCards: this.achievementCards.map((e) => e.toProto()),
            resourceCards: this.resourceCards.map((e) => e.toProto()),
            progressCards: this.progressCards.map((e) => e.toProto()),
            availableRoads: this.availableRoads,
            availableVillages: this.availableVillages,
            availableCities: this.availableCities,
        });
    }

    static toProto(data: GamePlayer): pb.GamePlayer {
        return data.toProto();
    }
}
