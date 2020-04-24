import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'
import { clearLoginInfo } from '@/utils'
Vue.use(Router)

import overView from './overView/overView.vue'
import FuncServe from './FuncServe/FuncServe.vue'
import createFun from './FuncServe/createFun.vue'
import createFunStep from './FuncServe/createFunStep.vue'
import funSeverDetail from './FuncServe/funSeverDetail.vue'

const router =  new Router({
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
      // component: () =>
      //   import('./overView/overView.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/FuncServe', // 函数服务
      name: 'FuncServe',
      component: FuncServe,
      // component: () =>
      //   import('./FuncServe/FuncServe.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/createFun', // 创建函数
      name: 'createFun',
      component: createFun,
      // component: () =>
      //   import('./FuncServe/createFun.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/createFunStep', // 创建函数第二步
      name: 'createFunStep',
      component: createFunStep,
      // component: () =>
      //   import('./FuncServe/createFunStep.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/funSeverDetail', // 创建函数第二步
      name: 'funSeverDetail',
      component: funSeverDetail,
      // component: () =>
      //   import('./FuncServe/funSeverDetail.vue'),
      meta: {
        keepAlive: true
      }
    }

  ]
})

router.beforeEach((to, from, next) => {
  // Message.closeAll()      // 关闭所有的alert
  // 如果没有uuid说明用户没有登录 则需要跳转到登录界面
  if(VueCookie.get('uuid') === '' || VueCookie.get('uuid') === undefined || VueCookie.get('uuid') === null){
    clearLoginInfo()
    window.location.href = process.env.VUE_APP_loginUrl
  }else{
    next()
  }


})

export default router
