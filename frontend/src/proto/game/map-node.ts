import { create } from '@bufbuild/protobuf';
import * as pb from '@proto/proto_game/map_node_pb';
import { Point } from '@root/proto/utils/point';

export class GameMapNode {
    constructor(
        public id: number,
        public pos: Point,
        public onSea: boolean,
        public oreDock: boolean,
        public woodDock: boolean,
        public wheatDock: boolean,
        public sheepDock: boolean,
        public clayDock: boolean,
        public generalDock: boolean,
        public hasVillage: boolean,
        public hasCity: boolean,
        public playerId: string,
    ) {}

    static fromProto(data: pb.GameMapNode) {
        return new GameMapNode(
            data.id,
            data.pos ? Point.fromProto(data.pos) : new Point(0, 0),
            data.onSea,
            data.oreDock,
            data.woodDock,
            data.wheatDock,
            data.sheepDock,
            data.clayDock,
            data.generalDock,
            data.hasVillage,
            data.hasCity,
            data.playerId,
        );
    }

    toProto(): pb.GameMapNode {
        return create(pb.GameMapNodeSchema, {
            id: this.id,
            pos: this.pos.toProtoInt(),
            onSea: this.onSea,
            oreDock: this.oreDock,
            woodDock: this.woodDock,
            wheatDock: this.wheatDock,
            sheepDock: this.sheepDock,
            clayDock: this.clayDock,
            generalDock: this.generalDock,
            hasVillage: this.hasVillage,
            hasCity: this.hasCity,
            playerId: this.playerId,
        });
    }

    static toProto(data: GameMapNode): pb.GameMapNode {
        return data.toProto();
    }
}
