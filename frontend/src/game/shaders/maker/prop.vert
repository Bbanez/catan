float uniforms_start;
uniform float u_time;
float uniforms_end;

float varying_start;
varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_norm;
float varying_end;

float include_start;
#include "../common"
float include_end;

void main() {
    float main_start;
    v_uv = uv;
    v_position = position;
    v_norm = normal;
    float main_end;
}