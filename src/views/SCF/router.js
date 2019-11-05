import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'OverView'
  },
  routes: [
    {
      path: '/',
      redirect: '/OverView'
    },
    {
      path: '/OverView', // 概览
      name: 'OverView',
      component: () => import(/* webpackChunkName: "overview" */ './OverView/OverView.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/FuncServe', // 函数服务
      name: 'FuncServe',
      component: () => import(/* webpackChunkName: "FuncServe" */ './FuncServe/FuncServe.vue'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
