import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import LoginPage from '@/components/LoginPage'
import FilePage from '@/components/FilePage'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/auth',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/file',
      name: 'FilePage',
      component: FilePage
    }
  ]
})
