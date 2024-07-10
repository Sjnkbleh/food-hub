import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../components/DefaultLayout.vue';
import GuestLayout from '../components/GuestLayout.vue';
import Home from '../views/Home.vue';
import MealsByIngredient from '../views/MealsByIngredient.vue';
import MealsByLetter from '../views/MealsByLetter.vue';
import MealsByName from '../views/MealsByName.vue';
import MealDetails from '../views/MealDetails.vue';
import Ingredients from '../views/Ingredients.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Favorite from '../views/Favorite.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '/',
        name: 'home',
        component: Home,
        meta: { requiresAuth: true, showNotification: false }
      },
      {
        path: '/by-name/:name?',
        name: 'byName',
        component: MealsByName,
        meta: { requiresAuth: true }
      },
      {
        path: '/by-letter/:letter?',
        name: 'byLetter',
        component: MealsByLetter,
        meta: { requiresAuth: true }
      },
      {
        path: '/ingredients',
        name: 'ingredients',
        component: Ingredients,
        meta: { requiresAuth: true }
      },
      {
        path: '/by-ingredient/:ingredient',
        name: 'byIngredient',
        component: MealsByIngredient,
        meta: { requiresAuth: true }
      },
      {
        path: '/meal/:id',
        name: 'mealDetails',
        component: MealDetails,
        meta: { requiresAuth: true }
      },
      {
        path: '/favorite',
        name: 'favorite',
        component: Favorite,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/guest',
    component: GuestLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login
      },
      {
        path: 'register',
        name: 'register',
        component: Register
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.path === '/' && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
