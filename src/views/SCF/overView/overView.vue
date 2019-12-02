<template>
  <div>
    <div class="topOverView">
      <span>概览</span>
      <span>
        <a href="#">函数服务帮助文档</a>
      </span>
    </div>
    <div class="mainContainer">
      <div class="contentTop">
        <el-row>
          <el-col :span="6">
            <div class="modelList">
              <p>函数数量</p>
              <p>
                <span>{{topList.number}}</span>
                <span>个</span>
              </p>
              <p>异常函数{{topList.thirdNum}}个</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>本月调用数</p>
              <p>
                <span>{{topList.number}}</span>
                <span>次</span>
              </p>
              <p>本月调用数{{topList.thirdNum}}次</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>本月资源量</p>
              <p>
                <span>{{topList.number}}</span>
                <span>GBs</span>
              </p>
              <p>昨日资源量{{topList.thirdNum}}GBs</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>本月出流量</p>
              <p>
                <span>{{topList.number}}</span>
                <span>GB</span>
              </p>
              <p>昨日出流量{{topList.thirdNum}}GB</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="modelchart">
        <h3>使用统计</h3>
        <div>
         <!--<el-select class="selectAddress" v-model="valueAddress" placeholder="请选择" filterable>
            <el-option
              v-for="item in address"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>-->
          <el-input class="addressName" readonly="readonly" v-model="addressIpt"></el-input>
          <XTimeX v-on:switchData="GetDat" :classsvalue='value'></XTimeX>
         <!-- <el-button-group>
            <el-button @click="thisTime(1)">实时</el-button>
            <el-button @click="thisTime(2)">近24小时</el-button>
            <el-button @click="thisTime(3)">近七天</el-button>
          </el-button-group>
          <el-date-picker
            class="newDataTime"
            v-model="value2"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
          <span>
            粒度：
            <el-select class="selectTime" v-model="value" placeholder="请选择" filterable>
              <el-option
                v-for="item in selectTime"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </span>-->
        </div>
        <div class="chartShowCon">
          <div class="chartShowTit">
            <el-button-group>
              <el-button @click="btnClick(1)" :class="{'addColor':type=='1'}">
                调用次数
                <span>(次)</span>
              </el-button>
              <el-button @click="btnClick(2)" :class="{'addColor':type=='2'}">
                外网出流量
                <span>(KB)</span>
              </el-button>
              <el-button @click="btnClick(3)" :class="{'addColor':type=='3'}">
                运行内存
                <span>(MB)</span>
              </el-button>
              <el-button @click="btnClick(4)" :class="{'addColor':type=='4'}">
                运行时间
                <span>(ms)</span>
              </el-button>
              <el-button @click="btnClick(5)" :class="{'addColor':type=='5'}">
                错误次数
                <span>(次)</span>
              </el-button>
              <el-button @click="btnClick(6)" :class="{'addColor':type=='6'}">
                并发执行个数
                <span>(个)</span>
              </el-button>
              <el-button @click="btnClick(7)" :class="{'addColor':type=='7'}">
                受限次数
                <span>(次)</span>
              </el-button>
            </el-button-group>
          </div>
          <div class="chartCon" id="echartsShow" ref="chartY"></div>
          <div class="chartNum newClear">
            <span>函数{{newData}}TOP 10统计</span>
            <span>
              <a>刷新</a>
            </span>
          </div>
          <div class="chartTable">
            <!-- <el-table :data="tableData"  ref="multipleTable" class="funDataTable">
            <el-table-column prop="funName" label="函数名"></el-table-column>
            <el-table-column prop="nameSpace" label="命名空间"></el-table-column>
            <el-table-column prop="dataNum" label="数据指标"></el-table-column>
            </el-table>-->
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              class="funDataTable"
            >
              <el-table-column prop="FunctionName" label="函数名"></el-table-column>
              <el-table-column prop="Namespace" label="命名空间"></el-table-column>
              <el-table-column prop="dataNum" label="数据指标"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import XTimeX from '@/components/public/TimeXK';
