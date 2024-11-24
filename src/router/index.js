import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SimpleStudentView from '@/views/SimpleStudentView.vue';
import GroupLeaderView from '@/views/GroupLeaderView.vue';
import ProfessorView from '@/views/ProfessorView.vue';

const routes = [
  {
    path: '/',
    name: 'LoginView',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        if (user.roles.includes('Student')) {
          next({ name: 'SimpleStudentView' });
        } else if (user.roles.includes('GroupLeader')) {
          next({ name: 'GroupLeaderView' });
        } else if (user.roles.includes('Professor')) {
          next({ name: 'ProfessorView' });
        } else {
          next();
        }
      } else {
        next();
      }
    },
  },
  {
    path: '/simple-student',
    name: 'SimpleStudentView',
    component: SimpleStudentView,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.roles.includes('Student')) {
        next();
      } else {
        next('/');
      }
    },
  },
  {
    path: '/group-leader',
    name: 'GroupLeaderView',
    component: GroupLeaderView,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.roles.includes('GroupLeader')) {
        next();
      } else {
        next('/');
      }
    },
  },
  {
    path: '/professor',
    name: 'ProfessorView',
    component: ProfessorView,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.roles.includes('Professor')) {
        next();
      } else {
        next('/');
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user && to.name !== 'LoginView') {
    next('/');
  } else {
    next();
  }
});

export default router;
