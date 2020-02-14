export const PACKAGE_CFG_TYPES = {
  0: {
      key: "wsm_package_base",
      goodstype: "wsm_waf",
      name: "基础版",
      index: 0,
      mainCount: 1,
      subCount: 10,
      busQps: 2500,
      CCQps: 30000
  },
  1: {
      key: "wsm_package_standard",
      goodstype: "wsm_waf",
      name: "标准版", 
      index: 1,
      mainCount: 1, 
      subCount: 10,
      busQps: 2500,
      CCQps: 30000
  },
  2: {
      key: "wsm_package_premium",
      goodstype: "wsm_waf",
      name: "高级版", 
      index: 2,
      mainCount: 2,
      subCount: 20,
      busQps: 2500,
      CCQps: 30000
  },
  3: {
      key: "wsm_package_enterprise",
      goodstype: "wsm_waf",
      name: "企业版",
      index: 3,
      mainCount: 3,
      subCount: 30,
      busQps: 5000,
      CCQps: 150000
  },
  4: {
      key: "wsm_package_ultimate",
      goodstype: "wsm_waf",
      name: "旗舰版",
      index: 4,
      mainCount: 4,
      subCount: 40,
      busQps: 10000,
      CCQps: 500000
  }
}