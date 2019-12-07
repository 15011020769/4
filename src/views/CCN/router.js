import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'ccnPage'
  },
  routes: [
    {
      path: '/',
      redirect: '/ccnPage'
    },
    {
      path: '/ccnPage', // ccn
      name: 'ccnPage',
      component: () => import(/* webpackChunkName: "ccnDetail" */ './ccnPage/ccnPage.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/ccnDetail', // ccn  详情
      name: 'ccnDetail',
      component: () => import(/* webpackChunkName: "ccnDetail" */ './ccnPage/ccnDetail.vue'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
