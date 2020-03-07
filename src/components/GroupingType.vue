<template>
  <div class="grouping-type">
    <div class="block">
      <el-cascader
        v-model="value"
        :options="options"
        :props="{ expandTrigger: 'hover' }"
        @change="handleChange"
      ></el-cascader>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: [],
      options: [
        {
          value: "云服务器",
          label: "云服务器",
          children: [
            {
              value: "BS",
              label: "存储监控"
            },
            {
              value: "基础监控",
              label: "存储监控"
            }
          ]
        },
        {
          value: "私有网络",
          label: "私有网络",
          children: [
            {
              value: "VPN_GW",
              label: "VPN网关"
            },
            {
              value: "VPN通道",
              label: "VPN通道"
            },
            {
              value: "共享带宽包",
              label: "共享带宽包"
            },
            {
              value: "NAT网关",
              label: "NAT网关"
            },
            {
              value: "对等连接",
              label: "对等连接"
            },
            {
              value: "VPC_CRCCN",
              label: "基础网络跨地域互联"
            },
            {
              value: "DC_GW",
              label: "专线网关"
            },
            {
              value: "云联网",
              label: "云联网",
              children: [
                {
                  value: "地域间",
                  label: "地域间"
                },
                {
                  value: "单地域",
                  label: "单地域"
                }
              ]
            },
            {
              value: "NET_DETECT",
              label: "网络探测"
            },
            {
              value: "EIPv6",
              label: "弹性公网IPv6"
            },
            {
              value: "弹性公网IP",
              label: "弹性公网IP"
            },
            {
              value: "Anycast弹性公网IP",
              label: "Anycast弹性公网IP"
            }
          ]
        },
        {
          value: "云数据库",
          label: "云数据库",
          children: [
            {
              value: "cmongo_instance",
              label: "MongoDB"
            },
            {
              value: "MySQL",
              label: "MySQL",
              children: [
                {
                  value: "cdb_detail",
                  label: "主机监控"
                },
                {
                  value: "CDB_SLAVE",
                  label: "备机监控"
                }
              ]
            },
            {
              value: "Redis",
              label: "Redis",
              children: [
                {
                  value: "其他版本",
                  label: "其他版本"
                },
                {
                  value: "社区集群版",
                  label: "社区集群版"
                }
              ]
            },
            {
              value: "SQL_Server",
              label: "SQL_Server"
            },
            {
              value: "PostgreSQL",
              label: "PostgreSQL"
            },
            {
              value: "CynosDB",
              label: "CynosDB",
              children: [
                {
                  value: "MySQL",
                  label: "MySQL"
                }
              ]
            },
            {
              value: "CTSDB",
              label: "CTSDB"
            }
          ]
        },
        {
          value: "黑石私有网络",
          label: "黑石私有网络",
          children: [
            {
              value: "BM_NATGW",
              label: "NAT网关"
            },
            {
              value: "BMSSLVPNGW",
              label: "SSL VPN网关"
            },
            {
              value: "网络探测",
              label: "网络探测"
            },
            {
              value: "BMPC",
              label: "对等连接"
            },
            {
              value: "BMIPSECGW",
              label: "IPsec VPN网关"
            },
            {
              value: "BMIPSECCONN",
              label: "IPsec VPN通道"
            }
          ]
        },
        {
          value: "容器服务",
          label: "容器服务",
          children: [
            {
              value: "服务",
              label: "服务"
            },
            {
              value: "容器",
              label: "容器"
            },
            {
              value: "DOCKER_CLUSTER",
              label: "集群"
            },
            {
              value: "DOCKER_POD",
              label: "pod"
            },
            {
              value: "节点",
              label: "节点"
            }
          ]
        },
        {
          value: "CVM_TRAFFIC_REGION",
          label: "云服务器总带宽(地域)"
        },
        {
          value: "CVM_TRAFFIC_PRJ",
          label: "云服务器总带宽(项目)"
        },
        {
          value: "宙斯盾",
          label: "宙斯盾",
          children: [{ value: "HAIP", label: "高防IP" }]
        },
        {
          value: "CDN",
          label: "CDN",
          children: [
            { value: "CDN域名国内", label: "CDN域名国内" },
            { value: "CDN项目国内", label: "CDN项目国内" },
            { value: "CDN域名海外", label: "CDN域名海外" },
            { value: "OV_CDN_PROJECT", label: "CDN项目海外" }
          ]
        },
        {
          value: "专线接入",
          label: "专线接入",
          children: [
            { value: "dcchannel", label: "专用通道" },
            { value: "dcline", label: "物理专线" }
          ]
        },
        {
          value: "消息服务CKafka",
          label: "消息服务CKafka",
          children: [
            { value: "CKAFKA_INSTANCE", label: "实例" },
            {
              value: "ConsumerGroup",
              label: "ConsumerGroup",
              children: [
                { value: "Topic", label: "Topic" },
                { value: "Partition", label: "Partition" }
              ]
            },
            { value: "Topic", label: "Topic" }
          ]
        },
        {
          value: "CES",
          label: "Elasticsearch服务"
        },
        {
          value: "弹性 MapReduce",
          label: "弹性 MapReduce",
          children: [
            {
              value: "HDFS",
              label: "HDFS",
              children: [
                { value: "hdfs_datanode", label: "DataNode" },
                { value: "hdfs_overview_aggregation", label: "概览" },
                { value: "JournalNode", label: "JournalNode" },
                { value: "hdfs_namenode", label: "NameNode" },
                { value: "ZKFailoverController", label: "ZKFailoverController" }
              ]
            },
            {
              value: "YARN",
              label: "YARN",
              children: [
                { value: "yarn_nodemanager", label: "NodeManager" },
                { value: "概览", label: "概览" },
                { value: "yarn_resourcemanager", label: "ResourceManager" },
                { value: "yarn_jobhistoryserver", label: "JobHistoryServer" }
              ]
            },
            {
              value: "PRESTO",
              label: "PRESTO",
              children: [
                { value: "Presto_Coordinator", label: "Presto_Coordinator" },
                { value: "presto_overview", label: "概览" },
                { value: "Presto_Worker", label: "Presto_Worker" }
              ]
            },
            {
              value: "HBASE",
              label: "HBASE",
              children: [
                { value: "hbase_hmaster", label: "HMaster" },
                { value: "概览", label: "概览" },
                { value: "hbase_regionserver", label: "RegionServer" }
              ]
            },
            {
              value: "SPARK",
              label: "SPARK",
              children: [
                {
                  value: "spark_sparkjobhistoryserver",
                  label: "SparkJobHistoryServer"
                }
              ]
            },
            {
              value: "HIVE",
              label: "HIVE",
              children: [
                { value: "hive_hivemetastore", label: "HiveMetaStore" },
                { value: "hive_hiveserver2", label: "HiveServer2" },
                { value: "hive_hivewebhcat", label: "HiveWebHcat" }
              ]
            },
            {
              value: "主机监控",
              label: "主机监控",
              children: [
                { value: "node_memory", label: "内存" },
                { value: "网络", label: "网络" },
                { value: "node_filehandle", label: "文件句柄" },
                { value: "node_cpu", label: "CPU" },
                { value: "进程", label: "进程" }
              ]
            },
            {
              value: "ZOOKEEPER",
              label: "ZOOKEEPER",
              children: [{ value: "zookeeper_zookeeper", label: "Zookeeper" }]
            }
          ]
        },
        {
          value: "全球应用加速",
          label: "全球应用加速",
          children: [
            { value: "QAAP_TUNNEL_RULE", label: "加速通道规则" },
            { value: "加速通道", label: "加速通道" },
            { value: "QAAP_TUNNEL_LISTENER", label: "加速通道监听器" }
          ]
        },
        {
          value: "TSF",
          label: "TSF",
          children: [
            { value: "日志告警", label: "日志告警" },
            { value: "部署组告警", label: "部署组告警" },
            { value: "服务告警", label: "服务告警" }
          ]
        },
        {
          value: "DDoS防护",
          label: "DDoS防护",
          children: [{ value: "高防IP", label: "高防IP" }]
        },
        {
          value: "tcaplusdb",
          label: "TcaplusDB"
        },
        {
          value: "负载均衡",
          label: "负载均衡",
          children: [
            { value: "外网监听器", label: "外网监听器" },
            { value: "CLB_LISTENER_PRIVATE", label: "内网监听器" },
            {
              value: "服务器端口(传统型内网) ",
              label: "服务器端口(传统型内网) "
            },
            {
              value: "服务器端口(其他)",
              label: "服务器端口(其他)",
              children: [
                { value: "LB_RS_PORT_STATUS", label: "监听器维度" },
                { value: "服务器端口维度", label: "服务器端口维度" }
              ]
            },
            { value: "LB-SEVEN-LAYER-MONITOR", label: "七层协议监控" },
            { value: "LB_VIP", label: "负载均衡实例" }
          ]
        },
        {
          value: "SCDN",
          label: "SCDN",
          children: [
            { value: "scdn_domain", label: "域名国内" },
            { value: "项目国内", label: "项目国内" },
            { value: "用户国内 ", label: "用户国内" }
          ]
        },
        {
          value: "存储网关",
          label: "存储网关",
          children: [
            { value: "卷网关", label: "卷网关" },
            { value: "文件网关", label: "文件网关" }
          ]
        },
        {
          value: "SPARKLING",
          label: "云数据仓库套件Sparkling"
        },
        {
          value: "日志服务",
          label: "日志服务",
          children: [{ value: "cls_machine_group", label: "机器组" }]
        },
        {
          value: "消息服务CMQ",
          label: "消息服务CMQ",
          children: [
            {
              value: "队列",
              label: "队列",
              children: [{ value: "消息请求", label: "消息请求" }]
            },
            {
              value: "主题",
              label: "主题",
              children: [{ value: "消息请求", label: "消息请求" }]
            }
          ]
        },
        {
          value: "ECDN",
          label: "ECDN",
          children: [
            { value: "ECDN域名", label: "ECDN域名" },
            { value: "dsa_project", label: "ECDN项目" }
          ]
        },
        {
          value: "SCS",
          label: "流计算 Oceanus"
        },
        {
          value: "无服务器云函数",
          label: "无服务器云函数"
        },
        {
          value: "云直播",
          label: "云直播",
          children: [{ value: "直播域名", label: "直播域名" }]
        },
        {
          value: "分布式数据库",
          label: "分布式数据库",
          children: [{ value: "TDSQL", label: "TDSQL" }]
        },
        {
          value: "cfs_monitor",
          label: "文件存储"
        },
        {
          value: "snova数据仓库",
          label: "snova数据仓库",
          children: [
            { value: "snova_cluster_node", label: "计算节点监控" },
            { value: "主节点监控", label: "主节点监控" },
            { value: "集群监控", label: "集群监控" }
          ]
        },
        {
          value: "小游戏联机对战引擎",
          label: "小游戏联机对战引擎",
          children: [
            { value: "pod", label: "实例监控" },
            { value: "实时服务器监控", label: "实时服务器监控" }
          ]
        },
        {
          value: "黑石负载均衡",
          label: "黑石负载均衡",
          children: [
            { value: "外网监听器", label: "外网监听器" },
            { value: "BM_LB_IN_LISTENER", label: "内网监听器" }
          ]
        },
        {
          value: "COS",
          label: "对象存储"
        },
        {
          value: "peer_altering",
          label: "Peer节点基础指标告警"
        },
        {
          value: "API网关",
          label: "API网关",
          children: [
            { value: "APIGW_ENV", label: "环境" },
            { value: "API", label: "API" }
          ]
        },
        {
          value: "数据传输服务",
          label: "数据传输服务",
          children: [{ value: "MIGRATEJOB_INTERRUPTION", label: "自建迁移" }]
        }
      ]
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    }
  }
};
</script>
<style lang="scss" scoped>
.grouping-type {
  ::v-deep .el-input__inner {
    width: 200px;
    border-radius: 0px;
    height: 30px;
  }
}
</style>
<style lang="scss">
.el-scrollbar__wrap {
  overflow: auto;
  margin: 0px !important;
}
.el-cascader-menu {
  overflow: auto;
}
.el-cascader-menu::-webkit-scrollbar {
  display: none;
}
.el-scrollbar__wrap::-webkit-scrollbar {
  display: none;
}
.el-cascader-menu__list {
  li {
    height: 30px;
    padding: 0 10px;
    padding-right: 20px;
    line-height: 30px;
    font-size: 12px;
    color: #000;
    display: flex;
    justify-content: space-between;
    i {
      line-height: 30px;
    }
    &:focus {
      outline-width: 0px;
    }
    &:hover {
      cursor: pointer;
      background: #f2f2f2;
    }
  }
}
.el-cascader-menu__hover-zone {
  display: none;
}
</style>
