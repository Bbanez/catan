import Axios from 'axios';
import {
    TextureLoader,
    type CubeTexture,
    type Group,
    type Texture,
    CubeTextureLoader,
    AudioLoader,
} from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { createId } from '@paralleldrive/cuid2';

export interface AssetLoaderCallbackData {
    type: 'progress' | 'started' | 'done';
    loadedItemsCount: number;
    items: Array<string | string[]>;
    item?: {
        progress: number;
        name: string;
        path: string | string[];
    };
}

export interface AssetLoaderCallback {
    (data: AssetLoaderCallbackData): void;
}

export interface AssetLoaderItem {
    path: string | string[];
    name: string;
    type: 'string' | 'fbx' | 'gltf' | 'texture' | 'cubeTexture' | 'audio';
}

export type AssetLoaderOnLoadedData =
    | Group
    | GLTF
    | Texture
    | CubeTexture
    | AudioBuffer
    | string;

export interface AssetLoaderOnLoadedCallback {
    (item: AssetLoaderItem, data: AssetLoaderOnLoadedData): Promise<void>;
}

export class AssetLoader {
    private static subs: Array<{
        id: string;
        cb: AssetLoaderCallback;
    }> = [];
    private static on_loaded_subs: Array<{
        id: string;
        cb: AssetLoaderOnLoadedCallback;
    }> = [];
    private static fbxLoader = new FBXLoader();
    private static gltfLoader = new GLTFLoader();
    private static textureLoader = new TextureLoader();
    private static cubeTextureLoader = new CubeTextureLoader();
    private static audioLoader = new AudioLoader();
    private static items: AssetLoaderItem[] = [];
    private static loadedItemsCount = 0;

    private static async trigger(type: 'started' | 'done') {
        for (let i = 0; i < this.subs.length; i++) {
            const sub = this.subs[i];
            sub.cb({
                items: this.items.map((e) => e.path),
                type,
                loadedItemsCount: this.loadedItemsCount,
            });
        }
    }

    private static async triggerProgress(
        item: AssetLoaderItem,
        progress: number,
    ) {
        for (let i = 0; i < this.subs.length; i++) {
            const sub = this.subs[i];
            sub.cb({
                items: this.items.map((e) => e.path),
                type: 'progress',
                loadedItemsCount: this.loadedItemsCount,
                item: {
                    path: item.path,
                    name: item.name,
                    progress,
                },
            });
        }
    }

    private static async triggerOnLoaded(
        item: AssetLoaderItem,
        data: AssetLoaderOnLoadedData,
    ) {
        for (let i = 0; i < this.on_loaded_subs.length; i++) {
            const sub = this.on_loaded_subs[i];
            await sub.cb(item, data);
        }
    }

    private static async loadAudio(
        item: AssetLoaderItem,
    ): Promise<AudioBuffer> {
        await this.triggerProgress(item, 0);
        return new Promise<AudioBuffer>((resolve, reject) => {
            this.audioLoader.load(
                item.path as string,
                async (buffer) => {
                    await this.triggerProgress(item, 100);
                    resolve(buffer);
                },
                async (progress) => {
                    await this.triggerProgress(
                        item,
                        (progress.loaded / progress.total) * 100,
                    );
                },
                async (err) => {
                    await this.triggerProgress(item, 100);
                    console.error(item);
                    reject(err);
                },
            );
        });
    }

    private static async loadFbx(item: AssetLoaderItem): Promise<Group> {
        await this.triggerProgress(item, 0);
        return new Promise<Group>((resolve, reject) => {
            this.fbxLoader.load(
                item.path as string,
                async (fbx) => {
                    await this.triggerProgress(item, 100);
                    resolve(fbx);
                },
                async (progress) => {
                    await this.triggerProgress(
                        item,
                        (progress.loaded / progress.total) * 100,
                    );
                },
                async (err) => {
                    await this.triggerProgress(item, 100);
                    reject(err);
                },
            );
        });
    }

    private static async loadGltf(item: AssetLoaderItem): Promise<GLTF> {
        await this.triggerProgress(item, 0);
        return new Promise<GLTF>((resolve, reject) => {
            this.gltfLoader.load(
                item.path as string,
                async (gltf) => {
                    await this.triggerProgress(item, 100);
                    resolve(gltf);
                },
                async (progress) => {
                    await this.triggerProgress(
                        item,
                        (progress.loaded / progress.total) * 100,
                    );
                },
                async (err) => {
                    await this.triggerProgress(item, 100);
                    console.error('Error:', item);
                    reject(err);
                },
            );
        });
    }

