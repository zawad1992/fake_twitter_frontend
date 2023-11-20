import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginRegistrationView from '../views/LoginRegistrationView.vue'
import { checkAuthentication } from '../api';


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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: LoginRegistrationView
    },
    {
      path: '/register',
      name: 'register',
      component: LoginRegistrationView 
    }
  ]
})


router.beforeEach(async (to, from, next) => {
  // List of paths that don't require authentication
  const openPaths = ['/login', '/register'];

  if (openPaths.includes(to.path)) {
    next(); // Skip the auth check for open paths
    return;
  }

  try {
    // Assuming checkAuthentication is an async function that throws an error if unauthenticated
    await checkAuthentication();
    next(); // Proceed to route
  } catch (error) {
    if (error.isUnauthenticated) {
      next('/login'); // Redirect to login if unauthenticated
    } else {
      next(error); // Handle other errors or pass them through
    }
  }
});



export default router
