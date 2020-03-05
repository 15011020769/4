//修改集群名称
export const UPDATE_CLUSTER_NAME = 'ccr/ModifyClusterAttributes'

//修改项目
export const UPDATE_PROJECT = 'ccs/ModifyProjectId'

//查询kubernetes版本
export const CLUSTER_VERSION = 'tke2/DescribeInstancesVersion'

//查询是否关联云网络
export const CLUSTERS_INSTANCES = 'tke2/DescribeCcnInstances'

//集群节点信息
export const NODE_INFO = 'tke2/DescribeClusterInstances'

//节点列表
export const NODE_LIST = 'cvm/DescribeInstances'

//删除节点
export const DELETE_NODE = 'tke2/DeleteClusterInstances'

//封锁、解除封锁节点
export const BLOCK_NODE = 'ccs/ModifyClusterNodeSchedulable'

//操作系统
export const CLUSTER_OS = 'ccs/DescribeClusterImage'

//修改操作系统
export const UPDATE_OS = 'tke2/ModifyClusterImage'

//查询条件查询集节点id列表
export const NODE_ID_LIST = 'tke2/DescribeClusterInstanceIds'

//获取节点实例列表
export const NODE_POD_LIST = 'ccs/DrainClusterNode'

//修改伸缩组属性
export const MODIFY_GROUP_STATUS = 'tke2/ModifyClusterAsGroupAttribute'

//删除伸缩组
export const DELETE_GROUP = 'tke2/DeleteClusterAsGroups'

//获取可用区机型配置信息
export const DESCRIBE_ZONE_INFO = 'cvm/DescribeZoneInstanceConfigInfos'

//伸缩组列表修改名称
export const MODIFY_NAME = 'as/ModifyAutoScalingGroup'

//获取节点JOBID
export const JOB_ID = 'tsm2/GetTkeDataJob'

export const MOMITOR_TKE = 'tsm2/GetTkeDataResult'

//新建伸缩组
export const CREATE_GROUP = 'tke2/CreateClusterAsGroup'

//是否开启云网络
export const TKE_CCN_ROUTES = 'tke2/DescribeCcnRoutes'

//注册云网络
export const ADD_CIDE_TO_CCN = 'tke2/AddClusterCIDRToCcn'

//关闭注册云网络
export const CLOSE_CIDE_TO_CCN = 'tke2/DeleteClusterCIDRFromCcn'

//新增节点
export const TKE_ADD_NODE = 'tke2/CreateClusterInstances'