<template>
  <div>
    <div class="statistReportTit">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">统计报表</h3>
        <el-button class="ReportTitBtn" type="primary" @click="newBuy">新购</el-button>
        <!-- <el-button class="TestMethod" type="primary" @click="describeCCEvList()">Test接口</el-button> -->
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="DDoS攻击防护" name="ddos">
            <div class="mainConList">
              <div class="mainConListAll mainConListOne">
                <el-date-picker
                  v-model="dateChoice1"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker><br/>
                <el-input v-model="inputId" @change="changeId" class="mainConListOneIpt" placeholder="请输入要查询的ID或名称"/>
              </div>
              <div class="mainConListAll mainConListTwo">
                <el-tabs class="tabsCard" v-model="activeName1" type="card" @tab-click="handleClick1">
                  <el-tab-pane label="攻击流量宽带" name="bps">
                    <div>
                      攻击流量宽带
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="攻击包速率" name="pps">
                    <div>
                      攻击包速率
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div class="mainConListAll">

              </div>
              <div class="mainConListAll mainConListFour">
                <h3>DDoS攻击详情</h3>
                <el-table :data="tableDataOfDescribeDDoSNetEvList.slice((currentPage-1)*pageSize,currentPage*pageSize)">
                  <el-table-column prop="attackTime" label="攻击时间"></el-table-column>
                  <el-table-column prop="durnTime" label="持续时间"></el-table-column>
                  <el-table-column prop="attackType" label="攻击类型"></el-table-column>
                  <el-table-column prop="attackStatus" label="攻击状态"></el-table-column>
                  <el-table-column prop="attackAction" label="操作" width="180">
                    <template slot-scope="">
                      <el-button
                        type="text"
                        size="small"
                      >操作</el-button>
                      <!-- <el-dialog
                        :title="'您确定要删除'+scope.row.funName+'吗？'"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :before-close="handleClose"
                      >
                        <span>删除函数将永久删除函数代码及已绑定的触发器。是否确定删除此函数？</span>
                        <span slot="footer" class="dialog-footer">
                          <el-button @click="dialogVisible = false">取 消</el-button>
                          <el-button type="primary" @click="sureDelete()">确 定</el-button>
                        </span>
                      </el-dialog> -->
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
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="CC攻击防护" name="cc">
            <div class="mainConList">
              <div class="mainConListAll mainConListOne">
                <el-date-picker
                  v-model="dateChoice2"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker><br/>
                <el-input v-model="inputIdCC" @change="changeIdCC" class="mainConListOneIpt" placeholder="请输入要查询的ID或名称"/>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="业务" name="service">
            <div class="mainConList">
              <div class="mainConListAll mainConListOne">
                <el-date-picker
                  v-model="dateChoice3"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker><br/>
                <el-input v-model="inputIdService" @change="changeIdService" class="mainConListOneIpt" placeholder="请输入要查询的ID或名称"/>
              </div>
              <div class="mainConListAll mainConListTwo">
                <el-tabs class="tabsCard" v-model="activeName2" type="card" @tab-click="handleClick2">
                  <el-tab-pane label="攻击流量宽带" name="traffic">
                    <div>
                      攻击流量宽带
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="攻击包速率" name="pkg">
                    <div>
                      攻击包速率
                    </div>
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
export default {
  data() {
    return {
      activeName: 'ddos',//一级tab标识
      activeName1: 'bps',//DDoS攻击防护-二级tab标识
      activeName2: 'traffic',//业务-二级tab标识
      // 日期区间：默认获取当前时间和前一天时间
      endTime: this.getDateString(new Date()),
      startTime: this.getDateString(new Date(new Date().getTime() - 24*60*60*1000)),
      endTimeCC: this.getDateString(new Date()),
      startTimeCC: this.getDateString(new Date(new Date().getTime() - 24*60*60*1000)),
      endTimeService: this.getDateString(new Date()),
      startTimeService: this.getDateString(new Date(new Date().getTime() - 24*60*60*1000)),
      // 日期选择
      dateChoice1: {},
      dateChoice2: {},
      dateChoice3: {},
      // 根据Id查询
      resourceId: '',
      inputId: 'net-0000006y',
      inputIdCC: 'net-0000006y',
      inputIdService: 'net-0000006y',
      metricName: 'bps',//指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
      metricName2: 'traffic',//指标，取值[traffic（攻击协议流量, 单位KB）, pkg（攻击协议报文数）, num（攻击事件次数）]
      metricNames: ['traffic', 'pkg', 'num'],
      metricNameCC: 'inqps',//指标，取值[inqps(总请求峰值，dropqps(攻击请求峰值))]
      metricNameCCs: ['inqps', 'dropqps'],
      metricNameService: 'traffic',//指标名，取值：traffic表示流量带宽，pkg表示包速率
      metricNameServices: ['traffic', 'pkg'],
      metricNameService2: 'connum',//指标名，取值：（通过腾讯云获取的值connum/inactive_conn），以下为API给出
        //connum表示总TCP连接数（新建TCP连接数与活跃TCP连接数的和）；
        // new_conn表示新建TCP连接数；
        // intraffic表示入流量；
        // outtraffic表示出流量；
        // alltraffic表示出流量和入流量之和；
        // inpkg表示入包速率；
        // outpkg表示出包速率；
      metricNameService2s: ['connum', 'inactive_conn'],
      period: 300,//统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      periodCC: 300,//统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      periodService: 300,//统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      statistics: 'max',//统计方式，取值：max表示最大值；min表示最小值；avg表示均值；
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        },{
          text: '近7天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近15天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近30天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近半年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      tableDataOfDescribeDDoSNetEvList: [], //DDoS攻击事件列表
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      allData:[
        {
          attackTime:"1",
          durnTime:"2",
          attackType:"3",
          attackStatus:"4"
        }
      ]
    }
  },
  watch: {
    'dateChoice1': function (value) {
      console.log(this.getDateString(value[0]))
      this.startTime = this.getDateString(value[0])
      this.endTime = this.getDateString(value[1])
      this.getData()
    },
    'dateChoice2': function (value) {
      console.log(this.getDateString(value[0]))
      this.startTimeCC = this.getDateString(value[0])
      this.endTimeCC = this.getDateString(value[1])
      this.getDataCC()
    },
    'dateChoice3': function (value) {
      console.log(this.getDateString(value[0]))
      this.startTimeService = this.getDateString(value[0])
      this.endTimeService = this.getDateString(value[1])
      this.getDataService()
    }
  },
  created() {
    this.describeResourceList() //获取资源列表的接口单独调用（因为日期变更不需要调用此接口）
    this.getData()
  },
  methods:{
    getData() {
      this.describeDDoSNetTrend()
      for(let index in this.metricNames){
        this.metricName2 = this.metricNames[index]
        this.describeDDoSNetCount()
      }
      this.describeDDoSNetEvList()
    },
    getDataCC(){
      for(let index in this.metricNameCCs){
        this.metricNameCC = this.metricNameCCs[index]
        this.describeCCTrend()
      }
      this.describeCCEvList()
    },
    getDataService() {
      this.describleL4Rules()
      this.describeTransmitStatis()
      for(let index in this.metricNameService2s){
        this.metricNameService2 = this.metricNameService2s[index]
        this.describeBaradData()
      }
    },
    // 获取资源列表
    describeResourceList() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
      }
      if(this.resourceId != '' && this.resourceId != null) {
        params['IdList.0'] = this.resourceId
      }
      this.$axios.post('dayu2/DescribeResourceList', params).then(res => {
        console.log(res)
      })
    },
    // 1.1.获取高防IP专业版资源的DDoS攻击指标数据
    describeDDoSNetTrend() {
      let params = {
        Version: '2018-07-09',
        // Region: '',
        Business: 'net',
        Id: this.inputId,
        MetricName: this.metricName,//指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
        Period: this.period,//统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        StartTime: this.startTime,
        EndTime: this.endTime,
      }
      this.$axios.post('dayu2/DescribeDDoSNetTrend', params).then(res => {
        console.log(res)
      })
    },
    // 1.2.获取高防IP专业版资源的DDoS攻击占比分析
    describeDDoSNetCount() {
      let params = {
        Version: '2018-07-09',
        // Region: '',
        Business: 'net',
        Id: this.inputId,
        StartTime: this.startTime,
        EndTime: this.endTime,
        MetricName: this.metricName2,//指标，取值[traffic（攻击协议流量, 单位KB）, pkg（攻击协议报文数）, num（攻击事件次数）]
      }
      this.$axios.post('dayu2/DescribeDDoSNetCount', params).then(res => {
        console.log(res)
      })
    },
    // 1.3.获取高防IP专业版资源的DDoS攻击事件列表
    describeDDoSNetEvList() {
      let params = {
        Version: '2018-07-09',
        // Region: '',
        Business: 'net',
        Id: this.inputId,
        StartTime: this.startTime,
        EndTime: this.endTime,
        //Limit: '',  //一页条数，填0表示不分页
        //Offset: ''  //页起始偏移，取值为(页码-1)*一页条数
      }
      this.$axios.post('dayu2/DescribeDDoSNetEvList', params).then(res => {
        console.log(res)
        this.tableDataOfDescribeDDoSNetEvList = res.Response.Data
      })
    },
    // DDOS资源Id变化时，重新获取数据
    changeId() {
      this.resourceId = this.inputId
      this.describeResourceList()
      this.getData()
    },
    // 2.1.获取CC攻击指标数据
    describeCCTrend() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        Id: this.inputIdCC,
        Ip: '175.97.142.150',//资源的IP
        MetricName: this.metricNameCC,//指标，取值[inqps(总请求峰值，dropqps(攻击请求峰值))]
        Period: this.periodCC,//统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        StartTime: this.startTimeCC,
        EndTime: this.endTimeCC,
      }
      this.$axios.post('dayu2/DescribeCCTrend', params).then(res => {
        console.log(res)
      })
    },
    // 2.2.获取 CC 攻击事件列表
    describeCCEvList() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        StartTime: this.startTimeCC,
        EndTime: this.endTimeCC,
        Id: this.inputIdCC,
      }
      this.$axios.post('dayu2/DescribeCCEvList', params).then(res => {
        console.log(res)
      })
    },
    // CC资源Id变化时，重新获取数据
    changeIdCC() {
      this.resourceId = this.inputIdCC
      this.describeResourceList()
      this.getDataCC()
    },
    // 3.1.获取L4转发规则
    describleL4Rules() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        Id: this.inputIdService,
      }
      this.$axios.post('dayu2/DescribleL4Rules', params).then(res => {
        console.log(res)
      })
    },
    // 3.2.获取业务转发统计数据
    describeTransmitStatis() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        Id: this.inputIdService,
        MetricName: this.metricNameService,//指标名，取值：traffic表示流量带宽，pkg表示包速率
        Period: this.periodService,//统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        StartTime: this.startTimeService,
        EndTime: this.endTimeService,
      }
      this.$axios.post('dayu2/DescribeTransmitStatis', params).then(res => {
        console.log(res)
      })
    },
    // 3.3.获取转发报表数据
    describeBaradData() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        Id: this.inputIdService,
        Ip: '175.97.142.150',//资源的IP
        MetricName: this.metricNameService2,
        Period: this.periodService,//统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        StartTime: this.startTimeService,
        EndTime: this.endTimeService,
        Statistics: this.statistics,//统计方式，取值：max表示最大值；min表示最小值；avg表示均值；
      }
      this.$axios.post('dayu2/DescribeBaradData', params).then(res => {
        console.log(res)
      })
    },
    // 业务资源id变化时，重新获取数据
    changeIdService() {
      this.resourceId = this.inputIdService
      this.describeResourceList()
      this.getDataService()
    },
    // tab页面切换
    handleClick(tab, event) {
      this.describeResourceList() //获取资源列表的接口单独调用（因为日期变更不需要调用此接口）
      if(tab.name == 'ddos') { //DDOS攻击防护
        this.getData()
      } else if(tab.name == 'cc') { //CC攻击防护
        this.getDataCC()
      } else if(tab.name == 'service') {  //业务
        this.getDataService()
      }
    },
    // DDOS攻击防护-二级tab切换
    handleClick1(value){
      console.log(value.name)
      this.metricName = value.name
      this.describeDDoSNetTrend()
    },
    // 业务-二级tab切换
    handleClick2(value){
      console.log(value.name)
      this.metricNameService = value.name
      this.describeTransmitStatis()
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
    // 时间格式化'yyyy-MM-dd hh:mm:ss'
    getDateString(date) {
      return date.toLocaleString('zh',{hour12:false, year: 'numeric',  month: '2-digit',  day: '2-digit',  hour: '2-digit',  minute: '2-digit',  second: '2-digit'}).replace(/\//g,'-');
    },
    newBuy(){
      this.$router.push({
        path: '/choose'
      })
    },
  }
}