import { All_MONITOR } from '@/constants'
export default {
  data() {
    return {
      functionName: this.$route.query.FunctionName,
      addressIpt: "中国台北",
      topList: {
        number: 0,
        thirdNum: 0
      },
      type: "1",
      value: "",
      valueAddress: "",
      address: [
        {
          value: "1",
          label: "北京"
        },
        {
          value: "2",
          label: "北京"
        },
        {
          value: "3",
          label: "北京"
        },
        {
          value: "4",
          label: "北京"
        }
      ],
      newData: "调用次数",
      selectTime: [
        {
          value: "time1",
          label: "一分钟"
        },
        {
          value: "time2",
          label: "五分钟"
        },
        {
          value: "time3",
          label: "一小时"
        },
        {
          value: "time4",
          label: "一天"
        }
      ],
      value2: "",
      changeColor: "",
      tableData: [
        {
          funName: "函数名1",
          nameSpace: "命名空间1",
          dataNum: "数据指标1"
        },
        {
          funName: "函数名2",
          nameSpace: "命名空间2",
          dataNum: "数据指标2"
        },
        {
          funName: "函数名3",
          nameSpace: "命名空间2",
          dataNum: "数据指标3"
        }
      ],
      charts: ""
    };
  },
  components: {
    XTimeX
  },
  methods: {
    init() {
      let params = {
        Action: "GetFunction",
        Version: "2018-04-16",
        ShowCode: "TRUE",
        Namespace: "default",
        Qualifier: "$LATEST",
        Region: this.$cookie.get("regionv2")
      };
      let functionName = this.$route.query.functionName;
      // functionName = 'tttt'
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      let url = "scf/GetFunction";
      this.axios
        .post(url, params)
        .then(res => {
          let _this = this;
          this.functionData = res.Response;
          let funcData = this.functionData;
        })
        .catch(error => {
          console.log(error);
        });
    },
    GetDat(data) {
        this.period = data[0];
        this.Start_End = data[1];
        this.value = data[2]
        const metricNArr = [
          'CPUUsage',
          'CPULoadAvg',
          'MemUsed',
          'MemUsage',
          'TcpCurrEstab',
          'lanOuttraffic',
          'lanIntraffic',
          'lanOutpkg',
          'lanInpkg',
          'WanOuttraffic',
          'WanIntraffic',
          'AccOuttraffic',
          'WanOutpkg',
          'WanInpkg'
        ];
        this.tableData = []
        for (let i = 0; i < metricNArr.length; i++) {
          this.Obtain(metricNArr[i]);
        }
        if (this.MetricName) {
          this.getModality(this.MetricName)
        }
      },
      // 
      Obtain(metricN) {
        const param = {
          Version: '2018-07-24',
          Region: this.$cookie.get('regionv2'),
          Namespace: 'QCE/SCF_V2',
          MetricName: metricN,
          'Instances.0.Dimensions.0.Name': 'InstanceId',
          'Instances.0.Dimensions.0.Value': this.ID,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme,
        };
        this.axios.post('monitor2/GetMonitorData', param).then((data) => {
          this.tableData.push(data.Response);
        });
      },
      getModality(MetricName) {
        const param = {
          Version: '2018-07-24',
          Region: this.$cookie.get('regionv2'),
          Namespace: 'QCE/SCF_V2',
          MetricName: MetricName,
          'Instances.0.Dimensions.0.Name': 'functionName',
          'Instances.0.Dimensions.0.Value': this.functionName,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme,
        };
        this.axios.post('monitor2/GetMonitorData', param).then((data) => {
          this.timeData = data.Response.DataPoints[0].Timestamps
          this.jingData = data.Response.DataPoints[0].Values
        });
      },
      // 模态框
      Modality(MetricName) {
        this.MetricName = MetricName
        this.dialogVisible = true;
        this.getModality(this.MetricName)
      },
    thisTime(thisTime) {
      var ipt1 = document.querySelector(".newDataTime input:nth-child(2)");
      var ipt2 = document.querySelector(".newDataTime input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (thisTime == "1") {
        start.setTime(start.getTime() - 3600 * 1000);
      } else if (thisTime == "2") {
        start.setTime(start.getTime() - 3600 * 1000 * 24);
      } else if (thisTime == "3") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      }
      ipt1.value = start
        .toLocaleString("chinese", { hour12: false })
        .replace(/\//g, "-");
      ipt2.value = end
        .toLocaleString("chinese", { hour12: false })
        .replace(/\//g, "-");
    },
    btnClick(clickNode) {
      this.type = clickNode;
      if (clickNode == "1") {
        this.newData = "调用次数";
      } else if (clickNode == "2") {
        this.newData = "外网出流量";
      }else if (clickNode == "3") {
        this.newData = "运行内存";
      }else if (clickNode == "4") {
        this.newData = "运行时间";
      } else if (clickNode == "5") {
        this.newData = "错误次数";
      } else if (clickNode == "6") {
        this.newData = "并发执行个数";
      } else if (clickNode == "7") {
        this.newData = "受限次数";
      }
    },
    initChart() {
      this.chart = echarts.init(document.getElementById("echartsShow"));
      // 把配置和数据放这里
      this.chart.setOption({
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["1", "2", "3", "4", "5", "6", "7"],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "line",
            barWidth: "60%",
            data: [50, 100, 120, 200, 300, 60, 70]
          }
        ]
      });
    }
  },
    filters: {
      UpName(value) {
        if (value === 'lanOuttraffic') {
          return (value = '内网出带宽');
        }
        if (value === 'lanIntraffic') {
          return (value = '内网入带宽');
        }
        if (value === 'lanOutpkg') {
          return (value = '内网出包量');
        }
        if (value === 'lanInpkg') {
          return (value = '内网入包量');
        }
        if (value === 'WanOuttraffic') {
          return (value = '外网出带宽');
        }
        if (value === 'WanIntraffic') {
          return (value = '外网入带宽');
        }
        if (value === 'AccOuttraffic') {
          return (value = '外网出流量');
        }
        if (value === 'WanOutpkg') {
          return (value = '外网出包量');
        }
        if (value === 'WanInpkg') {
          return (value = '外网入包量');
        }
        if (value === 'CPUUsage') {
          return (value = 'CPU使用率');
        }

        if (value === 'CPULoadAvg') {
          return (value = 'CPU平均负载');
        }
        if (value === 'MemUsed') {
          return (value = '内存使用量');
        }
        if (value === 'MemUsage') {
          return (value = '内存利用率');
        }
        if (value === 'TcpCurrEstab') {
          return (value = 'TCP连接数');
        }
        if (value === '') {
          return (value = '');
        }
      },
      UpTitle(value) {
        if (value === 'tcp_curr_estab') {
          return (value = '处于 ESTABLISHED 状态的 TCP 连接数量，依赖监控组件安装采集');
        }
        if (value === 'cpu_usage') {
          return (value = 'CPU利用率是通过CVM子机内部监控组件采集上报，数据更加精准');
        }
        if (value === 'cpu_loadavg') {
          return (value = '1分钟内CPU平均负载，取 /proc/loadavg 第一列数据（windows操作系统无此指标），依赖监控组件安装采集');
        }
        if (value === 'mem_used') {
          return (value = '使用的内存量，不包括系统缓存和缓存区占用内存，依赖监控组件安装采集');
        }
        if (value === 'mem_usage') {
          return (value = '用户实际使用的内存量与总内存量之比，不包括缓冲区与系统缓存占用的内存');
        }
      },
      UpTime(value) {

        let timeArr = []
        for (let i = 0; i < value.length; i++) {
          let uptime = moment(value[i] * 1000).format(
            'YYYY-MM-DD HH:mm:ss',
          );
          timeArr.push(uptime)
        }

        return timeArr
      }
    },
  mounted() {
    if (this.tableData == "") {
      document.querySelector(".chartTable").innerHTML = "暂无数据";
    }
    this.initChart();
    this.init()
  }
};
</script>

