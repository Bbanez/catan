float uniforms_start;
uniform bool u_use_gray_levels;
uniform vec2 u_map_size;
uniform float u_active_level;
uniform vec3 u_tower_attack_area;
uniform float u_time;


uniform sampler2D u_floor_1_texture;
uniform sampler2D u_floor_1_normal_texture;
uniform sampler2D u_wall_1_texture;
uniform sampler2D u_wall_1_normal_texture;

uniform vec3 u_light_direction;
uniform float u_light_intensity;
float uniforms_end;

float varying_start;
varying vec2 v_uv;
varying vec2 v_map_uv;
varying vec3 v_pos_transformed;
varying vec3 v_pos;
varying vec3 v_view_pos;
varying vec3 v_norm;
float varying_end;

float include_start;
#include "../common.glsl"
#include "../math.glsl"
#include "../textures.glsl"
float include_end;

float fn_start;
vec4 render_tower_attack_area(vec4 color) {
    if (u_tower_attack_area.z <= 0.0) {
        return color;
    }
    vec2 t_pos = vec2(
        u_tower_attack_area.x / u_map_size.x , 
        u_tower_attack_area.y / u_map_size.y
    ); 
    float att_radius = u_tower_attack_area.z / u_map_size.x;
    float d = circle_distance_from_center(vec3(t_pos, att_radius), v_map_uv);
    float d2 = circle_distance_from_center(
        t_pos.x,
        t_pos.y,
        v_map_uv.x,
        v_map_uv.y,
        att_radius * sawtooth(u_time / 30.0, 4.0)
    );
    vec4 c1 = vec4(1.0, 0.1, 0.1, 1.0);
    vec4 c2 = c1;
    float f1 = smoothstep(0.008, 0.02, d);
    float f2 = smoothstep(0.01, 0.08, d2);
    c2 = mix(vec4(1.0, 1.0, 1.0, 1.0), c2, d2);
    color = mix(c1, color, f1);
    color = mix(c2, color, f2);
    return color;
}

vec4 landscape_color() {
    if (u_use_gray_levels && v_pos.y < u_active_level) {
        float gray = 0.5;
        return vec4(gray, gray, gray, 1.0);
    }
    vec4 color = vec4(1.0);
    if (v_norm.y > 0.85) {
        color = load_surface_texture(
            u_floor_1_texture,
            u_floor_1_normal_texture,
            v_pos,
            v_norm,
            0.2,
            u_light_intensity,
            vec3(1.0, 1.0, 0.4)
        );
    } else {
        color = load_surface_texture(
            u_wall_1_texture,
            u_wall_1_normal_texture,
            v_pos,
            v_norm,
            0.5,
            u_light_intensity,
            vec3(1.0, 1.0, 0.4)
        );
    }
    color = render_tower_attack_area(color);
    return color;
}
float fn_end;

void main() {
    float main_start;
    diffuseColor = landscape_color();
    float main_end;
    float main_final_start;
    float main_final_end;
    float frag_total_start;
    totalSpecular = vec3(0.0);
    //    totalSpecular = reflectedLight.directSpecular * 0.1 + reflectedLight.indirectSpecular * 0.1;
    float frag_total_end;
}
