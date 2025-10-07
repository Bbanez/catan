import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import glsl from 'vite-plugin-glsl';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        glsl(),
        svgLoader({
            defaultImport: 'component',
        }),
    ],
    resolve: {
        alias: {
            '@root': fileURLToPath(new URL('./src', import.meta.url)),
            '@icons': fileURLToPath(
                new URL('./src/assets/icons', import.meta.url),
            ),
            '@proto': fileURLToPath(new URL('./src/gen', import.meta.url)),
            '@wails': fileURLToPath(new URL('./wailsjs/go', import.meta.url)),
        },
    },
});
