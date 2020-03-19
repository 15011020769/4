import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/editor", // 安全概览
      name: "editor",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./editor.vue"),
    },
    {
      path: "/cdn/report", // 安全概览
      name: "cdnreport",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./report/index.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/cdn/statistics/analysis", // 安全概览
      name: "cdnstatisticsanalysis",
      component: () =>
        import(
          /* webpackChunkName: "ipMan" */ "./statistics/analysis/index.vue"
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/cdn/global", // 安全概览
      name: "cdnglobal",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./global/index.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    
  ]
});
export default router;
