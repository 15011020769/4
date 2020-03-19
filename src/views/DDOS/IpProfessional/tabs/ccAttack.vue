<template>
<!-- CC攻击防护 -->
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
            v-model="dateChoice2"
            type="daterange"
            class="newDataTimetwo"
            range-separator="至"
            :start-placeholder="$t('DDOS.UnsealCode.beginDate')"
            :end-placeholder="$t('DDOS.UnsealCode.overDate')"
            :picker-options="pickerOptions"
            :default-time="defTime"
          ></el-date-picker>
        </div>
        <br />
        <el-select
          class="ddosAttackSelect1"
          v-model="inputIdCC"
          @change="changeIdCC"
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
        <el-select class="ddosAttackSelect1" v-model="ccTimeBtnSelect2">
          <el-option v-for="(item,index) in IpList" :value="item" :key="index"></el-option>
        </el-select>
      </div>
      <div class="mainConListAll mainConListTwo">
          <div id="myChart3" ref="chart"></div>
          <div>
             <div class="text-label">總請求峰值 </div>
             <div class="text-indent">{{ReqQpsTotal}}QPS</div>
             <div class="text-label">攻擊請求峰值</div>
             <div class="text-indent">{{DropQpsTotal}}QPS</div>
          </div>
      </div>
      <div class="mainConListAll">
        <h3>{{$t('DDOS.Statistical_forms.CC_attack_record')}}</h3>
        <div class="ddosTableMin">
          <el-table
            :data="tableDataOfDescribeDDoSNetEvListcc.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            height="450" empty-text='暫無數據'
          >
            <el-table-column prop="attackTime" :label="$t('DDOS.Statistical_forms.Attack_time')">
               <template slot-scope="scope">{{scope.row.StartTime}} - {{scope.row.EndTime}}</template>
            </el-table-column>
            <el-table-column
              prop="attackDomin"
              :label="$t('DDOS.Statistical_forms.Domainunder_attack')"
            >
             <template slot-scope="scope">
               <div v-if="scope.row.DomainList === ''" >未知</div>
               <div v-else > {{scope.row.DomainList}}</div>
             </template>
            </el-table-column>
            <el-table-column prop="attackUrl" :label="$t('DDOS.Statistical_forms.Attacked_URI')">
              <template slot-scope="scope">
               <div v-if="scope.row.UriList === ''" >未知</div>
               <div v-else > {{scope.row.UriList}}</div>
             </template>
            </el-table-column>
            <el-table-column
              prop="allRequestTop"
              :label="$t('DDOS.Statistical_forms.request_peak')"
            >
            <template slot-scope="scope">{{ scope.row.ReqQps}}</template>
            </el-table-column>
            <el-table-column prop="ReqQps" :label="$t('DDOS.Statistical_forms.Attack_peak')">
              <template slot-scope="scope">{{ scope.row.DropQps}}</template>
            </el-table-column>
            <el-table-column prop="attackResou" :label="$t('DDOS.Statistical_forms.Attack_source')">
              <template slot-scope="scope">
               <div v-if="scope.row.AttackipList === ''" >未知</div>
               <div v-else > {{scope.row.AttackipList}}</div>
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
import { GET_ID, CC_LIST, CC_DATA } from "@/constants";
import moment from "moment";
export default {
  data() {
    let that = this
    return {
      loading: true,
      inputIdCC: "",
      IpList: [],
      metricName: "bps", //指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
      metricNameCC: "inqps", //指标，取值[inqps(总请求峰值，dropqps(攻击请求峰值))]
      metricNameCCs: ["inqps", "dropqps"],
      tableDataOfDescribeDDoSNetEvListcc: [], //Cc攻击防护列表
      tableDataEnd: [],
      currentPage: 1, //当前页
      pageSize: 10, //每页长度
      totalItems: 0, //总条数
      ccTimeBtnSelect2: "", //cc时间按钮下面第二个下拉
      dateChoice2: [], //日期选择
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
      periodCC: 3600, //统计粒度，取值[300(5分鐘)，3600(小时)，86400(天)]
      ResIpList: [],
      choiceClick: false,
      ReqQpsTotal: 0,
      DropQpsTotal: 0,
      dropqps: [],
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
        }
        // ,
        // {
        //   selected: false,
        //   title: "Halfayear"
        // }
      ],
      inqpsdata: [],
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
    }
  },
  watch: {
    dateChoice2: function(value) {
      if(this.inputIdCC == "") {
        return
      }
      // var num = value[1].getTime() - value[0].getTime(); //计算时间戳的差
      // if(num == 0) {//选择时间为一天
      //   this.periodCC = 3600;
      //   var arr = [];
      //   for (var i = 24; i >= 0; i--) {
      //     var d = new Date(value[1].getTime() + 3600000 * i);
      //     arr.push(moment(d).format("MM-DD HH:mm:ss"));
      //   }
      //   this.endTimeCC = moment(value[1]).format("YYYY-MM-DD 23:59:59"); //格式处理
      // } else {
      //   this.periodCC = 86400;
      //   var arr = [];
      //   for (var i = 0; i <= num / 86400000; i++) {
      //     //根据时间戳的差以及时间粒度计算出开始时间与结束时间之间有多少天/小时
      //     var d = new Date(value[1].getTime() - 86400000 * i);
      //     arr.push(moment(d).format("MM-DD"));
      //   }
      //   this.endTimeCC = moment(value[1]).format("YYYY-MM-DD HH:mm:ss"); //格式处理
      // }
      // for (var i = 0; i <= num / 86400000; i++) {
      //   //根据时间戳的差以及时间粒度计算出开始时间与结束时间之间有多少天/小时
      //   var d = new Date(value[1].getTime() - 86400000 * i);
      //   arr.push(moment(d).format("MM-DD"));
      // }
      if (!this.choiceClick && value !== null) {
        let num = (value[1].getTime() - value[0].getTime()) / 86400000
        let dateValue = moment(value[0])
        let maxDate = moment(value[1])
        let arr = []
        arr.push(dateValue.format('YYYY-MM-DD HH:mm:ss'))
        while (!dateValue.isSameOrAfter(maxDate)) {
          if (num > 0 && num < 2) {
            this.periodCC = 300
            arr.push(dateValue.add(5, 'm').format('YYYY-MM-DD HH:mm:ss'))
          } else if (num < 6) {
            this.periodCC = 1800
            arr.push(dateValue.add(30, 'm').format('YYYY-MM-DD HH:mm:ss'))
          } else if (num < 16) {
            this.periodCC = 3600
            arr.push(dateValue.add(1, 'h').format('YYYY-MM-DD HH:mm:ss'))
          } else if (num < 31) {
            this.periodCC = 21600
            arr.push(dateValue.add(6, 'h').format('YYYY-MM-DD HH:mm:ss'))
          } else {
            this.periodCC = 86400
            arr.push(dateValue.add(1, 'd').format('YYYY-MM-DD HH:mm:ss'))
          }
        }
        this.timey = arr
        this.startTimeCC = moment(value[0]).format("YYYY-MM-DD 00:00:00"); //格式处理
        this.endTimeCC = moment(value[1]).format("YYYY-MM-DD 23:59:59")
        this.every();
        this.describeCCEvList();
        for (let i = 0; i < this.btnData.length; i++) {
          this.btnData[i]['selected'] = false
        }
      }
      this.choiceClick = false
    },
    inputIdCC(){
      this.changeIdCC()
    },
    ccTimeBtnSelect2() {
      this.changeIp()
    }
  },
  created() {
    this.$nextTick(function() {
      this.GetID()
      // this.thisTime(1)
    });
  },
  methods: {
    //获取资源的IP列表
    GetID() {
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
          this.inputIdCC = res.Response.Resource[0].Id
          for (const i in this.ResIpList) {
            if (this.ResIpList.hasOwnProperty(i)) {
              const element = this.ResIpList[i]
              if (this.inputIdCC === element.Id) {
                Object.assign(this.IpList, element.IpList)
              }
            }
          }
          this.thisTime(1)
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    // CC资源Id变化时，重新获取数据
    changeIdCC() {
      this.IpList = []
      for (const i in this.ResIpList) {
        if (this.ResIpList.hasOwnProperty(i)) {
          const element = this.ResIpList[i];
          if (this.inputIdCC === element.Id) {
            Object.assign(this.IpList, element.IpList)
          }
        }
      }
      // 资源ID改变时，IP默认为总览
      this.ccTimeBtnSelect2 = this.IpList[0]
      this.thisTime(1)
      this.getDataCC()
      sessionStorage.setItem("selectId", this.inputIdCC)
    },
    // DDOS资源Ip变化时，重新获取数据
    changeIp() {
      this.getDataCC()
    },
    getDataCC() {
      // this.thisTime(1)
      this.describeCCEvList()
      this.every()
    },
    every() {
      for (let index in this.metricNameCCs) {
        this.metricNameCC = this.metricNameCCs[index];
        this.describeCCTrend();
      }
      setTimeout(
        this.drawLine3(this.timey, this.inqpsdata, this.dropqps),
        1000
      );
    },
    // 2.2.获取 CC 攻击事件列表
    describeCCEvList () {
      this.loading = true
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        StartTime: this.startTimeCC,
        EndTime: this.endTimeCC,
        Id: this.inputIdCC
      }
      // this.IpList.forEach((ip, index) => {
      //   params['IpList.' + index] = ip
      // })
      params['IpList.0'] = this.ccTimeBtnSelect2
      this.axios.post(CC_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.tableDataOfDescribeDDoSNetEvListcc = res.Response.Data
          this.totalItems = res.Response.Data.length
          // this.loading = false
        }
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
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

    //计算时间间隔
    timedone(end, start, p) {
      var num = end.getTime() - start.getTime();
      var arr = [];
      for (var i = 0; i <= num / p; i++) {
        var d = new Date(end.getTime() - p * i);
        arr.push(moment(d).format("MM-DD"));
      }
      // console.log(arr)
      this.timey = arr;
    },
    //获取时间
    thisTime(thisTime) {
      if(this.inputIdCC == "") {
        return
      }
      // var ipt1 = document.querySelector(".newDataTimetwo input:nth-child(2)");
      // var ipt2 = document.querySelector(".newDataTimetwo input:nth-child(4)");
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

      //   this.startTimeCC = moment(end).format("YYYY-MM-DD 00:00:00");
      //   this.endTimeCC = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   this.periodCC = 3600;
      //   this.timey = arr;
      // } else if (thisTime == "2") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTimeCC = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTimeCC = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   this.periodCC = 86400;
      //   this.timedone(end, start, 86400000);
      //   //ddos攻击-攻击流量带宽
      // } else if (thisTime == "3") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 15);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTimeCC = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTimeCC = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   this.periodCC = 86400;
      //   this.timedone(end, start, 86400000);
      //   //ddos攻击-攻击流量带宽
      // } else if (thisTime == "4") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTimeCC = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTimeCC = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   this.periodCC = 86400;
      //   this.timedone(end, start, 86400000);
      //   //ddos攻击-攻击流量带宽
      // } else if (thisTime == "5") {
      //   //ddos攻击-攻击流量带宽
      //   start.setTime(end.getTime() - 3600 * 1000 * 24 * 30 * 6);
      //   ipt1.value = moment(start).format("YYYY-MM-DD");
      //   ipt2.value = moment(end).format("YYYY-MM-DD");
      //   this.startTimeCC = moment(start).format("YYYY-MM-DD HH:mm:ss");
      //   this.endTimeCC = moment(end).format("YYYY-MM-DD HH:mm:ss");
      //   this.periodCC = 86400;
      //   this.timedone(end, start, 86400000);
      //   //ddos攻击-攻击流量带宽
      // }
      for (let i =0; i < this.btnData.length; i++) {
        this.btnData[i]['selected'] = false;
        this.btnData[thisTime - 1]['selected'] = true
      }
      this.choiceClick = true
      let start
      let end = moment()
      const times = []
      if (thisTime == '1') {
        start = moment().startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(5, 'm').format('YYYY-MM-DD HH:mm:ss'))
        }
        this.startTimeCC = moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTimeCC = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 今天：0点到当前的时间，粒度5分钟一个值
        this.periodCC = 300 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
      } else if (thisTime == '2') {
        start = moment()
          .subtract(6, 'd')
          .startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(1, 'h').format('YYYY-MM-DD HH:mm:ss'))
        }
        this.startTimeCC = moment()
          .subtract(6, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTimeCC = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 2-5天：时间粒度为30分钟一个值
        this.periodCC = 3600 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
        this.timeValue = [this.startTimeCC, this.endTimeCC]
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
        this.startTimeCC = moment()
          .subtract(14, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTimeCC = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 6-15天：时间粒度为1小时一个值
        this.periodCC = 3600
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
        this.startTimeCC = moment()
          .subtract(29, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTimeCC = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 16-30天：时间粒度为6小时一个值
        this.periodCC = 21600 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
      } else if (thisTime == '5') {
        start = moment()
          .subtract(180, 'd')
          .startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(1, 'd').format('YYYY-MM-DD HH:mm:ss'))
        }
        this.startTimeCC = moment()
          .subtract(180, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTimeCC = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 16-30天：时间粒度为6小时一个值
        this.periodCC = 86400 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
      }
      this.dateChoice2 = [this.startTimeCC, this.endTimeCC]
      var vm = this;
      setTimeout(function() {
        vm.every();
        vm.describeCCEvList();
      }, 500);
    },
    // 2.1.获取CC攻击指标数据
    describeCCTrend() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.inputIdCC,
        Ip: this.ccTimeBtnSelect2, //资源的IP
        MetricName: this.metricNameCC, //指标，取值[inqps(总请求峰值，dropqps(攻击请求峰值))]
        Period: this.periodCC, //统计粒度，取值[300(5分鐘)，3600(小时)，86400(天)]
        StartTime: this.startTimeCC,
        EndTime: this.endTimeCC
      };
      this.DropQpsTotal = 0
      this.ReqQpsTotal = 0
      this.axios.post(CC_DATA, params).then(res => {
        if (res.Response.Error === undefined) {
          if (res.Response.MetricName === "inqps") {
            this.inqpsdata = res.Response.Data;
          } else {
            this.dropqps = res.Response.Data;
          }
          this.drawLine3(this.timey, this.inqpsdata, this.dropqps) 
          this.DropQpsTotal = Math.max.apply(Math, this.dropqps)
          this.ReqQpsTotal = Math.max.apply(Math, this.inqpsdata)
        }
      })
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
    drawLine3(time, data1, data2) {
      // var arr = [];
      // for (let i in time) {
      //   arr.unshift(time[i]); //属性
      // }
      // arr.splice(arr.length - 1, 1);
      // 基于准备好的dom，初始化echarts实例
      let myChart3 = this.$echarts.init(this.$refs.chart);
      // 绘制图表
      myChart3.setOption({
        color: ['rgb(124, 181, 236)','rgb(50, 205, 50)'],
        title: { text: "" },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            color: 'black',
            decoration: 'none',
            fontFamily: 'Verdana, sans-serif',
            fontSize: 12,
            // fontStyle: 'italic',
            fontWeight: 'bold'
          },
          backgroundColor: 'rgba(252,252,252)',
          formatter: function (params) {
            return '<div>' + params[0].name + '</div></br><div><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + params[0].color + ';"></span>' + params[0].seriesName + ': ' + params[0].value +'QPS</div><div><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[1].color+';"></span>'+params[1].seriesName+': '+params[1].value+'QPS</div>'
          }
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
            formatter: "{value}QPS"
          },
          boundaryGap: true
        },
        series: [
          {
            symbol: "none",
            name: "總請求峰值",
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
            symbol: "none",
            name: "攻擊請求峰值",
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
            color: ['rgb(124, 181, 236)','rgb(50, 205, 50)'],
          }
        }
      });
      myChart3.resize();
      window.addEventListener("resize", function() {
        myChart3.resize();
      });
    },
    tabchangeId () {
      let jsonIp = sessionStorage.getItem('selectId')
      if (jsonIp !== null) {
        this.inputIdCC = jsonIp
      }
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
.child >>> .el-button {
  height: 30px !important;
  line-height: 30px !important;
  border-radius: 0 !important;
  padding-top: 0;
}
.newDataTimetwo {
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
.ddosTableMin {
  min-height: 450px;
}
.tabListPage {
  height: 50px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
  text-align: right;
}
.mainConListTwo {
  display: flex;
}
.text-label{
    color: #888 ;
    font-size: 16px;
    margin-top: 20px;
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
    margin-bottom: 80px;
    text-align: right;
    color:black;
}
#myChart3 {
  width: 80%;
  height: 380px;
  margin: 20px 0;
}

</style>
