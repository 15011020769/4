<template>
  <div class="Monitor">
    <!-- 时间粒度搜素 -->
    <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
    <div class="box-dis p-style">
      <p>
        <i class="el-icon-info"></i>{{ $t('SCF.total.zs') }}
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
            <p v-if="scope.row.DataPoints[0].Values.length==0">{{ $t('SCF.total.zwsj') }}</p>
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
              <i class="el-icon-menu i-font" style="font-size:26px;" @click="Modality(scope.row.MetricName)"></i>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <!-- 模态框 -->
      <el-dialog :title="$t('SCF.total.jqjkzt')" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
        <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
        <echart-line id="diskEchearrts-line" class="echart-wh" :time="timeData | UpTime" :opData="jingData"
          :period="period" :xdata="true"></echart-line>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import XTimeX from "@/components/public/TimeXK";
  import echartLine from "@/components/public/echars-line";
  import {
    All_MONITOR,
    ALL_Basics,
    LIST_VERSION
  } from "@/constants";
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
        BasicsList: [], //基础指标详情
        tableData: [], // 获取列表数据
        timeData: [], // 折线图的x轴数据
        jingData: [],
        FunctionVersion: '', //函数版本
        MetricName: "",
        symbol: [{
            name: "Duration",
            Company: "毫秒(ms)",
          },
          {
            name: "Invocation",
            Company: "次",
          },
          {
            name: "Error",
            Company: "次",
          },
          {
            name: "ConcurrentExecutions",
            Company: "次",
          },
          {
            name: "ConfigMem",
            Company: "MB",
          },
          {
            name: "FunctionErrorPercentage",
            Company: "次",
          },
          {
            name: "Http2xx",
            Company: "次",
          },
          {
            name: "Http432",
            Company: "次",
          },
          {
            name: "Http433",
            Company: "次",
          },
          {
            name: "Http434",
            Company: "次",
          },
          {
            name: "Http4xx",
            Company: "次"
          },
          {
            name: "Mem",
            Company: "MB",
          },
          {
            name: "MemDuration",
            Company: "MB/ms",
          },
          {
            name: "OutFlow",
            Company: "次",
          },
          {
            name: "ServerErrorPercentage",
            Company: "%",
          },
          {
            name: "Syserr",
            Company: "次",
          },
          {
            name: "Throttle",
            Company: "次",
          },

        ]
      };
    },
    components: {
      echartLine,
      XTimeX
    },
    created() {

    },
    methods: {
      //获取数据
      GetDat(data) {
        this.period = data[0];
        this.Start_End = data[1];
        this.value = data[2];
        if (this.period) {
          this.searchVersion()
        }
      },
      //查看函数新版本
      searchVersion() {
        let params = {
          Version: '2018-04-16',
          Region: 'ap-guangzhou', // localStorage.getItem('regionv2'),
          FunctionName: this.ID
        }
        this.axios
          .post(LIST_VERSION, params)
          .then(res => {
            this.FunctionVersion = res.Response.FunctionVersion[0]
          }).then(() => {
            this.GetBasics()
          })
      },
      //监控指标
      GetBasics() {
        const param = {
          Version: "2018-07-24",
          Region: localStorage.getItem('regionv2'),
          Namespace: "QCE/SCF_V2",
        };
        this.axios.post(ALL_Basics, param).then(data => {
          this.BasicsList = data.Response.MetricSet
        }).then(() => {
          this.tableData = []
          this.BasicsList.forEach(item => {
            item.Period.forEach(element => {
              if (element == this.period) {
                this.Obtain(item.MetricName)
              }
            });
          });
        })
      },
      //监控数据
      Obtain(metricN) {
        const param = {
          Version: "2018-07-24",
          Region: localStorage.getItem('regionv2'),
          Namespace: "QCE/SCF_V2",
          MetricName: metricN,
          "Instances.0.Dimensions.0.Name": "functionName",
          "Instances.0.Dimensions.0.Value": this.ID,
          "Instances.0.Dimensions.1.Name": "version",
          "Instances.0.Dimensions.1.Value": this.FunctionVersion,
          Period: this.period,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme
        };
        this.axios.post(All_MONITOR, param).then(data => {
          this.symbol.forEach(element => {
            if (element.name == data.Response.MetricName) {
              data.Response.symbol = element.Company
            }
          });
          this.tableData.push(data.Response);
        });
      },
      getModality(MetricName) {
        const param = {
          Version: "2018-07-24",
          Region: localStorage.getItem('regionv2'),
          Namespace: "QCE/SCF_V2",
          MetricName: MetricName,
          "Instances.0.Dimensions.0.Name": "functionName",
          "Instances.0.Dimensions.0.Value": this.ID,
          "Instances.0.Dimensions.1.Name": "version",
          "Instances.0.Dimensions.1.Value": this.FunctionVersion,
          Period: this.period,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme
        };
        this.axios.post(All_MONITOR, param).then(data => {
          console.log(data)
          this.timeData = data.Response.DataPoints[0].Timestamps;
          this.jingData = data.Response.DataPoints[0].Values;
        });
      },

      // 模态框
      Modality(MetricName) {
        console.log(MetricName)
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
          return (value = "函数运行时间，按粒度（1分鐘、5分鐘）统计求平均值");
        }
        if (value === "Invocation") {
          return (value = "函数调用次数，按粒度（1分鐘、5分鐘）统计求和");
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
          return (value = "函数运行错误次数，按粒度（1分鐘、5分鐘）统计求和");
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
