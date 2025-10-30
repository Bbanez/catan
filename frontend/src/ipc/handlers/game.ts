import { GameSchema, type Game } from '@root/gen/proto_game/main_pb';
import { GameCreate } from '@wails/game_api/Api';
import { Ipc } from '@root/ipc/main';
import { ref } from 'vue';

export class GameHandler {
    private calls = {
        create: Ipc.createCall<void, Game>(undefined, GameSchema, GameCreate),
    };

    cache = ref<Game | undefined>();

    async create() {
        this.cache.value = await this.calls.create();
        return this.cache.value;
    }
}
