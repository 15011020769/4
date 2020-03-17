<template>
<!-- 统计报表-业务 -->
  <div class="child">
    <div class="mainConList" v-loading="loading">
      <div class="mainConListAll mainConListOne">
        <div class="newClear">
          <el-button-group class="buttonGroupAll">
            <!-- <el-button class="buttonGroup" @click="thisTime(1)">今天</el-button>
            <el-button class="buttonGroup" @click="thisTime(2)">近7天</el-button>
            <el-button class="buttonGroup" @click="thisTime(3)">近15天</el-button>
            <el-button class="buttonGroup" @click="thisTime(4)">近30天</el-button>
            <el-button class="buttonGroup" @click="thisTime(5)">近半年</el-button> -->
            <el-button
              v-for="(item, index) in btnData"
              :key="index"
              :type="item.selected ? 'primary' : ''"
              class="buttonGroup"
              @click="thisTime(index + 1)"
            >{{$t('DDOS.Statistical_forms.' + item.title)}}</el-button>
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
        <div>
             <div class="text-label">{{chartDes1}}</div>
             <div class="text-indent">{{chartValue1}}</div>
             <div class="text-label">{{chartDes2}}</div>
             <div class="text-indent">{{chartValue2}}</div>
          </div>
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
      ),
      choiceClick:false,
      btnData: [
        {
          selected: true,
          title: "Today"
        },
        {
          selected: false,
          title: "Nearly_sedays"
        },
        {
          selected: false,
          title: "Fifteendays"
        },
        {
          selected: false,
          title: "Halfamonth"
        },
        {
          selected: false,
          title: "Halfayear"
        }
      ],
      chartDes1: '入流量頻寬峰值',
      chartDes2: '出流量頻寬峰值',
      chartValue1: '0bps',
      chartValue2: '0bps'
    };
  },
  watch: {
    dateChoice3: function(value) {
      if(this.inputIdService == "") {
        return
      }
      // var num = value[1].getTime() - value[0].getTime(); //计算时间戳的差
      // if(num == 0) {//选择时间为一天
      //   this.periodService = 3600;
      //   var arr = [];
      //   for (var i = 24; i >= 0; i--) {
      //     var d = new Date(value[1].getTime() + 3600000 * i);
      //     arr.push(moment(d).format("MM-DD HH:mm:ss"));
      //   }
      //   this.endTimeService = moment(value[1]).format("YYYY-MM-DD 23:59:59"); //格式处理
      // } else {
      //   this.periodService = 86400;
      //   var arr = [];
      //   for (var i = 0; i <= num / 86400000; i++) {
      //     //根据时间戳的差以及时间粒度计算出开始时间与结束时间之间有多少天/小时
      //     var d = new Date(value[1].getTime() - 86400000 * i);
      //     arr.push(moment(d).format("MM-DD"));
      //   }
      //   this.endTimeService = moment(value[1]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      // }
      if (!this.choiceClick && value !== null) {
        let num = (value[1].getTime() - value[0].getTime()) / 86400000
        let dateValue = moment(value[0])
        let maxDate = moment(value[1]).add(1, 'd')
        let arr = []
        arr.push(dateValue.format('YYYY-MM-DD HH:mm:ss'))
        while (!dateValue.isSameOrAfter(maxDate)) {
          if (num > 0 && num < 2) {
            this.period = 300
            arr.push(dateValue.add(5, 'm').format('YYYY-MM-DD HH:mm:ss'))
          } else if (num < 6) {
            this.period = 1800
            arr.push(dateValue.add(30, 'm').format('YYYY-MM-DD HH:mm:ss'))
          } else if (num < 16) {
            this.period = 3600
            arr.push(dateValue.add(1, 'h').format('YYYY-MM-DD HH:mm:ss'))
          } else if (num < 31) {
            this.period = 21600
            arr.push(dateValue.add(6, 'h').format('YYYY-MM-DD HH:mm:ss'))
          } else {
            this.period = 86400
            arr.push(dateValue.add(1, 'd').format('YYYY-MM-DD HH:mm:ss'))
          }
        }
        this.timey = arr
        this.startTimeService = moment(value[0]).format("YYYY-MM-DD 00:00:00"); //格式处理
        this.endTimeService = moment(value[1]).format("YYYY-MM-DD 23:59:59"); //格式处理
        this.describeTransmitStatis();
        for (let i = 0; i < this.btnData.length; i++) {
          this.btnData[i]['selected'] = false;
        }
      }
      this.choiceClick = false
    },
    inputIdService() {
      this.changeIdService()
    },
    ywTimeBtnSelect2() {
      // this.describeResourceList();
      this.getDataService();
    }

  },
  created() {
    this.GetID();
  },
  methods: {
    getDataService() {
      // this.describleL4Rules();
      this.describeTransmitStatis();
      // for (let index in this.metricNameService2s) {
      //   this.metricNameService2 = this.metricNameService2s[index];
      //   this.describeBaradData();
      // }
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
      // this.describeResourceList();
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
      if (this.ywTimeBtnSelect2 === '總覽') {
        this.IpList.forEach((e, i) => {
          if (e !== '總覽') {
            params['IpList.' + (i - 1)] = e
          }
        })
      } else {
        params['IpList.' + 0] = this.ywTimeBtnSelect2
      }
      if (this.metricNameService === "traffic") {
        this.chartDes1 = '入流量頻寬峰值'
        this.chartDes2 = '出流量頻寬峰值'
        this.chartValue1 = '0bps'
        this.chartValue2 = '0bps'
      } else if (this.metricNameService === "pkg") {
        this.chartDes1 = '入流量包速率峰值'
        this.chartDes2 = '出流量包速率峰值'
        this.chartValue1 = '0pps'
        this.chartValue2 = '0pps'
      }
      this.axios.post(STATIC_LIST, params).then(res => {
        this.InDataList = res.Response.InDataList;
        this.OutDataList = res.Response.OutDataList;
        if (this.metricNameService == "traffic") {
          this.drawLine4(this.timey, this.InDataList, this.OutDataList)
          this.chartValue1 = Math.max.apply(Math, this.InDataList) + 'bps'
          this.chartValue2 = Math.max.apply(Math, this.OutDataList) + 'bps'
        } else if (this.metricNameService == "pkg") {
          this.drawLine5(this.timey, this.InDataList, this.OutDataList)
          this.chartValue1 = Math.max.apply(Math, this.InDataList) + 'pps'
          this.chartValue2 = Math.max.apply(Math, this.OutDataList) + 'pps'
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
      // var ipt1 = document.querySelector(".newDataTimethree input:nth-child(2)");
      // var ipt2 = document.querySelector(".newDataTimethree input:nth-child(4)");
      // const end = new Date();
      // const start = new Date();
      // if (thisTime == "1") {//'今天'，时间从00：00：00到new Date()
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   var zeroTime = new Date(moment(end).format("YYYY-MM-DD 00:00:00"));
      //   var maxI = Math.floor((end.getTime()-zeroTime.getTime())/3600000);
      //   var arr = [];
      //   for (var i = maxI; i >= 0; i--) {
      //     var d = new Date(zeroTime.getTime() + 3600000 * i);
      //     arr.push(moment(d).format("MM-DD HH:mm:ss"));
      //   }

      //   this.startTimeService = moment(end).format("YYYY-MM-DD 00:00:00");
      //   this.endTimeService = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   this.periodService = 3600;
      //   this.timey = arr;
      // } else if (thisTime == "2") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTimeService = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTimeService = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   this.periodService = 86400;
      //   this.timedone(end, start, 86400000);
      //   //ddos攻击-攻击流量带宽
      // } else if (thisTime == "3") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 15);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTimeService = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTimeService = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   this.periodService = 86400;
      //   this.timedone(end, start, 86400000);
      //   //ddos攻击-攻击流量带宽
      // } else if (thisTime == "4") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTimeService = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTimeService = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   this.periodService = 86400;
      //   this.timedone(end, start, 86400000);
      //   //ddos攻击-攻击流量带宽
      // } else if (thisTime == "5") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 30 * 6);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTimeService = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTimeService = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   this.periodService = 86400;
      //   this.timedone(end, start, 86400000);
      // }
      for (let i =0; i < this.btnData.length; i++) {
        this.btnData[i]['selected'] = false;
        this.btnData[thisTime - 1]['selected'] = true
      }
      let start
      let end = moment()
      const times = []
      this.choiceClick = true
      if (thisTime == '1') {
        start = moment().startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(5, 'm').format('YYYY-MM-DD HH:mm:ss'))
        }
        this.startTimeService = moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTimeService = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 今天：0点到当前的时间，粒度5分钟一个值
        this.periodService = 300 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
      } else if (thisTime == '2') {
        start = moment()
          .subtract(6, 'd')
          .startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(1, 'h').format('YYYY-MM-DD HH:mm:ss'))
        }
        this.startTimeService = moment()
          .subtract(6, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTimeService = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 2-5天：时间粒度为30分钟一个值
        this.periodService = 3600 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
        this.timeValue = [this.startTimeService, this.endTimeService]
        // ddos攻击-攻击流量带宽
      } else if (thisTime == '3') {
        // ddos攻击-攻击流量带宽
        start = moment()
          .subtract(14, 'd')
          .startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(1, 'h').format('YYYY-MM-DD HH:mm:ss'))
        }
        this.startTimeService = moment()
          .subtract(14, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTimeService = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 6-15天：时间粒度为1小时一个值
        this.periodService = 3600
        this.timey = times
        // ddos攻击-攻击流量带宽
      } else if (thisTime == '4') {
        start = moment()
          .subtract(29, 'd')
          .startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(6, 'h').format('YYYY-MM-DD HH:mm:ss'))
        }
        this.startTimeService = moment()
          .subtract(29, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTimeService = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 16-30天：时间粒度为6小时一个值
        this.periodService = 21600 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
      } else if (thisTime == '5') {
        start = moment()
          .subtract(180, 'd')
          .startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(1, 'd').format('YYYY-MM-DD HH:mm:ss'))
        }
        this.startTimeService = moment()
          .subtract(180, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTimeService = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 16-30天：时间粒度为6小时一个值
        this.periodService = 86400 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
      }
      this.dateChoice3 = [this.startTimeService, this.endTimeService]
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
      // var arr = [];
      // for (let i in time) {
      //   arr.unshift(time[i]); //属性
      // }
      // arr.splice(arr.length - 1, 1);
      // 基于准备好的dom，初始化echarts实例
      let myChart4 = this.$echarts.init(document.getElementById("myChart4"));
      // 绘制图表
      myChart4.setOption({
        color: ['rgb(124, 181, 236)','rgb(50, 205, 50)'],
        title: { text: "" },
        tooltip: {
        },
        //       legend: {
        //     data:['总请求峰值','攻击请求峰值']
        // },
        xAxis: {
          data: time //["12-05", "12-04", "12-03", "12-02", "12-01"]
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
                  color: "rgb(50, 205, 50)"
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
             color: ['rgb(124, 181, 236)','rgb(50, 205, 50)']
          }
        }
      });
      myChart4.resize();
      window.addEventListener("resize", function() {
        myChart4.resize();
      });
    },

    drawLine5(time, data1, data2) {
      // var arr = [];
      // for (let i in time) {
      //   arr.unshift(time[i]); //属性
      // }
      // arr.splice(arr.length - 1, 1);
      // 基于准备好的dom，初始化echarts实例
      let myChart5 = this.$echarts.init(document.getElementById("myChart5"));
      // 绘制图表
      myChart5.setOption({
        color: ['rgb(124, 181, 236)','rgb(50, 205, 50)'],
        title: { text: "" },
        tooltip: {},
        //       legend: {
        //     data:['总请求峰值','攻击请求峰值']
        // },
        xAxis: {
          data: time //["12-05", "12-04", "12-03", "12-02", "12-01"]
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
            formatter: "{value}pps"
          },
          boundaryGap: true
        },
        series: [
          {
            name: "入流量包速率峰值",
            type: "line",
            data: data1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "rgb(135, 206, 250)"
                }
              }
            }
          },
          {
            name: "出流量包速率峰值",
            type: "line",
            data: data2,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "rgb(50, 205, 50)"
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
            color: ['rgb(124, 181, 236)','rgb(50, 205, 50)']
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
  margin: 20px 0 20px 0;
}
#myChart5 {
  width: 100%;
  height: 380px;
  margin: 0 0 20px 0;
}
.mainConListTwo {
  display: flex;
}
.tabsCard {
  width: 80%;
}
.text-label{
    color: #888 ;
    font-size: 16px;
    margin-top: 50px;
}
.text-indent {
    display: inline-block;
    vertical-align: top;
    font-size: 18px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-left:100px;
    padding-right: 10px;
    margin-top: 30px;
    margin-bottom: 50px;
    text-align: right;
    color:black;
}
</style>
