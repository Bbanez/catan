import {
    ShaderMaterial,
    type ShaderMaterialParameters,
    UniformsLib,
    UniformsUtils,
} from 'three';
import type { IUniform } from 'three/src/renderers/shaders/UniformsLib';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { StringUtility } from '@root/utils/string-utility';

import standardMaterialFrag from '@root/game/shaders/materials/standard.frag';
import standardMaterialVert from '@root/game/shaders/materials/standard.vert';

export interface ShaderUniforms {
    [uniform: string]: IUniform;
}

export class ShaderPrecompiled {
    static readonly standard = {
        fragmentShader: standardMaterialFrag,
        vertexShader: standardMaterialVert,
    };

    // static async precompile() {
    //     const result = await this.precompile_shader([
    //         {
    //             id: 'standard',
    //             mesh: new Mesh(
    //                 new BoxGeometry(1, 1, 1),
    //                 new MeshStandardMaterial(),
    //             ),
    //         },
    //     ]);
    //     for (let i = 0; i < result.length; i++) {
    //         const item = result[i];
    //         if (item.id === 'standard') {
    //             this.standard = item.shader;
    //         }
    //     }
    // }

    // private static async precompile_shader(
    //     items: Array<{
    //         mesh: Mesh;
    //         id: string;
    //     }>,
    // ): Promise<
    //     Array<{
    //         id: string;
    //         shader: WebGLProgramParametersWithUniforms;
    //     }>
    // > {
    //     const scene = new Scene();
    //     const camera = new PerspectiveCamera(
    //         75,
    //         window.innerWidth / window.innerHeight,
    //         0.1,
    //         1000,
    //     );
    //     camera.position.z = 5;
    //     const renderer = new WebGLRenderer();
    //     document.body.appendChild(renderer.domElement);
    //     renderer.setSize(window.innerWidth, window.innerHeight);
    //     let resolve = () => {};
    //     const done: Array<{
    //         id: string;
    //         shader: WebGLProgramParametersWithUniforms;
    //     }> = [];
    //     for (let i = 0; i < items.length; i++) {
    //         const item = items[i];
    //         scene.add(item.mesh);
    //         (item.mesh.material as Material).onBeforeCompile = (shader) => {
    //             done.push({
    //                 id: item.id,
    //                 shader,
    //             });
    //             if (done.length === items.length) {
    //                 resolve();
    //             }
    //         };
    //     }
    //     await new Promise<void>((r) => {
    //         resolve = r;
    //         renderer.compile(scene, camera);
    //     });
    //     document.body.removeChild(renderer.domElement);
    //     renderer.dispose();
    //     return done;
    // }
}

export class ShaderManager<Uniforms = unknown> {
    material: ShaderMaterial;

    constructor(
        public vert: string,
        public frag: string,
        uniforms?: Uniforms,
        options?: Omit<
            ShaderMaterialParameters,
            'uniforms' | 'fragmentShader' | 'vertexShader'
        >,
    ) {
        const shaderUniforms: ShaderUniforms = {};
        if (uniforms) {
            for (const uniformsKey in uniforms) {
                shaderUniforms[uniformsKey] = {
                    value: uniforms[uniformsKey],
                };
            }
        }
        if (!options) {
            options = {};
        }
        this.material = new ShaderMaterial({
            uniforms: UniformsUtils.merge([
                UniformsLib.lights,
                UniformsLib.fog,
                shaderUniforms,
            ]),
            fragmentShader: frag,
            vertexShader: vert,
            ...options,
            fog: true,
        });
    }

    setUniform(key: keyof Uniforms, value: Uniforms[keyof Uniforms]) {
        const _key = key as never;
        if (!this.material.uniforms[_key]) {
            return;
        } else {
            this.material.uniforms[_key].value = value;
        }
    }

