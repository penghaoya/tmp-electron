/**
 * @type {import('vue-router').RouteRecordRaw[]}
 */
export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@renderer/views/Home/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@renderer/views/Login/index.vue')
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@renderer/views/Setting/index.vue')
  }
]
