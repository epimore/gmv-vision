import { createRouter, createWebHistory } from 'vue-router'
import {qiankunWindow} from "vite-plugin-qiankun/es/helper";

export function createMyRouter() {
    return createRouter({
        history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/gb28181_app/' : '/'),
        routes: [
            {
                path: '/',
                component: () => import('@/views/Home.vue'),
            },
            {
                path: '/home',
                component: () => import('@/views/Home.vue'),
            },
            {
                path: '/about',
                component: () => import('@/views/About.vue'),
            },
        ],
    })
}
