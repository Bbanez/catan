vec4 triplanar_mapping(sampler2D tex, vec3 pos, vec3 normal) {
    // Get the absolute value of the normal
    vec3 n = abs(normal);
    // Normalize the weights so they sum to 1
    n = n / (n.x + n.y + n.z);
    // Sample the texture from three directions
    vec4 x_axis = texture2D(tex, pos.yz);
    vec4 y_axis = texture2D(tex, pos.xz);
    vec4 z_axis = texture2D(tex, pos.xy);
    // Blend the results based on the normal
    return x_axis * n.x + y_axis * n.y + z_axis * n.z;
}

vec3 triplanar_normal_mapping(sampler2D normalMap, vec3 pos, vec3 normal) {
    // Get the absolute value of the normal
    vec3 blend = abs(normal);
    blend = normalize(max(blend, 0.00001)); // Avoid zero division
    // Sample normal maps for each axis
    vec3 normalX = texture2D(normalMap, pos.yz).rgb * 2.0 - 1.0;
    vec3 normalY = texture2D(normalMap, pos.xz).rgb * 2.0 - 1.0;
    vec3 normalZ = texture2D(normalMap, pos.xy).rgb * 2.0 - 1.0;
    // Swizzle normal maps to align with world space
    normalX = vec3(normalX.xy * vec2(1.0, -1.0), abs(normalX.z));
    normalY = vec3(normalY.xy * vec2(1.0, -1.0), abs(normalY.z));
    normalZ = vec3(normalZ.xy * vec2(1.0, -1.0), abs(normalZ.z));
    // Transform normals to align with their respective axes
    normalX = vec3(0.0, normalX.y, normalX.x);
    normalY = vec3(normalY.x, 0.0, normalY.y);
    normalZ = vec3(normalZ.xy, 0.0);
    // Blend the results
    vec3 worldNormal = normalize(
        normalX * blend.x +
        normalY * blend.y +
        normalZ * blend.z
    );
    return worldNormal;
}

vec4 load_surface_texture(
    sampler2D diffuse_texture,
    sampler2D normal_texture,
    vec3 v_pos,
    vec3 v_norm,
    float scale,
    float light_intensity,
    vec3 light_direction
) {
    vec4 tex = triplanar_mapping(diffuse_texture, v_pos * scale, v_norm);
    vec3 normal = triplanar_mapping(normal_texture, v_pos * scale, v_norm).xyz;
    normal = normal * 2.0 - 1.0;
    float light_value = max(dot(normal, normalize(light_direction)), 0.0) * light_intensity;
    return vec4(tex.rgb * (1.0 + 1.0 * light_value), tex.a);
}

