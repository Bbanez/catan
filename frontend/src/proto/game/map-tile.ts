import { create } from '@bufbuild/protobuf';
import * as pb from '@proto/proto_game/map_tile_pb';
import {
    gameCardResurceTypeFromProto,
    gameCardResurceTypeToProto,
    type GameCardResourceType,
} from '@root/proto/game/card';
import { Point } from '@root/proto/utils/point';

export class GameMapTile {
    constructor(
        public id: number,
        public pos: Point,
        public resourceType: GameCardResourceType,
        public num: number,
        public blocked: boolean,
        public nodeIds: number[],
        public edgeIds: number[],
    ) {}

    static fromProto(data: pb.GameMapTile) {
        return new GameMapTile(
            data.id,
            data.pos ? Point.fromProto(data.pos) : new Point(0, 0),
            gameCardResurceTypeFromProto(data.resourceType),
            data.num,
            data.blocked,
            data.nodeIds,
            data.edgeIds,
        );
    }

    toProto(): pb.GameMapTile {
        return create(pb.GameMapTileSchema, {
            id: this.id,
            pos: this.pos.toProtoInt(),
            resourceType: gameCardResurceTypeToProto(this.resourceType),
            num: this.num,
            blocked: this.blocked,
            nodeIds: this.nodeIds,
            edgeIds: this.edgeIds,
        });
    }

    static toProto(data: GameMapTile): pb.GameMapTile {
        return data.toProto();
    }
}
