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
    DISK_LIST, //云硬碟列表
    CM_GROUPING_LIST_TYPE,
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
            label: '雲伺服器',
            viewName: 'cvm_device',
          }, {
            label: '雲硬碟',
            viewName: 'BS',
          },
          {
            label: 'VPN網關',
            viewName: 'VPN_GW',
          }, {
            label: 'VPN通道',
            viewName: 'vpn_tunnel',
          }, {
            label: 'NAT網關',
            viewName: 'nat_tc_stat',
          }, {
            label: '專線網關',
            viewName: 'DC_GW',
          }, {
            label: 'MYSQL',
            viewName: 'cdb_detail',
          }, {
            label: 'Redis',
            viewName: 'REDIS-CLUSTER',
          }, {
            label: '物理專線',
            viewName: 'dcline',
          }, {
            label: '對象存儲',
            viewName: 'COS',
          }
        ],
        Date: [], //各个产品数组
        HeadConfig: {}, //头部设置
        SearchConfig: [], //搜索设置
        Namespace: 'QCE/CVM', //各产品调取监控数据命名空间
        MetricName: [],
        id: '',
        Pass: {},
        Conditions: '',
        productValue1: this.productValue,
        Metrics: null,
      }
    },
    watch: {
      productValue1() {
        this._Metrics()
      },
      projectId() {
        this._Metrics()
      },
      searchParam() {
        this._Metrics()
      }
    },
    created() {
      this._Metrics()
    },
    methods: {
      _Metrics() {
        this.$emit("loading", true);
        let params = {
          Version: "2018-07-24",
          Module: "monitor",
        };
        this.axios.post(CM_GROUPING_LIST_TYPE, params).then(res => {
          this.Conditions = res.Response.Conditions
          this.Conditions.forEach(item => {
            if (item.PolicyViewName === this.productValue1) {
              this.Metrics = item.Metrics
            }
          });
        }).then(() => {
          this._switchType()
        })
      },
      _PassValue() {
        this.Pass.productValue = this.productValue1
        this.Pass.Date = this.Date
        this.Pass.HeadConfig = this.HeadConfig
        this.Pass.SearchConfig = this.SearchConfig
        this.Pass.Namespace = this.Namespace
        this.Pass.MetricName = this.MetricName
        this.Pass.id = this.id
        this.Pass.Metrics = this.Metrics
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
        } else if (this.productValue1 === 'BS') {
          this._GetBs()
        }
      },
      // 獲取雲伺服器列表
      _GetCVM() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        if (this.searchParam.label !== undefined && this.searchParam.value !== undefined) {
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
            title1: 'ID/主機名',
            title2: '網絡類型',
            title3: 'IP地址'
          }
          this.MetricName = [{
              label: 'CPU使用率%',
              value: 'cpu_usage'
            }, {
              label: 'CPU平均負載',
              value: 'cpu_loadavg'
            }, {
              label: '基礎CPU使用率%',
              value: 'base_cpu_usage'
            },
            {
              label: '內存使用量(MB)',
              value: 'mem_used'
            }, {
              label: '內存利用率%',
              value: 'mem_usage'
            },
            {
              label: '內網出帶寬(Mbps)',
              value: 'lan_outtraffic'
            }, {
              label: '內網入帶寬(Mbps)',
              value: 'lan_intraffic'
            },
            {
              label: '內網出包量(個/s)',
              value: 'lan_outpkg'
            },
            {
              label: '內網入包量(個/s)',
              value: 'lan_inpkg'
            }, {
              label: 'TCP連接數(個)',
              value: 'tcp_curr_estab'
            },
            {
              label: '外網出帶寬(Mbps)',
              value: 'wan_outtraffic'
            },
            {
              label: '外網入帶寬(Mbps)',
              value: 'wan_intraffic'
            }, {
              label: '外網出包量(個/s)',
              value: 'wan_outpkg(個/s)'
            },
            {
              label: '外網入包量(個/s)',
              value: 'wan_inpkg'
            },
            {
              label: '外網出流量(MB)',
              value: 'acc_outtraffic'
            }
          ]
          this._PassValue()
        });
      },
      // 獲取NAT網關列表
      _GetNat() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        if (this.searchParam.label !== undefined && this.searchParam.value !== undefined) {
          parms["Filters.0.Name"] = this.searchParam.label;
          parms["Filters.0.Values.0"] = this.searchParam.value;
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
            title1: 'ID/名稱',
            title2: '狀態',
            title3: '私有網絡',
            title4: '類型',
          }
          this.MetricName = [{
              label: '外網出帶寬(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '外網入帶寬(Mbps)',
              value: 'inbandwidth'
            },
            {
              label: '出包量(個/s)',
              value: 'outpkg'
            },
            {
              label: '入包量(個/s)',
              value: 'inpkg'
            },
            {
              label: '連接數(個/s)',
              value: 'conns'
            }
          ]
          this._PassValue()
        });
      },
      // 獲取VPN網關列表
      _GetVPNG() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        if (this.searchParam.label !== undefined && this.searchParam.value !== undefined) {
          parms["Filters.0.Name"] = this.searchParam.label;
          parms["Filters.0.Values.0"] = this.searchParam.value;
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
            title1: 'ID/名稱',
            title2: '狀態',
            title3: '所屬網絡',
          }
          this.MetricName = [{
              label: '外網出帶寬(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '外網入帶寬(Mbps)',
              value: 'inbandwidth'
            },
            {
              label: '出包量(個/s)',
              value: 'outpkg'
            },
            {
              label: '入包量(個/s)',
              value: 'inpkg'
            }
          ]
          this._PassValue()
        });
      },
      // 獲取VPN通道列表
      _GetVPNX() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        if (this.searchParam.label !== undefined && this.searchParam.value !== undefined) {
          parms["Filters.0.Name"] = this.searchParam.label;
          parms["Filters.0.Values.0"] = this.searchParam.value;
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
            title1: 'ID/名稱',
            title2: '所屬網絡',
            title3: 'VPN網關',
          }
          this.MetricName = [{
              label: '網絡出帶寬(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '網絡入帶寬(Mbps)',
              value: 'inbandwidth'
            },
            {
              label: '出包量(個/s)',
              value: 'outpkg'
            },
            {
              label: '入包量(個/s)',
              value: 'inpkg'
            },
            {
              label: '丟包率(%)',
              value: 'pkgdrop'
            }, {
              label: '時延(ms)',
              value: 'delay'
            }

          ]
          this._PassValue()
        });
      },
      // 獲取專線網關列表
      _GetPRI() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        if (this.searchParam.label !== undefined && this.searchParam.value !== undefined) {
          parms["Filters.0.Name"] = this.searchParam.label;
          parms["Filters.0.Values.0"] = this.searchParam.value;
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
            title1: 'ID/名稱',
            title2: 'NAT配置狀態',
            title3: '所屬網絡',
          }
          this.MetricName = [{
              label: '網絡出帶寬(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '網絡入帶寬(Mbps)',
              value: 'inbandwidth'
            },
            {
              label: '出包量(個/s)',
              value: 'outpkg'
            },
            {
              label: '入包量(個/s)',
              value: 'inpkg'
            }

          ]
          this._PassValue()
        });
      },
      // 獲取mysql列表
      _GetMYSQL() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-20",
        }
        if (this.searchParam.label !== undefined && this.searchParam.value !== undefined) {
          parms["InstanceIds.0"] = this.searchParam.value;
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
            title1: 'ID/名稱',
            title2: '內網IP/端口',
            // title3: '網絡類型',
            // title4: '類型',
          }
          this.MetricName = [

            {
              label: '慢查詢數(次/分鍾)',
              value: 'slow_queries'
            },
            {
              label: '連接數利用率(%)',
              value: 'connection_use_rate'
            },
            {
              label: '最大連接數(個)',
              value: 'max_connections'
            },
            {
              label: '全表掃描數(次/秒)',
              value: 'select_scan'
            },
            {
              label: '查詢數(次/秒)',
              value: 'select_count'
            },
            {
              label: '更新數(次/秒)',
              value: 'com_update'
            },
            {
              label: '刪除數(次/秒)',
              value: 'com_delete'
            },
            {
              label: '插入數(次/秒)',
              value: 'com_insert'
            },
            {
              label: '覆蓋數(次/秒)',
              value: 'com_replace'
            },
            {
              label: '總請求數(次/秒)',
              value: 'queries',
            },
            {
              label: '當前打開連接數(個)',
              value: 'threads_connected'
            },
            {
              label: '磁盤使用空間(MB)',
              value: 'real_capacity'
            },
            {
              label: '磁盤占用空間(MB)',
              value: 'capacity'
            },
            {
              label: '內網出流量(Byte/秒)',
              value: 'bytes_sent'
            },
            {
              label: '內網入流量(Byte/秒)',
              value: 'bytes_received'
            },
            {
              label: '緩存使用率(%)',
              value: 'qcache_use_rate',
            },
            {
              label: '緩存命中率(%)',
              value: 'qcache_hit_rate'
            },
            {
              label: '等待表鎖次數(次/秒)',
              value: 'table_locks_waited'
            },
            {
              label: '臨時表數量(次/秒)',
              value: 'created_tmp_tables'
            },
            {
              label: 'innodb緩存使用率(%)',
              value: 'innodb_cache_use_rate'
            },
            {
              label: 'innodb緩存命中率(%)',
              value: 'innodb_cache_hit_rate'
            },
            {
              label: 'innodb讀磁盤數量(次/秒)',
              value: 'innodb_os_file_reads'
            },
            {
              label: 'innodb寫磁盤數量(次/秒)',
              value: 'innodb_os_file_writes'
            },
            {
              label: 'innodb fsync數量(次/秒)',
              value: 'innodb_os_fsyncs'
            },
            {
              label: 'myisam緩存使用率(%)',
              value: 'key_cache_use_rate'
            },
            {
              label: 'myisam緩存命中率(%)',
              value: 'key_cache_hit_rate'
            },
            {
              label: '磁盤利用率(%)',
              value: 'volume_rate'
            },
            {
              label: '查詢使用率(%)',
              value: 'query_rate'
            },
            {
              label: '每秒執行操作數(次/秒)',
              value: 'qps'
            },
            {
              label: '每秒執行事務數(次/秒)',
              value: 'tps'
            },
            {
              label: 'CPU利用率(%)',
              value: 'cpu_use_rate'
            },
            {
              label: '內存利用率(%)',
              value: 'memory_use_rate'
            }
          ]
          this._PassValue()
        });
      },
      // 獲取RESIS列表
      _GetREDIS() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2018-04-12",
        }
        if (this.searchParam.label !== undefined && this.searchParam.value !== undefined) {
          parms["InstanceId"] = this.searchParam.value;
        }
        this.axios.post(REDIS_LIST, parms).then(data => {
          this.redis = 'redis'
          this.Date = data.data.Response.InstanceSet
          this.Namespace = 'qce/redis'
          this.SearchConfig = [{
            value: "InstanceId",
            label: "ID"
          }]
          this.HeadConfig = {
            title1: 'ID/名稱',
            title2: '規格',
            title3: '內網地址',
          }
          this.MetricName = [{
              value: 'cpu_us_min',
              label: 'CPU使用率(%)'
            },
            {
              value: 'cmdstat_get_min',
              label: 'get請求數(次)'
            },
            {
              value: 'cmdstat_getbit_min',
              label: 'getbit請求數(次)'
            },
            {
              value: 'cmdstat_getrange_min',
              label: 'getrange請求數(次)'
            },
            {
              value: 'cmdstat_hget_min',
              label: 'hget請求數(次)'
            },
            {
              value: 'cmdstat_hgetall_min',
              label: 'hgetall請求數(次)'
            },
            {
              value: 'cmdstat_hmget_min',
              label: 'hmget請求數(次)'
            },
            {
              value: 'cmdstat_hmset_min',
              label: 'hmset請求數(次)'
            },
            {
              value: 'cmdstat_hset_min',
              label: 'hset請求數(次)'
            },
            {
              value: 'cmdstat_hsetnx_min',
              label: 'hsetnx請求數(次)'
            },
            {
              value: 'cmdstat_lset_min',
              label: 'lset請求數(次)'
            },
            {
              value: 'cmdstat_mget_min',
              label: 'mget請求數(次)'
            },
            {
              value: 'cmdstat_mset_min',
              label: 'mset請求數(次)'
            },
            {
              value: 'cmdstat_msetnx_min',
              label: 'msetnx請求數(次)'
            },
            {
              value: 'cmdstat_set_min',
              label: 'set請求數(次)'
            },
            {
              value: 'cmdstat_setbit_min',
              label: 'setbit請求數(次)'
            },
            {
              value: 'cmdstat_setex_min',
              label: 'setex請求數(次)'
            },
            {
              value: 'cmdstat_setnx_min',
              label: 'setnx請求數(次)'
            },
            {
              value: 'cmdstat_setrange_min',
              label: 'setrange請求數(次)'
            },
            {
              value: 'connections_min',
              label: '連接數量(個)'
            },
            {
              value: 'in_flow_min',
              label: '入流量(Mb)'
            },
            {
              value: 'keys_min',
              label: 'Key總數(個)'
            },
            {
              value: 'out_flow_min',
              label: '出流量(Mb)'
            },
            {
              value: 'stat_get_min',
              label: '讀請求數(次)'
            },
            {
              value: 'stat_set_min',
              label: '寫請求數(次)'
            },
            {
              value: 'storage_min',
              label: '內存使用量(Mb)'
            },
            {
              value: 'storage_us_min',
              label: '內存使用率(%)'
            }
          ]
          this._PassValue()
        });
      },
      //獲取物理專線列表
      _GetDCLINE() {
        let parms = {
          Region: this.selectedRegion,
          Version: '2018-04-10',
        }
        if (this.searchParam.label !== undefined && this.searchParam.value !== undefined) {
          parms["DirectConnectIds.0"] = this.searchParam.value;
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
            title1: '名稱/ID',
            title2: '所在地',
            title3: '帶寬',
          }
          this.MetricName = [{
              label: '網絡出帶寬(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '網絡入帶寬(Mbps)',
              value: 'inbandwidth'
            }
          ]
          this._PassValue()
        });
      },
      //獲取專線通道列表
      _GetDcPri() {
        let parms = {
          Region: this.selectedRegion,
          Version: '2018-04-10',
        }
        if (this.searchParam.label !== undefined && this.searchParam.value !== undefined) {
          parms["Filters.0.Name"] = this.searchParam.label;
          parms["Filters.0.Values.0"] = this.searchParam.value;
        }
        this.axios.post(Private_LIST, parms).then(data => {
          this.id = 'dcchannel'
          this.Date = data.Response.DirectConnectTunnelSet
          this.Namespace = 'qce/dcx'
          this.SearchConfig = [{
            value: "direct-connect-tunnel-id",
            label: "通道ID"
          }]
          this.HeadConfig = {
            title1: 'ID/名稱',
            title2: '私有網絡',
          }
          this.MetricName = [{
              label: '網絡入帶寬(Mbps)',
              value: 'inbandwidth'
            },
            {
              label: '網絡出帶寬(Mbps)',
              value: 'outbandwidth'
            },
            {
              label: '入包量(個/s)',
              value: 'inpkg'
            },

            {
              label: '出包量(個/s)',
              value: 'outpkg'
            }
          ]
          this._PassValue()
        });
      },
      //獲取對象存儲列表
      _GetOBJ() {
        let parms = {
          Region: this.selectedRegion,
          Version: '2018-04-10',
        }
        // if (this.searchParam.label !== undefined && this.searchParam.value !== undefined) {
        //   parms["Filters.0.Name"] = this.searchParam.label;
        //   parms["Filters.0.Values.0"] = this.searchParam.value;
        // }
        this.axios.post(OBJ_LIST, parms).then(data => {
          this.id = 'COS'
          this.Date = data.Buckets
          this.Namespace = 'qce/cos'
          this.SearchConfig = [{
            value: "bucket",
            label: "儲存桶名稱"
          }]
          this.HeadConfig = {
            title1: 'Bucket名稱',
            title2: '地域',
            title3: '創建時間'
          }
          this.MetricName = [{
              value: 'std_read_requests',
              label: '標准存儲讀請求(次)'
            },
            {
              value: 'std_write_requests',
              label: '標准存儲寫請求(次)',
            },
            {
              value: 'ia_read_requests',
              label: '低頻存儲讀請求(次)',
            },
            {
              value: 'outbandwidth',
              label: '低頻存儲寫請求(次)',
            },
            {
              value: 'nl_read_request',
              label: '近線存儲讀請求(次)',
            },
            {
              value: 'nl_write_requests',
              label: '近線存儲寫請求(次)',
            },
            {
              value: 'inbound_traffic',
              label: '上傳流量(B)',
            },
            {
              value: 'internal_traffic',
              label: '內網流量(B)',
            },
            {
              value: 'internet_traffic',
              label: '外網流量(B)',
            },
            {
              value: 'cdn_origin_traffic',
              label: 'CDN回源流量(B)',
            },
            {
              value: '2xx_response',
              label: '2xx狀態碼(次)',
            },
            {
              value: '3xx_response',
              label: '3xx狀態碼(次)',
            },

            {
              value: '4xx_response',
              label: '4xx狀態碼(次)',
            },
            {
              value: '5xx_response',
              label: '5xx狀態碼(次)',
            },
            {
              value: 'std_retrieval',
              label: '標准數據讀取(B)',
            },

            {
              value: 'ia_retrieval',
              label: '低頻數據取回(B)',
            }, {
              value: 'nl_retrieval',
              label: '近線數據取回(B)',
            }
          ]
          this._PassValue()
        });
      },
      //獲取雲硬碟
      _GetBs() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        if (this.searchParam.label !== undefined && this.searchParam.value !== undefined) {
          parms["Filters.0.Name"] = this.searchParam.label;
          parms["Filters.0.Values.0"] = this.searchParam.value;
          parms["Filters.1.Name"] = 'project-id';
          parms["Filters.1.Values.0"] = this.projectId;
        } else {
          parms["Filters.0.Name"] = 'project-id';
          parms["Filters.0.Values.0"] = this.projectId;
        }
        this.axios.post(DISK_LIST, parms).then(data => {
          this.id = 'bs'
          this.Date = data.Response.DiskSet
          this.Namespace = 'qce/block_storage'
          this.SearchConfig = [{
              value: "disk-id",
              label: "雲硬碟ID"
            },
            {
              value: "disk-name",
              label: "雲盤名稱"
            }
          ]
          this.HeadConfig = {
            title1: 'ID/名稱',
            title2: '大小(GB)',
            title3: '硬碟類型',
          }
          this.MetricName = [{
              label: '硬碟讀流量(KB/s)',
              value: 'disk_read_traffic'
            },
            {
              label: '硬碟寫流量',
              value: 'disk_write_traffic'
            },
            {
              label: '硬碟讀IOPS',
              value: 'disk_read_iops'
            },
            {
              label: '硬碟寫IOPS',
              value: 'disk_write_iops'
            },
            {
              label: '硬碟IO Await',
              value: 'disk_await'
            },
            {
              label: '硬碟IO Svctm',
              value: 'disk_svctm'
            },
            {
              label: '硬碟IO %util',
              value: 'disk_util'
            }
          ]
          this._PassValue()
        });
      }
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
