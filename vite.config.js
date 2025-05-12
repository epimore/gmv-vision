import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from 'node:url'
import qiankun from 'vite-plugin-qiankun'

export default defineConfig({
    base: process.env.NODE_ENV === 'development' ? '/' : '/gb28181_app/',
    plugins: [
        vue(),
        qiankun('gb28181_app', {
            useDevMode: true, // 关键：开发模式支持
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 1573,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    build: {
        target: 'esnext',
        assetsDir: 'static',
        rollupOptions: {
            output: {
                format: 'umd',               // ✅ 必须是 umd
                name: 'gb28181_app',         // ✅ 必须指定子应用名称
                entryFileNames: 'static/js/[name]-[hash].js',
                chunkFileNames: 'static/js/[name]-[hash].js',
                assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
            },
        },
    },
})
