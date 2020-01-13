// 删除命名空间
export const SPACENAME_DELETE = 'ccr/DeleteUserNamespace'

// 判断命名空间是否存在
export const SPACENAME_PRESENCE = 'ccr/NamespaceIsExists'

// 创建命名空间
export const CREATE_SPACENAME = 'ccr/CreateCCRNamespace'

// 获取我的镜像列表
export const MIRROR_LIST = 'ccr/SearchUserRepository'

// 获取命名空间
export const SPACENAME_LIST = 'ccr/GetNamespaceInfo'

// 删除我的镜像
export const MIRROR_DELETE = 'ccr/BatchDeleteRepository'

// 是否存在镜像名称接口
export const MIRROR_PRESENCE = 'ccr/RepositoryisExists'

// 新建我的镜像
export const MIRROR_CREATE = 'ccr/CreateRepository'

// 镜像版本使用指引
export const MIRROR_ROAD = 'ccr/GetTagList'

// 获取集群列表
export const COLONY_LIST = 'tke2/DescribeClusters'
// 获取集群列表状态
export const COLONY_STATUS = 'tke2/DescribeClusterStatus'
// 获取集群列表
export const WARNING_GetUSER = 'tke2/DescribeClusters'
// 获取集群详细信息
export const WARNING_GetCOLONY = 'tke2/DescribeAlarmPolicies'
// 获取集群基本信息相关
export const CLUSTERS_DESCRIBE = 'tke2/DescribeClusters'
export const CLUSTERS_SECURITY = 'tke2/DescribeClusterSecurity'
// export const CreateGetGroups = 'cam/GetGroups'
export const CreateListGroups = 'cam/ListGroups'
