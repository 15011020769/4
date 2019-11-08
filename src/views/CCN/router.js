import Vue from 'vue'
import Router from 'vue-router'
import overView from './overView/overView'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'overView'
  },
  routes: [
    {
      path: '/',
      redirect: '/overView'
    },
    {
      path: '/overView', // 概览
      name: 'overView',
      component: overView,
      meta: {
        keepAlive: true
      }
    }
  ]
})
