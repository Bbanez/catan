uniform vec2 uCursor;
uniform vec2 uSize;
uniform vec2 uStepSize;
uniform vec2 uActiveCell;
uniform bool uHideActiveCell;
uniform bool uShowGrid;
uniform bool uShow;
uniform sampler2D uNavMap;
uniform vec2 uNavMapSize;
uniform float uCameraDistance;

varying vec2 vUv;
varying vec3 vPosition;
varying vec2 vMapUv;

#include <common>
#include "../common.glsl"
#include "../math.glsl"

vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
vec4 highlight = vec4(1.0, 0.0, 0.0, 0.5);

void main() {
    vec4 color = vec4(1, 1, 1, 0);
    vec4 nav_map = texture2D(uNavMap, vUv);

    if (uShow == false) {
        gl_FragColor = color;
        return;
    }
    vec2 activeCell = uActiveCell;
    activeCell.y = 1.0 - activeCell.y - uStepSize.y;
    if (uShowGrid) {
        vec2 center = vUv;
        vec2 cell = fract(center * uSize);
        cell = abs(cell - 0.5);
        // Adjusting the grid line thickness based on camera distance
        float lineThickness = remap(uCameraDistance, 3.0, 1500.0, 0.01, 2.5);
        float distToCell = 1.0 - 2.0 * max(cell.x, cell.y);
        float cellLine = smoothstep(lineThickness - 0.002, lineThickness + 0.002, distToCell);

        color.a = 1.0 - mix(0.0, 1.0, cellLine);
        if (
        uHideActiveCell == false &&
        vUv.x > activeCell.x &&
        vUv.x < activeCell.x + uStepSize.x &&
        vUv.y > activeCell.y &&
        vUv.y < activeCell.y + uStepSize.y
        ) {
            color.r = 0.5;
            color.g = 0.0;
            color.b = 1.0;
            color.a = 0.4;
        }
        else if (nav_map.r > 0.0) {
            color.a = 0.2;
            color.r = 1.0;
            color.g = 0.0;
            color.b = 0.0;
        }
    }
    float circle_trash_hold = 20.0 / uSize.x;
    float d = circle_distance_from_center_inverse(
        activeCell.x + uStepSize.x / 2.0,
        activeCell.y + uStepSize.y / 2.0,
        vUv.x,
        vUv.y,
        circle_trash_hold
    );
//    color = mix(color, vec4(0.0, 0.0, 0.0, 0.0), 1.0 - d);

    gl_FragColor = color;
}