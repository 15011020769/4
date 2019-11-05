export const State = {
  'UNATTACHED': '待挂载',
  'ATTACHING': '挂载中',
  'ATTACHED': '已挂载',
  'DETACHING': '解挂中',
  'EXPANDING': '扩容中',
  'TORECYCLE': '待回收',
  'ROLLBACKING': '回滚中'
}
export const Region = {
  'ap-guangzhou-1': '广州一区',
  'ap-guangzhou-2': '广州二区',
  'ap-guangzhou-3': '广州三区',
  'ap-guangzhou-4': '广州四区',
  'ap-guangzhou-open-1': '广州OPEN专区',
  'ap-shanghai-1': '上海一区',
  'ap-shanghai-2': '上海二区',
  'ap-shanghai-3': '上海三区',
  'ap-shanghai-4': '上海四区',
  'ap-beijing-1': '北京一区',
  'ap-beijing-2': '北京二区',
  'ap-beijing-3': '北京三区',
  'ap-beijing-4': '北京四区',
  'ap-beijing-5': '北京五区',
  'ap-chengdu-1': '成都一区',
  'ap-chengdu-2': '成都二区',
  'ap-chongqing-1': '重庆一区',
  'ap-hongkong-1': '香港一区',
  'ap-hongkong-2': '香港二区',
  'ap-singapore-1': '新加坡一区',
  'ap-toronto-1': '多伦多一区',
  'ap-siliconvalley-1': '硅谷一区',
  'ap-siliconvalley-2': '硅谷二区',
  'ap-seoul-1': '首尔一区',
  'ap-bangkok-1': '泰国一区',
  'ap-moscow-1': '莫斯科一区',
  'ap-mumbai-1': '孟买一区',
  'ap-ashburn-1': '弗吉尼亚一区',
  'ap-frankfurt-1': '法兰克福一区',
  'ap-shenzhen-fsi-1': '深圳金融一区',
  'ap-shenzhen-fsi-2': '深圳金融二区',
  'ap-shanghai-fsi-1': '上海金融一区',
  'ap-shanghai-fsi-2': '上海金融二区'
}
export const RegionOver = {
  'ap-guangzhou': '华南地区(广州)',
  'ap-guangzhou-open': '华南地区(广州Open)',
  'ap-shanghai': '华东地区(上海)',
  'ap-shanghai-fsi': '华东地区(上海金融)',
  'ap-beijing': '华北地区(北京)',
  'ap-beijing-fsi': '华北地区(北京金融)',
  'ap-chengdu': '西南地区(成都)',
  'ap-chongqing': '西南地区(重庆)',
  'ap-hongkong': '亚太东南(香港)',
  'ap-singapore': '亚太东南(新加坡)',
  'ap-toronto': '北美地区(多伦多)',
  'ap-siliconvalley': '美国西部(硅谷)',
  'ap-nanjing': '华东地区(南京)',
  'ap-tianjin': '华北地区(天津)',
  'ap-hangzhou': '华东地区(杭州EC)',
  'ap-jinan': '华东地区(济南EC)',
  'ap-taibei': '亚太东南(台北)',
  'ap-seoul': '亚太东北(首尔)',
  'ap-bangkok-1': '泰国一区',
  'ap-moscow-1': '莫斯科一区',
  'ap-mumbai': '亚太南部(孟买)',
  'ap-ashburn-1': '弗吉尼亚一区',
  'ap-frankfurt': '欧洲地区(法兰克福)',
  'ap-shenzhen-fsi': '华南地区(深圳金融)',
  'ap-shenzhen': '华南地区(深圳)',
  'ap-shanghai-fsi': '上海金融一区'
}
export const Attribute = {
  'SYSTEM_DISK': '系统盘',
  'DATA_DISK': '数据盘'
}
export const Toconfigure = {
  'CLOUD_BASIC': '普通云硬盘',
  'CLOUD_PREMIUM': '高性能云硬盘',
  'CLOUD_SSD': 'SSD云硬盘'
}
export const Billingmodel = {
  'PREPAID': '包年包月',
  'POSTPAID_BY_HOUR': '按量计费'
}
// 镜像
export const IMAGE_STATE = {
  // 状态
  'USING': '使用中',
  'IMPORTING': '导入中',
  'SYNCING': '同步中',
  'DELETING': '删除中',
  'CREATING': '创建中',
  'NORMAL': '正常',
  // 类型
  'PUBLIC_IMAGE': '公共镜像',
  'SHARED_IMAGE': '共享镜像',
  'MARKET_IMAGE': '服务市场',
  'PRIVATE_IMAGE': '自定义镜像'
}
// 快照
export const SHOT_STATE = {
  // 状态
  'NORMAL': '正常',
  'CREATING': '创建中',
  'ROLLBACKING': '正常'
}
// 日志
export const LOG_STATE = {
  // 状态
  'SNAP_OPERATION_DELETE': '删除快照',
  'SNAP_OPERATION_ROLLBACK': '回滚快照',
  'SNAP_OPERATION_MODIFY': '修改快照属性',
  'SNAP_OPERATION_CREATE': '创建快照',
  'SNAP_OPERATION_COPY': '跨地域复制快照',
  'ASP_OPERATION_CREATE_SNAP': '由定期快照策略创建快照',
  'ASP_OPERATION_DELETE_SNAP': '由定期快照策略删除快照'
}
// 弹性ip
export const EIP_STATE = {
  // 状态
  'UNBIND': '未绑定，扣费中',
  'BIND_ENI': '已绑定',
  'BIND': '已绑定'
}
// 实例
export const CVM_STATE = {
  // 状态
  'PENDING': '创建中',
  'LAUNCH_FAILED': '创建失败',
  'RUNNING': '运行中',
  'STOPPED': '已关机',
  'STARTING': '开机中',
  'STOPPING': '关机中',
  'REBOOTING': '重启中',
  'SHUTDOWN': '停止待销毁',
  'TERMINATING': '销毁中',
}
//实例计费模式
export const INSTANCE_BILL = {
  'PREPAID': '包年包月',
  'POSTPAID_BY_HOUR': '按量计费',
  'CDHPAID': 'CDH付费',
}
//网络计费模式
export const NET_BILL = {
  'TRAFFIC_POSTPAID_BY_HOUR': '按流量计费',
  'BANDWIDTH_PREPAID': '按带宽包年包月计费',
  'BANDWIDTH_POSTPAID_BY_HOUR': '按带宽使用时长计费',
  'BANDWIDTH_PACKAGE': '带宽包计费方式',
  'BANDWIDTH_POSTPAID_BY_MONTH': '按月后付费'
}
//主机类型
export const INST_TYPEA = {
  "S4": "标准型S4",
  "S3": "标准型S3",
  "S2": "标准型S2",
  "S1": "标准型S1",
  "SN3NE": "标准网络优化型",
  "SA1": "标准型SA1",
  "S2NE": "标准网络优化型 S2ne",
  "SN2": "标准网络增强型SN2",
  "I3": "高IO型I3",
  "I2": "高IO型I2",
  "I1": "高IO型I1",
  "M4": "内存型M4",
  "M3": "内存型M3",
  "M2": "内存型M2",
  "M1": "内存型M1",
  "C3": "计算型C3",
  "C2": "计算型C2",
  "CN3": "计算型CN3",
  "CN2": "计算网络增强型CN2",
  "D1": "大数据型 D1",
  "D2": "大数据型 D2",
  "GN2": "GPU计算型GN2",
  "GN8": "GPU计算型GN8",
  "GA": "GPU渲染型GA2",
  "FX2": "FPGA型FX2",
  "BS1": "批量计算型 BS1",
  "BC1": "批量计算型 BC1"
}
//系统盘
export const DISK_TYPE = {
  "CLOUD_BASIC": "普通云硬盘",
  "CLOUD_PREMIUM": "高性能云硬盘",
  "CLOUD_SSD": "SSD云硬盘"
}
// 安全组
export const SAFETY_GROUP_PROJECT = {
  // 项目
  '0': '默认项目',
  '1135407': '丙晟3期',
  '1135416': '丙晟4期',
  '1135781': 'a1234a1234a1234a1234a1234a1234a1234a1234a1234a1234',
  '1135946': 'df',
  '1136120': 'g',
  '1143813': 'Project234567890123456789234567892345678',
  '1143814': 'Project001Project001Project001Project001Project001',
  '1152689': '12345678'
}
// MYSQL 所有过滤
export const MYSQL = {
  0: '创建中',
  1: '运行中',
  4: '隔离中',
  5: '已隔离',
  'HA': '高可用版',
  'BASIC': '基础版'
}
export const MYSQLType = {
  1: '主实例',
  2: '灾备实例',
  3: '只读实例'

}
