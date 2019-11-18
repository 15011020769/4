// // 云监控接口封装
export const ALL_CITY = 'pub/zoneAll' // 区域列表
    // // 云服务器
export const CVM_LIST = 'redesc/cloudServer' // 列表

export const CVM_PROJECT = 'account/DescribeProject' // 项目列表（云服务器，Mysql共用）
export const CVM_MONITOR = 'monitor/GetMonitorData' // 监控数据  （mysql部分共用）

// Mysql
export const MYSQL_LIST = 'redesc/cloudMysql' // 列表
export const MYSQL_MONITOR = 'monitor2/GetMonitorData' // 监控数据

// 云硬盘

export const DISK_LIST = 'cbs/DescribeCbsStorages' // 列表

// NAT网关
export const NAT_LIST = 'vpc/DescribeNatGateway' // 列表
    // 对等连接
export const PEE_LIST = 'vpc/DescribeVpcPeeringConnections' // 列表

// VPN网关
export const VPN_LIST = 'vpc/DescribeVpnGw' // 列表

// vpn 通道
export const VPNTD_LIST = 'vpc/DescribeVpnConn' // 列表

// 对象存储
export const OBJ_LIST = 'cvm/DescribeRegions' // 区域
export const OBJ_CITY = 'bucket/list' // 列表