import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
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
      //component: overView,
      component: () =>
        import('./overView/overView.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/FuncServe', // 函数服务
      name: 'FuncServe',
      // component: FuncServe,
      component: () =>
        import('./FuncServe/FuncServe.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/createFun', // 创建函数
      name: 'createFun',
      // component: createFun,
      component: () =>
        import('./FuncServe/createFun.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/createFunStep', // 创建函数第二步
      name: 'createFunStep',
      // component: createFunStep,
      component: () =>
        import('./FuncServe/createFunStep.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/funSeverDetail', // 创建函数第二步
      name: 'funSeverDetail',
      // component: funSeverDetail,
      component: () =>
        import('./FuncServe/funSeverDetail.vue'),
      meta: {
        keepAlive: true
      }
    }

  ]
})
