import {
    GameSchema,
    type Game as GameProto,
} from '@root/gen/proto_game/main_pb';
import { GameCreate, GameGet } from '@wails/game_api/Api';
import { Ipc } from '@root/ipc/main';
import { ref } from 'vue';
import {
    GameGetRequestSchema,
    type GameGetRequest,
} from '@root/gen/proto_game/api_pb';
import type { OmittedMessage } from '@root/types/omitted-message';
import { Game } from '@root/proto/game/main';

export class GameHandler {
    private calls = {
        create: Ipc.createCall<void, GameProto>(
            undefined,
            GameSchema,
            GameCreate,
        ),
        get: Ipc.createCall<GameGetRequest, GameProto>(
            GameGetRequestSchema,
            GameSchema,
            GameGet,
        ),
    };

    cache = ref<Game | undefined>();

    async create() {
        this.cache.value = Game.fromProto(await this.calls.create());
        return this.cache.value;
    }

    async get(data: OmittedMessage<GameGetRequest>) {
        this.cache.value = Game.fromProto(await this.calls.get(data));
        return this.cache.value;
    }
}
