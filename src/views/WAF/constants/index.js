import { obj2Arr, addVal2Key, isValidIPAddressNew, isValidIPv6, arr2Obj } from '@/utils'
export const SAFE_OVERVIEW_SHOWMODULE_KEY = 'waf:safeOverView:showModules'
export const BUSINESS_SHOWMODULE_KEY = 'waf:business:showModules'
export const ORDER_INFO = 'waf:order_info'
export const DOMAIN_STATE = {
  0: '正常',
  3: '過期',
  4: '正在綁定LB',
  5: '綁定LB成功',
  6: '正在解綁LB',
  7: '解綁LB失敗',
  8: '綁定LB失敗',
  9: '解綁LB成功',
  10: '內部錯誤',
}
/** 套餐包信息 */
export const CLB_PACKAGE_CFG_TYPES = {

  2: {
    key: "sp_wsm_waf_premium_clb",
    pricetype: "sv_wsm_waf_package_premium_clb",
    first_categoryid: 101198, categoryid: 101199, edit_categoryid: 101200,
    pid: 1001150,
    name: "高級版", index: 2,
    mainCount: 2, subCount: 20,
    busQps: 2500,
    CCQps: 30000,
    price: 3880,
  },
  3: {
      key: "sp_wsm_waf_enterprise_clb",
      pricetype: "sv_wsm_waf_package_enterprise_clb",
      first_categoryid: 101204, categoryid: 101205, edit_categoryid: 101206,
      pid: 1001152,
      name: "企業版", index: 3,
      mainCount: 3, subCount: 30,
      busQps: 5000,
      CCQps: 150000,
      price: 9880,
  },
  4: {
      key: "sp_wsm_waf_ultimate_clb",
      pricetype: "sv_wsm_waf_package_ultimate_clb",
      first_categoryid: 101201, categoryid: 101202, edit_categoryid: 101203,
      pid: 1001154,
      name: "旗艦版", index: 4,
      mainCount: 4, subCount: 40,
      busQps: 10000,
      CCQps: 500000,
      price: 28880,
  },
}

export const CLB_BUY_DOMAIN_TYPES = {
  goodstype: "sp_wsm_waf_domain_clb",
  pricetype: "sv_wsm_waf_domain_clb",
  first_categoryid: 101207, categoryid: 101208, edit_categoryid: 101209,
  pid: 1001156
}
// SAAS和CLBWAF 的 日誌服務 改成是共享的了 ，使用BUY_LOG_TYPES， 域名包和QPS使用CLB_XXX
export const BUY_LOG_TYPES = {
  goodstype: "sp_wsm_waf_scls",
  pricetype: "sv_wsm_waf_scls",
  first_categoryid: 101037, categoryid: 101038, edit_categoryid: 101039,
  pid: 1000483
}
export const CLB_BUY_QPS_TYPES = {
  goodstype: "sp_wsm_waf_qpsep_clb",
  pricetype: "sv_wsm_waf_qps_ep_clb",
  first_categoryid: 101210, categoryid: 101211, edit_categoryid: 101212,
  pid: 1001160
}
/** 公共錯誤code */
export const COMMON_ERROR = {
  'FailedOperation': '操作失敗。',
  'InternalError': '內部錯誤。',
  'InvalidParameter': '參數錯誤。',
  'InvalidParameterValue': '參數取值錯誤。',
  'LimitExceeded': '超過配額限制。',
  'MissingParameter': '缺少參數錯誤。',
  'ResourceInUse': '資源被佔用。',
  'ResourceInsufficient': '資源不足。',
  'ResourceNotFound': '資源不存在。',
  'ResourceUnavailable': '資源不可用。',
  'ResourcesSoldOut': '資源售罄。',
  'UnauthorizedOperation': '未授權操作。',
  'UnknownParameter': '未知參數錯誤。',
}
/** 自定義策略邏輯符號 */
const LOGIC_SYMBOL_LOCAL = {
  ipmatch: '匹配',
  ipnmatch: '不匹配',
  empty: '內容為空',
  null: '不存在',
  eq: '等於',
  neq: '不等於',
  contains: '包含',
  ncontains: '不包含',
  len_eq: '長度等於',
  len_gt: '長度大於',
  len_lt: '長度小於',
  strprefix: '前綴匹配',
  strsuffix: '後綴匹配',
  exsit: '存在參數',
  nexsit: '不存在參數',
}
export const LOGIC_SYMBOL = addVal2Key(LOGIC_SYMBOL_LOCAL)
export const LOGIC_SYMBOL_ARR = obj2Arr(LOGIC_SYMBOL_LOCAL)

