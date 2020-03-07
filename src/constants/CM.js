// // 雲监控接口封装
export const ALL_CITY = 'pub/zoneAll' // 区域列表
export const All_MONITOR = 'monitor2/GetMonitorData' // 监控接口
export const ALL_Basics = 'monitor2/DescribeBaseMetrics' // 监控基础指标
export const ALL_PROJECT = 'account/DescribeProject' // 项目列表


// // 雲服务器
export const CVM_LIST = 'cvm2/DescribeInstances' // 列表
// Mysql
export const MYSQL_LIST = 'cdb2/DescribeDBInstances' // 列表
// 雲硬盘
export const DISK_LIST = 'cbs2/DescribeDisks' // 列表
//负载均衡
export const CLB_LIST = 'lb2/DescribeLoadBalancers' // 列表
// NAT网关

export const NAT_LIST = 'vpc2/DescribeNatGateways' // 列表
// 对等连接
export const PEE_LIST = 'vpc/DescribeVpcPeeringConnections' // 列表
// 雲数据库Redis
export const REDIS_LIST = 'redis2/DescribeInstances' // 列表
//物理专线
export const Physics_LIST = 'dc2/DescribeDirectConnects' // 列表
//专线通道
export const Private_LIST = 'dc2/DescribeDirectConnectTunnels' // 列表
// VPN网关
export const VPN_LIST = 'vpc2/DescribeVpnGateways' // 列表
//专线网关
export const DCG_LIST = 'vpc2/DescribeDirectConnectGateways' // 列表

// vpn 通道
export const VPNTD_LIST = 'vpc2/DescribeVpnConnections' // 列表

// 对象存储
export const OBJ_LIST = 'bucket/list' // 列表

//弹性公网IP
export const NETIP_LIST = 'vpc2/DescribeAddresses' // 列表


// 实例分组
export const CM_GROUPING_LIST = 'monitor/GetInstanceGroupList' // 列表

// 实例分组 列表 分组类型
export const CM_GROUPING_LIST_TYPE = 'monitor2/DescribePolicyConditionList'

// 实例分组 列表 删除
export const CM_GROUPING_LIST_DELETE = 'monitor/DeleteInstanceGroup'

// 实例分组 列表 复制
export const CM_GROUPING_LIST_COPY = 'monitor/CopyInstanceGroup'
