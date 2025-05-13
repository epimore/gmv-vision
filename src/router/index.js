import {createRouter, createWebHistory} from 'vue-router'
import {qiankunWindow} from "vite-plugin-qiankun/es/helper";

export function createMyRouter() {
    return createRouter({
        history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/gb28181_app/' : '/'),
        routes: [
            {
                path: '/',
                redirect: '/home',
            },
            {
                path: "/home",
                name: "home",
                component: () => import("@/views/home/Index.vue"),
            },
            {
                path: "/enrolls",
                name: "enrolls",
                component: () => import("@/views/enrolls/Infos.vue"),
            },
            {
                path: "/info",
                name: "info",
                component: () => import("@/views/info/Index.vue"),
            },
        ],
    })
}
