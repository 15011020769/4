<template>
  <div class="Monitor">
    <!-- 时间粒度搜素 -->
    <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
    <div class="box-dis p-style">
      <p>
        <i class="el-icon-info"></i>{{ $t('CVM.clBload.zs') }}
      </p>
      <!-- <p>
        <el-button type="text">{{ $t('CVM.clBload.dcsj') }}</el-button>
      </p> -->
    </div>
    <div class="box-table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" :empty-text="$t('CVM.clBload.zwsj')">
        <el-table-column prop width="150">
          <template slot-scope="scope">
            <span style="font-size:12px;font-weight:bolder; color:#333;font-weight:600;">
              {{scope.row.MetricName | UpName(value)}}
              <span class="symbol">{{scope.row.symbol}}</span>
              <el-popover placement="bottom-start" title width="200" trigger="hover">
                <p>{{scope.row.MetricName | UpTitle(value)}}</p>
                <i class="el-icon-warning" slot="reference"></i>
              </el-popover>
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="DataPoints" width="550">
          <template slot-scope="scope">
            <p v-if="scope.row.DataPoints[0].Values.length==0">{{ $t('CVM.clBload.zwsj') }}</p>
            <div class="echart" v-if="scope.row.DataPoints[0].Values.length!=0">
              <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                :opData="scope.row.DataPoints[0].Values" :scale="3" :period="period" :xdata="false"></echart-line>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Max:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMax}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>
        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Min:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMin}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Avg:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMAvg}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>


        <el-table-column prop>
          <template slot-scope="scope">
            <p>
              <!-- <i class="el-icon-menu i-font" style="font-size:26px;" @click="Modality(scope.row.MetricName)"></i> -->
            </p>
          </template>
        </el-table-column>
      </el-table>
      <!-- 模态框 -->
      <el-dialog :title="$t('CVM.clBload.jqjkzt')" :visible.sync="dialogVisible" width="60%"
        :before-close="handleClose">
        <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
        <echart-line id="diskEchearrts-line" class="echart-wh" :time="timeData | UpTime" :opData="jingData"
          :period="period" :xdata="true"></echart-line>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import XTimeX from "@/components/public/TimeX";
  import echartLine from "@/components/public/echars-line";
  import {
    ErrorTips
  } from '@/components/ErrorTips'
  import {
    All_MONITOR
  } from "@/constants";
  export default {
    data() {
      return {
        ID: this.$route.query.id, //路由传递的id
        period: "",
        Start_End: [],
        value: 1,
        dialogVisible: false, // 模态框 （放大后的折线图）
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页数
        totalPage: 0, // 表格数据数组长度
        tableData: [], // 获取列表数据
        timeData: [], // 折线图的x轴数据
        jingData: [],
        MetricName: ""
      };
    },
    components: {
      echartLine,
      XTimeX
    },
    created() {},
    methods: {
      //获取数据
      GetDat(data) {
        this.period = data[0];
        this.Start_End = data[1];
        this.value = data[2];
        const metricNArr = [
          "CPUUsage",
          "CPULoadAvg",
          "MemUsed",
          "MemUsage",
          "TcpCurrEstab",
          "lanOuttraffic",
          "lanIntraffic",
          "lanOutpkg",
          "lanInpkg",
          "WanOuttraffic",
          "WanIntraffic",
          "AccOuttraffic",
          "WanOutpkg",
          "WanInpkg"
        ];
        const symbol = [
          "%",
          "-",
          "MB",
          "%",
          "個",
          "Mbps",
          "Mbps",
          "個/秒",
          "個/秒",
          "Mbps",
          "Mbps",
          "MB",
          "個/秒",
          "個/秒"
        ];
        this.tableData = [];
        for (let i = 0; i < metricNArr.length; i++) {
          this.Obtain(metricNArr[i], symbol[i]);
        }
        if (this.MetricName) {
          this.getModality(this.MetricName);
        }
      },
      //
      Obtain(metricN, symbol) {
        const param = {
          Version: "2018-07-24",
          Region: localStorage.getItem('regionv2'),
          Namespace: "QCE/CVM",
          MetricName: metricN,
          "Instances.0.Dimensions.0.Name": "InstanceId",
          "Instances.0.Dimensions.0.Value": this.ID,
          Period: this.period,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme
        };
        this.axios.post(All_MONITOR, param).then(data => {
          if (data.Response.Error == undefined) {
            data.Response.symbol = symbol;
            this.tableData.push(data.Response);
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
      getModality(MetricName) {
        const param = {
          Version: "2018-07-24",
          Region: localStorage.getItem('regionv2'),
          Namespace: "QCE/CVM",
          MetricName: MetricName,
          "Instances.0.Dimensions.0.Name": "InstanceId",
          "Instances.0.Dimensions.0.Value": this.ID,
          Period: this.period,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme
        };
        this.axios.post(All_MONITOR, param).then(data => {
          if (data.Response.Error == undefined) {
            this.timeData = data.Response.DataPoints[0].Timestamps;
            this.jingData = data.Response.DataPoints[0].Values;
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


      // 模态框
      Modality(MetricName) {
        this.MetricName = MetricName;
        this.dialogVisible = true;
        this.getModality(this.MetricName);
      },
      handleClose(done) {
        done();
      }
    },
    filters: {
      //文字过滤
      UpName(value) {
        if (value === "lanOuttraffic") {
          return (value = "內網出頻寬");
        }
        if (value === "lanIntraffic") {
          return (value = "內網入頻寬");
        }
        if (value === "lanOutpkg") {
          return (value = "內網出包量");
        }
        if (value === "lanInpkg") {
          return (value = "內網入包量");
        }
        if (value === "WanOuttraffic") {
          return (value = "外網出頻寬");
        }
        if (value === "WanIntraffic") {
          return (value = "外網入頻寬");
        }
        if (value === "AccOuttraffic") {
          return (value = "外網出流量");
        }
        if (value === "WanOutpkg") {
          return (value = "外網出包量");
        }
        if (value === "WanInpkg") {
          return (value = "外網入包量");
        }
        if (value === "CPUUsage") {
          return (value = "CPU利用率");
        }

        if (value === "CPULoadAvg") {
          return (value = "CPU平均負載");
        }
        if (value === "MemUsed") {
          return (value = "内存使用量");
        }
        if (value === "MemUsage") {
          return (value = "内存利用率");
        }
        if (value === "TcpCurrEstab") {
          return (value = "TCP連接數");
        }
        if (value === "") {
          return (value = "");
        }
      },
      UpTitle(value) {
        if (value === "lanOuttraffic") {
          return (value = "內網網卡的平均每秒出流量");
        }
        if (value === "lanIntraffic") {
          return (value = "內網網卡的平均每秒入流量");
        }
        if (value === "lanOutpkg") {
          return (value = "內網網卡的平均每秒出包量");
        }
        if (value === "lanInpkg") {
          return (value = "內網網卡的平均每秒入包量");
        }
        if (value === "WanOuttraffic") {
          return (value =
            "外網平均每秒出流量，最小粒度數據為10秒總流量/10秒 計算得出");
        }
        if (value === "WanIntraffic") {
          return (value = "外網平均每秒入流量");
        }
        if (value === "AccOuttraffic") {
          return (value = "外網網卡的平均每秒出流量");
        }
        if (value === "WanOutpkg") {
          return (value = "外網平均每秒出包量");
        }
        if (value === "WanInpkg") {
          return (value = "外網平均每秒入包量");
        }
        if (value === "CPUUsage") {
          return (value =
            "CPU利用率是通過CVM子機內部監控組件採集上報，數據更加精準");
        }
        if (value === "CPULoadAvg") {
          return (value =
            "1分鐘內CPU平均負載，取 /proc/loadavg 第一列數據（windows操作系統無此指標），依賴監控組件安裝採集");
        }
        if (value === "MemUsed") {
          return (value =
            "使用的記憶體量，不包括系統緩存和緩存區佔用記憶體，依賴監控組件安裝採集");
        }
        if (value === "MemUsage") {
          return (value =
            "用戶實際使用的記憶體量與總記憶體量之比，不包括緩衝區與系統緩存佔用的記憶體");
        }
        if (value === "TcpCurrEstab") {
          return (value =
            "處於 ESTABLISHED 狀態的 TCP 連接數量，依賴監控組件安裝採集");
        }
        if (value === "") {
          return (value = "");
        }
      },
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

<style scoped lang="scss">
  .symbol {
    color: #bbb;
  }

  .Monitor {
    background: #ffffff;
    margin-top: 20px;
    margin-bottom: 50px;
    border: 1px solid #cccccc;
    -webkit-box-shadow: 0px 3px 3px #c8c8c8;
    -moz-box-shadow: 0px 3px 3px #c8c8c8;
    box-shadow: 0px 3px 3px #c8c8c8;
  }

  .box-dis {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;

    .btn-style {
      margin-left: 20px;
      display: flex;
      line-height: 32px;

      .drop {
        margin-left: 30px;

        span {
          color: #cccccc;
          font-size: 10px;
        }

        ::v-deep.el-input {
          width: 100px !important;
          border: none;
        }
      }
    }

    p:nth-child(1) {
      color: #ccc;
      font-size: 14px;
      margin-left: 30px;
    }

    p:nth-child(2) {
      margin-right: 20px;
    }
  }

  .btn-sty {
    display: flex;
    justify-content: space-between;
  }

  .p-dis {
    display: flex;

    span {
      line-height: 40px;
    }

    .width-date {
      width: 150px;
      margin-left: 20px;
    }
  }

  .margin-row {
    margin-top: 30px;
    margin-left: 55%;
  }

  .dateheight {
    height: 34px;
  }

  ::v-deep.echart-wh {
    width: 100% !important;
    height: 500px !important;
  }

  .btn-style {
    margin-left: 20px;
    display: flex;
    line-height: 32px;

    .drop {
      margin-left: 500px;

      span {
        color: #cccccc;
        font-size: 10px;
      }

      ::v-deep.el-input {
        width: 100px !important;
        border: none;
      }
    }
  }

  .box-table {
    width: 100%;
  }

  ::v-deep.i-font {
    font-size: 36px;
  }

  ::v-deep.el-button--small {
    font-size: 14px !important;
  }

</style>
