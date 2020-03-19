// 实例分组
export const CM_GROUPING_LIST = 'monitor2/DescribeInstanceGroupList' // 列表

// 实例分组 列表 分组类型
export const CM_GROUPING_LIST_TYPE = 'monitor2/DescribePolicyConditionList'

// 实例分组 列表 删除
export const CM_GROUPING_LIST_DELETE = 'monitor2/DeleteInstanceGroup'

// 实例分组 列表 复制
export const CM_GROUPING_LIST_COPY = 'monitor2/CopyInstanceGroup'

// 实例分组 列表 编辑名称
export const CM_GROUPING_LIST_EDIT = 'monitor2/ModifyPolicyGroupInfo'

// 实例分组 列表 新建
export const CM_GROUPING_NEWLY_BUILD = 'monitor2/ModifyInstanceGroup'

// 实例分组 详情 实例管理 列表
export const CM_GROUPING_MANAGE = 'monitor2/DescribeInstanceGroup'

// 实例分组 详情 实例管理 列表
export const CM_GROUPING_MANAGELIST = 'cvm2/DescribeInstances'

// 实例分组 详情 实例管理 移出
export const CM_GROUPING_MOVE = 'monitor2/DeleteInstancesInInstanceGroup'

// 实例分组 详情 告警策略 列表
export const CM_GROUPING_ALARM_STRATEGY = 'monitor2/DescribePolicyGroupList'

// 实例分组 详情 告警策略 列表 告警启停
export const CM_GROUPING_ALARM_START = 'monitor2/ShieldPolicyAlarm'

// 实例分组 详情 告警策略 列表 解除绑定
export const CM_GROUPING_UNBINDING = 'monitor2/UnBindingInstanceGroup'

// 实例分组 详情 变更日志 列表
export const CM_GROUPING_CHANGELOG_LIST = 'monitor2/DescribeTransLog'



// 告警策略 列表
export const CM_ALARM_LIST = 'monitor2/DescribePolicyGroupList'

// 告警策略 列表
export const CM_ALARM_L = 'monitor2/DescribeProductEventList'

// 告警策略 列表 删除
export const CM_ALARM_DELETE = 'monitor2/DeletePolicyGroup'

// 告警策略 列表 策略类型 设置默认
export const CM_ALARM_SET_DEFAULT = 'monitor/SetDefaultPolicyGroup'

// 告警策略 列表 策略类型 修改告警渠道
export const CM_ALARM_MODIFY_NOTIFY = 'monitor2/ModifyNotifyBatch'

// 告警策略 详情
export const CM_ALARM_STRATEGY_DETAILS = 'monitor2/DescribePolicyGroupInfo'

// 告警策略 详情 告警触发条件 回显
export const CM_ALARM_TRIGGER_CONDITION = 'monitor2/DescribeConditionsTemplateList'

// 告警策略 详情 告警触发条件 保存
export const CM_ALARM_TRIGGER_MODIFY = 'monitor2/ModifyPolicyGroup'

// 告警策略 详情 告警对象 列表
export const CM_ALARM_OBJECT_LIST = 'monitor2/DescribeBindingPolicyObjectList'

// 告警策略 详情 告警对象 列表 移除
export const CM_ALARM_OBJECT_LIST_OUT = 'monitor2/UnBindingPolicyObject'

// 告警策略 详情 告警对象 列表 全部移除
export const CM_ALARM_OBJECT_LIST_ALLOUT = 'monitor2/UnBindingAllPolicyObject'

// 告警策略 详情 告警接收对象 列表
export const CM_ALARM_RECEIVE_OBJECT_LIST = 'monitor2/DescribeContactList'

// 告警策略 详情 告警接收对象 列表 解除
export const CM_ALARM_RECEIVE_OBJECT_RELIEVE = 'monitor2/ModifyAlarmReceivers'

// 告警策略 详情 回调接口
export const CM_CALLBACK = 'monitor2/DescribeAlarmCallbackVerifyCode'
