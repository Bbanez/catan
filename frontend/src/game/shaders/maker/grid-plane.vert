#include <common>
#include "../common"

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vMapUv;

uniform vec2 uSize;


void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    vec4 nPostition = projectionMatrix * modelViewMatrix * vec4(position, 1);
    vMapUv = vec2(
        remap(vPosition.x, 0.0, uSize.x, 0.0, 1.0),
        remap(vPosition.z, 0.0, uSize.y, 0.0, 1.0)
    );
    gl_Position = nPostition;
}