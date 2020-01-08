// 我的镜像
export const CGI_LIST = 'tke2/capi' 

// 删除命名空间
export const SPACENAME_DELETE = 'ccr/DeleteUserNamespace'

// 判断命名空间是否存在
export const SPACENAME_PRESENCE = 'ccr/NamespaceIsExists'

// 创建命名空间
export const CREATE_SPACENAME = 'ccr/CreateCCRNamespace'

// 获取集群列表
export const COLONY_LIST = 'tke2/DescribeClusters' 
// 获取集群列表状态
export const COLONY_STATUS = 'tke2/DescribeClusterStatus'
// 获取警告设置集群列表
export const WARNING_GetUSER = 'tke2/DescribeClusters'
// 获取告警设置集群详细信息
export const WARNING_GetCOLONY = 'tke2/DescribeAlarmPolicies'
// 获取用户组列表信息
export const CreateListGroups = 'cam/ListGroups'
// 获取用户组信息
export const CreateGetGroups = 'cam/Get'

// 获取集群基本信息相关
export const CLUSTERS_DESCRIBE = 'tke2/DescribeClusters'
export const CLUSTERS_SECURITY = 'tke2/DescribeClusterSecurity'
