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
export const SOURCEIPSEGMENT_DESCRIBE = 'dayu2/DescribeSourceIpSegment' //获取回源IP段

    // 高防IP专业版-接入配置
export const L4_RULES = 'dayu2/DescribleL4Rules' // 获取L4转发规则
export const L4RULES_CREATE = 'dayu2/CreateL4Rules' // 添加L4转发规则
export const L4DEL_CREATE = 'dayu2/DeleteL4Rules'// 删除L4转发规则
export const ENID_CREATE = 'dayu2/ModifyL4Rules'  // 编辑L4转发规则

    // 高防IP专业版-防护配置
export const CC_URLALLOW = 'dayu2/DescribeCCUrlAllow' //获取CC的Url白名单
export const CCURLALLOW_MODIFY = 'dayu2/ModifyCCUrlAllow' //添加或删除CC的URL白名单
export const CCTHRESHOLD_MODIFY = 'dayu2/ModifyCCThreshold' //修改CC的防护阈值
export const CCALARMTHRESHOLD_MODIFY = 'dayu2/ModifyCCAlarmThreshold' //设置CC告警通知阈值
export const CCALARMTHRESHOLD_GET = 'dayu2/DescribeCCAlarmThreshold' //获取CC告警通知阈值

export const CCSELFDEFINEPOLICY_LIST = 'dayu2/DescribeCCSelfDefinePolicy' // 获取CC自定义策略
export const CCSELFDEFINEPOLICY_CREATE = 'dayu2/CreateCCSelfDefinePolicy' //创建CC自定义策略
export const CCPOLICYSWITCH_MODIFY = 'dayu2/ModifyCCPolicySwitch' // 修改CC自定义策略开关
export const CCSELFDEFINEPOLICY_DELETE = 'dayu2/DeleteCCSelfDefinePolicy' // 删除CC自定义策略
export const CCSELFDEFINEPOLICY_MODIFY = 'dayu2/ModifyCCSelfDefinePolicy' //修改CC自定义策略

export const CC_IPALLOWDENY = 'dayu2/DescribeCCIpAllowDeny' //获取CC的IP黑白名单
export const CCIPALLOWDENY_MODIFY = 'dayu2/ModifyCCIpAllowDeny' //添加或删除CC的IP黑白名单

    // DDOS高级防护策略
export const DDOS_POLICY_CREATE = 'dayu2/CreateDDoSPolicy' // 添加DDoS高级策略
export const DDOS_POLICY_DELETE = 'dayu2/DeleteDDoSPolicy' // 删除DDoS高级策略
export const DDOS_POLICY_MODIFY = 'dayu2/ModifyDDoSPolicy' // 修改DDoS高级策略
export const RESBIND_MODIFY = 'dayu2/ModifyResBindDDoSPolicy' // 资源绑定DDoS高级策略

export const INSTANCENAME_CONT = 'dayu2/CreateInstanceName' //资源实例重命名接口
export const GET_ID = 'dayu2/DescribeResIpList' //获取资源的IP列表
export const GET_SPolicy = 'dayu2/DescribeDDoSPolicy' // 获取DDoS高级策略
export const GET_Status = 'dayu2/DescribeDDoSDefendStatus' // 获取DDoS防护状态
export const CLAEN_SHOLD = 'dayu2/ModifyDDoSThreshold' //修改DDoS清洗阈值
export const Modify_Level = 'dayu2/ModifyDDoSLevel' //修改DDoSIP防护等级
export const SET_SHOLD = 'dayu2/CreateBasicDDoSAlarmThreshold' //设置基础防护的DDoS告警阈值
export const Modify_Status = 'dayu2/ModifyDDoSDefendStatus' //修改DDoS防护状态

export const DDOS_EVENT = 'dayu2/DescribeDDoSNetEvList' //获取高防IP专业版资源的DDoS攻击事件列表
export const DDOS_ATTACK = 'dayu2/DescribeDDoSNetCount' //获取高防IP专业版资源的DDoS攻击占比分析
export const DDOS_DATA = 'dayu2/DescribeDDoSNetTrend' //获取高防IP专业版资源的DDoS攻击指标数据
export const CC_LIST = 'dayu2/DescribeCCEvList' //获取 CC 攻击事件列表
export const CC_DATA = 'dayu2/DescribeCCTrend' //获取CC攻击指标数据
export const STATIC_LIST = 'dayu2/DescribeTransmitStatis' //获取业务转发统计数据