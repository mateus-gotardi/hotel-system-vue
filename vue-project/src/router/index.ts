import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterHotelView from '../views/RegisterHotelView.vue'
import NotFound from '../components/NotFound.vue'
import ReservaView from '@/views/ReservaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/registrarHotel',
      name: 'register',
      component: RegisterHotelView,

    },
    {
      path: '/reservas',
      name: 'reservas',
      component: ReservaView
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('../views/ProtectedView.vue')

    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ]
})

async function getUser(next: any) {
  next()
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    getUser(next)
  } else {
    next()
  }
})


export default router
