<template>
  <div>
    <div class="statistReportTit">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">统计报表</h3>
        <el-button class="ReportTitBtn" type="primary" @click="newBuy">新购</el-button>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="DDoS攻击防护" name="ddos">
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
                <el-tabs
                  class="tabsCard"
                  v-model="activeName1"
                  type="card"
                  @tab-click="handleClick1"
                >
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
          </el-tab-pane>
          <el-tab-pane label="CC攻击防护" name="cc">
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
          </el-tab-pane>
          <el-tab-pane label="业务" name="service">
            <div class="mainConList">
              <div class="mainConListAll mainConListOne">
                <!-- <el-date-picker
                  v-model="dateChoice3"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker><br/>
                <el-input v-model="inputIdService" @change="changeIdService" class="mainConListOneIpt" placeholder="请输入要查询的ID或名称"/>-->
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
                  <el-option :label="inputIdCC" :value="inputIdCC"></el-option>
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
      activeName: "ddos", //一级tab标识
      activeName1: "bps", //DDoS攻击防护-二级tab标识
      activeName2: "traffic", //业务-二级tab标识
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
      // 日期选择
      dateChoice1: {},
      dateChoice2: {},
      dateChoice3: {},
      // 根据Id查询
      resourceId: "",
      inputId: "net-0000006y",
      inputIdCC: "net-0000006y",
      inputIdService: "net-0000006y",
      metricName: "bps", //指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
      metricName2: "traffic", //指标，取值[traffic（攻击协议流量, 单位KB）, pkg（攻击协议报文数）, num（攻击事件次数）]
      metricNames: ["traffic", "pkg", "num"],
      metricNameCC: "inqps", //指标，取值[inqps(总请求峰值，dropqps(攻击请求峰值))]
      metricNameCCs: ["inqps", "dropqps"],
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
      period: 3600, //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      periodCC: 3600, //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      periodService: 300, //统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      statistics: "max", //统计方式，取值：max表示最大值；min表示最小值；avg表示均值；
      tableDataOfDescribeDDoSNetEvList: [], //DDoS攻击事件列表
      tableDataOfDescribeDDoSNetEvListcc: [], //Cc攻击防护列表
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 1, //当前页
      pageSize: 10, //每页长度
      totalItems: 0, //总条数
      filterTableDataEnd: [], //物理搜索
      flag: false,
      allData: [
        {
          attackTime: "1",
          durnTime: "2",
          attackType: "3",
          attackStatus: "4"
        }
      ],
      timeBtnSelect2: "总览", //ddos时间按钮下面第二个下拉
      ccTimeBtnSelect2: "177.52.89.23", //cc时间按钮下面第二个下拉
      ywTimeBtnSelect2: "177.52.89.23" //业务 时间按钮下面第二个下拉
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
      this.getData();
    },
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
    dateChoice3: function(value) {
      // console.log(this.getDateString(value[0]))
      this.startTimeService = this.getDateString(value[0]);
      this.endTimeService = this.getDateString(value[1]);
      this.getDataService();
    }
  },
  created() {
    this.describeResourceList(); //获取资源列表的接口单独调用（因为日期变更不需要调用此接口）
    this.getData();
  },
  mounted() {
    this.drawLine(); //图表展示
    this.drawLine2(); //图表展示
  },
  methods: {
    //echarts图表
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

    drawLine3() {
      // var arr = [];
      // for (let i in date) {
      //   arr.unshift(date[i]); //属性
      // }
      // arr.splice(arr.length - 1, 1);
      // 基于准备好的dom，初始化echarts实例
      let myChart3 = this.$echarts.init(document.getElementById("myChart3"));
      // 绘制图表
      myChart3.setOption({
        color: ["rgb(124, 181, 236)"],
        title: { text: "" },
        tooltip: {},
    //       legend: {
    //     data:['总请求峰值','攻击请求峰值']
    // },
        xAxis: {
          data: [1,2,3,4,5] //["12-05", "12-04", "12-03", "12-02", "12-01"]
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
            name: "总请求峰值",
            type: "line",
            data: [12,3,4,5,6,4],
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "rgb(124, 181, 236)"
                }
              }
            }
          },
           {
            name: "攻击请求峰值",
            type: "line",
            data: [1,35,9,1,1,4],
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
    },
    
    getData() {
      this.thisTime(1);
      for (let index in this.metricNames) {
        this.metricName2 = this.metricNames[index];
        this.describeDDoSNetCount();
      }
      this.describeDDoSNetEvList();
    },
    getDataCC() {
      for (let index in this.metricNameCCs) {
        this.metricNameCC = this.metricNameCCs[index];
        this.describeCCTrend();
      }
      this.describeCCEvList();
    },
    getDataService() {
      this.describleL4Rules();
      this.describeTransmitStatis();
      for (let index in this.metricNameService2s) {
        this.metricNameService2 = this.metricNameService2s[index];
        this.describeBaradData();
      }
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
      };
      this.$axios.post("dayu2/DescribeDDoSNetCount", params).then(res => {
        // console.log(res)
      });
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
    // DDOS资源Id变化时，重新获取数据
    changeId() {
      this.resourceId = this.inputId;
      this.describeResourceList();
      this.getData();
    },
    // 2.1.获取CC攻击指标数据
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
        if(MetricName =="inqps"){
          this.inqpsdata = res.Response.Data
        }else{
            this.dropqps = res.Response.Data
        }
        this.drawLine3()
      });
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
    // CC资源Id变化时，重新获取数据
    changeIdCC() {
      this.resourceId = this.inputIdCC;
      this.describeResourceList();
      this.getDataCC();
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
    // tab页面切换
    handleClick(tab, event) {
      this.describeResourceList(); //获取资源列表的接口单独调用（因为日期变更不需要调用此接口）
      if (tab.name == "ddos") {
        //DDOS攻击防护
        this.getData();
      } else if (tab.name == "cc") {
        //CC攻击防护
        this.getDataCC();
      } else if (tab.name == "service") {
        //业务
        this.getDataService();
      }
    },
    // DDOS攻击防护-二级tab切换
    handleClick1(value) {
      this.metricName = value.name;
      this.thisTime(1);
    },
    // 业务-二级tab切换
    handleClick2(value) {
      // console.log(value.name)
      this.metricNameService = value.name;
      this.describeTransmitStatis();
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
    newBuy() {
      this.$router.push({
        path: "/choose"
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
    }
  }
};
</script>
<style lang="scss">
.newClear {
  content: "";
  display: block;
  clear: both;
}
.statistReportTit {
  width: 100%;
  height: 84px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 12px 20px 0;
  .ReportTitH3 {
    float: left;
    font-size: 16px;
    font-weight: 600;
  }
  .ReportTitBtn {
    float: right;
    height: 30px;
    width: 52px;
    padding: 0;
    color: #fff;
    border-radius: 0;
    background-color: #006eff;
    line-height: 30px;
    padding: 0;
    text-align: center;
  }
}
.mainConList {
  padding: 20px;
  width: 100%;
  .mainConListAll {
    width: 100%;
    min-height: 100px;
    border: 1px solid #ddd;
    margin-bottom: 20px;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    .mainConListOneIpt {
      width: 200px;
      margin-top: 12px;
    }
    .tabsCard {
      border: none;
      .el-tabs__header {
        border: none;
        .el-tabs__nav {
          border-bottom: 1px solid #e4e7ed;
        }
        .el-tabs__item.is-active {
          color: #3e8ef7;
          border: 1px solid #3e8ef7;
        }
      }
    }
  }
  .mainConListFour {
    h3 {
      line-height: 52px;
      font-size: 14px;
      color: #000;
      font-weight: 600;
    }
  }
}
.tabListPage {
  text-align: right;
}
.ddosAttackSelect1 {
  width: 180px;
  margin-right: 12px;
  div.el-input {
    width: 180px;
    input {
      width: 180px;
      height: 30px;
      border-radius: 0;
      font-size: 12px;
    }
  }
}
.tabsCard {
  .el-tabs__item {
    height: 30px;
    line-height: 30px;
  }
}
#myChart2 {
  width: 100%;
  height: 380px;
  margin: 20px 0;
}
.colDivThree {
  padding: 20px;
  text-align: center;
  h1 {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  p.count {
    color: #888 !important;
    font-size: 12px;
  }
  .dataList {
    text-align: center;
    height: 100px;
    padding-top: 44px;
    color: #888 !important;
    font-size: 12px;
  }
}
#myChart3 {
  width: 100%;
  height: 380px;
  margin: 20px 0;
}
</style>