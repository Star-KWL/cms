import { createRouter, createWebHashHistory } from 'vue-router'
import LoginFormView from '../views/LoginFormView.vue'
import DashBoardView from '../views/DashBoardView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginFormView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashBoardView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
