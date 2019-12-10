<template>
  <div>
    <div class="mainConList">
      <div class="mainConListAll mainConListOne newClear">
        <div class="newClear">
          <el-button-group class="buttonGroupAll">
            <el-button class="buttonGroup" @click="thisTime(1)">今天</el-button>
            <el-button class="buttonGroup" @click="thisTime(2)">近7天</el-button>
            <el-button class="buttonGroup" @click="thisTime(3)">近15天</el-button>
            <el-button class="buttonGroup" @click="thisTime(4)">近30天</el-button>
            <el-button class="buttonGroup" @click="thisTime(5)">近半年</el-button>
          </el-button-group>
          <el-date-picker
            v-model="dateChoice1"
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
          v-model="inputId"
          @change="changeId"
          filterable
          placeholder="请输入要查询的ID或名称"
        >
          <el-option :label="inputId" :value="inputId"></el-option>
        </el-select>
        <el-select class="ddosAttackSelect1" v-model="timeBtnSelect2">
          <el-option :label="timeBtnSelect2" :value="timeBtnSelect2"></el-option>
        </el-select>
      </div>
      <div class="mainConListAll mainConListTwo">
        <el-tabs class="tabsCard" v-model="activeName1" type="card" @tab-click="handleClick1">
          <el-tab-pane label="攻击流量宽带" name="bps">
            <div id="myChart"></div>
          </el-tab-pane>
          <el-tab-pane label="攻击包速率" name="pps">
            <div id="myChart2"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="mainConListAll">
        <div>
          <el-row>
            <el-col :span="8">
              <div class="colDivThree">
                <h1>攻击流量协议分布</h1>
                <p class="count">(单位：B)</p>
                <div class="dataList">暂无数据</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="colDivThree">
                <h1>攻击包协议分布</h1>
                <p class="count">(单位：packet)</p>
                <div class="dataList">暂无数据</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="colDivThree">
                <h1>攻击类型分布</h1>
                <p class="count">(单位：次)</p>
                <div class="dataList">暂无数据</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="mainConListAll mainConListFour">
        <h3>DDoS攻击详情</h3>
        <div class="ddosTableMin">
          <el-table
          :data="tableDataOfDescribeDDoSNetEvList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        >
          <el-table-column prop="attackTime" label="攻击时间"></el-table-column>
          <el-table-column prop="durnTime" label="持续时间"></el-table-column>
          <el-table-column prop="attackType" label="攻击类型"></el-table-column>
          <el-table-column prop="attackStatus" label="攻击状态"></el-table-column>
          <el-table-column prop="attackAction" label="操作" width="180">
            <template slot-scope>
              <el-button type="text" size="small">操作</el-button>
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
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      // 日期选择
      dateChoice1: {}, //选择日期
      inputId: "net-0000006y", //下拉框ID
      timeBtnSelect2: "总览", //ddos时间按钮下面第二个下拉
      activeName1: "bps", //DDoS攻击防护-二级tab标识
      tableDataOfDescribeDDoSNetEvList: [], //DDoS攻击事件列表
      currentPage: 1, //当前页
      pageSize: 10, //每页长度
      totalItems: 0, //总条数
      resourceId: "", // 根据Id查询
      metricName: "bps", //指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
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
      period: 3600 //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
    };
  },
  watch: {
    dateChoice1: function(value) {
      this.period = 86400;
      var num = value[1].getTime() - value[0].getTime(); //计算时间戳的差
      var arr = [];
      for (var i = 0; i <= num / 86400000; i++) {
        //根据时间戳的差以及时间粒度计算出开始时间与结束时间之间有多少天/小时
        var d = new Date(value[1].getTime() - 86400000 * i);
        arr.push(moment(d).format("MM-DD"));
      }
      this.timey = arr;
      
      // this.startTime = this.getDateString(value[0]);
      // this.endTime = this.getDateString(value[1]);
      this.startTime = moment(value[0]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      this.endTime = moment(value[1]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      this.describeDDoSNetTrend(this.timey)
    }
  },


  //初始化生命周期
  created() {
    this.describeResourceList(); //获取资源列表的接口单独调用（因为日期变更不需要调用此接口）
    this.getData();
  },




  
  methods: {
    // DDOS资源Id变化时，重新获取数据
    changeId() {
      this.resourceId = this.inputId;
      this.describeResourceList();
      this.getData();
    },
    getData() {
      this.thisTime(1);
      for (let index in this.metricNames) {
        this.metricName2 = this.metricNames[index];
        this.describeDDoSNetCount();
      }
      this.describeDDoSNetEvList();
    },
    // 1.3.获取高防IP专业版资源的DDoS攻击事件列表
    describeDDoSNetEvList() {
      let params = {
        Version: "2018-07-09",
        // Region: '',
        Business: "net",
        Id: this.inputId,
        StartTime: this.startTime,
        EndTime: this.endTime
        //Limit: '',  //一页条数，填0表示不分页
        //Offset: ''  //页起始偏移，取值为(页码-1)*一页条数
      };
      this.axios.post("dayu2/DescribeDDoSNetEvList", params).then(res => {
        // console.log(res)
        this.tableDataOfDescribeDDoSNetEvList = res.Response.Data;
      });
    },
    // 1.2.获取高防IP专业版资源的DDoS攻击占比分析
    describeDDoSNetCount() {
      let params = {
        Version: "2018-07-09",
        // Region: '',
        Business: "net",
        Id: this.inputId,
        StartTime: this.startTime,
        EndTime: this.endTime,
        MetricName: this.metricName2, //指标，取值[traffic（攻击协议流量, 单位KB）, pkg（攻击协议报文数）, num（攻击事件次数）]
        metricName2: "traffic", //指标，取值[traffic（攻击协议流量, 单位KB）, pkg（攻击协议报文数）, num（攻击事件次数）]
        metricNames: ["traffic", "pkg", "num"]
      };
      this.$axios.post("dayu2/DescribeDDoSNetCount", params).then(res => {
        // console.log(res)
      });
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
    // DDOS攻击防护-二级tab切换
    handleClick1(value) {
      this.metricName = value.name;
      this.thisTime(1);
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

        var arr = [];
        for (var i = 0; i <= 86400000 / 3600000; i++) {
          var d = new Date(end.getTime() - 3600000 * i);
          arr.push(moment(d).format("MM-DD HH:mm:ss"));
        }
         this.startTime = moment(new Date(end.getTime()-86400000)).format("YYYY-MM-DD HH:mm:ss");
         this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
         this.period = 3600;
        this.timey = arr;
      } else if (thisTime == "2") {
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        ipt1.value = moment(start).format("YYYY-MM-DD");
        ipt2.value = moment(end).format("YYYY-MM-DD");
        this.startTime = moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.period = 86400;
        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "3") {
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
        ipt1.value = moment(start).format("YYYY-MM-DD");
        ipt2.value = moment(end).format("YYYY-MM-DD");
        this.startTime = moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.period = 86400;
        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "4") {
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        ipt1.value = moment(start).format("YYYY-MM-DD");
        ipt2.value = moment(end).format("YYYY-MM-DD");
        this.startTime = moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
        this.period = 86400;
        this.timedone(end, start, 86400000);
        //ddos攻击-攻击流量带宽
      } else if (thisTime == "5") {
        //ddos攻击-攻击流量带宽
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
        ipt1.value = moment(start).format("YYYY-MM-DD");
        ipt2.value = moment(end).format("YYYY-MM-DD");
       this.startTime = moment(start).format("YYYY-MM-DD HH:mm:ss");
        this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
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
    drawLine(y, date) {
      var arr = [];
      for (let i in date) {
        arr.unshift(date[i]); //属性
      }
      arr.splice(arr.length - 1, 1);
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        color: ["rgb(124, 181, 236)"],
        title: { text: "" },
        tooltip: {},
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
            name: "攻击流量宽带",
            type: "line",
            data: y,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "rgb(124, 181, 236)"
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
    },
    drawLine2(y, date) {
      // 基于准备好的dom，初始化echarts实例
       var arr = [];
      for (let i in date) {
        arr.unshift(date[i]); //属性
      }
      arr.splice(arr.length - 1, 1);
          console.log(arr)
      let myChart2 = this.$echarts.init(document.getElementById("myChart2"));
      // 绘制图表
      myChart2.setOption({
        color: ["rgb(124, 181, 236)"],
        title: { text: "" },
        tooltip: {},
        xAxis: {
          data: arr
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
            name: "总攻击流量",
            type: "line",
            data: y,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "rgb(124, 181, 236)"
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
      myChart2.resize();
      window.addEventListener("resize", function() {
        myChart2.resize();
      });
    },
  }
};
</script>
<style lang="scss">
.ddosTableMin{
  min-height:450px;
}
</style>