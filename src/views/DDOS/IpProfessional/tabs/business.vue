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
            class="newDataTime"
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
        <el-tabs
          class="tabsCard"
          v-model="activeName2"
          type="card"
          @tab-click="handleClick2"
        >
          <el-tab-pane label="攻击流量宽带" name="traffic">
            <div>攻击流量宽带</div>
          </el-tab-pane>
          <el-tab-pane label="攻击包速率" name="pkg">
            <div>攻击包速率</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data(){
    return{
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
      ywTimeBtnSelect2: "177.52.89.23",//业务 时间按钮下面第二个下拉
      inputIdService: "net-0000006y",
      dateChoice3: {},//日期选择
      periodService: 300, //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
    }
  },
  watch:{
    dateChoice3: function(value) {
      // console.log(this.getDateString(value[0]))
      this.startTimeService = this.getDateString(value[0]);
      this.endTimeService = this.getDateString(value[1]);
      this.getDataService();
    }
  },
  methods:{
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
      // console.log(value.name)
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
        // console.log(res)
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
      var ipt1 = document.querySelector(".newDataTime input:nth-child(2)");
      var ipt2 = document.querySelector(".newDataTime input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (thisTime == "1") {
        console.log(111)
        start.setTime(start.getTime() - 3600 * 1000);
        var num =
          end.getTime() -
          new Date(
            new Date(new Date().toLocaleDateString()).getTime()
          ).getTime();
        var arr = [];
        for (var i = 0; i <= num / 3600000; i++) {
          var d = new Date(end.getTime() - 3600000 * i);
          arr.push(moment(d).format("MM-DD HH:mm:ss"));
        }
        this.timey = arr;
      } else if (thisTime == "2") {
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
        ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.startTime = ipt1.value;
        this.endTime = ipt2.value;
        this.period = 86400;
        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "3") {
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
        ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
        ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.startTime = ipt1.value;
        this.endTime = ipt2.value;
        this.period = 86400;
        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "4") {
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
        ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.startTime = ipt1.value;
        this.endTime = ipt2.value;
        this.period = 86400;
        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "5") {
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
        ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
        ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.startTime = ipt1.value;
        this.endTime = ipt2.value;
        this.period = 86400;
        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      }
      //console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),start
      //this.thisStart=moment(start).format('YYYY-MM-DD');
      //this.thisEnd=moment(end).format('YYYY-MM-DD');
      //this.$emit('timeNode1',[this.thisStart,this.thisEnd])
      // this.getData(this.timey)
      this.describeDDoSNetTrend(this.timey);
    },
    // 1.1.获取高防IP专业版资源的DDoS攻击指标数据
    describeDDoSNetTrend(date) {
      let params = {
        Version: "2018-07-09",
        // Region: '',
        Business: "net",
        Id: this.inputId,
        MetricName: this.metricName, //指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
        Period: this.period, //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        StartTime: this.startTime,
        EndTime: this.endTime
      };
      this.$axios.post("dayu2/DescribeDDoSNetTrend", params).then(res => {
        console.log(res)
        if (this.metricName == "bps") {
          this.drawLine(res.Response.Data, date);
        } else {
          this.drawLine2(res.Response.Data, date);
        }
      });
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
  }
}
</script>
<style lang="scss">

</style>