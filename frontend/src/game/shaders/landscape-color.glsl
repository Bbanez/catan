vec4 landscape_color(
    bool use_gray_levels,
    float active_level,
    vec3 v_pos,
    vec3 v_normal,
    vec3 map_size,
    sampler2D u_noise_texture,
    sampler2D u_grass_texture,
    vec3 grass_color,
    vec3 cliff_color,
    vec3 sand_color,
    vec3 snow_color
) {
    if (use_gray_levels && v_pos.y < active_level) {
        float gray = 0.5;
        return vec4(gray, gray, gray, 1.0);
    }
    vec2 grass_noise_uvs = vec2(
    remap(v_pos.x, 0.0, map_size.x, 0.0, 1.0),
    remap(v_pos.z, 0.0, map_size.z, 0.0, 1.0)
    ) * 1.0 + v_pos.y / 2.0;
    vec2 sand_noise_uvs = vec2(
    remap(v_pos.x, 0.0, map_size.x, 0.0, 1.0),
    remap(v_pos.z, 0.0, map_size.z, 0.0, 1.0)
    ) * 200.0;
    vec2 cliff_noise_uvs = vec2(
    remap(v_pos.x, 0.0, map_size.x, 0.0, 1.0),
    remap(v_pos.z, 0.0, map_size.z, 0.0, 1.0)
    ) * 200.0;

    vec4 sand_noise_texture = texture2D(u_noise_texture, sand_noise_uvs);
    float sand_noise = remap(sand_noise_texture.r, 0.0, 1.0, 0.2, 1.0);
    vec3 total_sand_color = sand_color * sand_noise;
    vec4 cliff_noise_texture = texture2D(u_noise_texture, cliff_noise_uvs);
    float cliff_noise = remap(cliff_noise_texture.r, 0.0, 1.0, 0.5, 1.0);
    vec3 total_cliff_color = cliff_color * cliff_noise;
    vec4 grass_noise_texture = texture2D(u_noise_texture, grass_noise_uvs);
    float grass_noise = remap(grass_noise_texture.r, 0.0, 1.0, 0.1, 0.5);
    vec2 grass_uvs = vec2(
    remap(v_pos.x, 0.0, map_size.x, 0.0, 1.0),
    remap(v_pos.z, 0.0, map_size.z, 0.0, 1.0)
    ) * 40.0 + v_pos.y / 2.0;
    vec4 grass_texture = texture2D(u_grass_texture, grass_uvs);
    float grass_texture_color = remap(
        (grass_texture.r + grass_texture.g + grass_texture.b) / 3.0,
        0.0, 1.0,
        0.3, 1.0
    );
    vec3 total_grass_color = vec3(
    grass_color.r,
    grass_color.g * grass_noise,
    grass_color.b * grass_noise
    );
    total_grass_color *= vec3(grass_texture_color);

    vec3 total_snow_color = snow_color;

    vec3 normal = normalize(v_normal);
    float top_normal = normal.y;

    vec3 color = vec3(0.0);

    float grass_multi = smoothstep(0.3, 0.9, top_normal);
    float cliff_multi = 1.0 - grass_multi;
    float snow_multi = smoothstep(7.0, 10.0, v_pos.y);
    float sand_multi = 1.0 - smoothstep(0.0, 0.9, v_pos.y);
    color = grass_color * grass_multi
    + cliff_color * cliff_multi
    + snow_color * snow_multi
    + sand_color * sand_multi;

    vec4 output_color = vec4(color, 1.0);

    return output_color;
}

vec4 landscape_draw_tower_attack_circle(vec4 in_color, vec3 tower_attack_area, vec2 map_uv, float time) {
    vec4 color = in_color;
    float d = circle_distance_from_center(tower_attack_area, map_uv);
    float d2 = circle_distance_from_center(
        tower_attack_area.x,
        tower_attack_area.y,
        map_uv.x,
        map_uv.y,
        tower_attack_area.z * sawtooth(time / 30.0, 4.0)
    );
    vec4 c1 = vec4(1.0, 0.1, 0.1, 1.0);
    vec4 c2 = c1;

    float f1 = smoothstep(0.001, 0.008, d);
    float f2 = smoothstep(0.001, 0.01, d2);
    c2 = mix(vec4(1.0, 1.0, 1.0, 1.0), c2, d2);
    color = mix(c1, color, f1);
    color = mix(c2, color, f2);
    return color;
}
