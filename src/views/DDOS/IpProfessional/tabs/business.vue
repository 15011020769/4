<template>
<!-- 统计报表-业务 -->
  <div class="child">
    <div class="mainConList" v-loading="loading">
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
            class="newDataTimethree"
            range-separator="至"
            :start-placeholder="$t('DDOS.UnsealCode.beginDate')"
            :end-placeholder="$t('DDOS.UnsealCode.overDate')"
          ></el-date-picker>
        </div>
        <br />
        <el-select
          class="ddosAttackSelect1"
          v-model="inputIdService"
          filterable
          :placeholder="$t('DDOS.AccesstoCon.searchAccess')"
          style="margin-right:10px;"
        >
          <el-option
              v-for="(item, index) in ResIpList"
              :label="item.Id"
              :value="item.Id"
              :key="index"
            ></el-option>
        </el-select>
        <el-select class="ddosAttackSelect1" v-model="ywTimeBtnSelect2">
          <el-option v-for="(item,index) in IpList" :value="item" :key="index"></el-option>
        </el-select>
      </div>
      <div class="mainConListAll mainConListTwo">
        <el-tabs class="tabsCard" v-model="activeName2" type="card" @tab-click="handleClick2">
          <el-tab-pane :label="$t('DDOS.Statistical_forms.Traffic_broadband')" name="traffic">
            <div id="myChart4"></div>
          </el-tab-pane>
          <el-tab-pane :label="$t('DDOS.Statistical_forms.Packet_rate')" name="pkg">
            <div id="myChart5"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { GET_ID, RESOURCE_LIST, STATIC_LIST, L4_RULES, DESCRIBE_BARADDATA } from "@/constants";
