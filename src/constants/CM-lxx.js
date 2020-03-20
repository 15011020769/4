// 获取基础告警历史
export const BASICS_ALARM_LIST = 'monitor2/DescribeBasicAlarmList' // 列表ok

//获取平台事件订阅列表
export const SUBSCRIPTION_LIST = 'monitor2/DescribeSubscribeInfo'

//订阅管理
export const SUBSCRIPTION_ADMINISTRATION = 'monitor2/SubscribeEvent'

//取消订阅
export const CANCEL_SUBSCRIPTION = 'monitor2/UnSubscribeEvent'

//获取自定义消息列表
export const CUSTON_MESSAGE_LIST = 'monitor2/DescribeMsgPolicyList'//ok

//获取自定义消息列表消息接收组详情
export const RECEIVING_GROUP_DETAILE = 'cam/GetGroup'//ok

//编辑自定义消息
export const EDIT_CUSTON_MESSAGE = 'monitor2/ModifyMsgPolicy' 

//删除自定义消息
export const DETELE_CUSTON_MESSAGE = 'monitor2/DeleteMsgPolicy'//ok

//新增自定义消息
export const ADD_CUSTON_MESSAGE = 'monitor2/CreateMsgPolicy'//ok
