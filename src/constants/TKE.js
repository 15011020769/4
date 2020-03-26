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

// 保留镜像自动
export const MIRROR_STRATEGY = 'ccr/SetAutoDelStrategy'

// 删除镜像自动
export const MIRROR_AUTODELELTE = 'ccr/closeAutoDelStrategy'

// 修改镜像类型
export const MIRROR_UPDATE = 'ccr/UpdateRepositoryPublic'

// 修改镜像描述
export const MIRROR_UPDATE_DESC = 'ccr/UpdateRepositoryDesc'

// 获取我的收藏
export const GETFAVOR = 'ccr/GetFavor'

// 获取公有收藏
export const GET_REPOSITORY_LIST = 'ccr/GetRepositoryList'

// 取消收藏
export const DELETE_FAVOR = 'ccr/DeleteFavor'

// 添加收藏
export const ADD_FAVOR = 'ccr/AddFavor'

// 获取镜像版本列表
export const GET_TAGLIST = 'ccr/GetTagList'

// 取消全选收藏
export const DELETE_BATCHDELETEFAVOR = 'ccr/BatchDeleteFavor'

// 获取集群列表
export const TKE_COLONY_LIST = 'tke2/DescribeClusters'

// 获取集群列表状态
export const TKE_COLONY_STATUS = 'tke2/DescribeClusterStatus'

// 修改集群列表名称
export const TKE_COLONY_DES = 'tke2/ModifyClusterAttribute'

// 删除集群
export const TKE_COLONY_DELETE = 'tke2/DeleteCluster'

// 删除集群列表
export const TKE_DELETE_XS = 'tke2/DescribeClusterInstances'

// 新建集群 Kubernetes版本
export const TKE_NEW_EDITION = 'tke2/DescribeVersions'

// 新建集群 集群网络
export const TKE_VPC_METWORK = 'vpc2/DescribeVpcs'

// 新建集群 校验 CIDR
// export const TKE_VPC_CIDR = 'ccs/CheckClusterCIDR'
export const TKE_VPC_CIDR = 'tke2/CheckClusterCIDR'

// 新建集群 操作系统
export const TKE_OPERAT_SYSTEM = 'tke2/DescribeImages'

// 新建集群 节点来源 已有节点
export const TKE_EXIST_NODES = 'cvm2/DescribeInstances'

// 新建集群 Worker 配置 节点网络
export const TKE_WORKER_METWORK = 'vpc2/DescribeSubnets'

// 新建集群 SSH密钥
export const TKE_SSH = 'cvm2/DescribeKeyPairs'

// 新建集群 创建集群
export const TKE_CREATW_CLUSTERS = 'tke2/CreateCluster'

// 新建集群 创建集群
export const TKE_CREATW_Quota = 'tke2/DescribeQuota'

// 新建集群 创建集群
export const TKE_CREATW_InstanceQuota = 'cvm2/DescribeUserInstanceQuota'

// 新建集群 总费计算
export const TKE_PRICE = 'cvm2/InquiryPriceRunInstances'

// 获取告警设置列表信息
export const TKE_WARNING_GETCOLONY = 'tke2/DescribeAlarmPolicies'

// 添加已有节点
export const TKE_EXIST = 'tke2/DescribeExistedInstances'

// 添加已有节点 安全组
export const TKE_MISG = 'vpc2/DescribeSecurityGroups'

// 添加已有节点 完成
export const TKE_ADD_COMPLETE = 'tke2/AddExistedInstances'

// 获取集群详细信息
export const WARNING_GetCOLONY = 'tke2/DescribeAlarmPolicies'

// 获取集群基本信息相关
export const CLUSTERS_DESCRIBE = 'tke2/DescribeClusters'

// 获取集群的基本信息
export const CLUSTERS_SECURITY = 'tke2/DescribeClusterSecurity'

// 集群关联的伸缩组列表
export const CLUSTERS_GROUPS = 'tke2/DescribeClusterAsGroups'

// 集群详情-节点管理-伸缩组-全局配置
export const CLUSTERS_GROUPSOPTION = 'tke2/DescribeClusterAsGroupOption'

// 修改伸缩组全局配置
export const MODIFY_ATTRIBUTE = 'tke2/ModifyClusterAsGroupOptionAttribute'

// 弹性伸缩组-伸缩组列表信息  --------不可用
export const AUTOSCALING_GROUPS = 'as2/DescribeAutoScalingGroups'

// export const CLUSTERS_INSTANCES = 'tke2/DescribeCcnInstances'

// export const CLUSTERS_REQUEST = 'tke2/ForwardRequest'

// export const CLUSTERS_VIPSTATUS = 'tke2/DescribeClusterEndpointVipStatus'

// export const CLUSTERS_STATUS = 'tke2/DescribeClusterEndpointStatus'

// export const CreateGetGroups = 'cam/GetGroups'
export const CreateListGroups = 'cam/ListGroups'

// 获取节点管理
export const POINT_REQUEST = 'tke2/ForwardRequest'

// 删除告警配置
export const TKE_DELETE_POLICIES = 'tke2/DeleteAlarmPolicies'

// 云硬盘列表
export const TKE_DESCRIBEDISKS = 'cbs2/DescribeDisks'

// ingress新建 - 获取证书列表
export const TKE_GETCERTLIST = 'account/GetCertList'

// ingress新建 - 描述者（业务模块为实现）
export const TKE_DESCRIBELISTENERS = 'clb2/DescribeListeners'

// ingress新建 - 查询价格
export const TKE_INQUIRYPRICE = 'clb2/InquiryPriceCreateLoadBalancer'

// ingress新建 - 获取负载均衡器
export const TKE_EDSCRIBELOADBALANCERS = 'clb2/DescribeLoadBalancers'

// 监控Job数据
export const TKE_GETTKEDATAJOB = 'tsm2/GetTkeDataJob'

// 监控Result数据
export const TKE_GETTKEDATARESULT = 'tsm2/GetTkeDataResult'

// 定期备份
export const TKE_CBS_POLICIES = 'cbs2/DescribeAutoSnapshotPolicies'

// 云硬盘---地区选择
export const TKE_DESCRIBEZONES = 'cvm2/DescribeZones'

// 获取PersistentVolumeClaim费用
export const TKE_PAY_MONEY = 'cbs2/InquiryPriceCreateDisks'


// export const TKE_PAY_MONEY = 'cbs2/InquiryPriceCreateDisks'
