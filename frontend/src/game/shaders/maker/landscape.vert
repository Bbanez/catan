float uniforms_start;
uniform vec2 u_map_size;
float uniforms_end;

float varying_start;
attribute vec4 tangent;

varying vec2 v_uv;
varying vec2 v_map_uv;
varying vec3 v_pos_transformed;
varying vec3 v_pos;
varying vec3 v_view_pos;
varying vec3 v_norm;
float varying_end;

float include_start;
#include "../common.glsl"
float include_end;

void main() {
    float main_start;
    v_pos = position;
    v_pos_transformed = (modelMatrix * vec4(position, 1.0)).xyz;
    v_norm = (modelMatrix * vec4(normal, 0.0)).xyz;
//    v_norm = normalize(normalMatrix * normal);

    v_uv = uv;

    v_map_uv = vec2(
    remap(v_pos_transformed.x, 0.0, u_map_size.x, 0.0, 1.0),
    remap(v_pos_transformed.z, 0.0, u_map_size.y, 0.0, 1.0)
    );

    vec4 pos = vec4(v_pos, 1.0);
    vec4 mpos = modelViewMatrix * pos;
    v_view_pos = -mpos.xyz;
    float main_end;
}