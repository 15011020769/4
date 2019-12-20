
// 数据盘类型
export const DISK_TYPE = {
  LOCAL_BASIC: '本地硬盘',
  LOCAL_SSD: '本地SSD硬盘',
  CLOUD_BASIC: '普通雲硬盘',
  CLOUD_PREMIUM: '高性能雲硬盘',
  CLOUD_SSD: 'SSD雲硬盘',
}
// 节点规格
export const NODE_TYPE = {
  'ES.S1.SMALL2': '1核2G',
  'ES.S1.MEDIUM4': '2核4G',
  'ES.S1.MEDIUM8': '2核8G',
  'ES.S1.LARGE16': '4核16G',
  'ES.S1.2XLARGE32': '8核32G',
  'ES.S1.3XLARGE32': '12核32G',
  'ES.S1.6XLARGE32': '24核32G',
  'ES.S1.4XLARGE64': '16核64G',
}
// 计费模式
export const CHARGE_TYPE = {
  PREPAID: '包年包月',
  POSTPAID_BY_HOUR: '按量计费',
  CDHPAID: '只对CDH计费',
}
// 实例状态
export const INS_STATUS = {
  0: '处理中',
  1: '正常',
  '-1': '停止',
  '-2': '销毁中',
  3: '已销毁',
  '-4': '已隔离',
}

export * from './region'