/** 自定義策略匹配欄位 */
export const MATCH_KEY = {
  IP: {
    name: '來源IP',
    param: false,
    symbol: ['ipmatch', 'ipnmatch'],
    placeholder: '多個IP以英文逗號隔開，最多20個',
    validator: match => (rule, value, callback) => {
      value = value && value.trim() || ''
      if (!value) {
        return callback(new Error(match.placeholder))
      }
      const ips = value.split(",");
      if (ips.length > 20) {
        return callback(new Error(match.placeholder))
      }
      let flag = false;
      for (let i = 0, l = ips.length; i < l; i++) {
        if (!isValidIPAddressNew(ips[i])) {
          flag = true
          break
        }
      }
      if (flag) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  IPV6: {
    name: '來源IPv6',
    param: false,
    symbol: ['ipmatch', 'ipnmatch'],
    placeholder: '支持單個IPV6地址',
    validator: match => (rule, value, callback) => {
      if (value && !isValidIPv6(value)) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  Referer: {
    name: 'Referer',
    param: false,
    symbol: ['empty', 'null', 'eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  URL: {
    name: '請求路徑',
    param: false,
    symbol: ['eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  UserAgent: {
    name: 'User-Agent',
    param: false,
    symbol: ['empty', 'null', 'eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  HTTP_METHOD: {
    name: 'HTTP請求方法',
    param: false,
    symbol: ['eq', 'neq',],
    placeholder: '請輸入方法名稱，建議大寫',
    validator: () => (rule, value, callback) => {
      if (!value || !['HEAD', 'GET', 'POST', 'PUT', 'OPTIONS', 'TRACE', 'DELETE', 'PATCH', 'CONNECT'].includes(value.toUpperCase())) {
        return callback('支持HEAD,GET,POST,PUT,OPTIONS,TRACE,DELETE,PATCH,CONNECT')
      }
      callback()
    },
  },
  QUERY_STRING: {
    name: '請求字元串',
    param: false,
    symbol: ['eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  GET: {
    name: 'GET參數值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  GET_PARAMS_NAMES: {
    name: 'GET參數名',
    param: false,
    symbol: ['exsit', 'nexsit', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  POST: {
    name: 'POST參數值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  GET_POST_NAMES: {
    name: 'POST參數名',
    param: false,
    symbol: ['exsit', 'nexsit', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  POST_BODY: {
    name: '完整BODY',
    param: false,
    symbol: ['eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入BODY內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  COOKIE: {
    name: 'Cookie',
    param: false,
    symbol: ['empty', 'null'],
    input: false,
  },
  GET_COOKIES_NAMES: {
    name: 'Cookie參數名',
    param: false,
    symbol: ['exsit', 'nexsit', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  ARGS_COOKIE: {
    name: 'Cookie參數值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  GET_HEADERS_NAMES: {
    name: 'Header參數名',
    param: false,
    symbol: ['exsit', 'nexsit', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，建議小寫，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  ARGS_HEADER: {
    name: 'Header參數值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '請輸入內容，512個字元以內',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
}
export const MATCH_KEY_ARR = obj2Arr(MATCH_KEY)

/** 自定義策略執行動作  */
const POLICY_RULE_ACTION_LOCAL = {
  0: '放行',
  1: '阻斷',
  2: '人機識別',
  3: '觀察',
  4: '重定向',
}
export const POLICY_RULE_ACTION = addVal2Key(POLICY_RULE_ACTION_LOCAL)
export const POLICY_RULE_ACTION_ARR = obj2Arr(POLICY_RULE_ACTION_LOCAL)

/** 自定義會話執行動作  */
const CUSTOM_SESSION_ACTION_LOCAL = {
  permit: '放行',
  monitor: '監控',
  redirect: '重定向',
  captcha: '驗證碼',
  intercept: '攔截',
}
export const CUSTOM_SESSION_ACTION = addVal2Key(CUSTOM_SESSION_ACTION_LOCAL)
export const CUSTOM_SESSION_ACTION_ARR = obj2Arr(CUSTOM_SESSION_ACTION_LOCAL)

export const UCB_ACTION_LOCAL = {
  permit: '放行',
  monitor: '監控',
  captcha: '驗證碼',
  intercept: '攔截',
}
export const UCB_ACTION = addVal2Key(UCB_ACTION_LOCAL)
export const UCB_ACTION_ARR = obj2Arr(UCB_ACTION_LOCAL)

/** 放行後繼續執行的動作 */
export const BY_PASS_ACTION = {
  geoip: '繼續執行地域封禁防護',
  cc: '繼續執行CC策略防護',
  owasp: '繼續執行WEB應用防護',
  ai: '繼續執行AI引擎防護',
  antileakage: '繼續執行信息防泄漏防護'
}
export const BY_PASS_ACTION_ARR = obj2Arr(BY_PASS_ACTION)


/** CC規則執行動作 */
const CC_RULE_ACTION_LOCAL = {
  20: '觀察',
  21: '人機識別',
  22: '攔截',
}
export const CC_RULE_ACTION = addVal2Key(CC_RULE_ACTION_LOCAL)
export const CC_RULE_ACTION_ARR = obj2Arr(CC_RULE_ACTION_LOCAL)

export const ALL_ACTION = {
  ...CC_RULE_ACTION_LOCAL,
  ...CUSTOM_SESSION_ACTION_LOCAL,
  POLICY_RULE_ACTION_LOCAL
}

/** CC規則匹配條件  */
const CC_RULE_MATCH_LOCAL = {
  0: '相等',
  1: '前綴匹配',
  2: '包含'
}
export const CC_RULE_MATCH = addVal2Key(CC_RULE_MATCH_LOCAL)
export const CC_RULE_MATCH_ARR = obj2Arr(CC_RULE_MATCH_LOCAL)

/** IP封堵類型 */
const IP_STATUS_TYPE_LOCAL = {
  CC: 'CC',
  BOT: 'BOT',
  DIY: '自定義人機識別'
}
export const IP_STATUS_TYPE = addVal2Key(IP_STATUS_TYPE_LOCAL)
export const IP_STATUS_TYPE_ARR = obj2Arr(IP_STATUS_TYPE_LOCAL)

/** 自定義會話特徵匹配欄位 */
export const ATTACK_TYPE = [
  { id: "全部攻擊類型", label: "全部攻擊類型" },
  { id: "SQL注入攻擊", label: "SQL注入攻擊" },
  { id: "XSS攻擊", label: "XSS攻擊" },
  { id: "命令注入攻擊", label: "命令注入攻擊" },
  { id: "LDAP注入攻擊", label: "LDAP注入攻擊" },
  { id: "SSI注入攻擊", label: "SSI注入攻擊" },
  { id: "XML注入攻擊", label: "XML注入攻擊" },
  { id: "WEB伺服器漏洞攻擊", label: "WEB伺服器漏洞攻擊" },
  { id: "WEB應用漏洞攻擊", label: "WEB應用漏洞攻擊" },
  { id: "路徑跨越攻擊", label: "路徑跨越攻擊" },
  { id: "核心文件非法訪問", label: "核心文件非法訪問" },
  { id: "文件上傳攻擊", label: "文件上傳攻擊" },
  { id: "木馬後門攻擊", label: "木馬後門攻擊" },
  { id: "CSRF攻擊", label: "CSRF攻擊" },
  { id: "惡意掃描", label: "惡意掃描" },
  { id: "自定義策略", label: "自定義策略" },
  { id: "地域封禁攔截", label: "地域封禁攔截" },
  { id: "信息防泄漏替換", label: "信息防泄漏替換" },
  { id: "AI引擎檢出", label: "AI引擎檢出" },
  { id: "IP黑名單", label: "IP黑名單" },
  { id: "CC策略攔截", label: "CC策略攔截" },
  { id: "Bot 攔截", label: "Bot 攔截" },
]

export const BOTS_TYPES_CFG = {
  TCB: "公開類型",
  UCB: "用戶自定義類型",
  UB: "未知類型"
}

//  自定義策略-會話特徵
export const sessionRules = [
  {
      id: "",
      key: "avg_speed", label: "會話平均速度",
      title: "等於會話請求總次數/會話持續時間，單位為：次/分鐘",
      opoptions: [">", "<"], value: "",
      placeholder: "請輸入0-100000之間整數，次/分鐘",
      reg: /^(\d{1,5}|100000)$/
  },
  {
      id: "",
      key: "win_speed", label: "會話窗口速度",
      title: "最近檢測窗口（2分鐘）內的會話訪問速度，單位為：次/分鐘",
      opoptions: [">", "<"], value: "",
      placeholder: "請輸入0-100000之間整數，次/分鐘",
      reg: /^(\d{1,5}|100000)$/
  },
  {
      id: "",
      key: "nums", label: "會話總次數",
      opoptions: [">", "<"], value: "",
      placeholder: "請輸入0-100000之間整數",
      reg: /^(\d{1,5}|100000)$/
  },
  {
      id: "",
      key: "session_duration", label: "會話持續時間",
      opoptions: [">", "<"], value: "",
      placeholder: "請輸入0-100000之間整數，單位：分鐘",
      reg: /^(\d{1,5}|100000)$/
  },

  {
      id: "",
      key: "robots_exist", label: "會話存在Robots.txt",
      title: "會話請求中訪問Robots.txt文件",
      opoptions: ["yes", "no"]
  },
  {
      id: "",
      key: "req_in_wee_hours", label: "會話發生在凌晨",
      title: "會話請求發生在凌晨",
      opoptions: ["yes", "no"]
  }
];

// 自定義策略-ip特徵
//匹配欄位--IP所有者 的匹配內容
export const ip_owner_list = [
  { value: "amazon.com", label: "Aws" },
  { value: "microsoft.com", label: "Azure" },
  { value: "cloud.google.com", label: "Google" },
  { value: "ucloud.cn", label: "UCloud" },
  { value: "阿里雲", label: "阿里雲" },
  { value: "baidu.com", label: "百度雲" },
  { value: "huawei.com", label: "華為雲" },
  { value: "ksyun.com", label: "金山雲" },
  { value: "pubyun.com", label: "京東雲" },
  { value: "qingcloud.com", label: "青雲" },
  { value: "tencent.com", label: "騰訊雲" }
];
//匹配欄位--IP類型 的匹配內容
export const ip_type_list = [{ value: "idc", label: "互聯網數據中心（IDC）" },
{ value: "bs", label: "運營商基站" },
{ value: "unknown", label: "未知類型" }];
export const ipRules = [
    {
        id: "",
        key: "ip_scope", label: "訪問源IP",
        title: "",
        opoptions: ["belong", "not belong"], value: "",
        placeholder: `支持三種形式的ip,多個ip之間分行隔開，示例如下：
        123.25.254.21
        123.25.254.21/24
        123.25.254.21-123.25.254.45`,
        reg: /(^\d{1,3}(.\d{1,3}){3}$)|(^(\d{1,3}.){3}\d{1,3}\/\d{1,3}$)|(^\d{1,3}(.\d{1,3}){3}-\d{1,3}(.\d{1,3}){3}$)/
    },
    {
        id: "",
        key: "ip_type", label: "IP類型",
        title: "IP的類型信息，類型為IDC或基站(運營商基站)，當IP為IDC類型時疑似存在異常",
        opoptions: ["contains", "not contains"], value: ""
        , valueoptions: ip_type_list,
        placeholder: "請選擇1個",
        reg: /^.+$/,
    },
    {
        id: "",
        key: "ip_owner", label: "IP所有者",
        title: "IP所有者信息（當IP類型為IDC時有效），例如：tencent.com，可以在BOT詳情中查看",
        opoptions: ["belong", "not belong"], value: [],
        valueoptions: ip_owner_list,
        placeholder: "請選擇1個",
        reg: /^.+$/,
}];

//  自定義會話特徵-請求特徵
export const reqRules = [
{
    id: "",
    key: "url_match", label: "請求最多的URL",
    opoptions: ["contains", "not contains"], value: "",
    placeholder: "請輸入1024個字元以內",
    reg: /^.{1,1024}$/
},
{
    id: "",
    key: "req_url_repeat", label: "URL重複比",
    title: "會話請求中URL重複比比例，取值範圍0-1，過高或過低疑似異常",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入0-1範圍內的值，保留2位有效數字",
    reg: /^(0\.\d{1,2}|0|1)$/
},
{
    id: "",
    key: "req_url_kind", label: "URL種類",
    opoptions: [">", "<"], value: "",
    title: "會話請求中URL去重後條目數",
    placeholder: "請輸入0-100000之間整數",
    reg: /^(\d{1,5}|100000)$/
},
{
    id: "",
    key: "param_match", label: "請求最多的參數",
    title: "會話請求出現最多的參數，包括GET請求參數（Query內容）或POST請求參數（Body內容）",
    opoptions: ["contains", "not contains"], value: "",
    placeholder: "請輸入1024個字元以內",
    reg: /^.{1,1024}$/
},
{
    id: "",
    key: "req_query_repeat", label: "參數重複比",
    title: "會話請求中GET請求參數（Query內容）或POST請求參數（Body內容）重複比例，取值範圍0-1，過高疑似異常",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入0-1範圍內的值，保留2位有效數字",
    reg: /^(0\.\d{1,2}|0|1)$/
}];

// 自定義會話特徵-高級特徵
export const scene_flag_list = [
  { value: "crawler_unregular", label: "疑似無規律爬蟲" },
  { value: "crawler_regular", label: "疑似規律性爬蟲" },
  { value: "request_repeat", label: "疑似介面重複訪問" },
  { value: "credential_cracking", label: "疑似暴力破解" },
  { value: "credential_stuffing", label: "疑似撞庫攻擊" },
  { value: "brush_sms", label: "疑似刷簡訊介面" },
  { value: "brush_captcha", label: "疑似刷驗證碼介面" },
  { value: "reg_malicious", label: "疑似惡意註冊" },
  { value: "credential_miss_user", label: "疑似登錄行為，缺失用戶值" },
  { value: "credential_without_user", label: "疑似登錄行為，缺失用戶參數" },
  { value: "credential_only_action", label: "疑似登錄行為，缺失用戶和密碼" },
  { value: "credential_user_password", label: "疑似登錄行為，缺失登錄動作" }
];
export const advanceRules = [
  {
      id: "",
      key: "score", label: "BOT得分",
      title: "BOT智能分析引擎對會話給出的BOT得分，得分越高判定為BOT可能性越大，參考值為：5",
      opoptions: [">", "<"], value: "",
      placeholder: "請輸入0-30之間整數",
      reg: /^(\d|[12]\d|30)$/
  },
  {
      id: "",
      key: "AI_abnormal_flag", label: "AI模型檢出",
      title: "AI行為分析模型檢測結果，結果為AI模型檢出時，疑似異常。",
      opoptions: ["yes", "no"]
  },
  {
      id: "",
      key: "scene_flag", label: "預測標籤",
      title: "演算法自動預測的疑似行為",
      opoptions: ["belong", "not belong"], value: [],
      valueoptions: scene_flag_list
  },
  {
      id: "",
      key: "sensitive_request_flag", label: "敏感介面訪問",
      title: "判斷是否對敏感介面（如：簡訊介面、註冊介面、登錄介面等）進行訪問",
      opoptions: ["yes", "no"]
  },
  {
      id: "",
      key: "req_variance", label: "時序行為異常指數",
      title: "一種時序行為異常檢測演算法，指數越小越異常，參考值閾值小於0.5疑似異常，0.24基本確定為異常",
      opoptions: [">", "<"], value: "",
      placeholder: "請輸入整數，最多保留2位有效數字",
      reg: /^\d+(.\d{1,2})?$/
  },
  {
      id: "",
      key: "req_CCE", label: "時序熵異常指數",
      title: "一種時序行為熵檢測演算法，指數越小越異常，參考值閾值為0.5疑似異常",
      opoptions: [">", "<"], value: "",
      placeholder: "請輸入整數，最多保留2位有效數字",
      reg: /^\d+(.\d{1,2})?$/
  },
  {
      id: "",
      key: "ua_not_match_ip", label: "公開BOT偽造",
      title: "會話請求偽造為公開BOT類型，例如：使用百度爬蟲的UA，但IP不是百度的IP",
      opoptions: ["yes", "no"]
  }
];

//匹配欄位--UA類型 的匹配內容
export const ua_type_list = [{ value: "browser", label: "瀏覽器" },
  { value: "mobile", label: "移動端" },
  { value: "gameortv", label: "遊戲或電視終端" },
  { value: "bot", label: "公開BOT類型" },
  { value: "bot-unknown", label: "未公開BOT類型" },
  { value: "tools", label: "自動化工具" },
  { value: "unknown", label: "未知類型" },
  { value: "scanner", label: "公開掃描器" },
  { value: "frmework", label: "開發框架" },
  { value: "http library", label: "語言HTTP庫" }];
// TCB BOT分類
export const tcb_types = [
    "Search engine bot",
    "Site monitor",
    "Screenshot creator",
    "Link checker",
    "Web scraper",
    "Vulnerability scanner",
    "Virus scanner",
    "Speed tester",
    "Feed Fetcher",
    "Tool",
    "Marketing",
    "Uncategorised"
];

// 自定義會話特徵-ua
export const uaRules = [
{
    id: "",
    key: "ua_exist", label: "UA存在性",
    opoptions: ["yes", "no"]
},
{
    id: "",
    key: "ua_match", label: "請求最多的UA",
    opoptions: ["contains", "not contains"], value: "",
    reg: /^(.{1,1024})$/,
    placeholder: "請輸入1024個字元以內"
},

{
    id: "",
    key: "ua_kind_nums", label: "UA種類",
    title: "會話請求中COOKIE去重後的數目，過多疑似異常，對非代理IP有效",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入0-100000之間的整數",
    reg: /^(\d{1,5}|100000)$/
},
{
    id: "",
    key: "ua_valid_rate", label: "UA存在比",
    title: "會話請求中UA的存在比例，取值範圍0-1，過低疑似異常",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入0-1範圍內的值，保留2位有效數字",
    reg: /^(0\.\d{1,2}|0|1)$/
}, {
    id: "",
    key: "ua_type", label: "UA類型",
    opoptions: ["belong"], value: [],
    valueoptions: ua_type_list,
    placeholder: "至少選擇一個"
}, {
    id: "",
    key: "ua_kind_random_rate", label: "UA隨機性指數",
    title: "會話請求中UA的隨機分布情況，取值範圍0-1，指數越高越異常，參考值閾值超過0.6疑似異常，指數超過0.92基本確定為異常",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入0-1範圍內的值，保留2位有效數字",
    reg: /^(0\.\d{1,2}|0|1)$/
}];

//  自定義會話特徵-COOKIE
export const cookieRules = [
{
    id: "",
    key: "cookie_exist", label: "COOKIE存在性",
    opoptions: ["yes", "no"]
},
{
    id: "",
    key: "cookie_match", label: "請求最多的COOKIE",
    opoptions: ["contains", "not contains"], value: "",
    reg: /^(.{1,1024})$/,
    placeholder: "請輸入1024個字元以內"
},
{
    id: "",
    key: "cookie_repeat", label: "COOKIE重複比",
    title: "會話請求中COOKIE重複比例，取值範圍0-1，越大說明重複性越高",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入0-1範圍內的值，保留2位有效數字",
    reg: /^(0\.\d{1,2}|0|1)$/
},
{
    id: "",
    key: "cookie_valid_rate", label: "COOKIE存在比",
    title: "會話請求中COOKIE存在比例，取值範圍0-1，越大說明存在性越高",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入0-1範圍內的值，保留2位有效數字",
    reg: /^(0\.\d{1,2}|0|1)$/
},
{
    id: "",
    key: "cookie_abuse", label: "COOKIE濫用",
    title: "多種不同的UA使用相同的COOKIE",
    opoptions: ["yes", "no"]
},
{
    id: "",
    key: "cookie_kind_nums", label: "COOKIE種類",
    title: "會話請求中COOKIE去重後的數目",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入0-100000之間的整數",
    reg: /^(\d{1,5}|100000)$/
}];

// 自定義會話特徵-Referer
export const referRules = [
{
    id: "",
    key: "refer_exist", label: "Referer存在性",
    opoptions: ["yes", "no"]
},
{
    id: "",
    key: "refer_match", label: "請求最多的Referer",
    opoptions: ["contains", "not contains"], value: "",
    reg: /^(.{1,1024})$/,
    placeholder: "請輸入1024個字元以內"
},
{
    id: "",
    key: "refer_repeat", label: "Referer重複比",
    title: "會話請求中referer重複比例，取值範圍0-1，對瀏覽器訪問有效，過高疑似異常",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入0-1範圍內的值，保留2位有效數字",
    reg: /^(0\.\d{1,2}|0|1)$/
},
{
    id: "",
    key: "refer_valid_rate", label: "Referer存在比",
    title: "會話請求中referer存在比例，取值範圍0-1，對瀏覽器訪問有效，過低疑似異常",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入0-1範圍內的值，保留2位有效數字",
    reg: /^(0\.\d{1,2}|0|1)$/
},
{
    id: "",
    key: "refer_abuse", label: "Referer濫用",
    title: "多種不同的UA使用相同的referer",
    opoptions: ["yes", "no"]
}, {
    id: "",
    key: "refer_kind_nums", label: "Referer種類",
    title: "會話請求中referer去重後的數目",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入0-100000之間的整數",
    reg: /^(\d{1,5}|100000)$/
}];

// 自定義會話特徵-HTTP頭部
export const headerRules = [
{
    id: "",
    key: "accept_exist", label: "Accept存在性",
    opoptions: ["yes", "no"]
},
{
    id: "",
    key: "accept_language_exist", label: "Accept-Language存在性",
    opoptions: ["yes", "no"]
},
{
    id: "",
    key: "accept_encoding_exist", label: "Accept-Encoding存在性",
    opoptions: ["yes", "no"]
},
{
    id: "",
    key: "connection_exist", label: "Connection存在性",
    opoptions: ["yes", "no"]
},
{
    id: "",
    key: "method", label: "請求方法佔比",
    arg: "",
    argreg: /^(GET|HEAD|POST|PUT|OPTIONS|DELETE|TRACE|PATCH|CONNECT)(((,|，)(GET|HEAD|POST|PUT|OPTIONS|DELETE|TRACE|PATCH|CONNECT)){0,4})$/,
    argplaceholder: "如GET；多個逗號隔開，最多5個",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入百分比，如50%",
    reg: /^(\d|[1-9]\d|100)%$/
},
{
    id: "",
    key: "protocal", label: "HTTP協議版本佔比",
    //argreg: /^\d\.\d$/,
    argreg: /^\d\.\d((,|，)(\d\.\d)){0,4}$/,
    argplaceholder: "如1.1；多個逗號隔開，最多5個",
    arg: "",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入百分比，如50%",
    reg: /^(\d|[1-9]\d|100)%$/
}, {
    id: "",
    key: "status", label: "返回狀態碼佔比",
    arg: "",
    //argreg: /^\d{3}$/,
    argreg: /^\d{3}((,|，)(\d{3})){0,4}$/,
    argplaceholder: "如403；多個逗號隔開，最多5個",
    opoptions: [">", "<"], value: "",
    placeholder: "請輸入百分比，如50%",
    reg: /^(\d|[1-9]\d|100)%$/
}];
export const ALL_RULE_ARR = [
  ...sessionRules,
  ...ipRules,
  ...reqRules,
  ...advanceRules,
  ...uaRules,
  ...cookieRules,
  ...referRules,
  ...headerRules
]

export const ALL_RULE = arr2Obj(ALL_RULE_ARR, 'key')
export const ALL_OPTION = arr2Obj([...ip_owner_list, ...ip_type_list, ...ua_type_list, ...scene_flag_list], 'value')

export const ARGS_MAP = {
  "ARGS_GET": "GET參數值",
  "ARGS_GET_NAME": "GET參數名",
  "ARGS_POST": "POST參數值",
  "ARGS_POST_NAME": "POST參數名",
  "REQUEST_HEADERS": "HTTP請求頭",
  "REQUEST_HEADERS[Range]": "HTTP請求頭",
  "REQUEST_URI_RAW": "請求URI",
  "REQUEST_URI": "請求URI",
  "PATH_INFO": "請求路徑",
  "FILECONTENT": "文件內容",
  "REQUEST_COOKIE": "COOKIE內容",
  "REMOTE_ADDR": "來源IP",
  "REQUEST_HEADERS[Referer]": "Referer",
  "USER_AGENT": "User-Agent",
  "none": "無"
}



export const UCB_HTTP_PROTOCLS = [{
  id: "method",
  type: "http",
  name: "使用HTTP HEAD方法",
  ftname: "使用HTTP HEAD方法",
  desc: "預設",
  rule_type: 1,
  addition_arg: "none",
  action: "monitor",
  rule: [
      {
          key: "method",
          op: "proportion",
          op_arg: ["HEAD"],
          op_op: ">",
          op_value: 0
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
}, {
  id: "protocal",
  type: "http",
  name: "HTTP协议为1.0或者更低",
  ftname: "HTTP協議為1.0或者更低",
  desc: "預設",
  rule_type: 1,
  addition_arg: "none",
  action: "monitor",
  rule: [
      {
          key: "protocal",
          op: "proportion",
          op_arg: ["1.0", "0.9"],
          op_op: ">",
          op_value: 0.5
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
}];


export const UCB_HEADERS_PROTOCLS = [
  {
      id: "referer_exist",
      type: "headers",
      name: "Referer空或不存在",
      ftname: "Referer空或不存在",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              "key": "referer_exist",
              "op": "logic",
              "value": false
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  }, {
      id: "refer_kind_nums",
      type: "headers",
      name: "Referer滥用(多个UA使用相同Referer)",
      ftname: "Referer濫用(多個UA使用相同Referer)",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              key: "ua_kind_nums",
              op: ">",
              value: 10
          },
          {
              key: "refer_kind_nums",
              op: "=",
              value: 1
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  }, {
      id: "ua_kind_nums",
      type: "headers",
      name: "Cookie滥用(多个UA使用相同Cookie)",
      ftname: "Cookie濫用(多個UA使用相同Cookie)",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              key: "ua_kind_nums",
              op: ">",
              value: 10
          },
          {
              key: "cookie_kind_nums",
              op: "=",
              value: 1
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  }, {
      id: "cookie_exist",
      type: "headers",
      name: "Cookie空或不存在",
      ftname: "Cookie空或不存在",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              key: "cookie_exist",
              op: "logic",
              value: false
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  }, {
      id: "connection_exist",
      type: "headers",
      name: "Connection空或不存在",
      ftname: "Connection空或不存在",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              key: "connection_exist",
              op: "logic",
              value: false
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  }, {
      id: "accept_exist",
      type: "headers",
      name: "Accept空或不存在",
      ftname: "Accept空或不存在",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              key: "accept_exist",
              op: "logic",
              value: false
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  },
  {
      id: "accept_language_exist",
      type: "headers",
      name: "Accept-Language空或不存在",
      ftname: "Accept-Language空或不存在",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              key: "accept_language_exist",
              op: "logic",
              value: false
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  },
  {
      id: "accept_encoding_exist",
      type: "headers",
      name: "Accept-Enconding空或不存在",
      ftname: "Accept-Enconding空或不存在",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              key: "accept_encoding_exist",
              op: "logic",
              value: false
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  }
];

export const UCB_UA_PROTOCLS = [
  {

      id: "ua_exist",
      type: "ua",
      name: "User-Agent为空或不存在",
      ftname: "User-Agent為空或不存在",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              key: "ua_exist",
              op: "logic",
              value: false
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  },
  {
      id: "ua_type_bot",
      type: "ua",
      action: "monitor",
      addition_arg: "none",
      desc: "預設",
      name: "User-Agent类型为BOT",
      ftname: "User-Agent類型為BOT",
      on_off: "off",
      rule: [{
          key: "ua_type",
          op: "belong",
          value: [
              "bot"
          ]
      }],
      rule_type: 1,
      timestamp: 0,
      valid_time: 0,
      visible: true
  },
  {
      id: "ua_type_http",
      type: "ua",
      name: "User-Agent类型为HTTP Library",
      ftname: "User-Agent類型為HTTP Library",
      action: "monitor",
      addition_arg: "none",
      desc: "預設",
      domain: "test.com",
      rule: [
          {
              "key": "ua_type",
              "op": "belong",
              "value": [
                  "http library"
              ]
          }
      ],
      on_off: "off",
      rule_type: 1,
      timestamp: 0,
      valid_time: 0,
      visible: true
  },
  {
      id: "ua_type_framework",
      type: "ua",
      name: "User-Agent类型为Framework",
      ftname: "User-Agent類型為Framework",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              key: "ua_type",
              op: "belong",
              value: [
                  "framework"
              ]
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  },
  {
      id: "ua_type_tools",
      type: "ua",
      name: "User-Agent类型为Tools",
      ftname: "User-Agent類型為Tools",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              key: "ua_type",
              op: "belong",
              value: [
                  "tools"
              ]
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  },
  {
      id: "ua_type_bot-unknown",
      type: "ua",
      name: "User-Agent类型为Unkonwn BOT",
      ftname: "User-Agent類型為Unkonwn BOT",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              key: "ua_type",
              op: "belong",
              value: [
                  "bot-unknown"
              ]
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  },
  {
      id: "ua_type_scanner",
      type: "ua",
      name: "User-Agent类型为Scanner",
      ftname: "User-Agent類型為Scanner",
      desc: "預設",
      rule_type: 1,
      addition_arg: "none",
      action: "monitor",
      rule: [
          {
              "key": "ua_type",
              "op": "belong",
              "value": [
                  "scanner"
              ]
          }
      ],
      on_off: "off",
      valid_time: 0,
      timestamp: 0,
      visible: true
  }
];

export const UCB_PROTOCLS = UCB_HTTP_PROTOCLS.concat(UCB_HEADERS_PROTOCLS).concat(UCB_UA_PROTOCLS)

export const UCB_IPS = [{
  id: "boce",
  name: "撥測",
  timestamp: 0,
  action: "",
  isOpen: true,
  type: "",
  visible: true
}, {
  name: "腾讯云WAF拨测", // ！！！这里不要改为台富云  用于接口传参
  ftname: "台富雲WAF撥測",
  type: "boce",
  desc: "預設",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",
  rule: [
      {
          key: "ip_scope",
          op: "belong",
          value: []
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
}, {
  id: "idc",
  name: "IDC-IP库",
  ftname: "IDC-IP庫",
  timestamp: 0,
  action: "monitor",
  isOpen: true,
  type: "",
  visible: true
},
{
  name: "IDC-IP 腾讯云", // ！！！这里不要改为台富云  用于接口传参
  ftname: "IDC-IP 台富雲",
  desc: "預設",
  type: "idc",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",

  rule: [
      {
          "key": "ip_type",
          "op": "contains",
          "value": "idc"
      },
      {
          "key": "ip_owner",
          "op": "contains",
          "value": "tencent.com"
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
},
{
  name: "IDC-IP 阿里云",
  ftname: "IDC-IP 阿里雲",
  desc: "預設",
  type: "idc",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",
  rule: [
      {
          key: "ip_type",
          op: "contains",
          value: "idc"
      },
      {
          key: "ip_owner",
          op: "contains",
          value: "阿里雲"
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
},
{
  name: "IDC-IP 华为云",
  ftname: "IDC-IP 華為雲",
  desc: "預設",
  type: "idc",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",

  rule: [
      {
          key: "ip_type",
          op: "contains",
          value: "idc"
      },
      {
          key: "ip_owner",
          op: "contains",
          value: "huawei.com"
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
},
{
  name: "IDC-IP 金山云",
  ftname: "IDC-IP 金山雲",
  desc: "預設",
  type: "idc",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",

  rule: [
      {
          key: "ip_type",
          op: "contains",
          value: "idc"
      },
      {
          key: "ip_owner",
          op: "contains",
          value: "ksyun.com"
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
}, {
  name: "IDC-IP UCloud",
  ftname: "IDC-IP UCloud",
  desc: "預設",
  type: "idc",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",
  rule: [
      {
          key: "ip_type",
          op: "contains",
          value: "idc"
      },
      {
          key: "ip_owner",
          op: "contains",
          value: "ucloud.cn"
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
},
{
  name: "IDC-IP 百度云",
  ftname: "IDC-IP 百度雲",
  desc: "預設",
  type: "idc",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",

  rule: [
      {
          key: "ip_type",
          op: "contains",
          value: "idc"
      },
      {
          key: "ip_owner",
          op: "contains",
          value: "baidu.com"

      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
},

{
  name: "IDC-IP 京东云",
  ftname: "IDC-IP 京東雲",
  desc: "預設",
  type: "idc",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",
  rule: [
      {
          key: "ip_type",
          op: "contains",
          value: "idc"
      },
      {
          key: "ip_owner",
          op: "contains",
          value: "pubyun.com"
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
},
{
  name: "IDC-IP 青云",
  ftname: "IDC-IP 青雲",
  desc: "預設",
  type: "idc",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",

  rule: [
      {
          key: "ip_type",
          op: "contains",
          value: "idc"
      },
      {
          key: "ip_owner",
          op: "contains",
          value: "qingcloud.com"
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
},
{
  name: "IDC-IP Aws",
  ftname: "IDC-IP Aws",
  type: "idc",
  desc: "預設",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",
  rule: [
      {
          key: "ip_type",
          op: "contains",
          value: "idc"
      },
      {
          key: "ip_owner",
          op: "contains",
          value: "amazon.com"
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
},
{
  name: "IDC-IP Azure",
  ftname: "IDC-IP Azure",
  desc: "預設",
  type: "idc",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",

  rule: [
      {
          key: "ip_type",
          op: "contains",
          value: "idc"
      },
      {
          key: "ip_owner",
          op: "contains",
          value: "microsoft.com"
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
},
{
  name: "IDC-IP Google",
  ftname: "IDC-IP Google",
  des: "預設",
  type: "idc",
  rule_type: 2,
  addition_arg: "none",
  action: "monitor",

  rule: [
      {
          key: "ip_type",
          op: "contains",
          value: "idc"
      },
      {
          key: "ip_owner",
          op: "contains",
          value: "cloud.google.com"
      }
  ],
  on_off: "off",
  valid_time: 0,
  timestamp: 0,
  visible: true
}];