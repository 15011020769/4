<template>
  <div class="Monitor">
    <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
      v-on:switchData="GetDat" />
    <div class="box-dis">
      <p>
        <i class="el-icon-info"></i>注釋：Max、Min和Avg數值統計為當前折線圖內所有點的最大值、最小值和平均值
      </p>

    </div>
    <div class="box-table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading='TableLoad'>
        <el-table-column prop width="200">
          <template slot-scope="scope">
            <p>
              <span class='span_1'>{{disName[scope.row.MetricName]}}</span>
              <span class='span_2'>{{Company[scope.row.MetricName]}}</span>
              <el-popover placement="bottom-start" title width="200" trigger="hover">
                <p>{{Tips[scope.row.MetricName]}}</p>
                <i class="el-icon-warning" slot="reference"></i>
              </el-popover>
            </p>
          </template>
        </el-table-column>

        <el-table-column width="550">
          <template slot-scope="scope">
            <p v-if="scope.row.DataPoints[0].Points.length==0">暫無數據</p>
            <div v-if="scope.row.DataPoints[0].Points.length!=0">
              <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Values "
                :opData="scope.row.DataPoints[0].Points" :scale="3" :period="Period" :xdata="false"
                :MetricName='disName[scope.row.MetricName]' :Company='Company[scope.row.MetricName]'></echart-line>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Max:</p>
            <template v-if="scope.row.DataPoints[0].Points.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Points|CMMax}} <span
                  class='span_2'>{{Company[scope.row.MetricName]}}</span></span>

            </template>
            <template v-if="scope.row.DataPoints[0].Points.length==0">-</template>
          </template>
        </el-table-column>
        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Min:</p>
            <template v-if="scope.row.DataPoints[0].Points.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Points|CMMin}} <span
                  class='span_2'>{{Company[scope.row.MetricName]}}</span></span>

            </template>
            <template v-if="scope.row.DataPoints[0].Points.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Avg:</p>
            <template v-if="scope.row.DataPoints[0].Points.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Points|CMAvg}} <span
                  class='span_2'>{{Company[scope.row.MetricName]}}</span></span>
            </template>
            <template v-if="scope.row.DataPoints[0].Points.length==0">-</template>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>
