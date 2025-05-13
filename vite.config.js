import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import qiankun from 'vite-plugin-qiankun'

const packageName = require('./package.json').name
const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
    base: isProd ? '/' : '/',
    plugins: [
        vue(),
        qiankun(packageName, {
            useDevMode: true,
        }),],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        host: 'localhost',
        port: 1573,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        proxy: {
            '/api/pics': {
                target: 'https://epimore.cn',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api\/pics/, '/api/pics'),
            },
            '/api/videos': {
                target: 'https://epimore.cn',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api\/videos/, '/api/videos'),
            },
            '/epimore-gmv': {
                target: 'http://127.0.0.1:38888',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/epimore-gmv/, ''),
                ws: true,
            },
            '/test_1': {
                target: 'https://epimore.cn',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/test_1/, '')
            }
        }
    },
    build: {
        outDir: `../dist/${packageName}`,
        assetsDir: 'static',
        target: 'esnext',
        rollupOptions: {
            output: {
                format: 'umd',
                name: `${packageName}-[name]`,
                entryFileNames: `static/js/[name]-[hash].js`,
                chunkFileNames: `static/js/[name]-[hash].js`,
                assetFileNames: `static/[ext]/[name]-[hash].[ext]`,
            },
        },
    },
})
