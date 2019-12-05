<template>
  <div class="Monitor">
    <!-- 时间粒度搜素 -->
    <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
    <div class="box-dis p-style">
      <p>
        <i class="el-icon-info"></i>注释：Max、Min和Avg数值统计为当前折线图内所有点的最大值、最小值和平均值
      </p>
      <p>
        <el-button type="text">导出数据</el-button>
      </p>
    </div>
    <div class="box-table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
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
            <p v-if="scope.row.DataPoints[0].Values.length==0">暂无数据</p>
            <div class="echart" v-if="scope.row.DataPoints[0].Values.length!=0">
              <echart-line
                id="diskEchearrts-line"
                :time="scope.row.DataPoints[0].Timestamps | UpTime"
                :opData="scope.row.DataPoints[0].Values"
                :scale="3"
                :period="period"
                :xdata="false"
              ></echart-line>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Max:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span
                style="color:#333;font-weight:600;font-size: 12px;"
              >{{scope.row.DataPoints[0].Values|CMMax}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>
        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Min:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span
                style="color:#333;font-weight:600;font-size: 12px;"
              >{{scope.row.DataPoints[0].Values|CMMin}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Avg:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span
                style="color:#333;font-weight:600;font-size: 12px;"
              >{{scope.row.DataPoints[0].Values|CMAvg}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p>
              <i
                class="el-icon-menu i-font"
                style="font-size:26px;"
                @click="Modality(scope.row.MetricName)"
              ></i>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <!-- 模态框 -->
      <el-dialog
        title="集群健康状态"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
      >
        <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
        <echart-line
          id="diskEchearrts-line"
          class="echart-wh"
          :time="timeData | UpTime"
          :opData="jingData"
          :period="period"
          :xdata="true"
        ></echart-line>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import XTimeX from "@/components/public/TimeXK";
import echartLine from "@/components/public/echars-line";
import { All_MONITOR, ALL_Basics } from "@/constants";
export default {
  data() {
    return {
      ID: this.$route.query.functionName, //路由传递的id
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
        "Duration",
        "Invocation",
        "Error",
        "ConcurrentExecutions", //111
        "ConfigMem",
        "FunctionErrorPercentage", //111
        "Http2xx", //111
        "Http432", //11
        "Http433", //11
        "Http434", //11
        "Http4xx", //11
        "Mem", //11
        "MemDuration",
        "OutFlow",
        "ServerErrorPercentage", //11
        "Syserr", //11
        "Throttle"
      ];
      const symbol = [
        "毫秒(ms)",
        "次",
        "次",
        "次",
        "MB",
        "次",
        "次",
        "次",
        "次",
        "次",
        "次",
        "MB",
        "MB/ms",
        "次",
        "%",
        "次",
        "次"
      ];
      this.tableData = [];
      for (let i = 0; i < metricNArr.length; i++) {
        this.Obtain(metricNArr[i], symbol[i]);
        // this.tableData[i].symbol = symbol
      }
      if (this.MetricName) {
        this.getModality(this.MetricName);
      }
    },
    //
    Obtain(metricN, symbol) {
      const param = {
        Version: "2018-07-24",
        Region: this.$cookie.get("regionv2"),
        Namespace: "QCE/SCF_V2",
        MetricName: metricN,
        "Instances.0.Dimensions.0.Name": "functionName",
        "Instances.0.Dimensions.0.Value": this.ID,
        "Instances.0.Dimensions.1.Name": "version",
        "Instances.0.Dimensions.1.Value": this.ID,
        Period: this.period,
        StartTime: this.Start_End.StartTIme,
        EndTime: this.Start_End.EndTIme
      };
      this.axios.post(All_MONITOR, param).then(data => {
        console.log(param);
        console.log(data);
        data.Response.symbol = symbol;
        this.tableData.push(data.Response);
      });
    },
    getModality(MetricName) {
      const param = {
        Version: "2018-07-24",
        Region: this.$cookie.get("regionv2"),
        Namespace: "QCE/SCF_V2",
        MetricName: MetricName,
        "Instances.0.Dimensions.0.Name": "functionName",
        "Instances.0.Dimensions.0.Value": this.ID,
        Period: this.period,
        StartTime: this.Start_End.StartTIme,
        EndTime: this.Start_End.EndTIme
      };
      this.axios.post(All_MONITOR, param).then(data => {
        this.timeData = data.Response.DataPoints[0].Timestamps;
        this.jingData = data.Response.DataPoints[0].Values;
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
      if (value === "Duration") {
        return (value = "运行时间");
      }
      if (value === "Invocation") {
        return (value = "调用次数");
      }
      if (value === "Error") {
        return (value = "调用错误次数");
      }
      if (value === "ConcurrentExecutions") {
        return (value = "并发执行次数");
      }
      if (value === "ConfigMem") {
        return (value = "配置内存");
      }
      if (value === "FunctionErrorPercentage") {
        return (value = "函数错误率");
      }
      if (value === "Http2xx") {
        return (value = "正确调用次数");
      }
      if (value === "Http432") {
        return (value = "资源超过限制");
      }
      if (value === "Http433") {
        return (value = "函数执行超时");
      }
      if (value === "Http434") {
        return (value = "内存超过限制");
      }

      if (value === "Http4xx") {
        return (value = "函数错误次数");
      }
      if (value === "Invocation") {
        return (value = "函数调用次数");
      }
      if (value === "Mem") {
        return (value = "运行内存");
      }
      if (value === "MemDuration") {
        return (value = "时间内存");
      }
      if (value === "OutFlow") {
        return (value = "外网出流量");
      }
      if (value === "ServerErrorPercentage") {
        return (value = "平台错误率");
      }
      if (value === "Syserr") {
        return (value = "系统内部错误次数");
      }
      if (value === "Throttle") {
        return (value = "函数运行受限次数");
      }
      if (value === "") {
        return (value = "");
      }
    },
    UpTitle(value) {
      if (value === "Duration") {
        return (value = "函数运行时间，按粒度（1分钟、5分钟）统计求平均值");
      }
      if (value === "Invocation") {
        return (value = "函数调用次数，按粒度（1分钟、5分钟）统计求和");
      }
      if (value === "Error") {
        return (value = "调用错误次数");
      }
      if (value === "ConcurrentExecutions") {
        return (value = "并发执行次数");
      }
      if (value === "ConfigMem") {
        return (value = "配置内存");
      }
      if (value === "FunctionErrorPercentage") {
        return (value = "函数错误率");
      }
      if (value === "Http2xx") {
        return (value = "正确调用次数");
      }
      if (value === "Http432") {
        return (value = "资源超过限制");
      }
      if (value === "Http433") {
        return (value = "函数执行超时");
      }
      if (value === "Http434") {
        return (value = "内存超过限制");
      }

      if (value === "Http4xx") {
        return (value = "函数运行错误次数，按粒度（1分钟、5分钟）统计求和");
      }
      if (value === "Invocation") {
        return (value = "函数调用次数");
      }
      if (value === "Mem") {
        return (value = "运行内存");
      }
      if (value === "MemDuration") {
        return (value = "时间内存");
      }
      if (value === "OutFlow") {
        return (value = "外网出流量");
      }
      if (value === "ServerErrorPercentage") {
        return (value = "平台错误率");
      }
      if (value === "Syserr") {
        return (value = "系统内部错误次数");
      }
      if (value === "Throttle") {
        return (value = "函数运行受限次数");
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