<script>
  import moment from "moment";
  import TimeDropDown from '@/components/public/TimeDropDown' //引入时间组件
  import echartLine from "@/components/public/echars-line"; //引入图标组件
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import {
    ALL_Basics1,
    All_MONITOR
  } from '@/constants'

  export default {
    data() {
      return {
        TimeArr: [{
            name: '實時',
            Time: 'realTime',
            TimeGranularity: [{
                value: "60",
                label: "1分鐘"
              },
              {
                value: "300",
                label: "5分鐘"
              }
            ]
          },
          {
            name: '近24小时',
            Time: 'Nearly_24_hours',
            TimeGranularity: [{
                value: "300",
                label: "5分鐘"
              },
              {
                value: "3600",
                label: "1小時"
              },
              {
                value: "86400",
                label: "1天"
              }
            ]
          },
          {
            name: '近7天',
            Time: 'Nearly_7_days',
            TimeGranularity: [{
                value: "3600",
                label: "1小時"
              },
              {
                value: "86400",
                label: "1天"
              }
            ]
          }
        ],
        ID: this.$route.query.id,
        Appid: this.$route.query.appid,
        BaseList: [], //全部指标列表
        BaseListK: [], //用到的指标列表
        TableLoad: true,
        Period: '', //粒度
        Time: {}, //监控传递时间
        MonitorData: [], //监控数据
        tableData: [], // 组合数据
        available: [{
            MetricName: 'cpu_us_min'
          },
          {
            MetricName: 'cmdstat_get_min'
          },
          {
            MetricName: 'cmdstat_getbit_min'
          },
          {
            MetricName: 'cmdstat_getrange_min'
          },
          {
            MetricName: 'cmdstat_hget_min'
          },
          {
            MetricName: 'cmdstat_hgetall_min'
          },
          {
            MetricName: 'cmdstat_hmget_min'
          },
          {
            MetricName: 'cmdstat_hmset_min'
          },
          {
            MetricName: 'cmdstat_hset_min'
          },
          {
            MetricName: 'cmdstat_hsetnx_min'
          },
          {
            MetricName: 'cmdstat_lset_min'
          },
          {
            MetricName: 'cmdstat_mget_min'
          },
          {
            MetricName: 'cmdstat_mset_min'
          },
          {
            MetricName: 'cmdstat_msetnx_min'
          },
          {
            MetricName: 'cmdstat_set_min'
          },
          {
            MetricName: 'cmdstat_setbit_min'
          },
          {
            MetricName: 'cmdstat_setex_min'
          },
          {
            MetricName: 'cmdstat_setnx_min'
          },
          {
            MetricName: 'cmdstat_setrange_min'
          },
          {
            MetricName: 'connections_min'
          },
          {
            MetricName: 'in_flow_min'
          },
          {
            MetricName: 'keys_min'
          },
          {
            MetricName: 'out_flow_min'
          },
          {
            MetricName: 'stat_get_min'
          },
          {
            MetricName: 'stat_set_min'
          },
          {
            MetricName: 'storage_min'
          },
          {
            MetricName: 'storage_us_min'
          },
          {
            MetricName: 'slow_query_min'
          },
          {
            MetricName: 'in_flow_us_min'
          },
          {
            MetricName: 'out_flow_us_min'
          },
          {
            MetricName: 'connections_us_min'
          },
          {
            MetricName: 'expired_keys_min'
          },
          {
            MetricName: 'evicted_keys_min'
          },
          {
            MetricName: 'latency_min'
          },
          {
            MetricName: 'latency_get_min'
          },
          {
            MetricName: 'latency_set_min'
          },
          {
            MetricName: 'latency_other_min'
          },
          {
            MetricName: 'big_value_min'
          },
          {
            MetricName: 'stat_success_min'
          },
          {
            MetricName: 'stat_missed_min'
          },
          {
            MetricName: 'cmd_err_min'
          },
          {
            MetricName: 'cache_hit_ratio_min'
          },
          {
            MetricName: 'cpu_max_us_min'
          },
        ], //可用指标
        disName: {
          'cpu_us_min': 'CPU使用率',
          'cmdstat_get_min': 'get請求數',
          'cmdstat_getbit_min': 'getbit請求數',
          'cmdstat_getrange_min': 'getrange請求數',
          'cmdstat_hget_min': 'hget請求數',
          'cmdstat_hgetall_min': 'hgetall請求數',
          'cmdstat_hmget_min': 'hmget請求數',
          'cmdstat_hmset_min': 'hmset請求數',
          'cmdstat_hset_min': 'hset請求數',
          'cmdstat_hsetnx_min': 'hsetnx請求數',
          'cmdstat_lset_min': 'lset請求數',
          'cmdstat_mget_min': 'mget請求數',
          'cmdstat_mset_min': 'mset請求數',
          'cmdstat_msetnx_min': 'msetnx請求數',
          'cmdstat_set_min': 'set請求數',
          'cmdstat_setbit_min': 'setbit請求數',
          'cmdstat_setex_min': 'setex請求數',
          'cmdstat_setnx_min': 'setnx請求數',
          'cmdstat_setrange_min': 'setrange請求數',
          'connections_min': '連接數量',
          'in_flow_min': '入流量',
          'keys_min': 'Key總數',
          'out_flow_min': '出流量',
          'stat_get_min': '讀請求數',
          'stat_set_min': '寫請求數',
          'storage_min': '記憶體使用量',
          'storage_us_min': '記憶體使用率',
          'slow_query_min': '慢查詢',
          'in_flow_us_min': '入流量使用率',
          'out_flow_us_min': '出流量使用率',
          'connections_us_min': '連接使用率',
          'expired_keys_min': 'key過期數',
          'evicted_keys_min': 'key驅逐數',
          'latency_min': '平均執行時延',
          'latency_get_min': '讀平均時延',
          'latency_set_min': '寫平均時延',
          'latency_other_min': '其他命令平均時延',
          'big_value_min': '大Value請求',
          'stat_success_min': '讀請求命中',
          'stat_missed_min': '讀請求MISS',
          'cmd_err_min': '執行錯誤',
          'cache_hit_ratio_min': '讀請求命中率',
          'cpu_max_us_min': '分片最大CPU使用率',
          'storage_max_us_min': '分片最大記憶體使用率',
        },
        Company: {
          'cpu_us_min': '%',
          'cmdstat_get_min': '次',
          'cmdstat_getbit_min': '次',
          'cmdstat_getrange_min': '次',
          'cmdstat_hget_min': '次',
          'cmdstat_hgetall_min': '次',
          'cmdstat_hmget_min': '次',
          'cmdstat_hmset_min': '次',
          'cmdstat_hset_min': '次',
          'cmdstat_hsetnx_min': '次',
          'cmdstat_mget_min': '次',
          'cmdstat_mset_min': '次',
          'cmdstat_msetnx_min': '次',
          'cmdstat_set_min': '次',
          'cmdstat_setbit_min': '次',
          'cmdstat_setex_min': '次',
          'cmdstat_setnx_min': '次',
          'cmdstat_setrange_min': '次',
          'connections_min': '次',
          'in_flow_min': 'Mb',
          'keys_min': '個',
          'out_flow_min': 'Mb',
          'stat_get_min': '個',
          'stat_set_min': '次',
          'storage_min': 'MB',
          'storage_us_min': '%',
          'slow_query_min': '個',
          'in_flow_us_min': '%',
          'out_flow_us_min': '%',
          'connections_us_min': '%',
          'expired_keys_min': '個',
          'evicted_keys_min': '個',
          'latency_min': 'ms',
          'latency_get_min': 'ms',
          'latency_set_min': 'ms',
          'latency_other_min': 'ms',
          'big_value_min': '個',
          'stat_success_min': '個',
          'stat_missed_min': '個',
          'cmd_err_min': '個',
          'cache_hit_ratio_min': '%',
          'cpu_max_us_min': '%',
          'storage_max_us_min': '%',
        },

        Tips: {
          'cpu_us_min': 'CPU使用率',
          'cmdstat_get_min': 'get請求數',
          'cmdstat_getbit_min': 'getbit請求數',
          'cmdstat_getrange_min': 'getrange請求數',
          'cmdstat_hget_min': 'hget請求數',
          'cmdstat_hgetall_min': 'hgetall請求數',
          'cmdstat_hmget_min': 'hmget請求數',
          'cmdstat_hmset_min': 'hmset請求數',
          'cmdstat_hset_min': 'hset請求數',
          'cmdstat_hsetnx_min': 'hsetnx請求數',
          'cmdstat_lset_min': 'lset請求數',
          'cmdstat_mget_min': 'mget請求數',
          'cmdstat_mset_min': 'mset請求數',
          'cmdstat_msetnx_min': 'msetnx請求數',
          'cmdstat_set_min': 'set請求數',
          'cmdstat_setbit_min': 'setbit請求數',
          'cmdstat_setex_min': 'setex請求數',
          'cmdstat_setnx_min': 'setnx請求數',
          'cmdstat_setrange_min': 'setrange請求數',
          'connections_min': '連接數量',
          'in_flow_min': '入流量',
          'keys_min': 'Key總數',
          'out_flow_min': '出流量',
          'stat_get_min': '讀請求數',
          'stat_set_min': '寫請求數',
          'storage_min': '記憶體使用量',
          'storage_us_min': '記憶體使用率',
          'slow_query_min': '慢查詢',
          'in_flow_us_min': '入流量使用率',
          'out_flow_us_min': '出流量使用率',
          'connections_us_min': '連接使用率',
          'expired_keys_min': 'key過期數',
          'evicted_keys_min': 'key驅逐數',
          'latency_min': '平均執行時延',
          'latency_get_min': '讀平均時延',
          'latency_set_min': '寫平均時延',
          'latency_other_min': '其他命令平均時延',
          'big_value_min': '大Value請求',
          'stat_success_min': '讀請求命中',
          'stat_missed_min': '讀請求MISS',
          'cmd_err_min': '執行錯誤',
          'cache_hit_ratio_min': '讀請求命中率',
          'cpu_max_us_min': '分片最大CPU使用率',
          'storage_max_us_min': '分片最大記憶體使用率',
        },
      }
    },
    components: {
      TimeDropDown,
      echartLine
    },
    watch: {
      MonitorData(val) {
        if (this.MonitorData) {
          this.MonitorData.forEach(element => {
            this.BaseListK.forEach(item => {
              if (item.MetricName === element.MetricName) {
                item.DataPoints = element.DataPoints
              }
            });
          });
          if (this.BaseListK.length == val.length) {
            this.tableData = this.BaseListK
            this.TableLoad = false
          }
        }
      }
    },
    methods: {
      GetDat(data) {
        this.Period = data[0]
        this.Time = data[1]
        this.TableLoad = true
        this._GetBase()
      },
      //获取基础指标详情
      _GetBase() {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          NameSpace: 'QCE/REDIS',
          Module: 'monitor',
        }
        this.axios.post(ALL_Basics1, parms).then(res => {

          if (res.Response.Error == undefined) {
            this.BaseList = res.Response.Data
            this.MonitorData = []
            this.BaseListK = []
            this.BaseList.forEach(item => {
              this.available.forEach(element => {
                if (item.MetricName === element.MetricName) {
                  element.data = item
                }
              });
            });
            this.available.forEach(i => {

              this.BaseListK.push(i.data)

            });
            for (let
                k = 0; k < this.BaseListK.length; k++) {
              let _this = this;
              (function (o) {
                setTimeout(() => {
                  _this._GetMonitorData(_this.BaseListK[o].MetricName)
                }, o * 1000);
              })(k)
            }
          } else {
            this.$message({
              message: ErrorTips[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      //获取监控数据
      _GetMonitorData(MetricName) {
        let parms = {
          Version: '2017-03-12',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'qce/redis',
          Period: this.Period,
          StartTime: this.Time.StartTIme,
          EndTime: this.Time.EndTIme,
          MetricName: MetricName,
          'Dimensions.0.instanceid': this.ID,
          'Dimensions.0.appid': this.Appid
        }
        this.axios.post(All_MONITOR, parms).then(data => {
          if (data.Response.Error == undefined) {
            data.Response.DataPoints[0].Values = this.GetX(data.Response.StartTime, data.Response.EndTime,
              data.Response.Period)
            this.MonitorData.push(data.Response);
          } else {
            this.$message({
              message: ErrorTips[data.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      GetX(startDate, endDate, space) {
        if (!endDate) {
          endDate = new Date();
        } else {
          endDate = new Date(endDate);
        }
        if (!startDate) {
          startDate = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
        } else {
          startDate = new Date(startDate);
        }
        if (!space) {
          space = 600 * 1000;
        } else {
          space = space * 1000;
        }
        var endTime = endDate.getTime();
        var startTime = startDate.getTime();
        var mod = endTime - startTime;
        var dateArray = [];
        // 加入结束时间
        var a = new Date();
        a.setTime(endTime);
        a = this.nowtime(a);
        dateArray.push(a);
        while (mod - space >= space) {
          var d = new Date();
          d.setTime(endTime - space);
          d = this.nowtime(d);
          dateArray.push(d);
          mod = mod - space;
          endTime = endTime - space;
        }
        // 加入开始时间
        var a = new Date();
        a.setTime(startTime);
        a = this.nowtime(a);
        dateArray.push(a);
        var xAxis = dateArray.reverse()
        return xAxis;
      },
      nowtime(dt) {
        return (
          dt.getFullYear() +
          "-" +
          (dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1) + "-" + (dt.getDate() < 10 ? "0" +
            dt.getDate() : dt.getDate()) + " " + (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + ":" + (
            dt
            .getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes()) + ":" + (dt.getSeconds() < 10 ? "0" +
            dt.getSeconds() : dt.getSeconds()));
      },
    },
    filters: {
      UpTime(value) {
        let timeArr = [];
        for (let i = 0; i < value.length; i++) {
          let uptime = moment(value[i] * 1000).format("YYYY-MM-DD HH:mm:ss");
          timeArr.push(uptime);
        }
        return timeArr;
      }
    }
  }

</script>
<style lang="scss" scoped>
  .Monitor {
    background: #ffffff;
    margin-top: 20px;
    margin-bottom: 50px;
    border: 1px solid #cccccc;
    -webkit-box-shadow: 0px 3px 3px #c8c8c8;
    -moz-box-shadow: 0px 3px 3px #c8c8c8;
    box-shadow: 0px 3px 3px #c8c8c8;
    padding: 20px;

    .box-dis {
      margin-top: 20px;
      color: #ccc;
      font-size: 14px;
    }

    .box-table {
      .span_1 {
        font-size: 14px;
        font-weight: bold;
        color: black;
      }

      .span_2 {
        font-size: 12px;
        color: #BBBBBB;
      }
    }
  }

</style>
