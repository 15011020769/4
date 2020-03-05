import { obj2Arr, addVal2Key, isValidIPAddressNew, isValidIPv6, arr2Obj } from '@/utils'
export const SAFE_OVERVIEW_SHOWMODULE_KEY = 'waf:safeOverView:showModules'
export const BUSINESS_SHOWMODULE_KEY = 'waf:business:showModules'
export const ORDER_INFO = 'waf:order_info'
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
// SAAS和CLBWAF 的 日志服务 改成是共享的了 ，使用BUY_LOG_TYPES， 域名包和QPS使用CLB_XXX
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
/** 公共错误code */
export const COMMON_ERROR = {
  'FailedOperation': '操作失败。',
  'InternalError': '内部错误。',
  'InvalidParameter': '参数错误。',
  'InvalidParameterValue': '参数取值错误。',
  'LimitExceeded': '超过配额限制。',
  'MissingParameter': '缺少参数错误。',
  'ResourceInUse': '资源被占用。',
  'ResourceInsufficient': '资源不足。',
  'ResourceNotFound': '资源不存在。',
  'ResourceUnavailable': '资源不可用。',
  'ResourcesSoldOut': '资源售罄。',
  'UnauthorizedOperation': '未授权操作。',
  'UnknownParameter': '未知参数错误。',
}
/** 自定义策略逻辑符号 */
const LOGIC_SYMBOL_LOCAL = {
  ipmatch: '匹配',
  ipnmatch: '不匹配',
  empty: '内容为空',
  null: '不存在',
  eq: '等于',
  neq: '不等于',
  contains: '包含',
  ncontains: '不包含',
  len_eq: '长度等于',
  len_gt: '长度大于',
  len_lt: '长度小于',
  strprefix: '前缀匹配',
  strsuffix: '后缀匹配',
  exsit: '存在参数',
  nexsit: '不存在参数',
}
export const LOGIC_SYMBOL = addVal2Key(LOGIC_SYMBOL_LOCAL)
export const LOGIC_SYMBOL_ARR = obj2Arr(LOGIC_SYMBOL_LOCAL)

