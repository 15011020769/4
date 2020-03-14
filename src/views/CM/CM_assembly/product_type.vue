<template>
  <div>
    <el-select v-model="productValue">
      <el-option v-for="item in productOptions" :key="item.viewName" :label="item.label" :value="item.viewName">
      </el-option>
    </el-select>
  </div>
</template>
<script>
  import {
    CVM_LIST, //云服务器列表
    NAT_LIST, //NAT网关列表
    VPN_LIST, //VPN网关列表
    VPNTD_LIST, //VPN通道列表
    DCG_LIST, //专线网关列表
    MYSQL_LIST, //MYSQL列表
    REDIS_LIST, //REDIS列表
    Physics_LIST, //物理专线列表
    Private_LIST, //专线通道列表
    OBJ_LIST, //对象存储列表
    ALL_PROJECT
  } from "@/constants";
  import {
    ErrorTips
  } from '@/components/ErrorTips'
  export default {
    data() {
      return {
        productOptions: [

          {
            label: '云服务器',
            viewName: 'cvm_device',
          }, {
            label: 'VPN网关',
            viewName: 'VPN_GW',
          }, {
            label: 'VPN通道',
            viewName: 'vpn_tunnel',
          }, {
            label: 'NAT网关',
            viewName: 'nat_tc_stat',
          }, {
            label: '专线网关',
            viewName: 'DC_GW',
          }, {
            label: '弹性公网IP',
            viewName: 'EIP',
          }, {
            label: 'MYSQL',
            viewName: 'cdb_detail',
          }, {
            label: 'Redis',
            viewName: 'REDIS-CLUSTER',
          }, {
            label: '专用通道',
            viewName: 'dcchannel',
          }, {
            label: '物理专线',
            viewName: 'dcline',
          }, {
            label: '对象存储',
            viewName: 'COS',
          }
        ],
        productValue: 'cvm_device',
        Date: [], //各个产品数组
        HeadConfig: {}, //头部设置
        SearchConfig: [], //搜索设置
        Namespace: 'QCE/CVM', //各产品调取监控数据命名空间
        MetricName: [],

        Pass: {}
      }
    },
    watch: {
      productValue() {
        this._switchType()
      }
    },
    created() {
      this._switchType()
    },
    methods: {
      _PassValue() {
        this.Pass.productValue = this.productValue
        this.Pass.Date = this.Date
        this.Pass.HeadConfig = this.HeadConfig
        this.Pass.SearchConfig = this.SearchConfig
        this.Pass.Namespace = this.Namespace
        this.Pass.MetricName = this.MetricName
        this.$emit("PassData", this.Pass);
      },
      _switchType() {
        if (this.productValue === 'cvm_device') {
          this._GetCVM()
        } else if (this.productValue === 'nat_tc_stat') {
          this._GetNat()
        } else if (this.productValue === 'VPN_GW') {
          this._GetVPNG()
        } else if (this.productValue === 'vpn_tunnel') {
          this._GetVPNX()
        } else if (this.productValue === 'DC_GW') {
          this._GetPRI()
        } else if (this.productValue === 'cdb_detail') {
          this._GetMYSQL()
        } else if (this.productValue === 'REDIS-CLUSTER') {
          this._GetREDIS()
        } else if (this.productValue === 'dcline') {
          this._GetDCLINE()
        } else if (this.productValue === 'dcchannel') {
          this._GetDcPri()
        } else if (this.productValue === 'COS') {
          this._GetOBJ()
        }
      },
      // 获取云服务器列表
      _GetCVM() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        this.axios.post(CVM_LIST, parms).then(data => {
          this.Date = data.Response.InstanceSet
          this.Namespace = 'QCE/CVM'
          this.SearchConfig = [{
              value: "instance-id",
              label: "實例ID"
            },
            {
              value: "instance-name",
              label: "實例名稱"
            },
            {
              value: "private-ip-address",
              label: "內網IP"
            },
            {
              value: "public-ip-address",
              label: "公網IP"
            }
          ]
          this.HeadConfig = {
            title1: 'ID/主机名',
            title2: '网络类型',
            title3: 'IP地址'
          }
          this.MetricName = [{
              label: '内网出带宽',
              value: 'LanOuttraffic'
            }, {
              label: '内网入带宽',
              value: 'LanIntraffic'
            },
            {
              label: '内网出包量',
              value: 'LanOutpkg'
            },
            {
              label: '内网入包量',
              value: 'LanInpkg'
            },
            {
              label: '外网出带宽',
              value: 'WanOuttraffic'
            },
            {
              label: '外网入带宽',
              value: 'WanIntraffic'
            }, {
              label: '外网出流量',
              value: 'AccOuttraffic'
            },
            {
              label: '外网出包量',
              value: 'WanOutpkg'
            },
            {
              label: '外网入包量',
              value: 'WanInpkg'
            },
            {
              label: 'CPU使用率',
              value: 'CpuUsage'
            }, {
              label: 'CPU平均负载',
              value: 'CpuLoadavg'
            },
            {
              label: '内存使用量',
              value: 'MemUsed'
            }, {
              label: '内存利用率',
              value: 'MemUsage'
            },
            {
              label: 'TCP连接数',
              value: 'TcpCurrEstab'
            }, {
              label: '基础CPU使用率',
              value: 'BaseCpuUsage'
            },
            {
              label: 'CPU平均负载',
              value: 'Cpuloadavg15m'
            }, {
              label: 'CPU平均负载',
              value: 'Cpuloadavg5m'
            },
            {
              label: 'IO Await',
              value: 'DiskIoAwait'
            }, {
              label: '读IOPS',
              value: 'DiskReadIops'
            },
            {
              label: '读流量',
              value: 'DiskReadTrafficNew'
            }, {
              label: 'IO Svctm',
              value: 'DiskSvctm'
            },
            {
              label: 'IO %util',
              value: 'DiskUtil'
            }, {
              label: '写流量',
              value: 'DiskWriteTrafficNew'
            },
          ]
          this._PassValue()
        });
      },
      // 获取NAT网关列表
      _GetNat() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        this.axios.post(NAT_LIST, parms).then(data => {
          this.Date = data.Response.NatGatewaySet
          this.Namespace = 'NAT_GATEWAY'
          this.SearchConfig = [{
              value: "nat-gateway-id",
              label: "ID"
            },
            {
              value: "nat-gateway-name",
              label: "名稱"
            }
          ]
          this.HeadConfig = {
            title1: 'ID/名称',
            title2: '状态',
            title3: '私有网络',
            title4: '类型',
          }
          this.MetricName = [{
              label: '外網出頻寬',
              value: 'OutBandwidth'
            },
            {
              label: '外網入頻寬',
              value: 'InBandwidth'
            },
            {
              label: '出包量',
              value: 'OutPkg'
            },
            {
              label: '入包量',
              value: 'InPkg'
            },
            {
              label: '連接數',
              value: 'Conns'
            }
          ]
          this._PassValue()
        });
      },
      // 获取VPN网关列表
      _GetVPNG() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        this.axios.post(VPN_LIST, parms).then(data => {
          this.Date = data.Response.VpnGatewaySet
          this.Namespace = 'QCE/VPNGW'
          this.SearchConfig = [{
              value: "vpn-gateway-id",
              label: "ID"
            },
            {
              value: "vpn-gateway-name",
              label: "名稱"
            }
          ]
          this.HeadConfig = {
            title1: 'ID/名称',
            title2: '状态',
            title3: '所属网络',
          }
          this.MetricName = [{
              label: '外网入带宽',
              value: 'InBandwidth'
            },
            {
              label: '出包量',
              value: 'OutPkg'
            },
            {
              label: '外网出带宽',
              value: 'OutBandwidth'
            },
            {
              label: '入包量',
              value: 'InPkg'
            },
            {
              label: '連接數',
              value: 'Conns'
            }
          ]
          this._PassValue()
        });
      },
      // 获取VPN通道列表
      _GetVPNX() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        this.axios.post(VPNTD_LIST, parms).then(data => {
          this.Date = data.Response.VpnConnectionSet
          this.Namespace = 'QCE/VPNX'
          this.SearchConfig = [{
              value: "vpn-connection-id",
              label: "ID"
            },
            {
              value: "vpn-connection-name",
              label: "名稱"
            }
          ]
          this.HeadConfig = {
            title1: 'ID/名称',
            title2: '所属网络',
            title3: 'VPN网关',
          }
          this.MetricName = [{
              label: '外網入頻寬',
              value: 'InBandwidth'
            },
            {
              label: '外網入頻寬',
              value: 'InBandwidth'
            },
            {
              label: '出包量',
              value: 'OutPkg'
            },
            {
              label: '外網出頻寬',
              value: 'OutBandwidth'
            },
            {
              label: '入包量',
              value: 'InPkg'
            }, {
              label: '丢包率',
              value: 'Pkgdrop'
            },
            {
              label: '時延',
              value: 'Delay'
            },

          ]
          this._PassValue()
        });
      },
      // 获取专线网关列表
      _GetPRI() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        this.axios.post(DCG_LIST, parms).then(data => {
          this.Date = data.Response.DirectConnectGatewaySet
          this.Namespace = 'QCE/DCG'
          this.SearchConfig = [{
              value: "direct-connect-gateway-id",
              label: "ID"
            },
            {
              value: "direct-connect-gateway-name",
              label: "網關名稱"
            }
          ]
          this.HeadConfig = {
            title1: 'ID/名称',
            title2: 'NAT配置状态',
            title3: '所属网络',
          }
          this.MetricName = [{
              label: '外網入頻寬',
              value: 'InBandwidth'
            },
            {
              label: '出包量',
              value: 'OutPkg'
            },
            {
              label: '外網出頻寬',
              value: 'OutBandwidth'
            },
            {
              label: '入包量',
              value: 'InPkg'
            }

          ]
          this._PassValue()
        });
      },
      // 获取mysql列表
      _GetMYSQL() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-20",
        }
        this.axios.post(MYSQL_LIST, parms).then(data => {
          this.Date = data.Response.Items
          this.Namespace = 'QCE/CDB'
          this.SearchConfig = [{
            value: "InstanceIds.0",
            label: "實例 ID"
          }]
          this.HeadConfig = {
            title1: 'ID/名称',
            title2: '内网IP/端口',
            title2: '网络类型',
            title3: '类型',
          }
          this.MetricName = [{
              label: 'BytesReceived',
              value: '内网入流量'
            },
            {
              label: 'BytesSent',
              value: '内网出流量'
            },
            {
              label: 'Capacity',
              value: '磁盘占用空间'
            },
            {
              label: 'ComCommit',
              value: '提交数'
            },
            {
              label: 'ComDelete',
              value: '删除数'
            },
            {
              label: 'ComInsert',
              value: '插入数'
            },
            {
              label: 'ComReplace',
              value: '回滚数'
            },
            {
              label: 'ComUpdate',
              value: '更新数'
            },
            {
              label: 'ConnectionUseRate',
              value: '连接数利用率'
            },
            {
              label: 'CpuUseRate',
              value: 'CPU利用率',
            },
            {
              label: 'CreatedTmpDiskTables',
              value: '磁盘临时表数量'
            },
            {
              label: 'CreatedTmpFiles',
              value: '临时文件数量'
            },
            {
              label: 'CreatedTmpTables',
              value: '临时表数量'
            },
            {
              label: 'HandlerCommit',
              value: '内部提交数'
            },
            {
              label: 'HandlerReadRndNext',
              value: '读下一行请求数'
            },
            {
              label: 'HandlerRollback',
              value: '内部回滚数',
            },
            {
              label: 'InnodbBufferPoolPagesFree',
              value: 'InnoDB空页数'
            },
            {
              label: 'InnodbBufferPoolPagesTotal',
              value: 'InnoDB总页数'
            },
            {
              label: 'InnodbBufferPoolReads',
              value: 'InnoDB物理读'
            },
            {
              label: 'InnodbBufferPoolReadRequests',
              value: 'InnoDB逻辑读'
            },
            {
              label: 'InnodbCacheHitRate',
              value: 'innodb缓存命中率'
            },
            {
              label: 'InnodbCacheUseRate',
              value: 'innodb缓存使用率'
            },
            {
              label: 'InnodbDataRead',
              value: 'InnoDB读取量'
            },
            {
              label: 'InnodbDataReads',
              value: 'InnoDB总读取量'
            },
            {
              label: 'InnodbDataWrites',
              value: 'InnoDB总写入量'
            },
            {
              label: 'InnodbDataWritten',
              value: 'InnoDB写入量'
            },
            {
              label: 'InnodbNumOpenFiles',
              value: '当前InnoDB打开表的数量'
            },
            {
              label: 'InnodbOsFileReads',
              value: 'innodb读磁盘数量'
            },
            {
              label: 'InnodbOsFileWrites',
              value: 'innodb写磁盘数量'
            },
            {
              label: 'InnodbOsFsyncs',
              value: 'innodb fsync数量'
            },
            {
              label: 'InnodbRowsDeleted',
              value: 'InnoDB行删除量'
            },
            {
              label: 'InnodbRowsInserted',
              value: 'InnoDB行插入量'
            },
            {
              label: 'InnodbRowsRead',
              value: 'InnoDB行读取量'
            },
            {
              label: 'InnodbRowsUpdated',
              value: 'InnoDB行更新量'
            },
            {
              label: 'InnodbRowLockTimeAvg',
              value: 'InnoDB平均获取行锁时间'
            },
            {
              label: 'InnodbRowLockWaits',
              value: 'InnoDB等待行锁次数'
            },
            {
              label: 'KeyBlocksUnused',
              value: '键缓存内未使用的块数量'
            },
            {
              label: 'KeyBlocksUsed',
              value: '键缓存内使用的块数量'
            },
            {
              label: 'KeyCacheHitRate',
              value: 'myisam缓存命中率'
            },
            {
              label: 'KeyCacheUseRate',
              value: 'myisam缓存使用率'
            },
            {
              label: 'KeyReads',
              value: '硬盘读取数据块次数'
            },
            {
              label: 'KeyReadRequests',
              value: '键缓存读取数据块次数'
            },
            {
              label: 'KeyWrites',
              value: '数据块写入磁盘次数'
            },
            {
              label: 'KeyWriteRequests',
              value: '数据块写入键缓冲次数'
            },
            {
              label: 'LogCapacity',
              value: '日志使用量'
            },
            {
              label: 'MasterSlaveSyncDistance',
              value: '主从延迟距离'
            },
            {
              label: 'MaxConnections',
              value: '最大连接数'
            },
            {
              label: 'MemoryUse',
              value: '内存占用'
            },
            {
              label: 'MemoryUseRate',
              value: '内存利用率'
            },
            {
              label: 'OpenedTables',
              value: '已经打开的表数'
            },
            {
              label: 'OpenFiles',
              value: '打开文件总数'
            },
            {
              label: 'QcacheFreeBlocks',
              value: '查询缓存空闲块'
            },
            {
              label: 'QcacheFreeMemory',
              value: '缓存中空闲内存量'
            },
            {
              label: 'QcacheHits',
              value: '缓存命中次数'
            },
            {
              label: 'QcacheHitRate',
              value: '查询缓存命中率'
            },
            {
              label: 'QcacheInserts',
              value: '缓存写入次数'
            },
            {
              label: 'QcacheLowmemPrunes',
              value: '因内存不足删除缓存次数'
            },
            {
              label: 'QcacheNotCached',
              value: '查询未被缓存次数'
            },
            {
              label: 'QcacheQueriesInCache',
              value: '以注册到缓存内的查询数'
            },
            {
              label: 'QcacheTotalBlocks',
              value: '查询缓存内的总块数'
            },
            {
              label: 'QcacheUseRate',
              value: '查询缓存使用率'
            },
            {
              label: 'Qps',
              value: '每秒执行操作数'
            },
            {
              label: 'Queries',
              value: '总请求数'
            },
            {
              label: 'QueryRate',
              value: '查询使用率'
            },
            {
              label: 'RealCapacity',
              value: '磁盘使用空间'
            },
            {
              label: 'SecondsBehindMaster',
              value: '主从延迟时间'
            },
            {
              label: 'SelectCount',
              value: '查询数'
            },
            {
              label: 'SelectScan',
              value: '全表扫描数'
            },
            {
              label: 'SlaveIoRunning',
              value: 'IO线程状态'
            },
            {
              label: 'SlaveSqlRunning',
              value: 'SQL线程状态'
            },
            {
              label: 'SlowQueries',
              value: '慢查询数'
            },
            {
              label: 'TableLocksImmediate',
              value: '立即释放的表锁数'
            },
            {
              label: 'TableLocksWaited',
              value: '等待表锁次数'
            },
            {
              label: 'ThreadsConnected',
              value: '当前打开连接数'
            },
            {
              label: 'ThreadsCreated',
              value: '已创建的线程数'
            },
            {
              label: 'ThreadsRunning',
              value: '运行的线程数'
            },
            {
              label: 'Tps',
              value: '每秒执行事务数'
            },
            {
              label: 'VolumeRate',
              value: '磁盘使用率',
            }























          ]
          this._PassValue()
        });
      },
      // 获取RESIS列表
      _GetREDIS() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2018-04-12",
        }
        this.axios.post(REDIS_LIST, parms).then(data => {
          this.Date = data.Response.InstanceSet
          this.Namespace = 'QCE/REDIS'
          this.SearchConfig = [{
            value: "InstanceId",
            label: "ID"
          }]
          this.HeadConfig = {
            title1: 'ID/名称',
            title2: '规格',
            title3: '内网地址',
          }
          this.MetricName = [{
              value: 'BigValueMin',
              label: '执行次数'
            },
            {
              value: 'BigValueNodeMin',
              label: '大value'
            },
            {
              value: 'CacheHitRatioMin',
              label: ' Key命中'
            },
            {
              value: 'CacheHitRatioNodeMin',
              label: 'cache命中率'
            },
            {
              value: 'CmdstatDelNodeMin',
              label: 'DEL命令执行次数'
            },
            {
              value: 'CmdstatFlushallNodeMin',
              label: 'Flushall执行次数'
            },
            {
              value: 'CmdstatFlushdbNodeMin',
              label: 'Flushdb执行次数'
            },
            {
              value: 'CmdstatGetbitNodeMin',
              label: 'Getbit执行次数'
            },
            {
              value: 'CmdstatGetrangeNodeMin',
              label: 'Getrange执行次数'
            },
            {
              value: 'CmdstatGetNodeMin',
              label: 'Get执行次数'
            },
            {
              value: 'CmdstatHgetallNodeMin',
              label: 'Hgetall执行次数'
            },
            {
              value: 'CmdstatHgetNodeMin',
              label: 'Hget执行次数'
            },
            {
              value: 'CmdstatHmget',
              label: 'hmget数量'
            },
            {
              value: 'CmdstatHmgetNodeMin',
              label: 'Hmget执行次数'
            },
            {
              value: 'CmdstatHmsetNodeMin',
              label: 'Hmset执行次数'
            },
            {
              value: 'CmdstatHsetnxNodeMin',
              label: 'Hsetnx执行次数'
            },
            {
              value: 'CmdstatHsetNodeMin',
              label: 'Hset执行次数'
            },
            {
              value: 'CmdstatMgetNodeMin',
              label: 'Mget执行次数'
            },
            {
              value: 'CmdstatMsetnxNodeMin',
              label: 'Msetnx执行次数'
            },
            {
              value: 'CmdstatMsetNodeMin',
              label: 'Mset执行次数'
            },
            {
              value: 'CmdstatSetbitNodeMin',
              label: 'Setbit执行次数'
            },
            {
              value: 'CmdstatSetexNodeMin',
              label: 'Setex执行次数'
            },
            {
              value: 'CmdstatSetnxNodeMin',
              label: 'Setnx执行次数'
            },
            {
              value: 'CmdstatSetrangeNodeMin',
              label: 'Setrange执行次数'
            },
            {
              value: 'CmdstatSetNodeMin',
              label: 'Set执行次数'
            },
            {
              value: 'CmdErrMin',
              label: '命令执行错误的次数'
            },
            {
              value: 'CmdErrNodeMin',
              label: '错误命令数量'
            },
            {
              value: 'ConnectionsMin',
              label: 'TCP连接数量'
            },
            {
              value: 'ConnectionsUsMin',
              label: '连接数使用率'
            },
            {
              value: 'CpuMaxUsMin',
              label: '单分片最大cpu使用率'
            },
            {
              value: 'CpuUsNodeMin',
              label: 'CPU使用率'
            },
            {
              value: 'EvictedKeysMin',
              label: '驱逐的Key'
            },
            {
              value: 'EvictedKeysNodeMin',
              label: 'keys驱逐数量'
            },
            {
              value: 'ExpiredKeysMin',
              label: '淘汰的Key'
            },
            {
              value: 'ExpiredKeysNodeMin',
              label: 'keys过期数量'
            },
            {
              value: 'GossipInFlowNodeMin',
              label: 'gossip入流'
            },
            {
              value: 'GossipOutFlowNodeMin',
              label: 'gossip出流'
            },
            {
              value: 'InFlowMin',
              label: '内网入流量'
            },
            {
              value: 'InFlowUsMin',
              label: '入流使用率'
            },
            {
              value: 'KeysMin',
              label: '总Key'
            },
            {
              value: 'KeysNodeMin',
              label: 'Key数量'
            },
            {
              value: 'LatencyGetMin',
              label: '读命令平均执行时延'
            },
            {
              value: 'LatencyGetNodeMin',
              label: '读请求平均延迟'
            },
            {
              value: 'LatencyMin',
              label: '执行时延平均值'
            },
            {
              value: 'LatencyNodeMin',
              label: '请求平均延迟'
            },
            {
              value: 'LatencyOtherMin',
              label: '命令平均执行时延'
            },
            {
              value: 'LatencyOtherNodeMin',
              label: '平均延迟'
            },
            {
              value: 'LatencySetNodeMin',
              label: '写命令平均执行时延'
            },
            {
              value: 'MemsizeDatasetNodeMin',
              label: '数据内存'
            },
            {
              value: 'MemsizeOverheadNodeMin',
              label: '其他内存'
            },
            {
              value: 'OutFlowMin',
              label: '内网出流量'
            },
            {
              value: 'OutFlowNodeMin',
              label: '指标'
            },
            {
              value: 'OutFlowUsMin',
              label: '出流使用率'
            },
            {
              value: 'QpsNodeMin',
              label: 'QPS命令执行次数'
            },
            {
              value: 'SlowQuery',
              label: '命令次数'
            },
            {
              value: 'SlowQueryNodeMin',
              label: '配置命令次数'
            },
            {
              value: 'StatGetNodeMin',
              label: '读命令执行次数'
            },
            {
              value: 'StatMissedNodeMin',
              label: '读请求Key不存在的个数'
            },
            {
              value: 'StatOtherNodeMin',
              label: '读写命令之外的命令执行次数'
            },
            {
              value: 'StatSetNodeMin',
              label: '写命令执行次数'
            },
            {
              value: 'StatSuccessNodeMin',
              label: '读请求Key存在的个数'
            },
            {
              value: 'Storage',
              label: '内存容量'
            },
            {
              value: 'StorageMaxUsMin',
              label: '单分片最大使用率'
            },
            {
              value: 'StorageNodeMin',
              label: '使用内存容量'
            },
            {
              value: 'StorageSlopeNodeMin',
              label: '分片内存使用率'
            },
            {
              value: 'StorageUsNodeMin',
              label: '实际使用内存和申请总内存之比'
            },
          ]
          this._PassValue()
        });
      },
      //获取物理专线列表
      _GetDCLINE() {
        let parms = {
          Region: this.selectedRegion,
          Version: '2018-04-10',
        }
        this.axios.post(Physics_LIST, parms).then(data => {
          this.Date = data.Response.DirectConnectSet
          this.Namespace = 'QCE/DC'
          this.SearchConfig = [{
            value: 'DirectConnectId',
            label: '專線ID'
          }]
          this.HeadConfig = {
            title1: '名称/ID',
            title2: '所在地',
            title3: '带宽',
          }
          this.MetricName = [{
              label: '物理专线平均每秒出流量',
              value: 'InBandwidth'
            },
            {
              label: '出带宽',
              value: 'OutBandwidth'
            }
          ]
          this._PassValue()
        });
      },
      //获取专线通道列表
      _GetDcPri() {
        let parms = {
          Region: this.selectedRegion,
          Version: '2018-04-10',
        }
        this.axios.post(Private_LIST, parms).then(data => {
          this.Date = data.Response.DirectConnectTunnelSet
          this.Namespace = 'QCE/DCX'
          this.SearchConfig = [{
            value: "DirectConnectIds",
            label: "通道ID"
          }]
          this.HeadConfig = {
            title1: '名称/ID',
            title2: '私有网络',
          }
          this.MetricName = [

            {
              label: '入包量',
              value: 'Inpkg'
            },
            {
              label: '出包量',
              value: 'Outpkg'
            },
            {
              label: '出带宽',
              value: 'Outbandwidth'
            },
            {
              label: '丢包',
              value: 'Pkgdrop'
            }, {
              label: '延时',
              value: 'Delay'
            },
            {
              label: '入带宽',
              value: 'Inbandwidth'
            }
          ]
          this._PassValue()
        });
      },
      //获取对象存储列表
      _GetOBJ() {
        let parms = {
          Region: this.selectedRegion,
          Version: '2018-04-10',
        }
        this.axios.post(OBJ_LIST, parms).then(data => {
          this.Date = data.Buckets
          this.Namespace = 'QCE/COS'
          this.SearchConfig = [{
            value: "bucket",
            label: "儲存桶名稱"
          }]
          this.HeadConfig = {
            title1: 'Bucket名称',
            title2: '地域',
            title3: '创建时间'
          }
          this.MetricName = [{
              value: 'NelStorage',
              label: '近线存储存储空间'
            },
            {
              value: 'SiaStorage',
              label: '低频存储存储空间',
            },
            {
              value: 'ArcStorage',
              label: '归档存储存储空间',
            },
            {
              value: 'StdStorage',
              label: '标准存储存储空间',
            },
            {
              value: '2xxResponse',
              label: '2xx状态码',
            },
            {
              value: '3xxResponse',
              label: '3xx状态码',
            },
            {
              value: '4xxResponse',
              label: '4xx状态码',
            },
            {
              value: '5xxResponse',
              label: '5xx状态码',
            },
            {
              value: 'CdnOriginTraffic',
              label: 'CDN回源流量',
            },
            {
              value: 'IaReadRequests',
              label: '低频存储读请求',
            },
            {
              value: 'IaRetrieval',
              label: '低频数据取回',
            },
            {
              value: 'IaWriteRequests',
              label: '低频存储写请求',
            },
            {
              value: 'InboundTraffic',
              label: '上传流量',
            },
            {
              value: 'InternalTraffic',
              label: '内网流量',
            },
            {
              value: 'InternetTraffic',
              label: '外网流量',
            },
            {
              value: 'NlReadRequests',
              label: '近线存储读请求',
            },
            {
              value: 'NlRetrieval',
              label: '近线数据取回',
            },
            {
              value: 'NlWriteRequests',
              label: '近线存储写请求',
            },
            {
              value: 'StdReadRequests',
              label: '标准存储读请求',
            },
            {
              value: 'StdRetrieval',
              label: '标准数据读取',
            },
            {
              value: 'StdWriteRequests',
              label: '标准存储写请求',
            }

          ]
          this._PassValue()
        });
      },
    },


  }

</script>
<style lang="scss" scoped>
  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px;
    width: 200px;
  }

</style>