<style scoped lang="scss">
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.topOverView {
  width: 100%;
  height: 52px;
  background-color: #fff;
  line-height: 52px;
  border-bottom: 1px solid #eee;
  padding: 0 20px;
  span:nth-child(1) {
    font-size: 16px;
    font-weight: 600;
    color: #000;
    float: left;
  }
  span:nth-child(2) {
    font-size: 14px;
    color: #888;
    float: right;
    a {
      color: #888;
    }
  }
}
.mainContainer {
  width: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
}
.contentTop {
  padding: 20px 0;
  width: 100%;
  height: 150px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  div:nth-child(4) {
    div {
      border-right: 0;
    }
  }
}
.modelList {
  padding: 10px 20px;
  border-right: 1px solid #ccc;
  height: 110px;
  p:nth-child(1) {
    color: #000;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 15px;
  }
  p:nth-child(2) {
    margin-bottom: 8px;
    color: #000;
    span:nth-child(1) {
      font-size: 30px;
    }
  }
  p:nth-child(3) {
    color: #888;
  }
}
.modelchart {
  width: 100%;
  min-height: 500px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  padding: 20px;
  h3 {
    line-height: 28px;
  }
}
.selectAddress {
  margin-right: 20px;
}
.newDataTime {
  margin-left: 20px;
}
.chartShowTit {
  width: 100%;
  border-bottom: 1px solid #eaeaea;
  height: 35px;
  line-height: 38px;
  margin-top: 20px;
  button {
    padding: 5px 10px;
    border-bottom: 2px solid transparent;
    margin-right: 20px !important;
    border: none;
    border-radius: 0;
    span {
      font-size: 12px;
      color: #888;
    }
  }
  .addColor {
    border-bottom: 2px solid #006eff;
    background-color: transparent;
    font-weight: 600;
    color: #000;
    span {
      font-weight: 100;
    }
  }
}
.chartCon {
  min-height: 300px;
  // border:1px solid #eaeaea;
}
.chartNum {
  margin-top: 20px;
  margin-bottom: 20px;
  span:nth-child(1) {
    font-weight: 600;
    float: left;
  }
  span:nth-child(2) {
    color: #006eff;
    float: right;
    cursor: pointer;
  }
}
.chartTable {
  min-height: 32px;
  line-height: 32px;
  text-align: left;
  table tbody tr td {
    text-align: left;
  }
}
</style>
