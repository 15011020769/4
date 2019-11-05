import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'Cdb'
  },
  routes: [
    {
      path: '/',
      redirect: '/Cdb'
    },
    {
      path: '/Cdb', // 实例列表
      name: 'Cdb',
      component: () => import(/* webpackChunkName: "Cdb" */ './Cdb/Cdb.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Task', // 任务列表
      name: 'Task',
      component: () => import(/* webpackChunkName: "Task" */ './Task/Task.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Variables', // 参数模板
      name: 'Variables',
      component: () => import(/* webpackChunkName: "Variables" */ './Variables/Variables.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/VariablesDetail', // 参数模板 --> 详情
      name: 'VariablesDetail',
      component: () => import(/* webpackChunkName: "VariablesDetail" */ './Variables/Detail/Detail.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Recycle', // 回收站
      name: 'Recycle',
      component: () => import(/* webpackChunkName: "Recycle" */ './Recycle/Recycle.vue'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
