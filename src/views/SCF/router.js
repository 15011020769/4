import Vue from 'vue'
import Router from 'vue-router'
import overView from './overView/overView'
import FuncServe from './FuncServe/FuncServe'
import createFun from './FuncServe/createFun'
import createFunStep from './FuncServe/createFunStep'
import funSeverDetail from './FuncServe/funSeverDetail'

Vue.use(Router)

export default new Router({
  // mode: 'history',
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
      path: '/createFun', // 创建函数
      name: 'createFun',
      component: createFun,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/createFunStep', // 创建函数第二步
      name: 'createFunStep',
      component: createFunStep,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/funSeverDetail', // 创建函数第二步
      name: 'funSeverDetail',
      component: funSeverDetail,
      meta: {
        keepAlive: true
      }
    }

  ]
})
