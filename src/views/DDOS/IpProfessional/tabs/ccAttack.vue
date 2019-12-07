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
            v-model="dateChoice2"
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
          v-model="inputIdCC"
          @change="changeIdCC"
          filterable
          placeholder="请输入要查询的ID或名称"
        >
          <el-option :label="inputIdCC" :value="inputIdCC"></el-option>
        </el-select>
        <el-select class="ddosAttackSelect1" v-model="ccTimeBtnSelect2">
          <el-option :label="ccTimeBtnSelect2" :value="ccTimeBtnSelect2"></el-option>
        </el-select>
      </div>
        <div class="mainConListAll mainConListTwo">
    
          
            <div id="myChart3"></div>
      
    
      </div>
      <div class="mainConListAll">
        <h3>CC攻击记录</h3>
        <el-table
          :data="tableDataOfDescribeDDoSNetEvListcc.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        >
          <el-table-column prop="attackTime" label="攻击时间"></el-table-column>
          <el-table-column prop="attackDomin" label="被攻击域名"></el-table-column>
          <el-table-column prop="attackUrl" label="被攻击URI"></el-table-column>
          <el-table-column prop="allRequestTop" label="总请求峰值（QPS）"></el-table-column>
          <el-table-column prop="attackReqTop" label="攻击请求峰值（QPS）"></el-table-column>
          <el-table-column prop="attackResou" label="攻击源"></el-table-column>
        </el-table>
        <div class="tabListPage">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data(){
    return{
      inputIdCC: "net-0000006y",
      metricName: "bps", //指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
      metricNameCC: "inqps", //指标，取值[inqps(总请求峰值，dropqps(攻击请求峰值))]
      metricNameCCs: ["inqps", "dropqps"],
      tableDataOfDescribeDDoSNetEvListcc: [], //Cc攻击防护列表
      tableDataEnd: [],
      currentPage: 1, //当前页
      pageSize: 10, //每页长度
      totalItems: 0, //总条数
      ccTimeBtnSelect2: "177.52.89.23", //cc时间按钮下面第二个下拉
      dateChoice2: {},//日期选择
      // 日期区间：默认获取当前时间和前一天时间
      endTime: this.getDateString(new Date()),
      startTime: this.getDateString(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      ),
      endTimeCC: this.getDateString(new Date()),
      startTimeCC: this.getDateString(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      ),
      endTimeService: this.getDateString(new Date()),
      startTimeService: this.getDateString(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      ),
      tableDataEnd: [],
      periodCC: 3600, //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
    }
  },
  watch:{
    dateChoice2: function(value) {
      // console.log(this.getDateString(value[0]))
      // this.startTimeCC = this.getDateString(value[0]);
      // this.endTimeCC = this.getDateString(value[1]);
      // this.getDataCC();

    this.period = 86400;
      var num = value[1].getTime() - value[0].getTime(); //计算时间戳的差
      var arr = [];
      for (var i = 0; i <= num / 86400000; i++) {
        //根据时间戳的差以及时间粒度计算出开始时间与结束时间之间有多少天/小时
        var d = new Date(value[1].getTime() - 86400000 * i);
        arr.push(moment(d).format("MM-DD"));
      }
      this.timey = arr;
      console.log(this.timey)
      this.startTimeCC = moment(value[0]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      this.endTimeCC = moment(value[1]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
       this.getDataCC();

    },
  },
  methods:{
    // CC资源Id变化时，重新获取数据
    changeIdCC() {
      this.resourceId = this.inputIdCC;
      this.describeResourceList();
      this.getDataCC();
    },
    getDataCC() {
      for (let index in this.metricNameCCs) {
        this.metricNameCC = this.metricNameCCs[index];
        this.describeCCTrend();
      }
      this.describeCCEvList();
    },
    describeCCTrend() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.inputIdCC,
        Ip: "175.97.142.150", //资源的IP
        MetricName: this.metricNameCC, //指标，取值[inqps(总请求峰值，dropqps(攻击请求峰值))]
        Period: this.periodCC, //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        StartTime: this.startTimeCC,
        EndTime: this.endTimeCC
      };
      this.$axios.post("dayu2/DescribeCCTrend", params).then(res => {
        console.log(res)
        if(this.MetricName =="inqps"){
          this.inqpsdata = res.Response.Data
        }else{
            this.dropqps = res.Response.Data
        }
        this.drawLine3()
      });
    },
    //时间按钮
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
    // 2.2.获取 CC 攻击事件列表
    describeCCEvList() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        StartTime: this.startTimeCC,
        EndTime: this.endTimeCC,
        Id: this.inputIdCC
      };
      this.$axios.post("dayu2/DescribeCCEvList", params).then(res => {
        // console.log(res)
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
    //获取时间
    thisTime(thisTime) {
      var ipt1 = document.querySelector(".newDataTime input:nth-child(2)");
      var ipt2 = document.querySelector(".newDataTime input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (thisTime == "1") {
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
  }
}
</script>
<style lang="scss">

</style>