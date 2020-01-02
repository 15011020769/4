import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'Cloudapi'
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
      path: '/colony', // 集群
      name: 'colony',
      component: () => import(/* webpackChunkName: "colony" */ './colony/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/helm', // helm应用
      name: 'helm',
      component: () => import(/* webpackChunkName: "helm" */ './helm/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/myMirror', // 我的镜像
      name: 'myMirror',
      component: () => import(/* webpackChunkName: "myMirror" */ './myMirror/index.vue'),
      meta: {
        keepAlive: true
      },
      children: [
        {
          path: '/myMirror/user',
          name: 'myMirrorUser',
          component: () => import(/* webpackChunkName: "myMirror" */ './myMirror/user.vue'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/myMirror/local',
          name: 'myMirrorLocal',
          component: () => import(/* webpackChunkName: "myMirror" */ './myMirror/local.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/myFavorite', // 我的收藏
      name: 'myFavorite',
      component: () => import(/* webpackChunkName: "myFavorite" */ './myFavorite/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/DockerHub', // DockerHub
      name: 'DockerHub',
      component: () => import(/* webpackChunkName: "DockerHub" */ './DockerHub/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/totalMirror', // 共有镜像
      name: 'totalMirror',
      component: () => import(/* webpackChunkName: "totalMirror" */ './totalMirror/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/logCollection', // 日志采集
      name: 'logCollection',
      component: () => import(/* webpackChunkName: "logCollection" */ './logCollection/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/warnings', // 告警设置
      name: 'warnings',
      component: () => import(/* webpackChunkName: "warnings" */ './warnings/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/persistence', // 事件持久化
      name: 'persistence',
      component: () => import(/* webpackChunkName: "persistence" */ './persistence/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/persistenceSetting/:uid', // 设置事件持久化
      props:true,
      name: 'persistenceSetting',
      component: () => import(/* webpackChunkName: "persistenceSetting" */ './persistenceSetting/index.vue'),
      meta: {
        keepAlive: true
      }
    },
  ]
})