/** 自定义策略匹配字段 */
export const MATCH_KEY = {
  IP: {
    name: '来源IP',
    param: false,
    symbol: ['ipmatch', 'ipnmatch'],
    placeholder: '多个IP以英文逗号隔开，最多20个',
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
    name: '来源IPv6',
    param: false,
    symbol: ['ipmatch', 'ipnmatch'],
    placeholder: '支持单个IPV6地址',
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
    placeholder: '请输入内容，512个字符以内',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  URL: {
    name: '请求路径',
    param: false,
    symbol: ['eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
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
    placeholder: '请输入内容，512个字符以内',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  HTTP_METHOD: {
    name: 'HTTP请求方法',
    param: false,
    symbol: ['eq', 'neq',],
    placeholder: '请输入方法名称，建议大写',
    validator: () => (rule, value, callback) => {
      if (!value || !['HEAD', 'GET', 'POST', 'PUT', 'OPTIONS', 'TRACE', 'DELETE', 'PATCH', 'CONNECT'].includes(value.toUpperCase())) {
        return callback('支持HEAD,GET,POST,PUT,OPTIONS,TRACE,DELETE,PATCH,CONNECT')
      }
      callback()
    },
  },
  QUERY_STRING: {
    name: '请求字符串',
    param: false,
    symbol: ['eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  GET: {
    name: 'GET参数值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  GET_PARAMS_NAMES: {
    name: 'GET参数名',
    param: false,
    symbol: ['exsit', 'nexsit', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  POST: {
    name: 'POST参数值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  GET_POST_NAMES: {
    name: 'POST参数名',
    param: false,
    symbol: ['exsit', 'nexsit', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
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
    placeholder: '请输入BODY内容，512个字符以内',
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
    name: 'Cookie参数名',
    param: false,
    symbol: ['exsit', 'nexsit', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  ARGS_COOKIE: {
    name: 'Cookie参数值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  GET_HEADERS_NAMES: {
    name: 'Header参数名',
    param: false,
    symbol: ['exsit', 'nexsit', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，建议小写，512个字符以内',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
  ARGS_HEADER: {
    name: 'Header参数值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validator: match => (rule, value, callback) => {
      if (!value || value.length > 512) {
        return callback(new Error(match.placeholder))
      }
      callback()
    }
  },
}
export const MATCH_KEY_ARR = obj2Arr(MATCH_KEY)

/** 自定义策略执行动作  */
const POLICY_RULE_ACTION_LOCAL = {
  0: '放行',
  1: '阻断',
  2: '人机识别',
  3: '观察',
  4: '重定向',
}
export const POLICY_RULE_ACTION = addVal2Key(POLICY_RULE_ACTION_LOCAL)
export const POLICY_RULE_ACTION_ARR = obj2Arr(POLICY_RULE_ACTION_LOCAL)

/** 自定义会话执行动作  */
const CUSTOM_SESSION_ACTION_LOCAL = {
  permit: '放行',
  monitor: '监控',
  redirect: '重定向',
  captcha: '验证码',
  intercept: '拦截',
}
export const CUSTOM_SESSION_ACTION = addVal2Key(CUSTOM_SESSION_ACTION_LOCAL)
export const CUSTOM_SESSION_ACTION_ARR = obj2Arr(CUSTOM_SESSION_ACTION_LOCAL)

export const UCB_ACTION_LOCAL = {
  permit: '放行',
  monitor: '监控',
  captcha: '验证码',
  intercept: '拦截',
}
export const UCB_ACTION = addVal2Key(UCB_ACTION_LOCAL)
export const UCB_ACTION_ARR = obj2Arr(UCB_ACTION_LOCAL)

/** 放行后继续执行的动作 */
export const BY_PASS_ACTION = {
  geoip: '继续执行地域封禁防护',
  cc: '继续执行CC策略防护',
  owasp: '继续执行WEB应用防护',
  ai: '继续执行AI引擎防护',
  antileakage: '继续执行信息防泄漏防护'
}
export const BY_PASS_ACTION_ARR = obj2Arr(BY_PASS_ACTION)


/** CC规则执行动作 */
const CC_RULE_ACTION_LOCAL = {
  20: '观察',
  21: '人机识别',
  22: '拦截',
}
export const CC_RULE_ACTION = addVal2Key(CC_RULE_ACTION_LOCAL)
export const CC_RULE_ACTION_ARR = obj2Arr(CC_RULE_ACTION_LOCAL)

export const ALL_ACTION = {
  ...CC_RULE_ACTION_LOCAL,
  ...CUSTOM_SESSION_ACTION_LOCAL,
  POLICY_RULE_ACTION_LOCAL
}

/** CC规则匹配条件  */
const CC_RULE_MATCH_LOCAL = {
  0: '相等',
  1: '前缀匹配',
  2: '包含'
}
export const CC_RULE_MATCH = addVal2Key(CC_RULE_MATCH_LOCAL)
export const CC_RULE_MATCH_ARR = obj2Arr(CC_RULE_MATCH_LOCAL)

/** IP封堵类型 */
const IP_STATUS_TYPE_LOCAL = {
  CC: 'CC',
  BOT: 'BOT',
  DIY: '自定义人机识别'
}
export const IP_STATUS_TYPE = addVal2Key(IP_STATUS_TYPE_LOCAL)
export const IP_STATUS_TYPE_ARR = obj2Arr(IP_STATUS_TYPE_LOCAL)

/** 自定义会话特征匹配字段 */
export const ATTACK_TYPE = [
  { id: "全部攻击类型", label: "全部攻击类型" },
  { id: "SQL注入攻击", label: "SQL注入攻击" },
  { id: "XSS攻击", label: "XSS攻击" },
  { id: "命令注入攻击", label: "命令注入攻击" },
  { id: "LDAP注入攻击", label: "LDAP注入攻击" },
  { id: "SSI注入攻击", label: "SSI注入攻击" },
  { id: "XML注入攻击", label: "XML注入攻击" },
  { id: "WEB服务器漏洞攻击", label: "WEB服务器漏洞攻击" },
  { id: "WEB应用漏洞攻击", label: "WEB应用漏洞攻击" },
  { id: "路径跨越攻击", label: "路径跨越攻击" },
  { id: "核心文件非法访问", label: "核心文件非法访问" },
  { id: "文件上传攻击", label: "文件上传攻击" },
  { id: "木马后门攻击", label: "木马后门攻击" },
  { id: "CSRF攻击", label: "CSRF攻击" },
  { id: "恶意扫描", label: "恶意扫描" },
  { id: "自定义策略", label: "自定义策略" },
  { id: "地域封禁拦截", label: "地域封禁拦截" },
  { id: "信息防泄漏替换", label: "信息防泄漏替换" },
  { id: "AI引擎检出", label: "AI引擎检出" },
  { id: "IP黑名单", label: "IP黑名单" },
  { id: "CC策略拦截", label: "CC策略拦截" },
  { id: "Bot 拦截", label: "Bot 拦截" },
]

export const BOTS_TYPES_CFG = {
  TCB: "公开类型",
  UCB: "用户自定义类型",
  UB: "未知类型"
}

//  自定义策略-会话特征
export const sessionRules = [
  {
      id: "",
      key: "avg_speed", label: "会话平均速度",
      title: "等于会话请求总次数/会话持续时间，单位为：次/分钟",
      opoptions: [">", "<"], value: "",
      placeholder: "请输入0-100000之间整数，次/分钟",
      reg: /^(\d{1,5}|100000)$/
  },
  {
      id: "",
      key: "win_speed", label: "会话窗口速度",
      title: "最近检测窗口（2分钟）内的会话访问速度，单位为：次/分钟",
      opoptions: [">", "<"], value: "",
      placeholder: "请输入0-100000之间整数，次/分钟",
      reg: /^(\d{1,5}|100000)$/
  },
  {
      id: "",
      key: "nums", label: "会话总次数",
      opoptions: [">", "<"], value: "",
      placeholder: "请输入0-100000之间整数",
      reg: /^(\d{1,5}|100000)$/
  },
  {
      id: "",
      key: "session_duration", label: "会话持续时间",
      opoptions: [">", "<"], value: "",
      placeholder: "请输入0-100000之间整数，单位：分钟",
      reg: /^(\d{1,5}|100000)$/
  },

  {
      id: "",
      key: "robots_exist", label: "会话存在Robots.txt",
      title: "会话请求中访问Robots.txt文件",
      opoptions: ["yes", "no"]
  },
  {
      id: "",
      key: "req_in_wee_hours", label: "会话发生在凌晨",
      title: "会话请求发生在凌晨",
      opoptions: ["yes", "no"]
  }
];

// 自定义策略-ip特征
//匹配字段--IP所有者 的匹配内容
export const ip_owner_list = [
  { value: "amazon.com", label: "Aws" },
  { value: "microsoft.com", label: "Azure" },
  { value: "cloud.google.com", label: "Google" },
  { value: "ucloud.cn", label: "UCloud" },
  { value: "阿里云", label: "阿里云" },
  { value: "baidu.com", label: "百度云" },
  { value: "huawei.com", label: "华为云" },
  { value: "ksyun.com", label: "金山云" },
  { value: "pubyun.com", label: "京东云" },
  { value: "qingcloud.com", label: "青云" },
  { value: "tencent.com", label: "腾讯云" }
];
//匹配字段--IP类型 的匹配内容
export const ip_type_list = [{ value: "idc", label: "互联网数据中心（IDC）" },
{ value: "bs", label: "运营商基站" },
{ value: "unknown", label: "未知类型" }];
  export const ipRules = [
    {
        id: "",
        key: "ip_scope", label: "访问源IP",
        title: "",
        opoptions: ["belong", "not belong"], value: "",
        placeholder: `支持三种形式的ip,多个ip之间分行隔开，示例如下：
        123.25.254.21
        123.25.254.21/24
        123.25.254.21-123.25.254.45`,
        reg: /(^\d{1,3}(.\d{1,3}){3}$)|(^(\d{1,3}.){3}\d{1,3}\/\d{1,3}$)|(^\d{1,3}(.\d{1,3}){3}-\d{1,3}(.\d{1,3}){3}$)/
    },
    {
        id: "",
        key: "ip_type", label: "IP类型",
        title: "IP的类型信息，類型為IDC或基站(运营商基站)，当IP为IDC类型时疑似存在异常",
        opoptions: ["contains", "not contains"], value: ""
        , valueoptions: ip_type_list,
        placeholder: "请选择1个",
        reg: /^.+$/,
    },
    {
        id: "",
        key: "ip_owner", label: "IP所有者",
        title: "IP所有者信息（当IP類型為IDC时有效），例如：tencent.com，可以在BOT详情中查看",
        opoptions: ["belong", "not belong"], value: [],
        valueoptions: ip_owner_list,
        placeholder: "请选择1个",
        reg: /^.+$/,
}];

  //  自定义会话特征-请求特征
  export const reqRules = [
    {
        id: "",
        key: "url_match", label: "请求最多的URL",
        opoptions: ["contains", "not contains"], value: "",
        placeholder: "请输入1024个字符以内",
        reg: /^.{1,1024}$/
    },
    {
        id: "",
        key: "req_url_repeat", label: "URL重复比",
        title: "会话请求中URL重复比比例，取值范围0-1，过高或过低疑似异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    },
    {
        id: "",
        key: "req_url_kind", label: "URL种类",
        opoptions: [">", "<"], value: "",
        title: "会话请求中URL去重后条目数",
        placeholder: "请输入0-100000之间整数",
        reg: /^(\d{1,5}|100000)$/
    },
    {
        id: "",
        key: "param_match", label: "请求最多的参数",
        title: "会话请求出现最多的参数，包括GET请求参数（Query内容）或POST请求参数（Body内容）",
        opoptions: ["contains", "not contains"], value: "",
        placeholder: "请输入1024个字符以内",
        reg: /^.{1,1024}$/
    },
    {
        id: "",
        key: "req_query_repeat", label: "参数重复比",
        title: "会话请求中GET请求参数（Query内容）或POST请求参数（Body内容）重复比例，取值范围0-1，过高疑似异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    }];

// 自定义会话特征-高级特征
export const scene_flag_list = [
  { value: "crawler_unregular", label: "疑似无规律爬虫" },
  { value: "crawler_regular", label: "疑似规律性爬虫" },
  { value: "request_repeat", label: "疑似接口重复访问" },
  { value: "credential_cracking", label: "疑似暴力破解" },
  { value: "credential_stuffing", label: "疑似撞库攻击" },
  { value: "brush_sms", label: "疑似刷短信接口" },
  { value: "brush_captcha", label: "疑似刷验证码接口" },
  { value: "reg_malicious", label: "疑似恶意注册" },
  { value: "credential_miss_user", label: "疑似登录行为，缺失用户值" },
  { value: "credential_without_user", label: "疑似登录行为，缺失用户参数" },
  { value: "credential_only_action", label: "疑似登录行为，缺失用户和密码" },
  { value: "credential_user_password", label: "疑似登录行为，缺失登录动作" }
];
export const advanceRules = [
  {
      id: "",
      key: "score", label: "BOT得分",
      title: "BOT智能分析引擎对会话给出的BOT得分，得分越高判定为BOT可能性越大，参考值为：5",
      opoptions: [">", "<"], value: "",
      placeholder: "请输入0-30之间整数",
      reg: /^(\d|[12]\d|30)$/
  },
  {
      id: "",
      key: "AI_abnormal_flag", label: "AI模型检出",
      title: "AI行为分析模型检测结果，结果为AI模型检出时，疑似异常。",
      opoptions: ["yes", "no"]
  },
  {
      id: "",
      key: "scene_flag", label: "预测标签",
      title: "算法自动预测的疑似行为",
      opoptions: ["belong", "not belong"], value: [],
      valueoptions: scene_flag_list
  },
  {
      id: "",
      key: "sensitive_request_flag", label: "敏感接口访问",
      title: "判断是否对敏感接口（如：短信接口、注册接口、登录接口等）进行访问",
      opoptions: ["yes", "no"]
  },
  {
      id: "",
      key: "req_variance", label: "时序行为异常指数",
      title: "一种时序行为异常检测算法，指数越小越异常，参考值阈值小于0.5疑似异常，0.24基本确定为异常",
      opoptions: [">", "<"], value: "",
      placeholder: "请输入整数，最多保留2位有效数字",
      reg: /^\d+(.\d{1,2})?$/
  },
  {
      id: "",
      key: "req_CCE", label: "时序熵异常指数",
      title: "一种时序行为熵检测算法，指数越小越异常，参考值阈值为0.5疑似异常",
      opoptions: [">", "<"], value: "",
      placeholder: "请输入整数，最多保留2位有效数字",
      reg: /^\d+(.\d{1,2})?$/
  },
  {
      id: "",
      key: "ua_not_match_ip", label: "公开BOT伪造",
      title: "会话请求伪造为公开BOT类型，例如：使用百度爬虫的UA，但IP不是百度的IP",
      opoptions: ["yes", "no"]
  }
];

  //匹配字段--UA类型 的匹配内容
 export const ua_type_list = [{ value: "browser", label: "浏览器" },
  { value: "mobile", label: "移动端" },
  { value: "gameortv", label: "游戏或电视终端" },
  { value: "bot", label: "公开BOT类型" },
  { value: "bot-unknown", label: "未公开BOT类型" },
  { value: "tools", label: "自动化工具" },
  { value: "unknown", label: "未知类型" },
  { value: "scanner", label: "公开扫描器" },
  { value: "frmework", label: "开发框架" },
  { value: "http library", label: "语言HTTP库" }];
  // TCB BOT分类
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

// 自定义会话特征-ua
  export const uaRules = [
    {
        id: "",
        key: "ua_exist", label: "UA存在性",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "ua_match", label: "请求最多的UA",
        opoptions: ["contains", "not contains"], value: "",
        reg: /^(.{1,1024})$/,
        placeholder: "请输入1024个字符以内"
    },

    {
        id: "",
        key: "ua_kind_nums", label: "UA种类",
        title: "会话请求中COOKIE去重后的数目，过多疑似异常，对非代理IP有效",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-100000之间的整数",
        reg: /^(\d{1,5}|100000)$/
    },
    {
        id: "",
        key: "ua_valid_rate", label: "UA存在比",
        title: "会话请求中UA的存在比例，取值范围0-1，过低疑似异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    }, {
        id: "",
        key: "ua_type", label: "UA类型",
        opoptions: ["belong"], value: [],
        valueoptions: ua_type_list,
        placeholder: "至少选择一个"
    }, {
        id: "",
        key: "ua_kind_random_rate", label: "UA随机性指数",
        title: "会话请求中UA的随机分布情况，取值范围0-1，指数越高越异常，参考值阈值超过0.6疑似异常，指数超过0.92基本确定为异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
  }];

  //  自定义会话特征-COOKIE
  export const cookieRules = [
    {
        id: "",
        key: "cookie_exist", label: "COOKIE存在性",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "cookie_match", label: "请求最多的COOKIE",
        opoptions: ["contains", "not contains"], value: "",
        reg: /^(.{1,1024})$/,
        placeholder: "请输入1024个字符以内"
    },
    {
        id: "",
        key: "cookie_repeat", label: "COOKIE重复比",
        title: "会话请求中COOKIE重复比例，取值范围0-1，越大说明重复性越高",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    },
    {
        id: "",
        key: "cookie_valid_rate", label: "COOKIE存在比",
        title: "会话请求中COOKIE存在比例，取值范围0-1，越大说明存在性越高",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    },
    {
        id: "",
        key: "cookie_abuse", label: "COOKIE滥用",
        title: "多种不同的UA使用相同的COOKIE",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "cookie_kind_nums", label: "COOKIE种类",
        title: "会话请求中COOKIE去重后的数目",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-100000之间的整数",
        reg: /^(\d{1,5}|100000)$/
  }];

  // 自定义会话特征-Referer
  export const referRules = [
    {
        id: "",
        key: "refer_exist", label: "Referer存在性",
        opoptions: ["yes", "no"]
    },
    {
        id: "",
        key: "refer_match", label: "请求最多的Referer",
        opoptions: ["contains", "not contains"], value: "",
        reg: /^(.{1,1024})$/,
        placeholder: "请输入1024个字符以内"
    },
    {
        id: "",
        key: "refer_repeat", label: "Referer重复比",
        title: "会话请求中referer重复比例，取值范围0-1，对浏览器访问有效，过高疑似异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    },
    {
        id: "",
        key: "refer_valid_rate", label: "Referer存在比",
        title: "会话请求中referer存在比例，取值范围0-1，对浏览器访问有效，过低疑似异常",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-1范围内的值，保留2位有效数字",
        reg: /^(0\.\d{1,2}|0|1)$/
    },
    {
        id: "",
        key: "refer_abuse", label: "Referer滥用",
        title: "多种不同的UA使用相同的referer",
        opoptions: ["yes", "no"]
    }, {
        id: "",
        key: "refer_kind_nums", label: "Referer种类",
        title: "会话请求中referer去重后的数目",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入0-100000之间的整数",
        reg: /^(\d{1,5}|100000)$/
  }];

  // 自定义会话特征-HTTP头部
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
        key: "method", label: "请求方法占比",
        arg: "",
        argreg: /^(GET|HEAD|POST|PUT|OPTIONS|DELETE|TRACE|PATCH|CONNECT)(((,|，)(GET|HEAD|POST|PUT|OPTIONS|DELETE|TRACE|PATCH|CONNECT)){0,4})$/,
        argplaceholder: "如GET；多个逗号隔开，最多5个",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入百分比，如50%",
        reg: /^(\d|[1-9]\d|100)%$/
    },
    {
        id: "",
        key: "protocal", label: "HTTP协议版本占比",
        //argreg: /^\d\.\d$/,
        argreg: /^\d\.\d((,|，)(\d\.\d)){0,4}$/,
        argplaceholder: "如1.1；多个逗号隔开，最多5个",
        arg: "",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入百分比，如50%",
        reg: /^(\d|[1-9]\d|100)%$/
    }, {
        id: "",
        key: "status", label: "返回状态码占比",
        arg: "",
        //argreg: /^\d{3}$/,
        argreg: /^\d{3}((,|，)(\d{3})){0,4}$/,
        argplaceholder: "如403；多个逗号隔开，最多5个",
        opoptions: [">", "<"], value: "",
        placeholder: "请输入百分比，如50%",
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
  "ARGS_GET": "GET参数值",
  "ARGS_GET_NAME": "GET参数名",
  "ARGS_POST": "POST参数值",
  "ARGS_POST_NAME": "POST参数名",
  "REQUEST_HEADERS": "HTTP请求头",
  "REQUEST_HEADERS[Range]": "HTTP请求头",
  "REQUEST_URI_RAW": "请求URI",
  "REQUEST_URI": "请求URI",
  "PATH_INFO": "请求路径",
  "FILECONTENT": "文件内容",
  "REQUEST_COOKIE": "COOKIE内容",
  "REMOTE_ADDR": "来源IP",
  "REQUEST_HEADERS[Referer]": "Referer",
  "USER_AGENT": "User-Agent",
  "none": "无"
}



export const UCB_HTTP_PROTOCLS = [{
  id: "method",
  type: "http",
  name: "使用HTTP HEAD方法",
  ftname: "使用HTTP HEAD方法",
  desc: "预设",
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
  desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
      desc: "预设",
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
  name: "拨测",
  timestamp: 0,
  action: "",
  isOpen: true,
  type: "",
  visible: true
}, {
  name: "腾讯云WAF拨测",
  ftname: "騰訊雲WAF撥測",
  type: "boce",
  desc: "预设",
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
  ftname: "IDC-IP库",
  timestamp: 0,
  action: "monitor",
  isOpen: true,
  type: "",
  visible: true
},
{
  name: "IDC-IP 腾讯云",
  ftname: "IDC-IP 騰訊雲",
  desc: "预设",
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
  desc: "预设",
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
          value: "阿里云"
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
  desc: "预设",
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
  desc: "预设",
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
  desc: "预设",
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
  desc: "预设",
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
  desc: "预设",
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
  desc: "预设",
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
  desc: "预设",
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
  desc: "预设",
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
  des: "预设",
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