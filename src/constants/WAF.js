export const DESCRIBE_USER_INFO = 'waf2/DescribeUserInfo'
/** 询价 */
export const DESCRIBE_WAF_PRICE = 'waf2/DescribeWafPrice'
/** 验证添加的域名是否已经存在 */
export const DESCRIBE_HOST_LIMIT = 'waf2/DescribeHostLimit'
/** 查询负载均衡的监听器列表 */
export const DESCRIBE_LISTENERS = 'lb2/DescribeListeners'
/** 添加防护域名 */
export const CREATE_HOST = 'waf2/CreateHost'
/** 编辑防护域名 */
export const MODIFY_HOST = 'waf2/ModifyHost'
/** 删除防护域名 */
export const DELETE_HOST = 'waf2/DeleteHost'
/** 防护域名列表 */
export const DESCRIBE_HOSTS = 'waf2/DescribeHosts'
/** 获取业务和攻击概览峰值 */
export const DESCRIBE_PEAK_VALUE = 'waf2/DescribePeakValue'
/** 获取业务和攻击概要趋势 */
export const DESCRIBE_PEAK_POINTS = 'waf2/DescribePeakPoints'
/** 业务概览峰值和趋势 */
export const WAF_INTERFACE = 'waf2/WafInterface'
/** 设置防护域名WAF开关 */
export const MODIFY_HOST_STATUS = 'waf2/ModifyHostStatus'
/** 设置域名访问日志开关 */
export const MODIFY_HOST_ACCESS_LOG_STATUS = 'waf2/ModifyHostAccessLogStatus'
/** 获取域名webshell状态 */
export const DESCRIBE_WEBSHELL_STATUS = 'waf2/DescribeWebshellStatus'
/** 设置webshell状态 */
export const MODIFY_WEBSHELL_STATUS = 'waf2/ModifyWebshellStatus'
/** 设置防护域名防护状态 */
export const MODIFY_HOST_MODE = 'waf2/ModifyHostMode'
/** ip状态查询 */
export const DESCRIBE_ACTIONED = 'waf2/DescribeActionedIp'
/** ip黑白名单查询 */
export const DESCRIBE_ACCESS_CONTROL = 'waf2/DescribeIpAccessControl'
/** 获取地域封禁配置 */
export const DESCRIBE_AREABAN_AREAS = 'waf2/DescribeAreaBanAreas'
/** 获取WAF地域封禁支持的地域列表 */
export const DESCRIBE_AREABAN_SUPPORT_AREAS = 'waf2/DescribeAreaBanSupportAreas'
/** 获取自定义策略列表 */
export const DESCRIBE_CUSTOM_RULES = 'waf2/DescribeCustomRules'
/** Waf CC V2 Query接口 */
export const DESCIRBE_CCRULE = 'waf2/DescirbeCCRule'
/** Waf 会话定义查询接口 */
export const DESCRIBE_SESSION = 'waf2/DescribeSession'
/** Waf 会话定义 Upsert接口 */
export const UPSERT_SESSION = 'waf2/UpsertSession'
/** Waf 会话定义 Delete接口 */
export const DELETE_SESSION = 'waf2/DeleteSession'
