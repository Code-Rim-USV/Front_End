import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';

const routes = [
  {
    path: '/',
    name: 'LoginView',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        next({ name: 'DashboardView' });
      } else {
        next();
      }
    },
  },
  {
    path: '/dashboard',
    name: 'DashboardView',
    component: DashboardView,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.roles) {
        const userRole = typeof user.roles === 'string' ? user.roles : user.roles[0];
        if (['Student', 'Professor', 'GroupLeader'].includes(userRole)) {
          next();
        } else {
          next('/');
        }
      } else {
        next('/');
      }
    },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
