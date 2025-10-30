import { create } from '@bufbuild/protobuf';
import * as pb from '@proto/proto_game/card_pb';

export type GameCardResourceType =
    | 'ore'
    | 'wood'
    | 'wheat'
    | 'clay'
    | 'sheep'
    | 'desert';

export function gameCardResurceTypeFromProto(data: pb.GameCardResourceType) {
    switch (data) {
        case pb.GameCardResourceType.GAME_CARD_RESOURCE_ORE:
            return 'ore';
        case pb.GameCardResourceType.GAME_CARD_RESOURCE_WOOD:
            return 'wood';
        case pb.GameCardResourceType.GAME_CARD_RESOURCE_WHEAT:
            return 'wheat';
        case pb.GameCardResourceType.GAME_CARD_RESOURCE_CLAY:
            return 'clay';
        case pb.GameCardResourceType.GAME_CARD_RESOURCE_SHEEP:
            return 'sheep';
        case pb.GameCardResourceType.GAME_CARD_RESOURCE_DESERT:
            return 'desert';
    }
}

export function gameCardResurceTypeToProto(data: GameCardResourceType) {
    switch (data) {
        case 'ore':
            return pb.GameCardResourceType.GAME_CARD_RESOURCE_ORE;
        case 'wood':
            return pb.GameCardResourceType.GAME_CARD_RESOURCE_WOOD;
        case 'wheat':
            return pb.GameCardResourceType.GAME_CARD_RESOURCE_WHEAT;
        case 'clay':
            return pb.GameCardResourceType.GAME_CARD_RESOURCE_CLAY;
        case 'sheep':
            return pb.GameCardResourceType.GAME_CARD_RESOURCE_SHEEP;
        case 'desert':
            return pb.GameCardResourceType.GAME_CARD_RESOURCE_DESERT;
    }
}

export class GameCardResource {
    constructor(
        public type: GameCardResourceType,
        public amount: number,
    ) {}

    static fromProto(data: pb.GameCardResource) {
        return new GameCardResource(
            gameCardResurceTypeFromProto(data.type),
            data.amount,
        );
    }

    toProto(): pb.GameCardResource {
        return create(pb.GameCardResourceSchema, {
            type: gameCardResurceTypeToProto(this.type),
            amount: this.amount,
        });
    }
}

export type GameCardProgressType =
    | 'point'
    | 'road_build'
    | 'monopoly'
    | 'invention'
    | 'knight';

export function gameCardProgressTypeFromProto(data: pb.GameCardProgressType) {
    switch (data) {
        case pb.GameCardProgressType.GAME_CARD_PROGRESS_POINT:
            return 'point';
        case pb.GameCardProgressType.GAME_CARD_PROGRESS_ROAD_BUILD:
            return 'road_build';
        case pb.GameCardProgressType.GAME_CARD_PROGRESS_MONOPOLY:
            return 'monopoly';
        case pb.GameCardProgressType.GAME_CARD_PROGRESS_INVENTION:
            return 'invention';
        case pb.GameCardProgressType.GAME_CARD_PROGRESS_KNIGHT:
            return 'knight';
    }
}

export function gameCardProgressTypeToProto(data: GameCardProgressType) {
    switch (data) {
        case 'point':
            return pb.GameCardProgressType.GAME_CARD_PROGRESS_POINT;
        case 'road_build':
            return pb.GameCardProgressType.GAME_CARD_PROGRESS_ROAD_BUILD;
        case 'monopoly':
            return pb.GameCardProgressType.GAME_CARD_PROGRESS_MONOPOLY;
        case 'invention':
            return pb.GameCardProgressType.GAME_CARD_PROGRESS_INVENTION;
        case 'knight':
            return pb.GameCardProgressType.GAME_CARD_PROGRESS_KNIGHT;
    }
}

export class GameCardProgress {
    constructor(
        public type: GameCardProgressType,
        public canActivate: boolean,
        public active: boolean,
    ) {}

    static fromProto(data: pb.GameCardProgress) {
        return new GameCardProgress(
            gameCardProgressTypeFromProto(data.type),
            data.canActivate,
            data.active,
        );
    }

    toProto(): pb.GameCardProgress {
        return create(pb.GameCardProgressSchema, {
            type: gameCardProgressTypeToProto(this.type),
            canActivate: this.canActivate,
            active: this.active,
        });
    }
}

export type GameCardAchievementType = 'most_roads_built' | 'biggest_army';

export function gameCardAchievementTypeFromProto(
    data: pb.GameCardAchievementType,
): GameCardAchievementType {
    switch (data) {
        case pb.GameCardAchievementType.GAME_CARD_ACHIEVEMENT_MOST_ROADS_BUILT:
            return 'most_roads_built';
        case pb.GameCardAchievementType.GAME_CARD_ACHIEVEMENT_BIGGEST_ARMY:
            return 'biggest_army';
    }
}

export function gameCardAchievementTypeToProto(data: GameCardAchievementType) {
    switch (data) {
        case 'most_roads_built':
            return pb.GameCardAchievementType
                .GAME_CARD_ACHIEVEMENT_MOST_ROADS_BUILT;
        case 'biggest_army':
            return pb.GameCardAchievementType
                .GAME_CARD_ACHIEVEMENT_BIGGEST_ARMY;
    }
}

export class GameCardAchievement {
    constructor(public type: GameCardAchievementType) {}

    static fromProto(data: pb.GameCardAchievement) {
        return new GameCardAchievement(
            gameCardAchievementTypeFromProto(data.type),
        );
    }

    toProto(): pb.GameCardAchievement {
        return create(pb.GameCardAchievementSchema, {
            type: gameCardAchievementTypeToProto(this.type),
        });
    }
}
