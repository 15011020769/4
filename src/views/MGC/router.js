import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'message'
  },
  routes: [
    {
      path: '/',
      redirect: '/message'
    },
    {
      path: '/message', // 概览
      name: 'message',
      component: () => import(/* webpackChunkName: "message" */ './message/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/mesgdetils', // 站内信详情
      name: 'mesgdetils',
      component: () => import(/* webpackChunkName: "message" */ './message/mesgdetils.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/newsFeeds', // 概览
      name: 'newsFeeds',
      component: () => import(/* webpackChunkName: "newsFeeds" */ './newsFeeds/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/newsdetils', // 通知公告详情
      name: 'newsdetils',
      component: () => import(/* webpackChunkName: "newsFeeds" */ './newsFeeds/newsdetils.vue'),
      meta: {
        keepAlive: true
      }
    },
  ]
})
