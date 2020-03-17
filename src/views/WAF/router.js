import Vue from "vue";
import Router from "vue-router";
import { DESCRIBE_USER_EDITION, DESCRIBE_USER_INFO } from "@/constants";
import { CLB_PACKAGE_CFG_TYPES } from "./constants";

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/protectionSettings"
    },
    {
      path: "/cdn/report", // 安全概览
      name: "cdnreport",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./cdnstat/report/index.vue"),
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
          /* webpackChunkName: "ipMan" */ "./cdnstat/statistics/analysis/index.vue"
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
        import(/* webpackChunkName: "ipMan" */ "./cdnstat/global/index.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/saveOverView", // 安全概览
      name: "saveOverView",
      component: () =>
        import(
          /* webpackChunkName: "ipMan" */ "./saveOverView/saveOverView.vue"
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/accessLogIntercept", // 访问日志
      name: "accessLogIntercept",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./logService/intercept.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/accessLog", // 访问日志
      name: "accessLog",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./logService/accessLog.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      },
      beforeEnter: accessLogIntercept
    },
    {
      path: "/accessLogDetail", // 访问日志
      name: "accessLogDetail",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./logService/tab/log.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      },
      beforeEnter: accessLogIntercept
    },
    {
      path: "/protectionSettings", // 防护设置
      name: "protectionSettings",
      component: () =>
        import(
          /* webpackChunkName: "ipMan" */ "./webFirewall/protectionSettings.vue"
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/attackDetails", // 攻击详情
      name: "attackDetails",
      component: () =>
        import(
          /* webpackChunkName: "ipMan" */ "./webFirewall/attackDetails.vue"
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/attackLog", // 攻击详情
      name: "attackLog",
      component: () =>
        import(
          /* webpackChunkName: "ipMan" */ "./webFirewall/tab/attackLog.vue"
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/protectConfig", // 攻击详情防护配置页面
      name: "protectConfig",
      component: () =>
        import(
          /* webpackChunkName: "ipMan" */ "./webFirewall/protectConfig.vue"
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/protectDomain", // 添加/修改防护域名
      name: "protectDomain",
      component: () =>
        import(
          /* webpackChunkName: "ipMan" */ "./webFirewall/protectDomain.vue"
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },

    {
      path: "/hijackDetection", // DNS劫持检测
      name: "hijackDetection",
      component: () =>
        import(
          /* webpackChunkName: "ipMan" */ "./safetyInspection/hijackDetection.vue"
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/ipSearch", // ip管理
      name: "ipSearch",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./ipMan/ipSearch.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },

    {
      path: "/ipStatus", // ip 状态
      name: "ipStatus",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./ipMan/ipStatus.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/ipList", // ip管理
      name: "ipList",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./ipMan/ipList.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/botIntercept", // bot管理
      name: "botIntercept",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./botMan/intercept.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/botMan", // bot管理
      name: "botMan",
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/botOverview", // botOverview
      name: "botOverview",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./botMan/botOverview.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      },
      beforeEnter: botIntercept
    },
    {
      path: "/botSetting", // bot设置
      name: "botSetting",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./botMan/botSetting.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      },
      beforeEnter: botIntercept
    },
    {
      path: "/botSetting/public/:id",
      name: "proctionSetting",
      meta: {
        keepAlive: true,
        leftNav: true,
        tips: "public"
      },
      component: () =>
        import(
          /* webpackChunckName: "botMan" */ "./botMan/component/protectionSetting"
        )
    },
    {
      path: "/botSetting/diy/:id",
      name: "proctionSettingdiy",
      meta: {
        keepAlive: true,
        leftNav: true,
        tips: "diy"
      },
      component: () =>
        import(
          /* webpackChunckName: "botMan" */ "./botMan/component/protectionSetting"
        )
    },
    {
      path: "/botDetail", // bot详情
      name: "botDetail",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./botMan/botDetail.vue"),
      meta: {
        keepAlive: true,
        leftNav: true
      },
      beforeEnter: botIntercept
    },
    {
      path: "/botDetail/ucb", // bot详情
      name: "ucb",
      component: () =>
        import(
          /* webpackChunkName: "ipMan" */ "./botMan/component/botdetail/module"
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/toBuy",
      name: "toBuy",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./buy/toBuy.vue"),
      meta: {
        interceptBuy: false,
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: "/choose",
      name: "choose",
      component: () =>
        import(/* webpackChunkName: "ipMan" */ "./buy/choose.vue"),
      meta: {
        interceptBuy: false,
        keepAlive: true,
        leftNav: false
      }
    },
    {
      path: "/pay",
      name: "pay",
      component: () => import(/* webpackChunkName: "ipMan" */ "./buy/pay.vue"),
      meta: {
        interceptBuy: false,
        keepAlive: true,
        leftNav: false
      }
    }
  ]
});

let pack;
const accessLogIntercept = (to, from, next) => {
  if (pack) {
    if (pack.Cls) {
      next();
    } else {
      next("/accessLogIntercept");
    }
  } else {
    Vue.prototype.axios
      .post(DESCRIBE_USER_INFO, {
        Version: "2018-01-25"
      })
      .then(resp => {
        Vue.prototype.generalRespHandler(resp, ({ Data }) => {
          pack = Data;
          if (pack.Cls) {
            next();
          } else {
            next("/accessLogIntercept");
          }
        });
      });
  }
};
const botIntercept = (to, from, next) => {
  if (pack) {
    if (pack.Level === CLB_PACKAGE_CFG_TYPES[2]) {
      next("/botIntercept");
    } else {
      next();
    }
  } else {
    Vue.prototype.axios
      .post(DESCRIBE_USER_INFO, {
        Version: "2018-01-25"
      })
      .then(resp => {
        Vue.prototype.generalRespHandler(resp, ({ Data }) => {
          pack = Data;
          if (pack.Level === CLB_PACKAGE_CFG_TYPES[2]) {
            next("/botIntercept");
          } else {
            next();
          }
        });
      });
  }
};

let waf = -1; // 0 未购买 1 已购买
router.beforeEach((to, from, next) => {
  if (to.meta.interceptBuy === false) {
    next();
    return;
  }
  if (waf === -1) {
    Vue.prototype.axios
      .post(DESCRIBE_USER_EDITION, {
        Version: "2018-01-25"
      })
      .then(resp => {
        Vue.prototype.generalRespHandler(resp, ({ Data }) => {
          if (!Data || !Data.includes("clb-waf")) {
            waf = 0;
            next("/toBuy");
          } else {
            waf = 1;
            next();
          }
        });
      });
  } else if (waf === 0 && to.params.intercept !== false) {
    next("/toBuy");
  } else {
    waf = 1;
    next();
  }
});

export default router;
