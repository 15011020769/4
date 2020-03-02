// 获取集群列表
export const TKE_COLONY_LIST = 'tke2/DescribeClusters'

//集群状态展示
export const TKE_COLONY_STATUS_JZ='ccs/GetClustersResourceStatus'

//集群状态展示2
export const TKE_COLONY_STATUS_JZ2='tke2/DescribeClustersResourceStatus'

//获得概览cpu 内存利用率
export const TKE_GETCPUUSE='monitor2/ArgusFrontTunnel'

//数据查询
export const TKE_COLONY_QUERY='tke2/ForwardRequest'

//kafka数据查询
// export const TKE_KAFKA_LIST='ckafka/DescribeInstancesDetail'
export const TKE_KAFKA_LIST='ckafka/ListInstanceDetail'

//topic二级数据查询
export const TKE_TOPIC_LIST='ckafka/ListTopic'
