import { create } from '@bufbuild/protobuf';
import * as pb from '@proto/proto_game/main_pb';
import { GameCardProgress } from '@root/proto/game/card';
import { GameMapEdge } from '@root/proto/game/map-edge';
import { GameMapNode } from '@root/proto/game/map-node';
import { GameMapTile } from '@root/proto/game/map-tile';
import { GamePlayer } from '@root/proto/game/player';

export class GameBank {
    constructor(
        public ore: number,
        public wood: number,
        public wheat: number,
        public sheep: number,
        public clay: number,
    ) {}

    static fromProto(data: pb.GameBank) {
        return new GameBank(
            data.ore,
            data.wood,
            data.wheat,
            data.sheep,
            data.clay,
        );
    }

    toProto(): pb.GameBank {
        return create(pb.GameBankSchema, {
            ore: this.ore,
            wood: this.wood,
            wheat: this.wheat,
            sheep: this.sheep,
            clay: this.clay,
        });
    }

    static toProto(data: GameBank): pb.GameBank {
        return data.toProto();
    }
}

export class Game {
    constructor(
        public id: string,
        public createdAt: number,
        public password: string,
        public mapType: pb.GameMapType,
        public hostId: string,
        public players: GamePlayer[],
        public activePlayerIdx: number,
        public bank: GameBank,
        public progressCards: GameCardProgress[],
        public tiles: GameMapTile[],
        public nodes: GameMapNode[],
        public edges: GameMapEdge[],
    ) {}

    static fromProto(data: pb.Game) {
        return new Game(
            data.id,
            Number(data.createdAt),
            data.password,
            data.mapType,
            data.hostId,
            data.players.map((e) => GamePlayer.fromProto(e)),
            data.activePlayerIdx,
            GameBank.fromProto(data.bank!),
            data.progressCards.map((e) => GameCardProgress.fromProto(e)),
            data.tiles.map((e) => GameMapTile.fromProto(e)),
            data.nodes.map((e) => GameMapNode.fromProto(e)),
            data.edges.map((e) => GameMapEdge.fromProto(e)),
        );
    }

    toProto(): pb.Game {
        return create(pb.GameSchema, {
            id: this.id,
            createdAt: BigInt(this.createdAt),
            password: this.password,
            mapType: this.mapType,
            hostId: this.hostId,
            players: this.players.map((e) => e.toProto()),
            activePlayerIdx: this.activePlayerIdx,
            bank: this.bank.toProto(),
            progressCards: this.progressCards.map((e) => e.toProto()),
            tiles: this.tiles.map((e) => e.toProto()),
            nodes: this.nodes.map((e) => e.toProto()),
            edges: this.edges.map((e) => e.toProto()),
        });
    }

    static toProto(data: Game): pb.Game {
        return data.toProto();
    }
}
