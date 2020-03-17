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
              v-for="(item, index) in btnData"
              :key="index"
              :type="item.selected ? 'primary' : ''"
              class="buttonGroup"
              @click="choiceTime(index + 1)"
            >{{$t('DDOS.Statistical_forms.' + item.title)}}</el-button>
          </el-button-group>
          <el-date-picker
            v-model="dateChoice"
            type="daterange"
            class="newDataTime"
            range-separator="至"
            :start-placeholder="$t('DDOS.UnsealCode.beginDate')"
            :end-placeholder="$t('DDOS.UnsealCode.overDate')"
            :picker-options="pickerOptions"
            :default-time="defTime"
          ></el-date-picker>
        </div>
        <div style="margin-top:12px;">
          <el-select
            class="ddosAttackSelect1"
            v-model="selectId"
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
          <el-select class="ddosAttackSelect1" v-model="selectIp">
            <el-option v-for="(item, index) in IpList" :label="item" :value="item" :key="index"></el-option>
          </el-select>
        </div>
      </div>
      <!-- <template  v-if="ResIpList.length > 0"> -->
      <div class="mainConListAll mainConListTwo">
        <el-tabs class="tabsCard" v-model="activeName" type="card" @tab-click="handleClick1">
          <el-tab-pane :label="$t('DDOS.Statistical_forms.Overview_broadband')" name="bps">
            <div id="chart-bps"></div>
          </el-tab-pane>
          <el-tab-pane :label="$t('DDOS.Statistical_forms.Attack_rate')" name="pps">
            <div id="chart-pps"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="mainConListAll mainConListFour">
        <h3>{{$t('DDOS.Statistical_forms.DDoS_details')}}</h3>
        <div class="ddosTableMin">
          <el-table
            height="450"
            :data="tableDataOfDescribeDDoSNetEvList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            empty-text="暫無數據"
            ref="ddosTable"
          >
            <el-table-column prop="StartTime" :label="$t('DDOS.Statistical_forms.Attack_time')"></el-table-column>
            <el-table-column prop="durnTime" :label="$t('DDOS.Statistical_forms.Duration')">
              <template slot-scope="scope">{{durationDate(scope.row.EndTime,scope.row.StartTime)}}</template>
            </el-table-column>
            <el-table-column prop="AttackType" :label="$t('DDOS.Statistical_forms.Type_ofattack')"></el-table-column>
            <el-table-column prop="AttackStatus" :label="$t('DDOS.Statistical_forms.Attack_state')">
              <template slot-scope="scope">
                <div v-if="scope.row.AttackStatus == '0'">{{ $t("DDOS.basicProtection.gongjiz") }}</div>
                <div v-else-if="scope.row.AttackStatus == '1'">{{ $t("DDOS.basicProtection.gjjs") }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="attackAction" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="describeDDoS(false, true)">攻擊包下載</el-button>
                <el-button type="text" size="small" @click="describeDDoS(scope.row, true)">攻擊詳情</el-button>
                <el-button type="text" size="small" @click="describeDDoS(scope.row, false)">攻擊日誌</el-button>
                <el-button v-if="selectIp !== '總覽'" type="text" size="small" @click="toDDOSAttackSource(scope.row)">攻擊源信息</el-button>
              </template>
            </el-table-column>
            <el-table-column type="expand" width="1px">
              <template slot-scope>
                <div v-if="InfoOrLog == true">
                  <tr>
                    <td style="width: 400px;">{{ $t("DDOS.Statistical_forms.Attack_rate_Max") }}</td>
                    <td style="width: 400px;">{{ $t("DDOS.Statistical_forms.Attack_Mbps") }}</td>
                    <td style="width: 400px;">{{ $t("DDOS.Statistical_forms.Attack_tt") }}</td>
                  </tr>
                  <tr>
                    <td style="width: 400px;">{{ Pps }}pps</td>
                    <td style="width: 400px;">{{ Math.round(Mbps / 1000 * 100) / 100 }}Gbps</td>
                    <td style="width: 400px;">{{ Math.round(TotalTraffic / 1000 * 10) / 10 }}MB</td>
                  </tr>
                </div>
                <div v-if="InfoOrLog == false">
                  <div v-for="(item, index) in DDoSIpLogData" :key="index">
                    <div v-for="(item2, index2) in item.Record" :key="index2+'i'" style="float: left;">
                      <span v-if="item2.Key == 'LogTime'">{{ item2.Value }}</span>
                    </div>
                    <div v-for="(item3, index3) in item.Record" :key="index3+'j'">
                      <span v-if="item3.Key == 'LogMessage'">{{ "&nbsp;&nbsp;" + item3.Value }}</span>
                    </div>
                  </div>
                </div>
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
      <!-- </template> -->
    </div>
  </div>
</template>
<script>
import {
  GET_ID,
  DDOS_EV_LIST,
  DDOS_EVENT,
  DDOS_ATTACK,
  DDOS_DATA,
  DDOS_TREND,
  DESCRIBE_DDOSNETEVINFO,
  DESCRIBE_DDOSIPLOG,
  DESCRIBE_DDOSNETIPLOG,
  DESCRIBE_DDOSATTACKSOURCE
} from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import moment from "moment";
export default {
  data() {
    let that = this
    return {
      loading: true,
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
      dateChoice: [], //选择日期
      ResIpList: [], //下拉框数据
      IpList: [], //下拉框IP数据
      selectId: "", //下拉框ID
      selectIp: "總覽", //下拉框IP
      activeName: "bps", //DDoS攻击防护-二级tab标识
      tableDataOfDescribeDDoSNetEvList: [], //DDoS攻击事件列表
      Mbps: "", //攻击最大带宽
      Pps: "", //攻击最大包速率
      TotalTraffic: "", //累计清洗流量值
      DDoSIpLogData: [], //DDOS攻击日志
      InfoOrLog: true, //攻击详情 或 攻击日志
      currentPage: 1, //当前页
      pageSize: 10, //每页长度
      totalItems: 0, //总条数
      metricName: "bps", //指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
      // 日期区间：默认获取当前时间和前一天时间
      metricNames: ["traffic", "pkg", "num"], //指标，取值[traffic（攻击协议流量, 单位KB）, pkg（攻击协议报文数）, num（攻击事件次数）]
      endTime: this.getDateString(new Date()),
      startTime: this.getDateString(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      ),
      timey: [],
      tableDataEnd: [],
      period: 3600, //统计粒度，取值[300(5分鐘)，3600(1小时)，86400(1天)]
      ipPro:{},//防护概览过来数据
      traffictable:[],
      pkgtable:[],
      numtable:[],
      choiceClick:false,
      // 一次最大只能查询30天，通过选择日期，可查询最大时间范围到半年，但是一次也只能查询30天
      chclikMinDate: '',
      chclikMaxDate: '',
      defTime: ['00:00:00', '23:59:59'],
      pickerOptions: { // 时间选择控件限制选择范围
        disabledDate (date) {
          let nowDate = moment(Date.now()).hour(23).minute(59).second(59).toDate().getTime()
          let Date6Moths = moment(Date.now()).subtract(181, 'days').toDate().getTime()
          if (that.chclikMinDate === '') {
            return date.getTime() < Date6Moths || date.getTime() > nowDate
          } else {
            if (that.chclikMaxDate === '') {
              let maxDate = moment(that.chclikMinDate).add(30, 'days').toDate().getTime()
              let minDate = moment(that.chclikMinDate).subtract(30, 'days').toDate().getTime()
              minDate = minDate < Date6Moths ? Date6Moths : minDate
              maxDate = maxDate > nowDate ? nowDate : maxDate
              return date.getTime() > maxDate || date.getTime() < minDate || date.getTime() > nowDate || date.getTime() < Date6Moths
            } else {
              return date.getTime() < Date6Moths || date.getTime() > nowDate
            }
          }
        },
        onPick ({ maxDate, minDate }) {
          that.chclikMinDate = minDate
          that.chclikMaxDate = maxDate === null ? '' : maxDate
        }
      }
    };
  },
  watch: {
    dateChoice: function(value) {
      if(this.selectId == "") {
        return
      }
      // var num = value[1].getTime() - value[0].getTime(); //计算时间戳的差
      // if(num == 0) {//选择时间为一天
      //   this.period = 3600;
      //   var arr = [];
      //   for (var i = 24; i >= 0; i--) {
      //     var d = new Date(value[1].getTime() + 3600000 * i);
      //     arr.push(moment(d).format("MM-DD HH:mm:ss"));
      //   }
      //   this.endTime = moment(value[1]).format("YYYY-MM-DD 23:59:59"); //格式处理
      // } else {
      //   this.period = 86400;
      //   var arr = [];
      //   for (var i = 0; i <= num / 86400000; i++) {
      //     //根据时间戳的差以及时间粒度计算出开始时间与结束时间之间有多少天/小时
      //     var d = new Date(value[1].getTime() - 86400000 * i);
      //     arr.push(moment(d).format("MM-DD"));
      //   }
      //   this.endTime = moment(value[1]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      // }
      if (!this.choiceClick && value !== null) {
        let num = (value[1].getTime() - value[0].getTime()) / 86400000
        let dateValue = moment(value[0])
        let maxDate = moment(value[1]).add(1, 'd')
        let arr = []
        arr.push(dateValue.format('YYYY-MM-DD HH:mm:ss'))
        while (!dateValue.isSameOrAfter(maxDate)) {
          if (num < 2) {
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
        this.timey = arr;
        this.startTime = moment(value[0]).format("YYYY-MM-DD 00:00:00"); //格式处理
        this.endTime = moment(value[1]).format("YYYY-MM-DD 23:59:59")
        if (this.selectIp !== "總覽") {
        this.describeDDoSTrend(this.timey);
      } else {
        this.describeDDoSNetTrend(this.timey);
      }
        this.describeDDoSNetEvList();
        // for (let index in this.metricNames) {
        //   this.metricName2 = this.metricNames[index];
        //   this.describeDDoSNetCount();
        // }
        for (let i = 0; i < this.btnData.length; i++) {
          this.btnData[i]['selected'] = false;
        }
      }
      this.choiceClick = false
    },
    selectId: function() {
      this.changeId();
    },
    selectIp () {
      this.changeIp()
    }
  },
  //初始化生命周期
  created() {
    this.GetID();
    // this.choiceTime(1);
  },
  methods: {
    //获取资源的IP列表
    GetID() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net"
      };
      // if (this.selectId != '') {
      //   params['IdList.0'] = this.selectId;
      // }
      this.axios.post(GET_ID, params).then(res => {
        if (res.Response.Error === undefined) {
          if (res.Response.Resource.length === 0) {
            this.$message({
              message: "暫無服務",
              type: "error",
              showClose: true,
              duration: 0
            });
            this.loading = false;
            return;
          }
          this.ResIpList = res.Response.Resource;
          let jsonStr = sessionStorage.getItem('IpPro')
          if (jsonStr !== null && jsonStr !== '') {
            this.ipPro = JSON.parse(jsonStr)
            this.selectId = this.ipPro.Id
            this.selectIp = this.ipPro.Vip
            this.startTime = moment(this.ipPro.StartTime, 'YYYY-MM-DD 00:00:00').toDate()
            this.endTime = moment(this.ipPro.EndTime, 'YYYY-MM-DD 23:59:59').toDate()
            this.dateChoice = [this.startTime, this.endTime]
            sessionStorage.setItem('IpPro', '')
            for (let i =0; i < this.btnData.length; i++) {
              this.btnData[i]['selected'] = false;
            }
          } else {
            this.selectId = this.ResIpList[0].Id;
            this.choiceTime(1);
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
      this.IpList = [];
      for (const i in this.ResIpList) {
        if (this.ResIpList.hasOwnProperty(i)) {
          const element = this.ResIpList[i];
          if (this.selectId == element.Id) {
            Object.assign(this.IpList, element.IpList);
          }
        }
      }
      this.IpList.splice(0, 0, "總覽");
      // 资源ID改变时，IP默认为总览
      this.selectIp = this.IpList[0];
      this.choiceTime('1')
      this.describeDDoSNetTrend(this.timey);
      this.metricNames.forEach((name, i) => {
        this.metricName2 = this.metricNames[i];
        this.describeDDoSNetCount();
      });
      this.describeDDoSNetEvList();
    },
    // DDOS资源Ip变化时，重新获取数据
    changeIp() {
      // 资源ID改变时，IP默认为总览
      if (this.selectIp !== "總覽") {
        this.describeDDoSTrend(this.timey);
      } else {
        this.describeDDoSNetTrend(this.timey);
      }
      // this.metricNames.forEach((name, i) => {
      //   this.metricName2 = this.metricNames[i];
      //   this.describeDDoSNetCount();
      // });
      this.describeDDoSNetEvList();
    },
    // 1.3.获取高防IP专业版资源的DDoS攻击事件列表
    describeDDoSNetEvList() {
      this.loading = true;
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.selectId,
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
    // 1.1.获取DDoS攻击指标数据
    describeDDoSTrend(date) {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.selectId,
        Ip: this.selectIp,
        MetricName: this.metricName,
        StartTime: this.startTime,
        EndTime: this.endTime,
        Period: this.period
      };
      this.axios.post(DDOS_TREND, params).then(res => {
        if (res.Response.Error === undefined) {
          // this.bps = res.Response.Data
          if (this.metricName === "bps") {
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
    // 1.2.获取高防IP专业版资源的DDoS攻击占比分析
    describeDDoSNetCount() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.selectId,
        StartTime: this.startTime,
        EndTime: this.endTime,
        MetricName: this.metricName2 //指标，取值[traffic（攻击协议流量, 单位KB）, pkg（攻击协议报文数）, num（攻击事件次数）]
        // metricName2: "traffic",
      };
      this.axios.post(DDOS_ATTACK, params).then(res => {
        if (res.Response.Error === undefined) {
          if (res.Response.MetricName == "traffic") {
            this.traffictable = res.Response.Data;
          } else if (res.Response.MetricName == "pkg") {
            this.pkgtable = res.Response.Data;
          } else if (res.Response.MetricName == "num") {
            this.numtable = res.Response.Data;
          }
          // this.drawPie(res.Response.Data, res.Response.MetricName);
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
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.selectId,
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
    // 1.4. 获取高防IP专业版资源的DDoS攻击事件详情
    async describeDDoSNetEvInfo(row) {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: row.Id,
        StartTime: row.StartTime,
        EndTime: row.EndTime
      };
      await this.axios.post(DESCRIBE_DDOSNETEVINFO, params).then(res => {
        if (res.Response.Error === undefined) {
          this.Pps = res.Response.Pps;
          this.Mbps = res.Response.Mbps;
          this.TotalTraffic = res.Response.TotalTraffic;
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
    // 1.5. 获取DDoSIP攻击日志
    async describeDDoSIpLog(row) {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: row.Id,
        StartTime: row.StartTime,
        EndTime: row.EndTime,
        Ip: this.selectIp
      };
      this.DDoSIpLogData = [];
      await this.axios.post(DESCRIBE_DDOSIPLOG, params).then(res => {
        if (res.Response.Error === undefined) {
          this.DDoSIpLogData = JSON.parse(JSON.stringify(res.Response.Data));
        } else {
          
        }
      });
    },
    // 1.6. 获取高防IP专业版资源的DDoSIP攻击日志
    async describeDDoSNetIpLog(row) {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: row.Id,
        StartTime: row.StartTime,
        EndTime: row.EndTime
      };
      this.DDoSIpLogData = [];
      await this.axios.post(DESCRIBE_DDOSNETIPLOG, params).then(res => {
        if (res.Response.Error === undefined) {
          this.DDoSIpLogData = JSON.parse(JSON.stringify(res.Response.Data));
        } else {
          
        }
      });
    },
    // 1.7. 获取DDoS攻击源列表
    describeDDoSAttackSource() {
      // let params = {
      //   Version: "2018-07-09",
      //   Region: localStorage.getItem("regionv2"),
      //   Business: "net",
      //   Id: row.Id,
      //   StartTime: row.StartTime,
      //   EndTime: row.EndTime
      // };
      // await this.axios.post(DESCRIBE_DDOSNETEVINFO, params).then(res => {
      //   if (res.Response.Error === undefined) {
      //     this.Pps = res.Response.Pps;
      //     this.Mbps = res.Response.Mbps;
      //     this.TotalTraffic = res.Response.TotalTraffic;
      //   } else {
      //     let ErrTips = {};
      //     let ErrOr = Object.assign(ErrorTips, ErrTips);
      //     this.$message({
      //       message: ErrOr[res.Response.Error.Code],
      //       type: "error",
      //       showClose: true,
      //       duration: 0
      //     });
      //   }
      // });
    },
    // ddosTable (row=false攻击包下载，flg=true攻击详情，false攻击日志)
    async describeDDoS(row, flg) {
      if (!row) {
        this.$message({
          message: '該地區暫不支持攻擊包下載',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        return
      }
      this.InfoOrLog = flg;
      let $table = this.$refs.ddosTable;
      // 关闭所有table展开行
      this.tableDataOfDescribeDDoSNetEvList.map((item) => {
        if (row.Id != item.Id) {
          $table.toggleRowExpansion(item, false);
        }
      });
      // 调用接口
      if (flg) {
        await this.describeDDoSNetEvInfo(row);
      } else {
        if (this.selectIp == "總覽") {
          await this.describeDDoSNetIpLog(row);
        } else {
          await this.describeDDoSIpLog(row);
        }
      }
      $table.toggleRowExpansion(row);
    },
    // 打开ddos攻击源列表弹框
    toDDOSAttackSource(row) {

    },
    // DDOS攻击防护-二级tab切换
    handleClick1(value) {
      this.metricName = value.name;
      // this.choiceTime(1);
      this.describeDDoSNetTrend(this.timey);
      this.describeDDoSNetEvList();
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
    choiceTime(thisTime) {
      if (this.selectId == "") {
        return;
      }
      this.choiceClick = true
      for (let i =0; i < this.btnData.length; i++) {
        this.btnData[i]['selected'] = false;
        this.btnData[thisTime - 1]['selected'] = true
      }
      // var ipt1 = document.querySelector(".newDataTime input:nth-child(2)");
      // var ipt2 = document.querySelector(".newDataTime input:nth-child(4)");
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
      //     arr.push(moment(d).add(5, 'm').format("MM-DD HH:mm:ss"));
      //   }

      //   this.startTime = moment(end).format("YYYY-MM-DD 00:00:00");
      //   this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   let misTime = new Date(this.endTime).getTime() - new Date(this.startTime).getTime()
      //   if(misTime / 3600*1000 < 1) 
      //     this.period = 300;
      //   else this.period = 3600;

      //   this.period = 300 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      //   this.timey = arr;
      // } else if (thisTime == "2") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTime = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   // this.period = 86400;

      //   this.period = 3600 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      //   this.timedone(end, start, 86400000,1,'h');
      //   //ddos攻击-攻击流量带宽
      // } else if (thisTime == "3") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 15);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTime = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   // this.period = 86400;

      //   this.period = 3600 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      //   this.timedone(end, start, 86400000, 1, 'h');
      //   //ddos攻击-攻击流量带宽
      // } else if (thisTime == "4") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTime = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   // this.period = 86400;
      //   this.period = 21600 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
      //   this.timedone(end, start, 86400000, 6, 'h');
      //   //ddos攻击-攻击流量带宽
      // } else if (thisTime == "5") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 30 * 6);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTime = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   this.period = 86400;
      //   this.timedone(end, start, 86400000);
      //   //ddos攻击-攻击流量带宽
      // }


      let start
      let end = moment()
      const times = []
      if (thisTime == '1') {
        start = moment().startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(5, 'm').format('YYYY-MM-DD HH:mm:ss'))
        }
        this.startTime = moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 今天：0点到当前的时间，粒度5分钟一个值
        this.period = 300 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
      } else if (thisTime == '2') {
        start = moment()
          .subtract(6, 'd')
          .startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(1, 'h').format('YYYY-MM-DD HH:mm:ss'))
        }
        this.startTime = moment()
          .subtract(6, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 2-5天：时间粒度为30分钟一个值
        this.period = 3600 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
        this.timeValue = [this.startTime, this.endTime]
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
        this.startTime = moment()
          .subtract(14, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 6-15天：时间粒度为1小时一个值
        this.period = 3600
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
        this.startTime = moment()
          .subtract(29, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 16-30天：时间粒度为6小时一个值
        this.period = 21600 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
      } else if (thisTime == '5') {
        start = moment()
          .subtract(180, 'd')
          .startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(1, 'd').format('YYYY-MM-DD HH:mm:ss'))
        }
        this.startTime = moment()
          .subtract(180, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 16-30天：时间粒度为6小时一个值
        this.period = 86400 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
      }
      this.dateChoice = [this.startTime, this.endTime]
      this.describeDDoSNetTrend(this.timey);
      // for (let index in this.metricNames) {
      //   this.metricName2 = this.metricNames[index];
      //   this.describeDDoSNetCount();
      // }
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
    timedone(end, start, p,a,b) {
      var num = end.getTime() - start.getTime();
      var arr = [];
      for (var i = 0; i <= num / p; i++) {
        var d = new Date(end.getTime() - p * i);
        arr.push(moment(d).add(a,b).format("YYYY-MM-DD HH:mm:ss"));
      }
      this.timey = arr;
    },
    // 时间格式化'yyyy-MM-dd hh:mm:ss'
    getDateString(date) {
      let o = {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
      };
      for (const i in o) {
        o[i] = (o[i] + "").length == 1 ? "0" + o[i] : o[i];
      }
      return o.y + "-" + o.M + "-" + o.d + " " + o.h + ":" + o.m + ":" + o.s;
    },
    drawLine(y, date) {
      // var arr = [];
      // for (let i in date) {
      //   arr.unshift(date[i]); //属性
      // }
      // arr.splice(arr.length - 1, 1);
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("chart-bps"));
      // 绘制图表
      myChart.setOption({
        color: ["rgb(124, 181, 236)"],
        title: { text: "" },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          data: date
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
            formatter: "{value}Mbps"
          },
          boundaryGap: true
        },
        series: [
          {
            symbol: 'none',
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
      // var arr = [];
      // for (let i in date) {
      //   arr.unshift(date[i]); //属性
      // }
      // arr.splice(arr.length - 1, 1);
      // console.log(arr)
      let myChart2 = this.$echarts.init(document.getElementById("chart-pps"));
      // 绘制图表
      myChart2.setOption({
        color: ["rgb(124, 181, 236)"],
        title: { text: "" },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          data: date
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
            symbol: 'none',
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
    },
    // 画饼图
    // drawPie(datas, id) {
    //   // datas.forEach(e => console.log('Key=' + e.Key +'***value=' + e.Value))
    //   let legendDatas = [];
    //   let seriesDatas = [];
    //   let objData = {};
    //   let edata = {};
    //   let dw = "";
    //   if (id === "traffic") {
    //     dw = "B";
    //   } else if (id === "pkg") {
    //     dw = "packet";
    //   } else if (id === "num") {
    //     dw = "次";
    //   }
    //   datas.forEach((m, i) => {
    //     // legendDatas[i] = m.Key + ':' + m.Value + dw
    //     // objData[m.Key] = m.Value + dw
    //     // console.log('objData = ' + objData.Value )
    //     // seriesDatas[i] = objData
    //   })
    //   legendDatas = datas.filter(e => e.Key).map(e => e.Key)
    //   seriesDatas = datas.filter(e => e.Value).map(e => e.Value)
    //   let IDName = 'chart-' + id
    //   let myChartPie = this.$echarts.init(document.getElementById(IDName))
    //   myChartPie.setOption({
    //     tooltip: {
    //       trigger: "item",
    //       formatter: "{a} <br/>{b} : {c} ({d}%)"
    //     },
    //     legend: {
    //       orient: "vertical",
    //       bottom: "bottom",
    //       data: seriesDatas,
    //       // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
    //       x: "left",
    //       // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
    //       y: "center",
    //       itemWidth: 24, // 设置图例图形的宽
    //       itemHeight: 18, // 设置图例图形的高
    //       backgroundColor: "#fff" // 设置整个图例区域背景颜色
    //     },
    //     series: [
    //       {
    //         name: "",
    //         type: "pie",
    //         radius: "55%",
    //         center: ["50%", "60%"],
    //         data: seriesDatas,
    //         itemStyle: {
    //           emphasis: {
    //             shadowBlur: 0,
    //             shadowOffsetX: 0,
    //             shadowColor: "rgba(0, 0, 0, 0.5)"
    //           }
    //         },
    //         // 设置值域的那指向线
    //         labelLine: {
    //           normal: {
    //             show: false // show设置线是否显示，默认为true，可选值：true ¦ false
    //           }
    //         },
    //         // 设置值域的标签
    //         label: {
    //           normal: {
    //             position: "inner", // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
    //             // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
    //             // {a}指series.name  {b}指series.data的name
    //             // {c}指series.data的value  {d}%指这一部分占总数的百分比
    //             formatter: "{a} <br/>{b} : {c} ({d}%)"
    //           }
    //         }
    //       }
    //     ]
    //   });
    //   myChartPie.resize();
    //   window.addEventListener("resize", function() {
    //     myChartPie.resize();
    //   });
    // },
    // 获取持续时间
    durationDate(endTime, StartTime) {
      let durationTime = "";
      let stime = new Date(StartTime).getTime();
      let etime = new Date(endTime).getTime();
      let dateDiff = etime - stime;
      let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); // 计算出相差天数
      if (dayDiff > 0) {
        durationTime += dayDiff + "天";
      }
      let leave1 = dateDiff % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000)); // 计算出小时数
      if (hours > 0) {
        durationTime += hours + "小時";
      }
      // 计算相差分钟数
      let leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000)); // 计算相差分钟数
      if (minutes > 0) {
        durationTime += minutes + "分鐘";
      }
      // 计算相差秒数
      let leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000);
      let leave4 = leave3 % (60 * 1000); // 计算分钟数后剩余的毫秒数
      let minseconds = Math.round(leave4 / 1000);
      if (minseconds > 0) {
        durationTime += minseconds + "秒";
      }
      return durationTime;
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
#chart-bps {
  width: 100%;
  height: 380px;
  margin: 20px 0;
}
#chart-pps {
  width: 100%;
  height: 380px;
  margin: 20px 0;
}
</style>
