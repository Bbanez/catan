import {
    SettingsSchema,
    SettingsSetSchema,
    type Settings,
    type SettingsSet,
} from '@root/gen/proto_settings/main_pb';
import { Ipc } from '@root/ipc/main';
import type { OmittedMessage } from '@root/types/omitted-message';
import {
    SettingsGet,
    SettingsSet as SettingsSetFn,
} from '@wails/settings_api/Api';
import { ref } from 'vue';

export class SettingsHandler {
    private calls = {
        get: Ipc.createCall<SettingsSet, Settings>(
            SettingsSetSchema,
            SettingsSchema,
            SettingsGet,
        ),
        set: Ipc.createCall<SettingsSet, Settings>(
            SettingsSetSchema,
            SettingsSchema,
            SettingsSetFn,
        ),
    };

    cache = ref<Settings>(null as never);

    async get() {
        if (this.cache.value) {
            return this.cache.value;
        }
        this.cache.value = await this.calls.get({
            renderWidth: window.innerWidth,
            useServer: false,
        });
        return this.cache.value;
    }

    async set(data: OmittedMessage<SettingsSet>) {
        this.cache.value = await this.calls.set(data);
        return this.cache.value;
    }
}