    private static async loadTexture(item: AssetLoaderItem): Promise<Texture> {
        await this.triggerProgress(item, 0);
        return new Promise<Texture>((resolve, reject) => {
            this.textureLoader.load(
                item.path as string,
                async (texture) => {
                    await this.triggerProgress(item, 100);
                    resolve(texture);
                },
                async (progress) => {
                    await this.triggerProgress(
                        item,
                        (progress.loaded / progress.total) * 100,
                    );
                },
                async (err) => {
                    await this.triggerProgress(item, 100);
                    reject(err);
                },
            );
        });
    }

    private static async loadCubeTexture(
        item: AssetLoaderItem,
    ): Promise<CubeTexture> {
        await this.triggerProgress(item, 0);
        return new Promise<CubeTexture>((resolve, reject) => {
            this.cubeTextureLoader.load(
                item.path as string[],
                async (texture) => {
                    await this.triggerProgress(item, 100);
                    resolve(texture);
                },
                async (progress) => {
                    await this.triggerProgress(
                        item,
                        (progress.loaded / progress.total) * 100,
                    );
                },
                async (err) => {
                    await this.triggerProgress(item, 100);
                    reject(err);
                },
            );
        });
    }

    private static async loadString(item: AssetLoaderItem): Promise<string> {
        await this.triggerProgress(item, 0);
        const result = await Axios({
            url: item.path as string,
            method: 'get',
            onDownloadProgress: (progress) => {
                if (progress.total) {
                    this.triggerProgress(
                        item,
                        (progress.loaded / progress.total) * 100,
                    );
                }
            },
        });
        return result.data;
    }

    static subscribe(callback: AssetLoaderCallback): () => void {
        const id = createId();
        this.subs.push({
            id,
            cb: callback,
        });
        return () => {
            for (let i = 0; i < this.subs.length; i++) {
                const sub = this.subs[i];
                if (sub.id === id) {
                    this.subs.splice(i, 1);
                }
            }
        };
    }

    static async loadItem(
        item: AssetLoaderItem,
    ): Promise<AssetLoaderOnLoadedData> {
        this.register(item);
        let result: AssetLoaderOnLoadedData = null as never;
        const unsub = this.onLoaded(async (itm, data) => {
            if (itm.name === item.name) {
                result = data;
            }
        });
        try {
            await this.run();
            unsub();
        } catch (error) {
            unsub();
            throw error;
        }
        return result;
    }

    static register(...items: Array<AssetLoaderItem | undefined | null>): void {
        for (let i = 0; i < items.length; i++) {
            if (!items[i]) {
                continue;
            }
            const k = items[i];
            this.items.push(k as AssetLoaderItem);
        }
    }

    static onLoaded(callback: AssetLoaderOnLoadedCallback): () => void {
        const id = createId();
        this.on_loaded_subs.push({
            id,
            cb: callback,
        });
        return () => {
            for (let i = 0; i < this.on_loaded_subs.length; i++) {
                const sub = this.on_loaded_subs[i];
                if (sub.id === id) {
                    this.on_loaded_subs.splice(i, 1);
                }
            }
        };
    }

    static async run(): Promise<void> {
        try {
            this.loadedItemsCount = 0;
            await this.trigger('started');
            let loop = true;
            while (loop) {
                const item = this.items.pop();
                if (!item) {
                    loop = false;
                } else {
                    switch (item.type) {
                        case 'fbx':
                            {
                                await this.triggerOnLoaded(
                                    item,
                                    await this.loadFbx(item),
                                );
                            }
                            break;
                        case 'gltf':
                            {
                                await this.triggerOnLoaded(
                                    item,
                                    await this.loadGltf(item),
                                );
                            }
                            break;
                        case 'texture':
                            {
                                await this.triggerOnLoaded(
                                    item,
                                    await this.loadTexture(item),
                                );
                            }
                            break;
                        case 'cubeTexture':
                            {
                                await this.triggerOnLoaded(
                                    item,
                                    await this.loadCubeTexture(item),
                                );
                            }
                            break;
                        case 'string':
                            {
                                await this.triggerOnLoaded(
                                    item,
                                    await this.loadString(item),
                                );
                            }
                            break;
                        case 'audio':
                            {
                                await this.triggerOnLoaded(
                                    item,
                                    await this.loadAudio(item),
                                );
                            }
                            break;
                    }
                    this.loadedItemsCount++;
                }
            }
            await this.trigger('done');
        } catch (error) {
            await this.trigger('done');
            throw error;
        }
    }

    static destroy() {
        for (const id in this.subs) {
            delete this.subs[id];
        }
        for (const id in this.on_loaded_subs) {
            delete this.on_loaded_subs[id];
        }
    }
}
