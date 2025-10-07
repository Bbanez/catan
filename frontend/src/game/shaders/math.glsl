bool is_point_inside_circle(float cx, float cy, float px, float py, float r) {
    float x = px - cx;
    float y = py - cy;
    float d = x * x + y * y;
    float r2 = r * r;
    if (d > r2) {
        return false;
    }
    return true;
}

bool is_point_inside_circle(vec3 c, vec2 p) {
    float x = p.x - c.x;
    float y = p.y - c.y;
    float d = x * x + y * y;
    float r2 = c.z * c.z;
    if (d > r2) {
        return false;
    }
    return true;
}

float circle_distance_from_center(float cx, float cy, float px, float py, float r) {
    float x = px - cx;
    float y = py - cy;
    float d = x * x + y * y;
    float r2 = r * r;
    if (d > r2) {
        return 1.0;
    }
    return remap(r2 - d, 0.0, r2, 0.0, 1.0);
}

float circle_distance_from_center(vec3 c, vec2 p) {
    float x = p.x - c.x;
    float y = p.y - c.y;
    float d = x * x + y * y;
    float r2 = c.z * c.z;
    if (d > r2) {
        return 1.0;
    }
    return remap(r2 - d, 0.0, r2, 0.0, 1.0);
}

float circle_distance_from_center_inverse(float cx, float cy, float px, float py, float r) {
    float x = px - cx;
    float y = py - cy;
    float d = x * x + y * y;
    float r2 = r * r;
    if (d > r2) {
        return 0.0;
    }
    return remap(r2 - d, 0.0, r2, 0.0, 1.0);
}

float circle_distance_from_center_inverse(vec3 c, vec2 p) {
    float x = p.x - c.x;
    float y = p.y - c.y;
    float d = x * x + y * y;
    float r2 = c.z * c.z;
    if (d > r2) {
        return 0.0;
    }
    return remap(r2 - d, 0.0, r2, 1.0, 0.0);
}