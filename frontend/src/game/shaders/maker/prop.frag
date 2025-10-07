float uniforms_start;
uniform vec4 u_color;
uniform sampler2D u_texture; // Model texture from GLTF modal (cannot change name)
uniform bool u_show_outline;
float uniforms_end;

float varying_start;
varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_norm;
float varying_end;

float include_start;
#include "../common.glsl"
float include_end;

void main() {
    float main_start;
//        diffuseColor = texture2D(u_texture, v_uv);
//    diffuseColor = vec4(0.0, 1.0, 0.0, 1.0);
//    diffuseColor = vec4(v_norm.x, 0.0, 0.0, 1.0);
    diffuseColor = vec4(v_uv, 0.0, 1.0);
    //    diffuseColor = u_color;
    float main_end;
    float main_final_start;
    if (u_show_outline) {
        gl_FragColor = vec4(v_uv, 0.0, 1.0);
    }
//    if (u_show_outline) {
////        //        vec3 normal = normalize(v_norm);
////        //        vec3 view_dir = normalize(-v_position);
////        //        float fresnel = 1.0 - max(dot(normal, view_dir), 0.0);
////        //        float outline = smoothstep(1.0 - 0.5, 1.0, fresnel);
////        //        outline *= 1.0;
////        ////        gl_FragColor = diffuseColor;
////        //        gl_FragColor = mix(diffuseColor, u_color, outline);
////        // Calculate the normal in view space
//        float u_outline_width = 0.5;
//        float u_outline_strength = 1.0;
//        vec3 normal = normalize(v_norm);
//
//        // Calculate fresnel effect for edge detection
//        vec3 view_dir = normalize(-v_position);
//        float fresnel = 1.0 - max(dot(normal, view_dir), 0.0);
//
//        // Create smooth outline
//        float outline = smoothstep(1.0 - u_outline_width, 1.0, fresnel);
//        outline *= u_outline_strength;
//
//        // Mix original color with outline
//        vec4 outlineColor = u_color;
//        gl_FragColor = mix(diffuseColor, outlineColor, 0.1);
//    }
    float main_final_end;
}