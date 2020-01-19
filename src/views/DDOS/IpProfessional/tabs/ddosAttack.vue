<template>
  <div class="child">
    <div class="mainConList" v-loading="loading">
      <div
        class="mainConListAll mainConListOne newClear"
        style="display: flex;flex-direction: column;"
      >
        <div class="newClear">
          <el-button-group class="buttonGroupAll">
            <el-button
              class="buttonGroup"
              @click="thisTime(1)"
            >{{$t('DDOS.Statistical_forms.Today')}}</el-button>
            <el-button
              class="buttonGroup"
              @click="thisTime(2)"
            >{{$t('DDOS.Statistical_forms.Nearly_sedays')}}</el-button>
            <el-button class="buttonGroup" @click="thisTime(3)">近15天</el-button>
            <el-button class="buttonGroup" @click="thisTime(4)">近30天</el-button>
            <el-button class="buttonGroup" @click="thisTime(5)">近半年</el-button>
          </el-button-group>
          <el-date-picker
            v-model="dateChoice1"
            type="daterange"
            class="newDataTime"
            range-separator="至"
            :start-placeholder="$t('DDOS.UnsealCode.beginDate')"
            :end-placeholder="$t('DDOS.UnsealCode.overDate')"
          ></el-date-picker>
        </div>
        <div style="margin-top:12px;">
          <el-select
            class="ddosAttackSelect1"
            v-model="inputId"
            @change="changeId"
            filterable
            :placeholder="$t('DDOS.AccesstoCon.searchAccess')"
            style="margin-right:10px;"
          >
            <el-option :label="inputId" :value="inputId"></el-option>
          </el-select>
          <el-select class="ddosAttackSelect1" v-model="timeBtnSelect2">
            <el-option v-for="(item,index) in IpList" :value="item" :key="index"></el-option>
          </el-select>
        </div>
      </div>
      <div class="mainConListAll mainConListTwo">
        <el-tabs class="tabsCard" v-model="activeName1" type="card" @tab-click="handleClick1">
          <el-tab-pane :label="$t('DDOS.Statistical_forms.Overview_broadband')" name="bps">
            <div id="myChart"></div>
          </el-tab-pane>
          <el-tab-pane :label="$t('DDOS.Statistical_forms.Attack_rate')" name="pps">
            <div id="myChart2"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="mainConListAll">
        <div>
          <el-row>
            <el-col :span="8">
              <div class="colDivThree">
                <h1>{{$t('DDOS.Statistical_forms.Attack_distribution')}}</h1>
                <p class="count">({{$t('DDOS.Statistical_forms.SettingB')}})</p>
                <div class="dataList">{{$t('DDOS.Statistical_forms.Nodate')}}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="colDivThree">
                <h1>{{$t('DDOS.Statistical_forms.Attack_pp_distribution')}}</h1>
                <p class="count">({{$t('DDOS.Statistical_forms.Unit_packe')}})</p>
                <div class="dataList">{{$t('DDOS.Statistical_forms.Nodate')}}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="colDivThree">
                <h1>{{$t('DDOS.Statistical_forms.Attack_typedistribution')}}</h1>
                <p class="count">({{$t('DDOS.Statistical_forms.Unit_Times')}})</p>
                <div class="dataList">{{$t('DDOS.Statistical_forms.Nodate')}}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="mainConListAll mainConListFour">
        <h3>{{$t('DDOS.Statistical_forms.DDoS_details')}}</h3>
        <div class="ddosTableMin">
          <el-table
            height="450"
            :data="tableDataOfDescribeDDoSNetEvList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            empty-text='暫無數據'
          >
            <el-table-column prop="attackTime" :label="$t('DDOS.Statistical_forms.Attack_time')"></el-table-column>
            <el-table-column prop="durnTime" :label="$t('DDOS.Statistical_forms.Duration')"></el-table-column>
            <el-table-column prop="attackType" :label="$t('DDOS.Statistical_forms.Type_ofattack')"></el-table-column>
            <el-table-column prop="attackStatus" :label="$t('DDOS.Statistical_forms.Attack_state')"></el-table-column>
            <el-table-column prop="attackAction" label="操作" width="180">
              <template slot-scope>
                <el-button type="text" size="small">操作</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="Right-style pagstyle">
          <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;{{$t('DDOS.UnsealCode.tiao')}}</span>
          <el-pagination
            :page-size="pageSize"
            :pager-count="7"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  GET_ID,
  DDOS_EVENT,
  DDOS_ATTACK,
  DDOS_DATA,
} from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import moment from "moment";
export default {
  data() {
    return {
      loading: true,
      // 日期选择
      dateChoice1: {}, //选择日期
      IpList: "",
      inputId: "", //下拉框ID
      timeBtnSelect2: "總覽", //ddos时间按钮下面第二个下拉
      activeName1: "bps", //DDoS攻击防护-二级tab标识
      tableDataOfDescribeDDoSNetEvList: [], //DDoS攻击事件列表
      currentPage: 1, //当前页
      pageSize: 10, //每页长度
      totalItems: 0, //总条数
      resourceId: "", // 根据Id查询
      metricName: "bps", //指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
      // 日期区间：默认获取当前时间和前一天时间
      metricNames: ["traffic", "pkg", "num"], //指标，取值[traffic（攻击协议流量, 单位KB）, pkg（攻击协议报文数）, num（攻击事件次数）]
      endTime: this.getDateString(new Date()),
      startTime: this.getDateString(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      ),
      tableDataEnd: [],
      period: 3600 //统计粒度，取值[300(5分鐘)，3600(小时)，86400(天)]
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
      this.startTime = moment(value[0]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      this.endTime = moment(value[1]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      this.describeDDoSNetTrend(this.timey);
      this.describeDDoSNetEvList();
      for (let index in this.metricNames) {
        this.metricName2 = this.metricNames[index];
        this.describeDDoSNetCount();
      }
    }
  },

  //初始化生命周期
  created() {
    this.getData();
    this.GetID();
  },

  methods: {
    //获取资源的IP列表
    GetID() {
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      this.axios.post(GET_ID, params).then(res => {
        if (res.Response.Error === undefined) {
					let IpList = res.Response.Resource;
          for (let i = 0; i < IpList.length; i++) {
            this.inputId = IpList[i].Id;
            this.IpList = IpList[i].IpList;
          }
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
    // DDOS资源Id变化时，重新获取数据
    changeId() {
      this.resourceId = this.inputId;
      this.getData();
    },
    getData() {
      this.thisTime(1);
    },
    // 1.3.获取高防IP专业版资源的DDoS攻击事件列表
    describeDDoSNetEvList() {
      this.loading = true;
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.inputId,
        StartTime: this.startTime,
        EndTime: this.endTime
        //Limit: '',  //一页条数，填0表示不分页
        //Offset: ''  //页起始偏移，取值为(页码-1)*一页条数
      };
      this.axios.post(DDOS_EVENT, params).then(res => {
        if (res.Response.Error === undefined) {
					this.tableDataOfDescribeDDoSNetEvList = res.Response.Data;
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
        this.loading = false;
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
        MetricName: this.metricName2 //指标，取值[traffic（攻击协议流量, 单位KB）, pkg（攻击协议报文数）, num（攻击事件次数）]
        // metricName2: "traffic",
      };
      this.axios.post(DDOS_ATTACK, params).then(res => {
        if (res.Response.Error === undefined) {
					if (this.metricName2 == "traffic") {
            this.traffictable = res.data;
          } else if (this.metricName2 == "pkg") {
            this.pkgtable = res.data;
          } else if (this.metricName2 == "num") {
            this.numtable = res.data;
          }
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
    // 1.1.获取高防IP专业版资源的DDoS攻击指标数据
    describeDDoSNetTrend(date) {
      let params = {
        Version: "2018-07-09",
        // Region: '',
        Business: "net",
        Id: this.inputId,
        MetricName: this.metricName, //指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
        Period: this.period, //统计粒度，取值[300(5分鐘)，3600(小时)，86400(天)]
        StartTime: this.startTime,
        EndTime: this.endTime
      };
      this.axios.post(DDOS_DATA, params).then(res => {
        if (res.Response.Error === undefined) {
					if (this.metricName == "bps") {
            this.drawLine(res.Response.Data, date);
          } else {
            this.drawLine2(res.Response.Data, date);
          }
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
        this.startTime = moment(new Date(end.getTime() - 86400000)).format(
          "YYYY-MM-DD HH:mm:ss"
        );
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
      this.describeDDoSNetTrend(this.timey);
      for (let index in this.metricNames) {
        this.metricName2 = this.metricNames[index];
        this.describeDDoSNetCount();
      }
      this.describeDDoSNetEvList();
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
    drawLine(y, date) {
      var arr = [];
      for (let i in date) {
        arr.unshift(date[i]); //属性
      }
      arr.splice(arr.length - 1, 1);
      // 基于准备好的dom，初始化echarts实例
      // console.log(arr)
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
            name: "攻擊流量寬頻",
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
      // console.log(arr)
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
            name: "總攻擊流量",
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
    }
  }
};
</script>
<style lang="scss" scoped>
.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.child >>> .el-tabs__nav-wrap {
  padding: 0 !important;
}
.child >>> .el-tabs__item,
.child >>> .is-active {
  border-bottom: 1px #f2f2f2 solid !important;
  border-radius: 0 !important;
}
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
::v-deep .el-range__icon {
  line-height: 26px;
}
::v-deep .el-range-separator {
  line-height: 26px;
  width: 7%;
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
.ddosTableMin {
  min-height: 450px;
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
.newDataTime {
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
.colDivThree {
  h1 {
    font-size: 16px;
  }
  h1,
  p,
  div {
    text-align: center;
    line-height: 40px;
  }
}
.ddosAttackSelect1 {
  width: 180px;
  margin-right: 12px;
  height: 30px;
  ::v-deep div.el-input {
    width: 180px;
    height: 30px;
    ::v-deep .el-input__inner {
      width: 180px;
      height: 30px;
      line-height: 30px;
      border-radius: 0;
      font-size: 12px;
    }
  }
}
::v-deep .el-input__inner {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
}
.tabListPage {
  height: 50px;
  text-align: right;
  border-top: 1px solid #ddd;
  padding-top: 8px;
}
</style>