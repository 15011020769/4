import { obj2Arr, addVal2Key, isValidIPAddressNew, isValidIPv6 } from '@/utils'

/** 套餐包信息 */
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
  BOT: 'BOT',
  CC: 'CC',
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
