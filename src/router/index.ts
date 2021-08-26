import { createRouter, createWebHistory, RouteRecord, RouteRecordRaw } from 'vue-router';
const routes:Array<RouteRecordRaw> = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'home',
    component: () => import('../view/home/home.vue'),
    children: [
      { path: '/iry', name: 'iry', component: () => import('../view/home/landing/iry.vue') },
      { path: '/dosc', name: 'dosc', component: () => import('../view/home/dosc/dosc.vue') },
      { path: '/tool', name: 'tool', component: () => import('../view/home/tool/index.vue') },
  ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router