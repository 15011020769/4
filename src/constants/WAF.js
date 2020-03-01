/** 获取用户购买的WAF的类型 */
export const DESCRIBE_USER_EDITION = 'waf2/DescribeUserEdition'
/** 获取WAF的套餐信息 */
export const DESCRIBE_USER_INFO = 'waf2/DescribeUserInfo'
/** 设置套餐自动续费 */
export const MODIFY_PACKAGE_RENEW = 'waf2/ModifyPackageRenew'
/** 询价 */
export const DESCRIBE_WAF_PRICE = 'waf2/InquiryPriceWafInstance'
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
/** 查询TOP N攻击类型 */
export const DESCRIBE_ATTACK_TYPE = 'waf2/DescribeAttackType'
/** 查询Bot数量 */
export const DESCRIBE_BOT_COUNT = 'waf2/DescribeBotCount'
/** 查询Bot趋势数据 */
export const DESCRIBE_BOT_POINTS = 'waf2/DescribeBotPoints'
/** 获取bot开关 */
export const DESCRIBE_BOT_STATUS = 'waf2/DescribeBotStatus'
/** bot策略公开类型列表 */
export const DESCRIBE_BOTTCB_RECORDS = 'waf2/DescribeBotTCBRule'
/** bot策略更新 */
export const MODIFY_BOTTCB_RULE = 'waf2/ModifyBotTCBRule'
/** bot开关更新 */
export const MODIFY_BOT_STATUS = 'waf2/ModifyBotStatus'
/** bot TCB策略域名拷贝 */
export const COPY_BOTTCB_RULE = 'waf2/CopyBotTCBRule'
/** 攻击城市分布 */
export const DESCRIBE_ATTACK_WORLD_MAP = 'waf2/DescribeAttackWorldMap'
/** 查询访问类型占比 web攻击次数 */
export const DESCRIBE_ATTACK_COUNT = 'waf2/DescribeAttackCount'
/** 查询访问类型占比 正常访问次数 */
export const DESCRIBE_REQUEST_COUNT = 'waf2/DescribeRequestCount'
/** 获取柱状图 */
export const DESCRIBE_HISTOGRAM = 'waf2/DescribeHistogram'
/** 攻击概览 服务器响应浏览器类型 */
export const DESCRIBE_PIECHART = 'waf2/DescribePieChart'
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
/** ip管理 添加黑白ip */
export const UPSERTIP_ACCESS_CONTROL = 'waf2/UpsertIpAccessControl'
/** ip管理 删除ip名单 */
export const DELETEIP_ACCESS_CONTROL = 'waf2/DeleteIpAccessControl'
/** ip封堵状态查询 */
export const DESCRIBEIP_HITITEMS = 'waf2/DescribeIpHitItems'
/** 获取地域封禁配置 */
export const DESCRIBE_AREABAN_AREAS = 'waf2/DescribeAreaBanAreas'
/** 修改地域封禁状态 */
export const MODIFY_AREA_BAN_STATUS = 'waf2/ModifyAreaBanStatus'
/** 获取WAF地域封禁支持的地域列表 */
export const DESCRIBE_AREABAN_SUPPORT_AREAS = 'waf2/DescribeAreaBanSupportAreas'
/** 修改地域封禁中地域信息 */
export const MODIFY_AREA_BAN_AREAS = 'waf2/ModifyAreaBanAreas'
/** 添加封禁地域 */
export const ADD_AREA_BAN_AREAS = 'waf2/AddAreaBanAreas'
/** 增加自定义规则 */
export const ADD_CUSTOM_RULE = 'waf2/AddCustomRule'
/** 增加自定义规则 */
export const MODIFY_CUSTOM_RULE = 'waf2/ModifyCustomRule'
/** 获取自定义策略列表 */
export const DESCRIBE_CUSTOM_RULES = 'waf2/DescribeCustomRules'
/** Waf CC V2 Upsert接口 */
export const UPSERT_CCRULE = 'waf2/UpsertCCRule'
/** Waf CC V2 Query接口 */
export const DESCIRBE_CCRULE = 'waf2/DescirbeCCRule'
/** Waf CC V2 Delete接口 */
export const DELETE_CCRULE = 'waf2/DeleteCCRule'
/** Waf 会话定义查询接口 */
export const DESCRIBE_SESSION = 'waf2/DescribeSession'
/** Waf 会话定义 Upsert接口 */
export const UPSERT_SESSION = 'waf2/UpsertSession'
/** Waf 会话定义 Delete接口 */
export const DELETE_SESSION = 'waf2/DeleteSession'
/** 查询访问日志 */
export const DESCRIBE_ACCESS_LOGS = 'waf2/DescribeAccessLogs'
/** 获取攻击日志 */
export const DESCRIBE_ATTACK_DETAIL = 'waf2/DescribeAttackDetail'
/** 查询攻击日志数量 */
export const DESCRIBE_ATTACK_LOG_COUNT = 'waf2/DescribeAttackLogCount'
/** 建攻击日志下载任务 */
export const CREATE_ATTACK_DOWNLOAD_TASK = 'waf2/CreateAttackDownloadTask'
/** 查询下载记录 */
export const DESCRIBE_ATTACK_DOWNLOAD_RECORDS = 'waf2/DescribeAttackDownloadRecords'
/** 删除下载记录 */
export const DELETE_DOWNLOAD_RECORD = 'waf2/DeleteDownloadRecord'
/** 切换自定义规则的开关 */
export const MODIFY_CUSTOM_RULE_STATUS = 'waf2/ModifyCustomRuleStatus'
/** Bot_V2 域名bot统计 */
export const DESCRIBE_BOT_AGGREGATE_DOMAINSTAT = 'waf2/DescribeBotAggregateDomainStat'
/** 查询日志服务使用状况 */
export const DESCRIBE_CLS = 'waf2/DescribeCLS'
/** 查询满足搜索条件的访问日志数量 */
export const DESCRIBE_ACCESSLOG_COUNT = 'waf2/DescribeAccessLogCount'
/** 查询访问日志下载任务 */
export const DESCRIBE_ACCESS_DOWNLOAD_RECORDS = 'waf2/DescribeAccessDownloadRecords'
/** 下载访问日志 */
export const CREATE_ACCESS_DOWNLOAD_RECORD = 'waf2/CreateAccessDownloadRecord'
/** Bot_V2 Bot流量统计 */
export const DESCRIBE_BOT_STATISTIC_POINTS = 'waf2/DescribeBotStatisticPoints'
/** Bot_V2 Bot类别统计 */
export const DESCRIBE_BOT_TYPE_STAT = 'waf2/DescribeBotTypeStat'
/** Bot_V2 bot地理纬度统计 */
export const DESCRIBE_BOT_REGIONS_STAT = 'waf2/DescribeBotRegionsStat'
/** Bot_V2 获取bot动作统计 */
export const DESCRIBE_BOT_ACTION_STAT = 'waf2/DescribeBotActionStat'
/** Bot_V2 获取UB类型Bots */
export const DESCRIBE_BOT_UB_RECORDS = 'waf2/DescribeBotUBRecords'
/** Bot_V2 获取UCB类型Bots */
export const DESCRIBE_BOT_UCB_RECORDS = 'waf2/DescribeBotUCBRecords'
/** Bot_V2 获取UCB自定义策略 */
export const DESCRIBE_BOT_UCB_FEATURE_RULE = 'waf2/DescribeBotUCBFeatureRule'
/** Bot_V2 UCB策略更新/添加 */
export const UPSERT_BOT_UCB_FEATURE_RULE = 'waf2/UpsertBotUCBFeatureRule'
/** Bot_V2 获取UCB预设策略 */
export const DESCRIBE_BOT_UCB_PREINSTALLRULE = 'waf2/DescribeBotUCBPreinstallRule'
/** Bot_V2 UCB预设策略拷贝 */
export const COPY_BOT_UCB_PREINSTALL_RULE = 'waf2/CopyBotUCBPreinstallRule'
/** Bot_V2 UCB预设规则更新 */
export const MODIFY_BOT_UCB_PREINSTALL_RULE = 'waf2/ModifyBotUCBPreinstallRule'
