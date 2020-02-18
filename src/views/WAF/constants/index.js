import { obj2Arr } from '@/utils'

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
export const LOGIC_SYMBOL = {
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
export const MATCH_KEY = {
  IP: {
    name: '来源IP',
    param: false,
    symbol: ['ipmatch', 'ipnmatch'],
    placeholder: '多个IP以英文逗号隔开，最多20个',
    validate(val) {
      return true
    },
  },
  IPV6: {
    name: '来源IPv6',
    param: false,
    symbol: ['ipmatch', 'ipnmatch'],
    placeholder: '支持单个IPV6地址',
    validate(val) {
      return true
    },
  },
  Referer: {
    name: 'Referer',
    param: false,
    symbol: ['empty', 'null', 'eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validate(val) {
      return true
    },
  },
  URL: {
    name: '请求路径',
    param: false,
    symbol: ['eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validate(val) {
      return true
    },
  },
  UserAgent: {
    name: 'User-Agent',
    param: false,
    symbol: ['empty', 'null', 'eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validate(val) {
      return true
    },
  },
  HTTP_METHOD: {
    name: 'HTTP请求方法',
    param: false,
    symbol: ['eq', 'neq',],
    placeholder: '请输入方法名称，建议大写',
    validate(val) {
      return true
    },
  },
  QUERY_STRING: {
    name: '请求字符串',
    param: false,
    symbol: ['eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validate(val) {
      return true
    },
  },
  GET: {
    name: 'GET参数值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validate(val) {
      return true
    },
  },
  GET_PARAMS_NAMES: {
    name: 'GET参数名',
    param: false,
    symbol: ['exsit', 'nexsit', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validate(val) {
      return true
    },
  },
  POST: {
    name: 'POST参数值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validate(val) {
      return true
    },
  },
  GET_POST_NAMES: {
    name: 'POST参数名',
    param: false,
    symbol: ['exsit', 'nexsit', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validate(val) {
      return true
    },
  },
  POST_BODY: {
    name: '完整BODY',
    param: false,
    symbol: ['eq', 'neq', 'contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入BODY内容，512个字符以内',
    validate(val) {
      return true
    },
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
    validate(val) {
      return true
    },
  },
  ARGS_COOKIE: {
    name: 'Cookie参数值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validate(val) {
      return true
    },
  },
  GET_HEADERS_NAMES: {
    name: 'Header参数名',
    param: false,
    symbol: ['exsit', 'nexsit', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，建议小写，512个字符以内',
    validate(val) {
      return true
    },
  },
  ARGS_HEADER: {
    name: 'Header参数值',
    param: true,
    symbol: ['contains', 'ncontains', 'len_eq', 'len_gt', 'len_lt', 'strprefix', 'strsuffix'],
    placeholder: '请输入内容，512个字符以内',
    validate(val) {
      return true
    },
  },
}
export const POLICY_RULE_ACTION = {
  0: '放行',
  1: '阻断',
  2: '人机识别',
  3: '观察',
  4: '重定向',
}
export const POLICY_RULE_ACTION_ARR = obj2Arr(POLICY_RULE_ACTION)
export const CC_RULE_ACTION = {
  20: '观察',
  21: '人机识别',
  22: '拦截',
}
export const CC_RULE_MATCH = {
  0: '相等',
  1: '前缀匹配',
  2: '包含'
}
