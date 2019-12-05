<template>
  <div>
    <div class="newClear">
      <el-button-group class="buttonGroupAll">
        <el-button class="buttonGroup" @click="thisTime(1)">今天</el-button>
        <el-button class="buttonGroup" @click="thisTime(2)">近7天</el-button>
        <el-button class="buttonGroup" @click="thisTime(3)">近15天</el-button>
        <el-button class="buttonGroup" @click="thisTime(4)">近30天</el-button>
        <el-button class="buttonGroup" @click="thisTime(5)">近半年</el-button>
      </el-button-group>
      <el-date-picker
        v-model="timeValue"
        type="daterange"
        class="newDataTime"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div id="myChart">

    </div>
    <div>
      <h3>DDoS攻击记录</h3>
      <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
        <el-table-column prop="StartTime" label="攻击时间">
          <template slot-scope="scope">{{scope.row.StartTime}}</template>
        </el-table-column>
        <el-table-column prop="durnTime" label="持续时间">
          <template slot-scope="scope">{{scope.row.EndTime - scope.row.StartTime}}</template>
        </el-table-column>
        <el-table-column prop="AttackType" label="攻击类型">
          <template slot-scope="scope">{{scope.row.AttackType}}</template>
        </el-table-column>
        <el-table-column prop="AttackStatus" label="攻击状态">
          <template slot-scope="scope">
              <div v-if="scope.row.AttackStatus == '0'">攻击中</div>
              <div v-else-if="scope.row.AttackStatus == '1'">攻击结束</div>
            </template>
        </el-table-column>
      </el-table>
    </div>
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
</template>
<script>

import moment from 'moment';
import { DDOS_EV_LIST, DDOS_TREND } from '@/constants'
export default {
  props:{
    ddosAttack: Object // 实例对象
  },
  data(){
    return {
      business: 'basic', //[bgp表示独享包；bgp-multip表示共享包；net表示高防IP专业版；basic表示DDoS基础防护]
      metricName: 'bps', // 指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
      period: 3600, //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      // 日期区间：今天
      endTime: this.getDateString(new Date()),
      startTime: this.getDateString(new Date(new Date(new Date().toLocaleDateString()).getTime())),
      // 攻击事件列表
      tableDataBegin: [],
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,

      timeValue: {},
      thisStart:'',
      thisEnd:"",
      tableDataEnd: [],
      filterTableDataEnd: [],
      flag: false,
    }
  },
  watch: {
    'timeValue': function (value) {
      console.log(value, this.getDateString(value[0]))
      // this.startTime = this.getDateString(value[0])
      // this.endTime = this.getDateString(value[1])
      // this.getData()
    }
  },
  created() {
    this.getData()
  },
  mounted(){
    this.drawLine();
  },
  methods:{
    getData() {
      console.log(this.ddosAttack)
      this.describeDDoSTrend()
      this.describeDDoSEvList()
    },
    // 1.1.获取DDoS攻击指标数据
    describeDDoSTrend() {
      let params = {
        Version: '2018-07-09',
        Business: this.business,
        Ip: this.ddosAttack.PublicIpAddresses[0],
        MetricName: this.metricName,
        Period: this.period,
        StartTime: this.startTime,
        EndTime: this.endTime,
      }
      this.axios.post(DDOS_TREND, params).then(res => {
        console.log(res)
      })
    },
    // 1.2.获取DDoS攻击事件列表
    describeDDoSEvList() {
      let params = {
        Version: '2018-07-09',
        Business: this.business,
        StartTime: this.startTime,
        EndTime: this.endTime,
        'IpList.0': this.ddosAttack.PublicIpAddresses[0]
      }
      this.axios.post(DDOS_EV_LIST, params).then(res => {
        console.log(res)
        if(!('Error' in res.Response)) {
          this.tableDataBegin = res.Response.Data
          this.totalItems = this.tableDataBegin.length
        } else {
          console.log(res.Response.Error)
        }
      })
    },
    //选择时间
    thisTime(thisTime) {
      var ipt1 = document.querySelector(".newDataTime input:nth-child(2)");
      var ipt2 = document.querySelector(".newDataTime input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (thisTime == "1") {
        start.setTime(start.getTime() - 3600 * 1000);
      } else if (thisTime == "2") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      } else if (thisTime == "3") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
      }else if (thisTime == "4") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      }else if (thisTime == "5") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
      }
      ipt1.value = moment(start).format('YYYY-MM-DD');
      ipt2.value = moment(end).format('YYYY-MM-DD');
    },
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        color:["rgb(124, 181, 236)"],
        title: { text: '' },
        tooltip: {},
        xAxis: {
            data: ["11-11","11-12","11-13","11-14","11-15","11-16"]
        },
        yAxis: {
          axisLine:{     //y轴   
            show:false
          },
          axisTick:{       //刻度线 
            show:false
          },
          "splitLine": {     //网格线
            "show": false
          },
          axisLabel:{
            formatter:'{value}bps'
          },
          boundaryGap:true
        },
        series: [{
            name: '攻击流量宽带',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0],
            itemStyle : {    
              normal : {    
                lineStyle:{    
                  color:'rgb(124, 181, 236)'
                }    
              }    
            },    
        }],
        legend:{
          //默认横向布局，纵向布局值为'vertical'
          orient: 'vertical',
          x:'center',      //可设定图例在左、右、居中
          y:'bottom',
          icon: "line",//图例样式
          textStyle: {
            //文字样式
            fontWeight: "bold"
          },
          lineStyle:{    
            color:'rgb(124, 181, 236)'
          } 
        }
      });
    },
    // 时间格式化'yyyy-MM-dd hh:mm:ss'
    getDateString(date) {
      return date.toLocaleString('zh',{hour12:false, year: 'numeric',  month: '2-digit',  day: '2-digit',  hour: '2-digit',  minute: '2-digit',  second: '2-digit'}).replace(/\//g,'-');
    },
    
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
  }
}
</script>
<style lang="scss">
.newClear:after{
  clear:both;
  display: block;
  content:"";
}
.buttonGroupAll{
  float:left;
}
.buttonGroup{
  width:66px;
  height:30px;
  border-radius: 0;
  padding:0!important;
  text-align:center;
  line-height: 30px;
  float:left;
}
.buttonGroup:nth-child(1){
  border-radius: 0!important;
}
.buttonGroup:nth-child(5){
  border-radius: 0!important;
}
.newDataTime{
  float:left;
  height:30px!important;
  border-radius: 0!important;
  margin-left:-1px;
  span.el-range-separator{
    line-height:24px;
    width:8%;
  }
  i.el-range__icon{
    line-height:24px;
  }
}
#myChart{
  width:100%;
  height:380px;
  margin:20px 0;
}
</style>