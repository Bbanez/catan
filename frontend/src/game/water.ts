import fsh from '@root/game/shaders/water.frag';
import vsh from '@root/game/shaders/water.vert';
import {
    FrontSide,
    Mesh,
    PlaneGeometry,
    RepeatWrapping,
    type ShaderMaterial,
    Texture,
} from 'three';
import { ShaderManager } from '@root/game/shaders/manager';
import {
    callAndClearUnsubscribeFns,
    type UnsubscribeFns,
} from '@root/utils/sub';
import { PI12 } from '@root/utils/math';
import type { Ticker } from '@root/utils/ticker';
import { AssetLoader } from '@root/utils/asset-loader';

export class GameWater {
    shader = new ShaderManager<{
        normalTexture: Texture;
        uMillis: number;
    }>(
        vsh,
        fsh,
        {
            normalTexture: new Texture(),
            uMillis: 0,
        },
        {
            transparent: true,
        },
    );
    mesh: Mesh;

    private unsubs: UnsubscribeFns = [];

    constructor(
        width: number,
        depth: number,
        height: number,
        waterNormalTexture: Texture,
        private frameTicker: Ticker,
    ) {
        waterNormalTexture.wrapS = RepeatWrapping;
        waterNormalTexture.wrapT = RepeatWrapping;
        const plane = new PlaneGeometry(width, depth);
        plane.rotateX(-PI12);
        this.unsubs.push(
            this.frameTicker.subscribe((cTime) => {
                this.shader.setUniform('uMillis', cTime);
            }),
        );
        this.shader.setUniform('normalTexture', waterNormalTexture);
        this.mesh = new Mesh(plane, this.shader.material);
        (this.mesh.material as ShaderMaterial).side = FrontSide;
        this.mesh.receiveShadow = true;
        this.mesh.position.set(width / 2, height, depth / 2);
    }

    destroy() {
        callAndClearUnsubscribeFns(this.unsubs);
    }

    static async new(
        width: number,
        depth: number,
        height: number,
        frameTicker: Ticker,
    ) {
        AssetLoader.register({
            name: 'water-normals',
            path: [`/assets/game/water_normals.jpeg`],
            type: 'texture',
        });
        let waterNormalTexture: Texture = null as never;
        const loaderUnsub = AssetLoader.onLoaded(async (item, data) => {
            if (item.name === 'water-normals') {
                waterNormalTexture = data as Texture;
            }
        });
        await AssetLoader.run();
        loaderUnsub();
        return new GameWater(
            width,
            depth,
            height,
            waterNormalTexture,
            frameTicker,
        );
    }
}
