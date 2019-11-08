import Vue from 'vue'
import Router from 'vue-router'
import overView from './overView/overView'
import FuncServe from './FuncServe/FuncServe'
import createFun from './FuncServe/createFun'

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
    },
    {
      path: '/FuncServe', // 函数服务
      name: 'FuncServe',
      component: FuncServe,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/createFun', // 函数服务
      name: 'createFun',
      component: createFun,
      meta: {
        keepAlive: true
      }
    }
  ]
})
