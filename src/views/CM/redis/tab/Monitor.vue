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
              <span  style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMax}}</span>
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
import { All_MONITOR } from "@/constants";
export default {
  data() {
    return {
      ID: this.$route.query.id,
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
    GetDat(data) {
      this.period = data[0];
      this.Start_End = data[1];
      this.value = data[2];
      const metricNArr = [
        "CacheHitRatio",
        "CmdstatGet",
        "CmdstatGetbit",
        "CmdstatGetrange",
        "CmdstatHget",
        "CmdstatHgetall",
        "CmdstatHmget",
        "CmdstatHmset",
        "CmdstatHset",
        "CmdstatHsetnx",
        "CmdstatLset",
        "CmdstatMget",
        "CmdstatMset",
        "CmdstatMsetnx",
        "CmdstatSet",
        "CmdstatSetbit",
        "CmdstatSetex",
        "CmdstatSetrange",
        "Qps",
        "Connections",
        "CpuUs",
        "InFlow",
        "Keys",
        "OutFlow",
        "StatGet",
        "StatSet",
        "Storage",
        "StorageUs"
      ];
      const symbol = [
        "%",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/分钟",
        "次/秒钟",
        "个",
        "%",
        "Mb/分钟",
        "个",
        "Mb/分钟",
        "次/分钟",
        "次/分钟",
        "MB/分钟",
        "%"
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
      // if (this.period == 10) {
      //   this.period = 60;
      // }
      const param = {
        Version: "2018-07-24",
        Region: this.$cookie.get("regionv2"),
        Namespace: "QCE/REDIS",
        MetricName: metricN,
        "Instances.0.Dimensions.0.Name": "redis_uuid",
        "Instances.0.Dimensions.0.Value": this.ID,
        Period: this.period,
        StartTime: this.Start_End.StartTIme,
        EndTime: this.Start_End.EndTIme
      };
      this.axios.post(All_MONITOR, param).then(data => {
        data.Response.symbol = symbol;
        this.tableData.push(data.Response);
      });
    },
    getModality(MetricName) {
      // if (this.period == 10) {
      //   this.period = 60;
      // }
      const param = {
        Version: "2018-07-24",
        Region: this.$cookie.get("regionv2"),
        Namespace: "QCE/REDIS",
        MetricName: MetricName,
        "Instances.0.Dimensions.0.Name": "redis_uuid",
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
    UpName(value) {
      if (value === "CacheHitRatio") {
        return (value = "cache命中率");
      }
      if (value === "CmdstatGet") {
        return (value = "get命令数");
      }
      if (value === "CmdstatGetbit") {
        return (value = "getbit命令数");
      }
      if (value === "CmdstatGetrange") {
        return (value = "getrange命令数");
      }
      if (value === "CmdstatHget") {
        return (value = "hget命令数");
      }
      if (value === "CmdstatHgetall") {
        return (value = "hgetall命令数");
      }
      if (value === "CmdstatHmget") {
        return (value = "hmget命令数");
      }
      if (value === "CmdstatHmset") {
        return (value = "hmset命令数");
      }
      if (value === "CmdstatHset") {
        return (value = "hset命令数");
      }
      if (value === "CmdstatHsetnx") {
        return (value = "hsetnx命令数");
      }
      if (value === "CmdstatLset") {
        return (value = "lset命令数");
      }

      if (value === "CmdstatMget") {
        return (value = "mget命令数");
      }
      if (value === "CmdstatMset") {
        return (value = "mset命令数");
      }
      if (value === "CmdstatMsetnx") {
        return (value = "msetnx命令数");
      }
      if (value === "CmdstatSet") {
        return (value = "set命令数");
      }
      if (value === "CmdstatSetbit") {
        return (value = "setbit命令数");
      }
      if (value === "CmdstatSetex") {
        return (value = "setex命令数");
      }
      if (value === "CmdstatSetrange") {
        return (value = "setrange命令数");
      }
      if (value === "Qps") {
        return (value = "每秒执行命令数");
      }
      if (value === "Connections") {
        return (value = "连接数");
      }
      if (value === "CpuUs") {
        return (value = "cpu利用率");
      }
      if (value === "InFlow") {
        return (value = "内网入流量");
      }
      if (value === "Keys") {
        return (value = "key总数");
      }
      if (value === "OutFlow") {
        return (value = "内网出流量");
      }
      if (value === "StatGet") {
        return (value = "所有get命令数");
      }
      if (value === "StatSet") {
        return (value = "所有set命令数");
      }
      if (value === "Storage") {
        return (value = "已使用容量");
      }
      if (value === "StorageUs") {
        return (value = "容量使用率");
      }
      if (value === "") {
        return (value = "");
      }
    },
    UpTitle(value) {
      if (value === "CacheHitRatio") {
        return (value =
          "1分钟取内取 keyspace_misses、keyspace_hits通过如下计算 （1- keyspace_misses/keyspace_hits）* 100% 得出。不再维护该指标");
      }
      if (value === "CmdstatGet") {
        return (value = "1分钟内 get 命令请求数");
      }
      if (value === "CmdstatGetbit") {
        return (value = "	1分钟内 getbit 命令请求数");
      }
      if (value === "CmdstatGetrange") {
        return (value = "1分钟内 getrange 命令请求数");
      }
      if (value === "CmdstatHget") {
        return (value = "1分钟内 hget 命令请求数");
      }
      if (value === "CmdstatHgetall") {
        return (value = "1分钟内 hgetall 命令请求数");
      }
      if (value === "CmdstatHmget") {
        return (value = "	1分钟内 hmget 命令请求数");
      }
      if (value === "CmdstatHmset") {
        return (value = "	1分钟内 hmset 命令请求数");
      }
      if (value === "CmdstatHset") {
        return (value = "1分钟内 hset 命令请求数");
      }
      if (value === "CmdstatHsetnx") {
        return (value = "	1分钟内 hsetnx 命令请求数");
      }
      if (value === "CmdstatLset") {
        return (value = "	1分钟内 lset 命令请求数");
      }

      if (value === "CmdstatMget") {
        return (value = "	1分钟内 mget 命令请求数");
      }
      if (value === "CmdstatMset") {
        return (value = "	1分钟内 mset 命令请求数");
      }
      if (value === "CmdstatMsetnx") {
        return (value = "1分钟内 msetnx 命令请求数");
      }
      if (value === "CmdstatSet") {
        return (value = "	1分钟内 set 命令请求数");
      }
      if (value === "CmdstatSetbit") {
        return (value = "1分钟内 setbit 命令请求数");
      }
      if (value === "CmdstatSetex") {
        return (value = "	1分钟内 setex 命令请求数");
      }
      if (value === "CmdstatSetrange") {
        return (value = "1分钟内 setrange 命令请求数");
      }
      if (value === "Qps") {
        return (value = "1分钟内命令总数除以60");
      }
      if (value === "Connections") {
        return (value = "	1分钟内连接数总和");
      }
      if (value === "CpuUs") {
        return (value = "CPU处于非空闲状态的百分比，取 /proc/stat数据计算得出");
      }
      if (value === "InFlow") {
        return (value = "1分钟内入流量总和v");
      }
      if (value === "Keys") {
        return (value = "1分钟内key数量的最大值");
      }
      if (value === "OutFlow") {
        return (value = "1分钟内出流量总和");
      }
      if (value === "StatGet") {
        return (value =
          "	1分钟内 get, hget, hgetall, hmget, mget, getbit, getrange 命令请求数");
      }
      if (value === "StatSet") {
        return (value =
          "1分钟内 set, hset, hmset, hsetnx, lset, mset, msetnx, setbit, setex, setrange, setnx 命令请求数");
      }
      if (value === "Storage") {
        return (value = "	1分钟内已使用容量的最大值");
      }
      if (value === "StorageUs") {
        return (value = "1分钟内已使用容量的百分比最大值");
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
