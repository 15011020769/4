
// 调用腾讯的接口Version
export const TENCENT_API_VERSION_2018_04_16 = '2018-04-16'
export const TENCENT_API_VERSION_2018_07_09 = '2018-07-09'
export const TENCENT_API_VERSION_2017_03_12 = '2017-03-12'

// 查询私有网络
export const VPC_LIST = 'vpc/DescribeVpcEx'

// 查询私有网络子网列表
export const VPC_SUBNET_LIST = 'vpc/DescribeSubnetEx'

// 查询可用区列表
export const ZONE_LIST = 'pub/esZone'

// 查询可用区列表 我也不知道为什么有两个 :(
export const ZONE_CVM2_LIST = 'cvm2/DescribeZones'

// 创建ES实例
export const ES_CREATE = 'es/CreateInstance'

// ES实例询价
export const ES_PRICE = 'billing/GetPrice'

// 查询ES列表和详情
export const ES_QUERY = 'es/DescribeInstances'

// 重启ES实例
export const ES_RESTART = 'es/RestartInstance'

// 更新ES实例
export const ES_UPDATE = 'es/UpdateInstance'

// 销毁ES实例
export const ES_DESTROY = 'es/DeleteInstance'

// 退出
export const SIGNOUT = 'sys/logout'
