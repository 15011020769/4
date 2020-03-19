<template>
  <div>
    <el-select v-model="productValue1">
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
    props: {
      projectId: {
        required: true,
        type: Number
      },
      searchParam: {
        required: true,
        type: Object
      },
      productValue: {
        required: true,
        type: String
      },
    },


    data() {
      return {
        productOptions: [{
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
        }],
        Date: [], //各个产品数组
        HeadConfig: {}, //头部设置
        SearchConfig: [], //搜索设置
        Namespace: 'QCE/CVM', //各产品调取监控数据命名空间
        MetricName: [],
        id: '',
        Pass: {},
        productValue1: this.productValue
      }
    },
    watch: {
      productValue1() {
        this._switchType()
      },
      projectId() {
        this._switchType()
      },
      searchParam() {
        this._switchType()
      }

    },
    created() {
      this._switchType()
    },
    methods: {
      _PassValue() {
        this.Pass.productValue = this.productValue1
        this.Pass.Date = this.Date
        this.Pass.HeadConfig = this.HeadConfig
        this.Pass.SearchConfig = this.SearchConfig
        this.Pass.Namespace = this.Namespace
        this.Pass.MetricName = this.MetricName
        this.Pass.id = this.id
        this.$emit("PassData", this.Pass);
      },
      _switchType() {
        if (this.productValue1 === 'cvm_device') {
          this._GetCVM()
        } else if (this.productValue1 === 'nat_tc_stat') {
          this._GetNat()
        } else if (this.productValue1 === 'VPN_GW') {
          this._GetVPNG()
        } else if (this.productValue1 === 'vpn_tunnel') {
          this._GetVPNX()
        } else if (this.productValue1 === 'DC_GW') {
          this._GetPRI()
        } else if (this.productValue1 === 'cdb_detail') {
          this._GetMYSQL()
        } else if (this.productValue1 === 'REDIS-CLUSTER') {
          this._GetREDIS()
        } else if (this.productValue1 === 'dcline') {
          this._GetDCLINE()
        } else if (this.productValue1 === 'dcchannel') {
          this._GetDcPri()
        } else if (this.productValue1 === 'COS') {
          this._GetOBJ()
        }
      },
      // 获取云服务器列表
      _GetCVM() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        if (this.searchParam.label !== '' && this.searchParam.value !== '') {
          parms["Filters.0.Name"] = this.searchParam.label;
          parms["Filters.0.Values.0"] = this.searchParam.value;
          parms["Filters.1.Name"] = 'project-id';
          parms["Filters.1.Values.0"] = this.projectId;
        } else {
          parms["Filters.0.Name"] = 'project-id';
          parms["Filters.0.Values.0"] = this.projectId;
        }
        this.axios.post(CVM_LIST, parms).then(data => {
          this.id = 'cvm'
          this.Date = data.Response.InstanceSet
          this.Namespace = 'qce/cvm'
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
              label: 'CPU使用率%',
              value: 'cpu_usage'
            }, {
              label: 'CPU平均负载',
              value: 'cpu_loadavg'
            }, {
              label: '基础CPU使用率%',
              value: 'base_cpu_usage'
            },
            {
              label: '内存使用量(MB)',
              value: 'mem_used'
            }, {
              label: '内存利用率%',
              value: 'mem_usage'
            },
            {
              label: '内网出带宽(Mbps)',
              value: 'lan_outtraffic'
            }, {
              label: '内网入带宽(Mbps)',
              value: 'lan_intraffic'
            },
            {
              label: '内网出包量(个/s)',
              value: 'lan_outpkg'
            },
            {
              label: '内网入包量(个/s)',
              value: 'lan_inpkg'
            }, {
              label: 'TCP连接数(个)',
              value: 'tcp_curr_estab'
            },
            {
              label: '外网出带宽(Mbps)',
              value: 'wan_outtraffic'
            },
            {
              label: '外网入带宽(Mbps)',
              value: 'wan_intraffic'
            }, {
              label: '外网出包量(个/s)',
              value: 'wan_outpkg(个/s)'
            },
            {
              label: '外网入包量(个/s)',
              value: 'wan_inpkg'
            },
            {
              label: '外网出流量(MB)',
              value: 'acc_outtraffic'
            }
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
          this.id = "nat_tc_stat"
          this.Date = data.Response.NatGatewaySet
          this.Namespace = 'qce/nat_gateway'
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
              label: '外网出带宽(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '外网入带宽(Mbps)',
              value: 'inbandwidth'
            },
            {
              label: '出包量(个/s)',
              value: 'outpkg'
            },
            {
              label: '入包量(个/s)',
              value: 'inpkg'
            },
            {
              label: '連接數(个/s)',
              value: 'conns'
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
          this.id = 'vpcgw'
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
              label: '外网出带宽(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '外网入带宽(Mbps)',
              value: 'inbandwidth'
            },
            {
              label: '出包量(个/s)',
              value: 'outpkg'
            },
            {
              label: '入包量(个/s)',
              value: 'inpkg'
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
          this.id = "vpn_tunnel"
          this.Date = data.Response.VpnConnectionSet
          this.Namespace = 'qce/vpnx'
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
              label: '网络出带宽(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '网络入带宽(Mbps)',
              value: 'inbandwidth'
            },
            {
              label: '出包量(个/s)',
              value: 'outpkg'
            },
            {
              label: '入包量(个/s)',
              value: 'inpkg'
            },
            {
              label: '丢包率(%)',
              value: 'pkgdrop'
            }, {
              label: '時延(ms)',
              value: 'delay'
            }

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
          this.id = 'dclinegw'
          this.Date = data.Response.DirectConnectGatewaySet
          this.Namespace = 'qce/dcg'
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
              label: '网络出带宽(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '网络入带宽(Mbps)',
              value: 'inbandwidth'
            },
            {
              label: '出包量(个/s)',
              value: 'outpkg'
            },
            {
              label: '入包量(个/s)',
              value: 'inpkg'
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
          this.id = 'cdb'
          this.Date = data.Response.Items
          this.Namespace = 'qce/cdb'
          this.SearchConfig = [{
            value: "InstanceIds.0",
            label: "實例 ID"
          }]
          this.HeadConfig = {
            title1: 'ID/名称',
            title2: '内网IP/端口',
            // title3: '网络类型',
            // title4: '类型',
          }
          this.MetricName = [

            {
              label: '慢查询数(次/分钟)',
              value: 'slow_queries'
            },
            {
              label: '连接数利用率(%)',
              value: 'connection_use_rate'
            },
            {
              label: '最大连接数(个)',
              value: 'max_connections'
            },
            {
              label: '全表扫描数(次/秒)',
              value: 'select_scan'
            },
            {
              label: '查询数(次/秒)',
              value: 'select_count'
            },
            {
              label: '更新数(次/秒)',
              value: 'com_update'
            },
            {
              label: '删除数(次/秒)',
              value: 'com_delete'
            },
            {
              label: '插入数(次/秒)',
              value: 'com_insert'
            },
            {
              label: '覆盖数(次/秒)',
              value: 'com_replace'
            },
            {
              label: '总请求数(次/秒)',
              value: 'queries',
            },
            {
              label: '当前打开连接数(个)',
              value: 'threads_connected'
            },
            {
              label: '磁盘使用空间(MB)',
              value: 'real_capacity'
            },
            {
              label: '磁盘占用空间(MB)',
              value: 'capacity'
            },
            {
              label: '内网出流量(Byte/秒)',
              value: 'bytes_sent'
            },
            {
              label: '内网入流量(Byte/秒)',
              value: 'bytes_received'
            },
            {
              label: '缓存使用率(%)',
              value: 'qcache_use_rate',
            },
            {
              label: '缓存命中率(%)',
              value: 'qcache_hit_rate'
            },
            {
              label: '等待表锁次数(次/秒)',
              value: 'table_locks_waited'
            },
            {
              label: '临时表数量(次/秒)',
              value: 'created_tmp_tables'
            },
            {
              label: 'innodb缓存使用率(%)',
              value: 'innodb_cache_use_rate'
            },
            {
              label: 'innodb缓存命中率(%)',
              value: 'innodb_cache_hit_rate'
            },
            {
              label: 'innodb读磁盘数量(次/秒)',
              value: 'innodb_os_file_reads'
            },
            {
              label: 'innodb写磁盘数量(次/秒)',
              value: 'innodb_os_file_writes'
            },
            {
              label: 'innodb fsync数量(次/秒)',
              value: 'innodb_os_fsyncs'
            },
            {
              label: 'myisam缓存使用率(%)',
              value: 'key_cache_use_rate'
            },
            {
              label: 'myisam缓存命中率(%)',
              value: 'key_cache_hit_rate'
            },
            {
              label: '磁盘利用率(%)',
              value: 'volume_rate'
            },
            {
              label: '查询使用率(%)',
              value: 'query_rate'
            },
            {
              label: '每秒执行操作数(次/秒)',
              value: 'qps'
            },
            {
              label: '每秒执行事务数(次/秒)',
              value: 'tps'
            },
            {
              label: 'CPU利用率(%)',
              value: 'cpu_use_rate'
            },
            {
              label: '内存利用率(%)',
              value: 'memory_use_rate'
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
          this.redis = 'redis'
          this.Date = data.Response.InstanceSet
          this.Namespace = 'qce/redis'
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
              value: 'cpu_us_min',
              label: 'CPU使用率(%)'
            },
            {
              value: 'cmdstat_get_min',
              label: 'get请求数(次)'
            },
            {
              value: 'cmdstat_getbit_min',
              label: 'getbit请求数(次)'
            },
            {
              value: 'cmdstat_getrange_min',
              label: 'getrange请求数(次)'
            },
            {
              value: 'cmdstat_hget_min',
              label: 'hget请求数(次)'
            },
            {
              value: 'cmdstat_hgetall_min',
              label: 'hgetall请求数(次)'
            },
            {
              value: 'cmdstat_hmget_min',
              label: 'hmget请求数(次)'
            },
            {
              value: 'cmdstat_hmset_min',
              label: 'hmset请求数(次)'
            },
            {
              value: 'cmdstat_hset_min',
              label: 'hset请求数(次)'
            },
            {
              value: 'cmdstat_hsetnx_min',
              label: 'hsetnx请求数(次)'
            },
            {
              value: 'cmdstat_lset_min',
              label: 'lset请求数(次)'
            },
            {
              value: 'cmdstat_mget_min',
              label: 'mget请求数(次)'
            },
            {
              value: 'cmdstat_mset_min',
              label: 'mset请求数(次)'
            },
            {
              value: 'cmdstat_msetnx_min',
              label: 'msetnx请求数(次)'
            },
            {
              value: 'cmdstat_set_min',
              label: 'set请求数(次)'
            },
            {
              value: 'cmdstat_setbit_min',
              label: 'setbit请求数(次)'
            },
            {
              value: 'cmdstat_setex_min',
              label: 'setex请求数(次)'
            },
            {
              value: 'cmdstat_setnx_min',
              label: 'setnx请求数(次)'
            },
            {
              value: 'cmdstat_setrange_min',
              label: 'setrange请求数(次)'
            },
            {
              value: 'connections_min',
              label: '连接数量(个)'
            },
            {
              value: 'in_flow_min',
              label: '入流量(Mb)'
            },
            {
              value: 'keys_min',
              label: 'Key总数(个)'
            },
            {
              value: 'out_flow_min',
              label: '出流量(Mb)'
            },
            {
              value: 'stat_get_min',
              label: '读请求数(次)'
            },
            {
              value: 'stat_set_min',
              label: '写请求数(次)'
            },
            {
              value: 'storage_min',
              label: '内存使用量(Mb)'
            },
            {
              value: 'storage_us_min',
              label: '内存使用率(%)'
            }
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
          this.id = "dcline"
          this.Date = data.Response.DirectConnectSet
          this.Namespace = 'qce/dc'
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
              label: '网络出带宽(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '网络入带宽(Mbps)',
              value: 'inbandwidth'
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
          this.id = 'dcchannel'
          this.Date = data.Response.DirectConnectTunnelSet
          this.Namespace = 'qce/dcx'
          this.SearchConfig = [{
            value: "DirectConnectIds",
            label: "通道ID"
          }]
          this.HeadConfig = {
            title1: '名称/ID',
            title2: '私有网络',
          }
          this.MetricName = [{
              label: '网络入带宽(Mbps)',
              value: 'inbandwidth'
            },
            {
              label: '网络出带宽(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '入包量(个/s)',
              value: 'inpkg'
            },

            {
              label: '出包量(个/s)',
              value: 'outpkg'
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
          this.id = 'COS'
          this.Date = data.Buckets
          this.Namespace = 'qce/cos'
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
              value: 'std_read_requests',
              label: '标准存储读请求(次)'
            },
            {
              value: 'std_write_requests',
              label: '标准存储写请求(次)',
            },
            {
              value: 'ia_read_requests',
              label: '低频存储读请求(次)',
            },
            {
              value: 'outbandwidth',
              label: '低频存储写请求(次)',
            },
            {
              value: 'nl_read_request',
              label: '近线存储读请求(次)',
            },
            {
              value: 'nl_write_requests',
              label: '近线存储写请求(次)',
            },
            {
              value: 'inbound_traffic',
              label: '上传流量(B)',
            },
            {
              value: 'internal_traffic',
              label: '内网流量(B)',
            },
            {
              value: 'internet_traffic',
              label: '外网流量(B)',
            },
            {
              value: 'cdn_origin_traffic',
              label: 'CDN回源流量(B)',
            },
            {
              value: '2xx_response',
              label: '2xx状态码(次)',
            },
            {
              value: '3xx_response',
              label: '3xx状态码(次)',
            },

            {
              value: '4xx_response',
              label: '4xx状态码(次)',
            },
            {
              value: '5xx_response',
              label: '5xx状态码(次)',
            },
            {
              value: 'std_retrieval',
              label: '标准数据读取(B)',
            },

            {
              value: 'ia_retrieval',
              label: '低频数据取回(B)',
            }, {
              value: 'nl_retrieval',
              label: '近线数据取回(B)',
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
