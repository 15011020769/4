//  // DDOS防护
    // 防护概览
export const DDOS_SECINDEX = 'dayu2/DescribeSecIndex' // 获取安全统计-本月
export const DDOS_PACKINDEX = 'dayu2/DescribePackIndex' // 获取产品总览
export const DDOS_EV_LIST = 'dayu2/DescribeDDoSEvList' // 获取DDoS攻击事件列表

    // 基础防护
export const DDOS_TREND = 'dayu2/DescribeDDoSTrend' // 获取DDoS攻击指标数据

    // 自助解封
export const UNBlOCKSTATIS_NUM = 'dayu2/DescribeUnBlockStatis' //获取黑洞解封次数
export const IPBlOCKLIST_LIST = 'dayu2/DescribeIpBlockList' //获取IP封堵列表
export const IPUNBlOCKLIST_LIST = 'dayu2/DescribeIpUnBlockList' //获取IP解封记录

    // 高防IP专业版-资产列表
export const RESOURCE_LIST = 'dayu2/DescribeResourceList' //获取资源列表
export const DDOSPOLICY_CONT = 'dayu2/DescribeDDoSPolicy' //获取DDoS高级策略
export const RULESETS_CONT = 'dayu2/DescribeRuleSets' //获取资源的规则数

    // 高防IP专业版-接入配置
export const L4_RULES = 'dayu2/DescribleL4Rules' // 获取L4转发规则
export const L4RULES_CREATE = 'dayu2/CreateL4Rules' // 添加L4转发规则
export const L4DEL_CREATE = 'dayu2/DeleteL4Rules'// 删除L4转发规则
export const ENID_CREATE = 'dayu2/ModifyL4Rules'  // 编辑L4转发规则

    // 高防IP专业版-防护配置
export const CC_URLALLOW = 'dayu2/DescribeCCUrlAllow' //获取CC的Url白名单
export const CC_THRESHOLD = 'dayu2/ModifyCCThreshold' //修改CC的防护阈值
export const CC_SELFDEFINEPOLICY_CREATE = 'dayu2/CreateCCSelfDefinePolicy' //创建CC自定义策略
export const CC_IPALLOWDENY = 'dayu2/DescribeCCIpAllowDeny' //获取CC的IP黑白名单
export const DDOS_POLICY_CREATE = 'dayu2/CreateDDoSPolicy' // 添加DDoS高级策略
export const DDOS_POLICY_DELETE = 'dayu2/DeleteDDoSPolicy' // 删除DDoS高级策略
export const DDOS_POLICY_MODIFY = 'dayu2/ModifyDDoSPolicy' // 修改DDoS高级策略