import moment from "moment";
export default {
  data() {
    return {
      loading: true,
      activeName2: "traffic", //业务-二级tab标识
      IpList: [],
      ResIpList:[],
      inputIdService: "",
      metricNameService: "traffic", //指标名，取值：traffic表示流量带宽，pkg表示包速率
      metricNameServices: ["traffic", "pkg"],
      metricNameService2: "connum", //指标名，取值：（通过腾讯雲获取的值connum/inactive_conn），以下为API给出
      //connum表示总TCP连接数（新建TCP连接数与活跃TCP连接数的和）；
      // new_conn表示新建TCP连接数；
      // intraffic表示入流量；
      // outtraffic表示出流量；
      // alltraffic表示出流量和入流量之和；
      // inpkg表示入包速率；
      // outpkg表示出包速率；
      metricNameService2s: ["connum", "inactive_conn"],
      ywTimeBtnSelect2: "總覽", //业务 时间按钮下面第二个下拉

      dateChoice3: [], //日期选择
      periodService: 3600, //统计粒度，取值[300(5分鐘)，3600(小时)，86400(天)]
      endTimeService: this.getDateString(new Date()),
      startTimeService: this.getDateString(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      )
    };
  },
  watch: {
    dateChoice3: function(value) {
      if(this.inputIdService == "") {
        return
      }
      var num = value[1].getTime() - value[0].getTime(); //计算时间戳的差
      if(num == 0) {//选择时间为一天
        this.periodService = 3600;
        var arr = [];
        for (var i = 24; i >= 0; i--) {
          var d = new Date(value[1].getTime() + 3600000 * i);
          arr.push(moment(d).format("MM-DD HH:mm:ss"));
        }
        this.endTimeService = moment(value[1]).format("YYYY-MM-DD 23:59:59"); //格式处理
      } else {
        this.periodService = 86400;
        var arr = [];
        for (var i = 0; i <= num / 86400000; i++) {
          //根据时间戳的差以及时间粒度计算出开始时间与结束时间之间有多少天/小时
          var d = new Date(value[1].getTime() - 86400000 * i);
          arr.push(moment(d).format("MM-DD"));
        }
        this.endTimeService = moment(value[1]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      }
      this.timey = arr;
      this.startTimeService = moment(value[0]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      
      this.describeTransmitStatis();
    },
    inputIdService() {
      this.changeIdService()
    },
    ywTimeBtnSelect2() {
      this.describeResourceList();
      this.getDataService();
    }

  },
  created() {
    this.GetID();
  },
  methods: {
    getDataService() {
      this.describleL4Rules();
      this.describeTransmitStatis();
      for (let index in this.metricNameService2s) {
        this.metricNameService2 = this.metricNameService2s[index];
        this.describeBaradData();
      }
    },
    //获取资源的IP列表
    GetID() {
      this.loading = true;
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net"
      };
      this.axios.post(GET_ID, params).then(res => {
        if (res.Response.Error === undefined) {
          if (res.Response.Resource.length === 0) {
            this.$message({
              message: '暫無服務',
              type: "error",
              showClose: true,
              duration: 0
            });
            this.loading = false
            return
          }
          this.ResIpList = res.Response.Resource
          this.inputIdService = res.Response.Resource[0].Id;
				} else {
					let ErrTips = {};
					let ErrOr = Object.assign(ErrorTips, ErrTips);
					this.$message({
						message: ErrOr[res.Response.Error.Code],
						type: "error",
						showClose: true,
						duration: 0
					});
				}
      });
    },
    // 3.1.获取L4转发规则
    describleL4Rules() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.inputIdService
      };
      this.axios.post(L4_RULES, params).then(res => {
        // console.log(res)
      });
    },
    // 3.3.获取转发报表数据
    describeBaradData() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.inputIdService,
        Ip: this.IpList[0]=='總覽'?'':this.IpList[0], //资源的IP
        MetricName: this.metricNameService2,
        Period: this.periodService, //统计粒度，取值[300(5分鐘)，3600(小时)，86400(天)]
        StartTime: this.startTimeService,
        EndTime: this.endTimeService,
        Statistics: this.statistics //统计方式，取值：max表示最大值；min表示最小值；avg表示均值；
      };
      this.axios.post(DESCRIBE_BARADDATA, params).then(res => {
        // console.log(res)
      });
    },
    // 业务资源id变化时，重新获取数据
    changeIdService() {
      this.IpList = []
      console.log('inputIdService =' + this.inputIdService)
      for (const i in this.ResIpList) {
        if (this.ResIpList.hasOwnProperty(i)) {
          const element = this.ResIpList[i];
          if(this.inputIdService == element.Id){
            Object.assign(this.IpList, element.IpList)
          }
        }
      }
      this.IpList.splice(0, 0, '總覽')
      // 资源ID改变时，IP默认为总览
      this.ywTimeBtnSelect2 = this.IpList[0]
      this.resourceId = this.inputIdService;
      this.thisTime('1')
      this.describeResourceList();
      this.getDataService();
    },
    // 时间格式化'yyyy-MM-dd hh:mm:ss'
    getDateString(date) {
      let o = {
        y: date.getFullYear(),
        M: date.getMonth()+1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
      }
      for (const i in o) {
        o[i] = (o[i]+"").length == 1 ? "0"+o[i] : o[i]
      }
      return o.y+"-"+o.M+"-"+o.d+" " +o.h+":"+o.m+":"+o.s;
    },
    // 业务-二级tab切换
    handleClick2(value) {
      this.metricNameService = value.name;
      this.describeTransmitStatis();
    },
    // 3.2.获取业务转发统计数据
    describeTransmitStatis() {
      this.loading = true;
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.inputIdService,
        MetricName: this.metricNameService, //指标名，取值：traffic表示流量带宽，pkg表示包速率
        Period: this.periodService, //统计粒度，取值[300(5分鐘)，3600(小时)，86400(天)]
        StartTime: this.startTimeService,
        EndTime: this.endTimeService
      };
      this.axios.post(STATIC_LIST, params).then(res => {
        this.InDataList = res.Response.InDataList;
        this.OutDataList = res.Response.OutDataList;
        if (this.metricNameService == "traffic") {
          this.drawLine4(this.timey, this.InDataList, this.OutDataList);
        } else if (this.metricNameService == "pkg") {
          this.drawLine5(this.timey, this.InDataList, this.OutDataList);
        }
        this.loading = false;
      });
    },
    // // 业务资源id变化时，重新获取数据
    // changeIdService() {
    //   this.resourceId = this.inputIdService;
    //   this.describeResourceList();
    //   this.getDataService();
    // },
    // 获取资源列表
    describeResourceList(data) {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net"
      };
      if (this.resourceId != "" && this.resourceId != null) {
        params["IdList.0"] = this.resourceId;
      }
      this.axios.post(RESOURCE_LIST, params).then(res => {
        // console.log(res)
      });
    },
    thisTime(thisTime) {
      if(this.inputIdService == "") {
        return
      }
      var ipt1 = document.querySelector(".newDataTimethree input:nth-child(2)");
      var ipt2 = document.querySelector(".newDataTimethree input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (thisTime == "1") {//'今天'，时间从00：00：00到new Date()
        ipt1.value = moment(start).format("YYYY-MM-DD");
        ipt2.value = moment(end).format("YYYY-MM-DD");
        var zeroTime = new Date(moment(end).format("YYYY-MM-DD 00:00:00"));
        var maxI = Math.floor((end.getTime()-zeroTime.getTime())/3600000);
        var arr = [];
        for (var i = maxI; i >= 0; i--) {
          var d = new Date(zeroTime.getTime() + 3600000 * i);
          arr.push(moment(d).format("MM-DD HH:mm:ss"));
        }

        this.startTimeService = moment(end).format("YYYY-MM-DD 00:00:00");
        this.endTimeService = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.periodService = 3600;
        this.timey = arr;
      } else if (thisTime == "2") {
        //ddos攻击-攻击流量带宽
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
        ipt1.value = moment(start).format("YYYY-MM-DD");
        ipt2.value = moment(end).format("YYYY-MM-DD");
        this.startTimeService = moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endTimeService = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.periodService = 86400;
        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "3") {
        //ddos攻击-攻击流量带宽
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 15);
        ipt1.value = moment(start).format("YYYY-MM-DD");
        ipt2.value = moment(end).format("YYYY-MM-DD");
        this.startTimeService = moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endTimeService = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.periodService = 86400;
        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "4") {
        //ddos攻击-攻击流量带宽
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
        ipt1.value = moment(start).format("YYYY-MM-DD");
        ipt2.value = moment(end).format("YYYY-MM-DD");
        this.startTimeService = moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endTimeService = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.periodService = 86400;
        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "5") {
        //ddos攻击-攻击流量带宽
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 30 * 6);
        ipt1.value = moment(start).format("YYYY-MM-DD");
        ipt2.value = moment(end).format("YYYY-MM-DD");
        this.startTimeService = moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endTimeService = moment(end).format("YYYY-MM-DD HH:mm:ss");
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
            name: "入流量頻寬峰值",
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
            name: "出流量頻寬峰值",
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
            name: "入流量頻寬峰值",
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
            name: "出流量頻寬峰值",
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
<style lang="scss" scoped>
.child >>> .el-tabs__nav-wrap {
  padding: 0 !important;
}
.child >>> .el-tabs__item,
.child >>> .is-active {
  border-bottom: 1px #f2f2f2 solid !important;
  border-radius: 0 !important;
}
.newClear {
  display: flex;
}
.child {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.mainConListAll {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  margin-bottom: 20px;
}
.buttonGroupAll {
  float: left;
  button {
    height: 30px;
    line-height: 30px;
    padding: 0 16px;
    border-radius: 0;
  }
}
.newDataTimethree {
  float: left;
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  .el-input__icon {
    line-height: 26px;
  }
  .el-range-separator {
    line-height: 26px;
    width: 7%;
  }
}
::v-deep .el-range-editor.el-input__inner {
  height: 30px;
  line-height: 30px;
}
::v-deep .el-range__icon {
  line-height: 26px;
}
::v-deep .el-range-separator {
  line-height: 26px;
  width: 7%;
}
::v-deep .newDataTimeTwo {
  float: left;
  height: 30px !important;
  border-radius: 0 !important;
  margin-left: -1px;
}
::v-deep input.el-input__inner {
  height: 30px;
  border-radius: 0;
  line-height: 30px;
}
.ddosAttackSelect1 {
  height: 30px;
  line-height: 30px;
  ::v-deep div.el-input {
    height: 30px;
  }
}
#myChart4 {
  width: 100%;
  height: 380px;
  margin: 20px 0;
}
#myChart5 {
  width: 100%;
  height: 380px;
  margin: 20px 0;
}
</style>