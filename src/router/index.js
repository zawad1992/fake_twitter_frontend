import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue';
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginRegistrationView from '../views/LoginRegistrationView.vue'
import { checkAuthentication } from '../api';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: HomeView },
        { path: 'profile', component: ProfileView },
        { path: 'about', component: AboutView },
      ]
    },
    { path: '/login', name: 'login', component: LoginRegistrationView },
    { path: '/register', name: 'register', component: LoginRegistrationView }
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
