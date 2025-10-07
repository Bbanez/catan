import { type Texture, type Vector4 } from 'three';

export interface OutlineShaderUniforms {
    u_color: Vector4;
    u_show_outline: boolean;
    u_texture: Texture;
}
