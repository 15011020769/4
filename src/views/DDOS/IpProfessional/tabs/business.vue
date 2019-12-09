<template>
  <div>
    <div class="mainConList">
      <div class="mainConListAll mainConListOne">
        <div class="newClear">
          <el-button-group class="buttonGroupAll">
            <el-button class="buttonGroup" @click="thisTime(1)">今天</el-button>
            <el-button class="buttonGroup" @click="thisTime(2)">近7天</el-button>
            <el-button class="buttonGroup" @click="thisTime(3)">近15天</el-button>
            <el-button class="buttonGroup" @click="thisTime(4)">近30天</el-button>
            <el-button class="buttonGroup" @click="thisTime(5)">近半年</el-button>
          </el-button-group>
          <el-date-picker
            v-model="dateChoice3"
            type="daterange"
            class="newDataTime newDataTimethree"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <br />
        <el-select
          class="ddosAttackSelect1"
          v-model="inputIdService"
          @change="changeIdService"
          filterable
          placeholder="请输入要查询的ID或名称"
        >
          <el-option :label="inputIdService" :value="inputIdService"></el-option>
        </el-select>
        <el-select class="ddosAttackSelect1" v-model="ywTimeBtnSelect2">
          <el-option :label="ywTimeBtnSelect2" :value="ywTimeBtnSelect2"></el-option>
        </el-select>
      </div>
      <div class="mainConListAll mainConListTwo">
        <el-tabs class="tabsCard" v-model="activeName1" type="card" @tab-click="handleClick2">
          <el-tab-pane label="业务流量宽带" name="traffic">
            <div id="myChart4"></div>
          </el-tab-pane>
          <el-tab-pane label="业务包速率" name="pkg">
            <div id="myChart5"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      activeName2: "traffic", //业务-二级tab标识
      inputIdService: "net-0000006y",
      metricNameService: "traffic", //指标名，取值：traffic表示流量带宽，pkg表示包速率
      metricNameServices: ["traffic", "pkg"],
      metricNameService2: "connum", //指标名，取值：（通过腾讯云获取的值connum/inactive_conn），以下为API给出
      //connum表示总TCP连接数（新建TCP连接数与活跃TCP连接数的和）；
      // new_conn表示新建TCP连接数；
      // intraffic表示入流量；
      // outtraffic表示出流量；
      // alltraffic表示出流量和入流量之和；
      // inpkg表示入包速率；
      // outpkg表示出包速率；
      metricNameService2s: ["connum", "inactive_conn"],
      ywTimeBtnSelect2: "177.52.89.23", //业务 时间按钮下面第二个下拉

      dateChoice3: {}, //日期选择
      periodService: 3600, //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      endTimeService: this.getDateString(new Date()),
      startTimeService: this.getDateString(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      )
    };
  },
  watch: {
    dateChoice3: function(value) {
      // console.log(this.getDateString(value[0]))
      // this.startTimeService = this.getDateString(value[0]);
      // this.endTimeService = this.getDateString(value[1]);
      // this.getDataService();

      this.period = 86400;
      var num = value[1].getTime() - value[0].getTime(); //计算时间戳的差
      var arr = [];
      for (var i = 0; i <= num / 86400000; i++) {
        //根据时间戳的差以及时间粒度计算出开始时间与结束时间之间有多少天/小时
        var d = new Date(value[1].getTime() - 86400000 * i);
        arr.push(moment(d).format("MM-DD"));
      }
      this.timey = arr;
      this.startTimeService = moment(value[0]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      this.endTimeService = moment(value[1]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      // console.log(this.startTimeService,this.endTimeService)
    }
  },

  created() {
    this.gettableshow();
  },
  methods: {
    gettableshow() {
      this.thisTime(1);
    },
    getDataService() {
      this.describleL4Rules();
      this.describeTransmitStatis();
      for (let index in this.metricNameService2s) {
        this.metricNameService2 = this.metricNameService2s[index];
        this.describeBaradData();
      }
    },
    // 3.1.获取L4转发规则
    describleL4Rules() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.inputIdService
      };
      this.$axios.post("dayu2/DescribleL4Rules", params).then(res => {
        // console.log(res)
      });
    },
    // 3.3.获取转发报表数据
    describeBaradData() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.inputIdService,
        Ip: "175.97.142.150", //资源的IP
        MetricName: this.metricNameService2,
        Period: this.periodService, //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        StartTime: this.startTimeService,
        EndTime: this.endTimeService,
        Statistics: this.statistics //统计方式，取值：max表示最大值；min表示最小值；avg表示均值；
      };
      this.$axios.post("dayu2/DescribeBaradData", params).then(res => {
        // console.log(res)
      });
    },
    // 业务资源id变化时，重新获取数据
    changeIdService() {
      this.resourceId = this.inputIdService;
      this.describeResourceList();
      this.getDataService();
    },
    // 时间格式化'yyyy-MM-dd hh:mm:ss'
    getDateString(date) {
      return date
        .toLocaleString("zh", {
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
        .replace(/\//g, "-");
    },
    // 业务-二级tab切换
    handleClick2(value) {
      console.log(value.name);
      this.metricNameService = value.name;
      this.describeTransmitStatis();
    },
    // 3.2.获取业务转发统计数据
    describeTransmitStatis() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.inputIdService,
        MetricName: this.metricNameService, //指标名，取值：traffic表示流量带宽，pkg表示包速率
        Period: this.periodService, //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        StartTime: this.startTimeService,
        EndTime: this.endTimeService
      };
      this.$axios.post("dayu2/DescribeTransmitStatis", params).then(res => {
        this.InDataList = res.Response.InDataList;
        this.OutDataList = res.Response.OutDataList;
        if (this.metricNameService == "traffic") {
          this.drawLine4(this.timey, this.InDataList, this.OutDataList);
          console.log(1)
        } else if (this.metricNameService == "pkg") {
          this.drawLine5(this.timey, this.InDataList, this.OutDataList);
          console.log(2)
        }
      });
    },
    // 业务资源id变化时，重新获取数据
    changeIdService() {
      this.resourceId = this.inputIdService;
      this.describeResourceList();
      this.getDataService();
    },
    // 获取资源列表
    describeResourceList(data) {
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      if (this.resourceId != "" && this.resourceId != null) {
        params["IdList.0"] = this.resourceId;
      }
      this.$axios.post("dayu2/DescribeResourceList", params).then(res => {
        // console.log(res)
      });
    },
    thisTime(thisTime) {
      var ipt1 = document.querySelector(".newDataTimethree input:nth-child(2)");
      var ipt2 = document.querySelector(".newDataTimethree input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (thisTime == "1") {
        this.periodService = 3600;
        start.setTime(start.getTime() - 3600 * 1000);
        var num =
          end.getTime() -
          new Date(
            new Date(new Date().toLocaleDateString()).getTime()
          ).getTime();
        var arr = [];
        for (var i = 0; i <= 86400000 / 3600000; i++) {
          var d = new Date(end.getTime() - 3600000 * i);
          arr.push(moment(d).format("MM-DD HH:mm:ss"));
        }
        this.startTimeService = moment(
          new Date(end.getTime() - 86400000)
        ).format("YYYY-MM-DD HH:mm:ss");
        this.endTimeService = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.timey = arr;
      } else if (thisTime == "2") {
        // console.log(this.inqpsdata,this.dropqps)
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
        ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.startTimeService = ipt1.value;
        this.endTimeService = ipt2.value;
        this.periodService = 86400;
        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "3") {
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
        ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
        ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.startTimeService = ipt1.value;
        this.endTimeService = ipt2.value;
        this.periodService = 86400;

        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "4") {
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
        ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.startTimeService = ipt1.value;
        this.endTimeService = ipt2.value;
        this.periodService = 86400;
        this.timedone(end, start, 86400000);
        // console.log(end,start)
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "5") {
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
        ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
        ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.startTimeService = ipt1.value;
        this.endTimeService = ipt2.value;
        this.periodService = 86400;
        this.timedone(end, start, 86400000);
      }
      this.describeTransmitStatis();
    },

    //计算时间间隔
    timedone(end, start, p) {
      var num = end.getTime() - start.getTime();
      var arr = [];
      for (var i = 0; i <= num / p; i++) {
        var d = new Date(end.getTime() - p * i);
        arr.push(moment(d).format("MM-DD"));
      }
      this.timey = arr;
    },

    drawLine4(time, data1, data2) {
      var arr = [];
      for (let i in time) {
        arr.unshift(time[i]); //属性
      }
      arr.splice(arr.length - 1, 1);
      // console.log(arr)
      // 基于准备好的dom，初始化echarts实例
      let myChart4 = this.$echarts.init(document.getElementById("myChart4"));
      // 绘制图表
      myChart4.setOption({
        color: ["rgb(124, 181, 236)"],
        title: { text: "" },
        tooltip: {},
        //       legend: {
        //     data:['总请求峰值','攻击请求峰值']
        // },
        xAxis: {
          data: arr //["12-05", "12-04", "12-03", "12-02", "12-01"]
          // type : 'time',
          // minInterval: 1
        },
        yAxis: {
          axisLine: {
            //y轴
            show: false
          },
          axisTick: {
            //刻度线
            show: false
          },
          splitLine: {
            //网格线
            show: false
          },
          axisLabel: {
            formatter: "{value}bps"
          },
          boundaryGap: true
        },
        series: [
          {
            name: "入流量带宽峰值",
            type: "line",
            data: data1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "rgb(124, 181, 236)"
                }
              }
            }
          },
          {
            name: "出流量带宽峰值",
            type: "line",
            data: data2,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#f40"
                }
              }
            }
          }
        ],
        legend: {
          //默认横向布局，纵向布局值为'vertical'
          orient: "vertical",
          x: "center", //可设定图例在左、右、居中
          y: "bottom",
          icon: "line", //图例样式
          textStyle: {
            //文字样式
            fontWeight: "bold"
          },
          lineStyle: {
            color: "rgb(124, 181, 236)"
          }
        }
      });
      myChart4.resize();
      window.addEventListener("resize", function() {
        myChart4.resize();
      });
    },

    drawLine5(time, data1, data2) {
      var arr = [];
      for (let i in time) {
        arr.unshift(time[i]); //属性
      }
      arr.splice(arr.length - 1, 1);
      // console.log(arr)
      // 基于准备好的dom，初始化echarts实例
      let myChart5 = this.$echarts.init(document.getElementById("myChart5"));
      // 绘制图表
      myChart5.setOption({
        color: ["rgb(124, 181, 236)"],
        title: { text: "" },
        tooltip: {},
        //       legend: {
        //     data:['总请求峰值','攻击请求峰值']
        // },
        xAxis: {
          data: arr //["12-05", "12-04", "12-03", "12-02", "12-01"]
          // type : 'time',
          // minInterval: 1
        },
        yAxis: {
          axisLine: {
            //y轴
            show: false
          },
          axisTick: {
            //刻度线
            show: false
          },
          splitLine: {
            //网格线
            show: false
          },
          axisLabel: {
            formatter: "{value}bps"
          },
          boundaryGap: true
        },
        series: [
          {
            name: "入流量带宽峰值",
            type: "line",
            data: data1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "rgb(124, 181, 236)"
                }
              }
            }
          },
          {
            name: "出流量带宽峰值",
            type: "line",
            data: data2,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#f40"
                }
              }
            }
          }
        ],
        legend: {
          //默认横向布局，纵向布局值为'vertical'
          orient: "vertical",
          x: "center", //可设定图例在左、右、居中
          y: "bottom",
          icon: "line", //图例样式
          textStyle: {
            //文字样式
            fontWeight: "bold"
          },
          lineStyle: {
            color: "rgb(124, 181, 236)"
          }
        }
      });
      myChart5.resize();
      window.addEventListener("resize", function() {
        myChart5.resize();
      });
    }
  }
};
</script>
<style lang="scss">
</style>