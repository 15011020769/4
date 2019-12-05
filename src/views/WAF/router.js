import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'ipSearch'
  },
  routes: [
    {
      path: '/',
      redirect: '/ipSearch'
    },
    {
      path: '/ipSearch', // ip管理
      name: 'ipSearch',
      component: () => import(/* webpackChunkName: "ipMan" */ './ipMan/ipSearch.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/ipStatus', // ip 状态
      name: 'ipStatus',
      component: () => import(/* webpackChunkName: "ipMan" */ './ipMan/ipStatus.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/ipList', // ip管理
      name: 'ipList',
      component: () => import(/* webpackChunkName: "ipMan" */ './ipMan/ipList.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/botMan', // bot管理
      name: 'botMan',
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/botOverview', // botOverview
      name: 'botOverview',
      component: () => import(/* webpackChunkName: "ipMan" */ './botMan/botOverview.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/botSetting', // bot设置
      name: 'botSetting',
      component: () => import(/* webpackChunkName: "ipMan" */ './botMan/botSetting.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/botDetail', // bot详情
      name: 'botDetail',
      component: () => import(/* webpackChunkName: "ipMan" */ './botMan/botDetail.vue'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
