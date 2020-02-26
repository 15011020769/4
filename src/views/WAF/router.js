import Vue from 'vue'
import Router from 'vue-router'
import { DESCRIBE_USER_EDITION } from '@/constants'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/protectionSettings'
    },
    {
      path: '/saveOverView', // 安全概览
      name: 'saveOverView',
      component: () => import(/* webpackChunkName: "ipMan" */ './saveOverView/saveOverView.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/accessLog', // 访问日志
      name: 'accessLog',
      component: () => import(/* webpackChunkName: "ipMan" */ './logService/accessLog.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/accessLogDetail', // 访问日志
      name: 'accessLogDetail',
      component: () => import(/* webpackChunkName: "ipMan" */ './logService/tab/log.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/protectionSettings', // 防护设置
      name: 'protectionSettings',
      component: () => import(/* webpackChunkName: "ipMan" */ './webFirewall/protectionSettings.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/attackDetails', // 攻击详情
      name: 'attackDetails',
      component: () => import(/* webpackChunkName: "ipMan" */ './webFirewall/attackDetails.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/attackLog', // 攻击详情
      name: 'attackLog',
      component: () => import(/* webpackChunkName: "ipMan" */ './webFirewall/tab/attackLog.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/protectConfig', // 攻击详情防护配置页面
      name: 'protectConfig',
      component: () => import(/* webpackChunkName: "ipMan" */ './webFirewall/protectConfig.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/protectDomain', // 添加/修改防护域名
      name: 'protectDomain',
      component: () => import(/* webpackChunkName: "ipMan" */ './webFirewall/protectDomain.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    
    {
      path: '/hijackDetection', // DNS劫持检测
      name: 'hijackDetection',
      component: () => import(/* webpackChunkName: "ipMan" */ './safetyInspection/hijackDetection.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/ipSearch', // ip管理
      name: 'ipSearch',
      component: () => import(/* webpackChunkName: "ipMan" */ './ipMan/ipSearch.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    
    
    {
      path: '/ipStatus', // ip 状态
      name: 'ipStatus',
      component: () => import(/* webpackChunkName: "ipMan" */ './ipMan/ipStatus.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/ipList', // ip管理
      name: 'ipList',
      component: () => import(/* webpackChunkName: "ipMan" */ './ipMan/ipList.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/botMan', // bot管理
      name: 'botMan',
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/botOverview', // botOverview
      name: 'botOverview',
      component: () => import(/* webpackChunkName: "ipMan" */ './botMan/botOverview.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/botSetting', // bot设置
      name: 'botSetting',
      component: () => import(/* webpackChunkName: "ipMan" */ './botMan/botSetting.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/botSetting/public/:id',
      name: 'proctionSetting',
      meta: {
        keepAlive: true,
        leftNav:true,
        tips: 'public'
      },
      component: () => import(/* webpackChunckName: "botMan" */ './botMan/component/protectionSetting')
    },
    {
      path: '/botSetting/diy/:id',
      name: 'proctionSetting',
      meta: {
        keepAlive: true,
        leftNav:true,
        tips: 'diy'
      },
      component: () => import(/* webpackChunckName: "botMan" */ './botMan/component/protectionSetting')
    },
    {
      path: '/botDetail', // bot详情
      name: 'botDetail',
      component: () => import(/* webpackChunkName: "ipMan" */ './botMan/botDetail.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/toBuy', // bot详情
      name: 'toBuy',
      component: () => import(/* webpackChunkName: "ipMan" */ './buy/toBuy.vue'),
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/choose', // bot详情
      name: 'choose',
      component: () => import(/* webpackChunkName: "ipMan" */ './buy/choose.vue'),
      meta: {
        keepAlive: true,
        leftNav:false
      }
    },
    {
      path: '/pay', // bot详情
      name: 'pay',
      component: () => import(/* webpackChunkName: "ipMan" */ './buy/pay.vue'),
      meta: {
        keepAlive: true,
        leftNav:false
      }
    }
  ]
})

let waf = -1 // 0 未购买 1 已购买
router.beforeEach((to, from, next) => {
  if (to.path === '/toBuy') {
    next()
    return
  }
  if (waf === -1) {
    Vue.prototype.axios.post(DESCRIBE_USER_EDITION, {
      Version: '2018-01-25'
    }).then(resp => {
      Vue.prototype.generalRespHandler(resp, ({ Data }) => {
        if (!Data || !Data.includes('clb-waf')) {
          waf = 0
          next('/toBuy')
        } else {
          waf = 1
          next()
        }
      }, )
    })
  } else if (waf === 0) {
    next('/toBuy')
  } else {
    next()
  }
})

export default router