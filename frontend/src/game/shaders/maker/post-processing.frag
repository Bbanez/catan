#include <common>
#include "../common.glsl"

uniform sampler2D tDiffuse;
uniform sampler2D tGrad;
uniform float uMillis;
uniform vec2 uMouse;
uniform vec2 uScreen;

varying vec2 vUv;

vec3 edgeDetection(sampler2D text, vec2 uv, vec2 texelSize) {
    float Gx[9] = float[9](
    -1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0
    );
    float Gy[9] = float[9](
    -1.0, -2.0, -1.0,
    0.0, 0.0, 0.0,
    1.0, 2.0, 1.0
    );
    float edgeX = 0.0;
    float edgeY = 0.0;
    int index = 0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y)) * texelSize;
            vec3 samp = texture2D(text, uv + offset).rgb;
            float luminance = dot(samp, vec3(0.299, 0.587, 0.114)); // Calculate grayscale
            edgeX += Gx[index] * luminance;
            edgeY += Gy[index] * luminance;
            index++;
        }
    }
    float edgeValue = length(vec2(edgeX, edgeY));
    return vec3(edgeValue);
}

void main() {
    vec4 texel = texture2D(tDiffuse, vUv);
    vec3 color = texel.rgb;
    gl_FragColor = texel;

//    vec3 edgeColor = edgeDetection(tDiffuse, vUv, 1.0 / uScreen);
//    float edgeAlpha = 1.0 - step(edgeColor.r, 0.1);
//    float edgeValue = 1.0 - edgeAlpha;
//    vec4 ec = vec4(vec3(edgeValue), edgeAlpha);
//    gl_FragColor = mix(texel, ec, edgeAlpha);
}
