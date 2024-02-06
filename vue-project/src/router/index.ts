import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import RegisterView from '../views/RegisterView.vue'
import NotFound from '../components/NotFound.vue'
import { supabase } from '@/clients/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,

    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
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
  const localUser = await supabase.auth.getSession()
  if (localUser.data.session == null) {
    next('/unauthorized')
  } else {
    next()
  }
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    getUser(next)
  } else {
    next()
  }
})


export default router