</script>
<style lang="scss">
.newClear{
  content:"";
  display: block;
  clear:both;
}
.statistReportTit{
  width:100%;
  height:84px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
  padding:12px 20px 0;
  .ReportTitH3{
    float:left;
    font-size:16px;
    font-weight:600;
  }
  .ReportTitBtn{
    float:right;
    height:30px;
    width:52px;
    padding:0;
    color:#fff;
    border-radius: 0;
    background-color:#006eff;
    line-height: 30px;
    padding:0;
    text-align:center;
  }
}
.mainConList{
  padding:20px;
  width:100%;
  .mainConListAll{
    width:100%;
    min-height:100px;
    border:1px solid #ddd;
    margin-bottom:20px;
    background-color:#fff;
    padding:20px;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    .mainConListOneIpt{
      width:200px;
      margin-top:12px;
    }
    .tabsCard{
      border:none;
      .el-tabs__header{
        border:none;
        .el-tabs__nav{
          border-bottom:1px solid #e4e7ed;
        }
        .el-tabs__item.is-active{
          color: #3E8EF7;
          border: 1px solid #3E8EF7;
        }
      }
    }
  }
  .mainConListFour{
    h3{
      line-height:52px;
      font-size:14px;
      color:#888;
      font-weight:600;
    }
  }
}
.tabListPage{
  text-align:right;
}
</style>