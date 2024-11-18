import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SimpleStudentView from '@/views/SimpleStudentView.vue';
import GroupLeaderView from '@/views/GroupLeaderView.vue';
import ProfessorView from '@/views/ProfessorView.vue';

const routes = [
  {
    path: '/',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/simple-student',
    name: 'SimpleStudentView',
    component: SimpleStudentView
  },
  {
    path: '/group-leader',
    name: 'GroupLeaderView',
    component: GroupLeaderView
  },
  {
    path: '/professor',
    name: 'ProfessorView',
    component: ProfessorView
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
