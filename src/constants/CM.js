// // 云监控接口封装
export const ALL_CITY = 'pub/zoneAll' // 区域列表
export const All_MONITOR = 'monitor2/GetMonitorData' // 监控接口
export const ALL_PROJECT = 'account/DescribeProject' // 项目列表

// // 云服务器
export const CVM_LIST = 'cvm2/DescribeInstances' // 列表
    // Mysql
export const MYSQL_LIST = 'cdb2/DescribeDBInstances' // 列表
    // 云硬盘
export const DISK_LIST = 'cbs2/DescribeDisks' // 列表
    //负载均衡
export const CLB_LIST = 'lb2/DescribeLoadBalancers' // 列表
    // NAT网关

export const NAT_LIST = 'vpc/DescribeNatGateway' // 列表
    // 对等连接
export const PEE_LIST = 'vpc/DescribeVpcPeeringConnections' // 列表
    // 云数据库Redis
export const REDIS_LIST = 'redis2/DescribeInstances' // 列表

// VPN网关
export const VPN_LIST = 'vpc/DescribeVpnGw' // 列表

// vpn 通道
export const VPNTD_LIST = 'vpc/DescribeVpnConn' // 列表

// 对象存储
export const OBJ_LIST = 'bucket/list' // 列表

//弹性公网IP
export const NETIP_LIST = 'vpc2/DescribeAddresses' // 列表