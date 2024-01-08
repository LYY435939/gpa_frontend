import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: "/login",
    },
    {
        path: '/login',
        name: 'Index',
        component: () => import('@/views/IndexView.vue'),
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import('@/views/MainView.vue'),
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/views/AdminView.vue'),
    },
    {
        path: '/userinfo/:username',
        name: 'UserInfo',
        component: () => import('@/views/UserScoreView.vue'),
    },
    {
        path: '/:path(.*)',
        name: '404',
        component: () => import('@/views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router;