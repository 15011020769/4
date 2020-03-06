import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'ULive'
  },
  routes: [
    {
      path: '/',
      redirect: '/overview'
    },
    {
      path: '/overview', // 概览
      name: 'overview',
      component: () => import(/* webpackChunkName: "overview" */ './overview/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/domainManagement', // 域名管理
      name: 'domainManagement',
      component: () => import(/* webpackChunkName: "domainManagement" */ './domainManagement/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/detailPushStream', // 域名管理推流详情页
      name: 'detailPushStream',
      component: () => import(/* webpackChunkName: "detailPushStream" */ './domainManagement/detailPushStream.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/detailPlay', // 域名管理播放详情页
      name: 'detailPlay',
      component: () => import(/* webpackChunkName: "detailPlay" */ './domainManagement/detailPlay.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/streamManagement', // 流管理
      name: 'streamManagement',
      component: () => import(/* webpackChunkName: "streamManagement" */ './streamManagement/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/transcribe', // 录制配置
      name: 'transcribe',
      component: () => import(/* webpackChunkName: "transcribe" */ './transcribe/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/transcoding', // 转码设置
      name: 'transcoding',
      component: () => import(/* webpackChunkName: "transcoding" */ './transcoding/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/screenshot', // 截图鉴黄配置
      name: 'screenshot',
      component: () => import(/* webpackChunkName: "screenshot" */ './screenshot/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/watermark', // 水印配置
      name: 'watermark',
      component: () => import(/* webpackChunkName: "watermark" */ './watermark/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/callback', // 回调配置
      name: 'callback',
      component: () => import(/* webpackChunkName: "callback" */ './callback/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/appreciation', // 增值功能
      name: 'appreciation',
      component: () => import(/* webpackChunkName: "appreciation" */ './appreciation/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/streamlookup', // 流查询
      name: 'streamlookup',
      component: () => import(/* webpackChunkName: "streamlookup" */ './streamlookup/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/operation', // 运营数据
      name: 'operation',
      component: () => import(/* webpackChunkName: "operation" */ './operation/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/logManagement', // 日志管理
      name: 'logManagement',
      component: () => import(/* webpackChunkName: "logManagement" */ './logManagement/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/license', // License
      name: 'license',
      component: () => import(/* webpackChunkName: "license" */ './license/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/application', // 应用管理
      name: 'application',
      component: () => import(/* webpackChunkName: "application" */ './application/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/statistic', // 统计分析
      name: 'statistic',
      component: () => import(/* webpackChunkName: "statistic" */ './statistic/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/meerkat', // 移动直播连麦
      name: 'meerkat',
      component: () => import(/* webpackChunkName: "meerkat" */ './meerkat/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/meerkat', // 移动直播连麦
      name: 'meerkat',
      component: () => import(/* webpackChunkName: "meerkat" */ './meerkat/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/domainLive', // 域名管理
      name: 'domainLive',
      component: () => import(/* webpackChunkName: "domainLive" */ './domainLive/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/domainLivedetails', // 域名管理详情
      name: 'domainLivedetails',
      component: () => import(/* webpackChunkName: "domainLive" */ './domainLive/details/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/configuration', // 模板配置
      name: 'configuration',
      component: () => import(/* webpackChunkName: "configuration" */ './configuration/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/statisticLive', // 统计分析
      name: 'statisticLive',
      component: () => import(/* webpackChunkName: "statisticLive" */ './statisticLive/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/cutout', // 断流诊断
      name: 'cutout',
      component: () => import(/* webpackChunkName: "cutout" */ './cutout/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/builder', // 地址生成器
      name: 'builder',
      component: () => import(/* webpackChunkName: "builder" */ './builder/index.vue'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
