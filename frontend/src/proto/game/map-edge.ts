import { create } from '@bufbuild/protobuf';
import * as pb from '@proto/proto_game/map_edge_pb';
import { Point } from '@root/proto/utils/point';

export class GameMapEdge {
    constructor(
        public id: number,
        public pos: Point,
        public nodeIds: number[],
        public hasRode: boolean,
        public playerId: string,
    ) {}

    static fromProto(data: pb.GameMapEdge) {
        return new GameMapEdge(
            data.id,
            data.pos ? Point.fromProto(data.pos) : new Point(0, 0),
            data.nodeIds,
            data.hasRode,
            data.playerId,
        );
    }

    toProto(): pb.GameMapEdge {
        return create(pb.GameMapEdgeSchema, {
            id: this.id,
            pos: this.pos.toProtoInt(),
            nodeIds: this.nodeIds,
            hasRode: this.hasRode,
            playerId: this.playerId,
        });
    }

    static toProto(data: GameMapEdge): pb.GameMapEdge {
        return data.toProto();
    }
}
