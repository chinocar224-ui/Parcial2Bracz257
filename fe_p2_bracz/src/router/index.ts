import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/eventos',
    },
    {
      path: '/eventos',
      name: 'eventos',
      component: () => import('../views/EventosView.vue'),
    },
    {
      path: '/recintos',
      name: 'recintos',
      component: () => import('../views/RecintosView.vue'),
    },
  ],
})

export default router