    getUniform<Key extends keyof Uniforms>(
        key: Key,
    ): Uniforms[Key] | undefined {
        const _key = key as never;
        if (!this.material.uniforms[_key]) {
            return undefined;
        }
        return this.material.uniforms[_key].value;
    }

    static fromStandardMaterial<SUniforms = unknown>(
        frag: string,
        vert: string,
        uniforms?: SUniforms,
        options?: Omit<
            ShaderMaterialParameters,
            'uniforms' | 'fragmentShader' | 'vertexShader'
        >,
    ): ShaderManager<SUniforms> {
        interface InjectData {
            fn: string;
            uniforms: string;
            varying: string;
            main: string;
            main_final: string;
            include: string;
            frag_total: string;
        }
        function getInjections(shader: string) {
            const injections: InjectData = {
                fn: StringUtility.textBetween(
                    shader,
                    'float fn_start;',
                    'float fn_end;',
                ),
                main: StringUtility.textBetween(
                    shader,
                    'float main_start;',
                    'float main_end;',
                ),
                frag_total: StringUtility.textBetween(
                    shader,
                    'float frag_total_start;',
                    'float frag_total_end;',
                ),
                main_final: StringUtility.textBetween(
                    shader,
                    'float main_final_start;',
                    'float main_final_end;',
                ),
                include: StringUtility.textBetween(
                    shader,
                    'float include_start;',
                    'float include_end;',
                ),
                varying: StringUtility.textBetween(
                    shader,
                    'float varying_start;',
                    'float varying_end;',
                ),
                uniforms: StringUtility.textBetween(
                    shader,
                    'float uniforms_start;',
                    'float uniforms_end;',
                ),
            };
            return injections;
        }
        const fragInjections = getInjections(frag);
        const fragShader = ShaderPrecompiled.standard.fragmentShader
            .replace(
                'void main() {\n',
                `${fragInjections.include}\n${fragInjections.uniforms}\n${fragInjections.varying}\n${fragInjections.fn}\nvoid main() {\n`,
            )
            .replace(
                'vec3 totalEmissiveRadiance = emissive;',
                `vec3 totalEmissiveRadiance = emissive;\n${fragInjections.main}`,
            )
            .replace(
                '#include <dithering_fragment>',
                `#include <dithering_fragment>\n${fragInjections.main_final}`,
            )
            .replace(
                '#include <transmission_fragment>',
                `${fragInjections.frag_total}\n#include <transmission_fragment>`,
            );
        const vertInjections = getInjections(vert);
        const vertShader = ShaderPrecompiled.standard.vertexShader
            .replace(
                'void main() {\n',
                `${vertInjections.include}\n${vertInjections.uniforms}\n${vertInjections.varying}\n${vertInjections.fn}\nvoid main() {\n`,
            )
            .replace(
                '#include <fog_vertex>',
                `#include <fog_vertex>\n${vertInjections.main}`,
            );
        return new ShaderManager<SUniforms>(
            vertShader,
            fragShader,
            uniforms,
            options,
        );
    }
}

export class ShaderPassManager<Uniforms = unknown> {
    shader: ShaderPass;

    constructor(
        public vert: string,
        public frag: string,
        uniforms?: Uniforms,
    ) {
        const shaderUniforms: ShaderUniforms = {};
        if (uniforms) {
            for (const uniformsKey in uniforms) {
                shaderUniforms[uniformsKey] = {
                    value: uniforms[uniformsKey],
                };
            }
        }
        this.shader = new ShaderPass({
            uniforms: UniformsUtils.merge([UniformsLib.lights, shaderUniforms]),
            fragmentShader: frag,
            vertexShader: vert,
        });
    }

    setUniform(key: keyof Uniforms, value: Uniforms[keyof Uniforms]) {
        const _key = key as never;
        if (!this.shader.uniforms[_key]) {
            this.shader.uniforms[_key] = { value: value };
        } else {
            this.shader.uniforms[_key].value = value;
        }
    }
}
