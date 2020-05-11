import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/player',
    name: 'Player',
    component: () => import('../views/player.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/songlist',
    name: 'songList',
    component: () => import('../views/songlist.vue'),
    meta: {
      keepAlive: true
    }
  }
];

const router = new VueRouter({
  routes,
});

export default router;
