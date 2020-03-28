<template>
  <div class="Monitor">
    <TimeDropDown
      :TimeArr="TimeArr"
      :Datecontrol="true"
      :Graincontrol="true"
      :Difference="'H'"
      v-on:switchData="GetDat"
    />
    <div class="box-dis">
      <p>
        <i class="el-icon-info"></i>注釋：Max、Min和Avg數值統計為當前折線圖內所有點的最大值、最小值和平均值
      </p>
    </div>
    <div class="box-table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading="TableLoad">
        <el-table-column prop width="200">
          <template slot-scope="scope">
            <p>
              <span class="span_1">{{disName[scope.row.MetricName]}}</span>
              <span class="span_2">{{Company[scope.row.MetricName]}}</span>
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
              <echart-line
                id="diskEchearrts-line"
                :time="scope.row.DataPoints[0].timestamps | UpTime"
                :opData="scope.row.DataPoints[0].Points"
                :scale="3"
                :period="Period"
                :xdata="false"
                :MetricName="disName[scope.row.MetricName]"
                :Company="Company[scope.row.MetricName]"
              ></echart-line>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Max:</p>
            <template v-if="scope.row.DataPoints[0].Points.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">
                {{scope.row.DataPoints[0].Points|CMMax}}
                <span
                  class="span_2"
                >{{Company[scope.row.MetricName]}}</span>
              </span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Points.length==0">-</template>
          </template>
        </el-table-column>
        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Min:</p>
            <template v-if="scope.row.DataPoints[0].Points.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">
                {{scope.row.DataPoints[0].Points|CMMin}}
                <span
                  class="span_2"
                >{{Company[scope.row.MetricName]}}</span>
              </span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Points.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Avg:</p>
            <template v-if="scope.row.DataPoints[0].Points.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">
                {{scope.row.DataPoints[0].Points|CMAvg}}
                <span
                  class="span_2"
                >{{Company[scope.row.MetricName]}}</span>
              </span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Points.length==0">-</template>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tableData1" style="width: 100%" v-loading="TableLoad">
        <el-table-column prop width="200">
          <template slot-scope="scope">
            <p>
              <span class="span_1">{{disName[scope.row.MetricName]}}</span>
              <span class="span_2">{{Company[scope.row.MetricName]}}</span>
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
              <echart-line
                id="diskEchearrts-line"
                :time="scope.row.DataPoints[0].timestamps | UpTime"
                :opData="scope.row.DataPoints[0].Points"
                :scale="3"
                :period="Period"
                :xdata="false"
                :MetricName="disName[scope.row.MetricName]"
                :Company="Company[scope.row.MetricName]"
              ></echart-line>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Max:</p>
            <template v-if="scope.row.DataPoints[0].Points.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">
                {{scope.row.DataPoints[0].Points|CMMax}}
                <span
                  class="span_2"
                >{{Company[scope.row.MetricName]}}</span>
              </span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Points.length==0">-</template>
          </template>
        </el-table-column>
        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Min:</p>
            <template v-if="scope.row.DataPoints[0].Points.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">
                {{scope.row.DataPoints[0].Points|CMMin}}
                <span
                  class="span_2"
                >{{Company[scope.row.MetricName]}}</span>
              </span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Points.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Avg:</p>
            <template v-if="scope.row.DataPoints[0].Points.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">
                {{scope.row.DataPoints[0].Points|CMAvg}}
                <span
                  class="span_2"
                >{{Company[scope.row.MetricName]}}</span>
              </span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
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
import TimeDropDown from "@/components/public/TimeDropDown"; //引入时间组件
import echartLine from "@/components/public/echars-line"; //引入图标组件
import { ErrorTips } from "@/components/ErrorTips";
import { ALL_Basics1, ALL_Basics, All_MONITOR } from "@/constants";
export default {
  data() {
    return {
      TimeArr: [
        {
          name: "实时",
          Time: "realTime",
          TimeGranularity: [
            {
              value: "10",
              label: "10秒"
            },
            {
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
          name: "近24小时",
          Time: "Nearly_24_hours",
          TimeGranularity: [
            {
              value: "60",
              label: "1分鐘"
            },
            {
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
          name: "近7天",
          Time: "Nearly_7_days",
          TimeGranularity: [
            {
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
      BaseList: [], //全部指标列表
      BaseListK: [], //用到的指标列表
      TableLoad: true,
      Period: "", //粒度
      Time: {}, //监控传递时间
      MonitorData: [], //监控数据
      MonitorData1: [], //监控数据
      tableData: [], // 组合数据
      tableData1: [],
      available: [
        {
          MetricName: "cpu_usage"
        },
        {
          MetricName: "cpu_loadavg"
        },
        {
          MetricName: "base_cpu_usage"
        },
        {
          MetricName: "mem_used"
        },
        {
          MetricName: "mem_usage"
        },
        {
          MetricName: "lan_outtraffic"
        },
        {
          MetricName: "lan_intraffic"
        },
        {
          MetricName: "lan_outpkg"
        },
        {
          MetricName: "lan_inpkg"
        },
        {
          MetricName: "tcp_curr_estab"
        },
        {
          MetricName: "wan_outtraffic"
        },
        {
          MetricName: "wan_intraffic"
        },
        {
          MetricName: "wan_outpkg"
        },
        {
          MetricName: "wan_inpkg"
        },
        {
          MetricName: "acc_outtraffic"
        }
      ], //可用指标
      available1: [
        {
          MetricName: "disk_read_traffic"
        },
        {
          MetricName: "disk_write_traffic"
        },
        {
          MetricName: "disk_read_iops"
        },
        {
          MetricName: "disk_write_iops"
        },
        {
          MetricName: "disk_await"
        },
        {
          MetricName: "disk_svctm"
        },
        {
          MetricName: "disk_util"
        }
      ],
      disName: {
        lan_outtraffic: "內網出頻寬",
        lan_intraffic: "內網入頻寬",
        lan_outpkg: "內網出包量",
        lan_inpkg: "内網入包量 ",
        wan_outtraffic: "外網出頻寬",
        wan_intraffic: "外網入頻寬 ",
        acc_outtraffic: "外網出流量",
        wan_outpkg: "外網出包量",
        wan_inpkg: "外網入包量",
        cpu_usage: "CPU利用率",
        cpu_loadavg: "CPU平均負載",
        mem_used: "記憶體使用量",
        mem_usage: "記憶體利用率",
        tcp_curr_estab: "TCP連接數",
        base_cpu_usage: "基礎CPU使用率",
        disk_await: "IO Await",
        disk_read_iops: "讀IOPS",
        disk_read_traffic: "讀流量",
        disk_svctm: "IO Svctm",
        disk_util: "IO %util",
        disk_write_iops: "寫IOPS",
        disk_write_traffic: "寫流量"
      },
      Company: {
        lan_outtraffic: "Mbps",
        lan_intraffic: "Mbps",
        lan_outpkg: "個/s",
        lan_inpkg: "個/s ",
        wan_outtraffic: "Mbps",
        wan_intraffic: "Mbps ",
        acc_outtraffic: "Mbps",
        wan_outpkg: "個/s",
        wan_inpkg: "個/s",
        cpu_usage: "%",
        cpu_loadavg: "",
        mem_used: "MB",
        mem_usage: "%",
        tcp_curr_estab: "個",
        base_cpu_usage: "%",
        disk_io_await: "ms",
        disk_await: "ms",
        disk_read_iops: "個",
        disk_read_traffic: "KB/s",
        disk_svctm: "ms",
        disk_util: "%",
        disk_write_iops: "個",
        disk_write_traffic: "KB/s"
      },
      Tips: {
        acc_outtraffic: "外網網路介面的平均每秒出流量",
        base_cpu_usage:
          " 基礎CPU使用率通過宿主機採集上報，無須安裝監控元件即可檢視數據，子機高負載情況下仍可持續採集上報數據",
        cpu_loadavg:
          "1分钟内CPU平均负载，取 /proc/loadavg 第一列數據（windows作業系統無此指標），依賴監控元件安裝採集",
        cpu_usage: "CPU利用率是通過CVM子機內部監控元件採集上報，數據更加精準",
        disk_io_await: " 磁碟分區I/O平均每次操作的等待時間",
        disk_svctm: "磁碟分區平均每次I/O操作所花的時間",
        disk_util: "磁碟分區有IO操作的時間與總時間的百分比",
        disk_write_traffic_new: "平均每秒從記憶體寫到磁碟的數據量",
        lan_inpkg: "內網網路介面的平均每秒入包量",
        lan_intraffic: "內網網路介面的平均每秒入流量",
        lan_outpkg: "內網網路介面的平均每秒出包量",
        lan_outtraffic: "內網網路介面的平均每秒出流量",
        mem_usage:
          "用戶實際使用的記憶體量與總記憶體量之比，不包括緩衝區與系統快取佔用的記憶體",
        mem_used:
          " 使用的記憶體量，不包括系統快取和快取區佔用記憶體，依賴監控元件安裝採集",
        tcp_curr_estab:
          "處於 ESTABLISHED 狀態的 TCP 連接數量，依賴監控元件安裝採集",
        wan_inpkg: "外網平均每秒入包量",
        wan_intraffic: "外網平均每秒入流量",
        wan_outpkg: "外網平均每秒出包量",
        wan_outtraffic:
          "外網平均每秒出流量，最小粒度數據為10秒總流量/10秒 計算得出",
        disk_await: "硬碟I / O平均每次操作的等待時間",
        disk_read_iops: "硬碟平均每秒讀次數",
        disk_read_traffic: "平均每秒從硬碟讀到記憶體的數據量",
        disk_write_iops: "硬碟平均每秒寫次數",
        disk_write_traffic: "平均每秒從記憶體寫到硬碟的數據量"
      }
    };
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
              item.DataPoints = element.DataPoints;
            }
          });
        });
        if (this.BaseListK.length == val.length) {
          this.tableData = this.BaseListK;
          this.TableLoad = false;
        }
      }
    },
    MonitorData1(val) {
      if (this.MonitorData1) {
        this.MonitorData1.forEach(element => {
          this.BaseListKd.forEach(item => {
            if (item.MetricName === element.MetricName) {
              item.DataPoints = element.DataPoints;
            }
          });
        });
        if (this.BaseListKd.length == val.length) {
          this.tableData1 = this.BaseListKd;
          console.log(this.tableData1);
          }
      }
    }
  },
  methods: {
    GetDat(data) {
      this.Period = data[0];
      this.Time = data[1];
      this.TableLoad = true;
      this._GetBase();
      this._GetBase1();
    },
    //获取基础指标详情
    _GetBase() {
      let parms = {
        Version: "2018-07-24",
        Region: localStorage.getItem("regionv2"),
        NameSpace: "qce/cvm",
        Module: "monitor"
      };
      this.axios.post(ALL_Basics1, parms).then(res => {
        if (res.Response.Error == undefined) {
          this.BaseList = res.Response.Data;
          this.MonitorData = [];
          this.BaseListK = [];
          this.BaseList.forEach(item => {
            this.available.forEach(element => {
              if (item.MetricName === element.MetricName) {
                element.data = item;
              }
            });
          });
          this.available.forEach((i, index, dat) => {
            dat[index].data.PeriodAndStatTypes.forEach((items, indexs, m) => {
              if (items.Period === Number(this.Period)) {
                this.BaseListK.push(i.data);
              }
            });
          });
          for (let k = 0; k < this.BaseListK.length; k++) {
            let _this = this;
            (function(o) {
              setTimeout(() => {
                _this._GetMonitorData(_this.BaseListK[o].MetricName);
              }, o * 50);
            })(k);
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
        Version: "2017-03-12",
        Region: localStorage.getItem("regionv2"),
        Namespace: "qce/cvm",
        Period: this.Period,
        StartTime: this.Time.StartTIme,
        EndTime: this.Time.EndTIme,
        MetricName: MetricName,
        "Dimensions.0.unInstanceId": this.ID
      };
      this.axios.post(All_MONITOR, parms).then(data => {
        if (data.Response.Error == undefined) {
          // 时间粒度
          data.Response.DataPoints[0]['timestamps']= []
          let StartTIme = new Date(data.Response.StartTime);
          let EndTIme = new Date(data.Response.EndTime);
          let StartTime = StartTIme.getTime() / 1000;
          let EndTime = EndTIme.getTime() / 1000;
          let timestamps = StartTime;
          for(var i=0; i< data.Response.DataPoints[0].Points.length; i++) {
              data.Response.DataPoints[0]['timestamps'].push(timestamps);
              timestamps = timestamps  + (this.Period- 0)
          }

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
    //获取基础指标详情
    _GetBase1() {
      let parms = {
        Version: "2018-07-24",
        Region: localStorage.getItem("regionv2"),
        NameSpace: "qce/block_storage",
        Module: "monitor"
      };
      this.axios.post(ALL_Basics1, parms).then(res => {
        if (res.Response.Error == undefined) {
          let BaseList = res.Response.Data;
          this.MonitorData1 = [];
          this.BaseListKd = [];
          BaseList.forEach(item => {
            this.available1.forEach(element => {
              if (item.MetricName === element.MetricName) {
                element.data = item;
              }
            });
          });

          this.available1.forEach((i, index, dat) => {
            dat[index].data.PeriodAndStatTypes.forEach((items, indexs, m) => {
              if (items.Period === Number(this.Period)) {
                this.BaseListKd.push(i.data);
              }
            });
          });
          for (let k = 0; k < this.BaseListKd.length; k++) {
            let _this = this;
            (function(o) {
              setTimeout(() => {
                _this._GetMonitorData1(_this.BaseListKd[o].MetricName);
              }, o * 50);
            })(k);
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
    _GetMonitorData1(MetricName) {
      let parms = {
        Version: "2017-03-12",
        Region: localStorage.getItem("regionv2"),
        Namespace: "qce/block_storage",
        Period: this.Period,
        StartTime: this.Time.StartTIme,
        EndTime: this.Time.EndTIme,
        MetricName: MetricName,
        "Dimensions.0.diskId": this.$route.query.DiskId
      };
      this.axios.post(All_MONITOR, parms).then(data => {
        if (data.Response.Error == undefined) {
          // 时间粒度
          data.Response.DataPoints[0]['timestamps']= []
          let StartTIme = new Date(data.Response.StartTime);
          let EndTIme = new Date(data.Response.EndTime);
          let StartTime = StartTIme.getTime() / 1000;
          let EndTime = EndTIme.getTime() / 1000;
          let timestamps = StartTime;
          for(var i=0; i< data.Response.DataPoints[0].Points.length; i++) {
              data.Response.DataPoints[0]['timestamps'].push(timestamps);
              timestamps = timestamps  + (this.Period- 0)
          }
          this.MonitorData1.push(data.Response);
          console.log(this.MonitorData1)
        } else {
          this.$message({
            message: ErrorTips[data.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    }
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
};
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
      color: #bbbbbb;
    }
  }
}
</style>
