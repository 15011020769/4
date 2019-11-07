import Vue from 'vue'
import Router from 'vue-router'
import overView from './overView/overView'
import FuncServe from './FuncServe/FuncServe'
import chartShow from './overView/chartShow'

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
      },
      children:[
        {
            path:'/overView/chartShow',
            component:chartShow
        }
      ]
    },
    {
      path: '/FuncServe', // 函数服务
      name: 'FuncServe',
      component: FuncServe,
      meta: {
        keepAlive: true
      }
    }
  ]
})
