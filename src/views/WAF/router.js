import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'saveOverView'
  },
  routes: [
    {
      path: '/',
      redirect: '/saveOverView'
    },
    {
      path: '/saveOverView', // 安全概览
      name: 'saveOverView',
      component: () => import(/* webpackChunkName: "ipMan" */ './saveOverView/saveOverView.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/protectionSettings', // 防护设置
      name: 'protectionSettings',
      component: () => import(/* webpackChunkName: "ipMan" */ './webFirewall/protectionSettings.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/attackDetails', // 攻击详情
      name: 'attackDetails',
      component: () => import(/* webpackChunkName: "ipMan" */ './webFirewall/attackDetails.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/toProtectSet', // 攻击详情防护配置页面
      name: 'toProtectSet',
      component: () => import(/* webpackChunkName: "ipMan" */ './webFirewall/components/toProtectSet.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/editDominList', // 攻击详情编辑页面
      name: 'editDominList',
      component: () => import(/* webpackChunkName: "ipMan" */ './webFirewall/components/editDominList.vue'),
      meta: {
        keepAlive: true
      }
    },
    
    {
      path: '/hijackDetection', // DNS劫持检测
      name: 'hijackDetection',
      component: () => import(/* webpackChunkName: "ipMan" */ './safetyInspection/hijackDetection.vue'),
      meta: {
        keepAlive: true
      }
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
