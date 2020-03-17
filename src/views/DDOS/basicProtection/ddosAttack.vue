/* eslint-disable no-unreachable */
<template>
  <div v-loading="loading">
    <div class="newClear">
      <el-button-group class="buttonGroupAll">
        <el-button class="buttonGroup" @click="thisTime(1)">今天</el-button>
        <el-button class="buttonGroup" @click="thisTime(2)">近7天</el-button>
        <el-button class="buttonGroup" @click="thisTime(3)">近15天</el-button>
        <el-button class="buttonGroup" @click="thisTime(4)">近30天</el-button>
      </el-button-group>
      <el-date-picker
        v-model="timeValue"
        type="daterange"
        class="newDataTime"
        range-separator="至"
        :start-placeholder="$t('DDOS.UnsealCode.beginDate')"
        :end-placeholder="$t('DDOS.UnsealCode.overDate')"
        :picker-options="pickerOptions"
        :default-time="defTime"
      ></el-date-picker>
    </div>
    <div id="myChart"></div>
    <div>
      <h3>{{ $t("DDOS.basicProtection.ddosgjjl") }}</h3>
      <el-table
        :data="
          tableDataBegin.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )
        "
        height="450"
        empty-text="暫無數據"
      >
        <el-table-column
          prop="StartTime"
          :label="$t('DDOS.Protective.AgainstTime')"
        >
          <template slot-scope="scope">{{ scope.row.StartTime }}</template>
        </el-table-column>
        <el-table-column
          prop="durnTime"
          :label="$t('DDOS.Protective.durationTime')"
        >
          <template slot-scope="scope">{{
            durationDate(scope.row.EndTime, scope.row.StartTime)
          }}</template>
        </el-table-column>
        <el-table-column
          prop="AttackType"
          :label="$t('DDOS.Protective.AgainstType')"
        >
          <template slot-scope="scope">{{ scope.row.AttackType }}</template>
        </el-table-column>
        <el-table-column
          prop="AttackStatus"
          :label="$t('DDOS.basicProtection.gjzt')"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.AttackStatus == '0'">
              {{ $t("DDOS.basicProtection.gongjiz") }}
            </div>
            <div v-else-if="scope.row.AttackStatus == '1'">
              {{ $t("DDOS.basicProtection.gjjs") }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="Right-style pagstyle">
      <span class="pagtotal"
        >共&nbsp;{{ totalItems }}&nbsp;{{ $t("DDOS.UnsealCode.tiao") }}</span
      >
      <el-pagination
        :page-size="pageSize"
        :pager-count="7"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="totalItems"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import moment, { now, min, months } from 'moment'
import { DDOS_EV_LIST, DDOS_TREND } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
export default {
  data () {
    let that = this
    return {
      loading: true,
      business: 'basic', // [bgp表示独享包；bgp-multip表示共享包；net表示高防IP专业版；basic表示DDoS基础防护]
      metricName: 'bps', // 指标，取值[bps(攻击流量带宽，pps(攻击包速率))]
      // period: 600, //统计粒度，取值[300(5分鐘)，3600(小时)，86400(天)]
      // 日期区间：今天
      endTime: this.getDateString(new Date()),
      startTime: this.getDateString(
        new Date(new Date(new Date().toLocaleDateString()).getTime())
      ),
      // 攻击事件列表
      tableDataBegin: [],
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      Period: 300,
      timeValue: {},
      thisStart: '',
      thisEnd: '',
      tableDataEnd: [],
      filterTableDataEnd: [],
      flag: false,
      clickFlag: false,
      // 一次最大只能查询30天，通过选择日期，可查询最大时间范围到半年，但是一次也只能查询30天
      chclikMinDate: '',
      chclikMaxDate: '',
      defTime: ['00:00:00', '23:59:59'],
      pickerOptions: {
        disabledDate (date) {
          let nowDate = moment(Date.now()).hour(23).minute(59).second(59).toDate().getTime()
          let Date6Moths = moment(Date.now()).subtract(180, 'days').toDate().getTime()
          if (that.chclikMinDate === '') {
            return date.getTime() < Date6Moths || date.getTime() > nowDate
          } else {
            if (that.chclikMaxDate === '') {
              let maxDate = moment(that.chclikMinDate).add(29, 'days').toDate().getTime()
              let minDate = moment(that.chclikMinDate).subtract(29, 'days').toDate().getTime()
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
    timeValue: function (value) {
    // 当前：显示的是当前1小时的时间，粒度为5分钟一个值
    // 6小时：最近的6小时，粒度5分钟一个值
    // 今天：0点到当前的时间，粒度5分钟一个值
    // 2-5天：时间粒度为30分钟一个值
    // 6-15天：时间粒度为1小时一个值
    // 16-30天：时间粒度为6小时一个值
      this.Period = 86400
      // 根据开始时间与结束时间以及时间粒度，计算监控x轴应有多少坐标点
      if (!this.clickFlag && this.timeValue !== null) {
        let num = (this.timeValue[1].getTime() - this.timeValue[0].getTime()) / 86400000
        let dateValue = moment(this.timeValue[0])
        let maxDate = moment(this.timeValue[1])
        let arr = []
        arr.push(dateValue.format('YYYY-MM-DD HH:mm:ss'))
        while (!dateValue.isSameOrAfter(maxDate)) {
          if (num > 0 && num < 2) {
            this.Period = 300
            arr.push(dateValue.add(5, 'm').format('YYYY-MM-DD HH:mm:ss'))
          } else if (num < 6) {
            this.Period = 1800
            arr.push(dateValue.add(30, 'm').format('YYYY-MM-DD HH:mm:ss'))
          } else if (num < 16) {
            this.Period = 3600
            arr.push(dateValue.add(1, 'h').format('YYYY-MM-DD HH:mm:ss'))
          } else if (num < 31) {
            this.Period = 21600
            arr.push(dateValue.add(6, 'h').format('YYYY-MM-DD HH:mm:ss'))
          }
        }
        this.timey = arr
        this.startTime = moment(this.timeValue[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        ) // 格式处理
        this.endTime = moment(this.timeValue[1]).format('YYYY-MM-DD HH:mm:ss') // 格式处理
        this.describeDDoSTrend(this.timey)
        this.describeDDoSEvList()
      }
      this.clickFlag = false
    }
  },
  computed: {},
  created () {
    this.getData()
  },
  mounted () {
    // this.drawLine();
  },
  methods: {
    getData () {
      this.getIp()
      this.thisTime(1)
      this.describeDDoSEvList()
    },
    getIp () {
      this.ddosAttack = JSON.parse(localStorage.getItem('ddosAttack'))
    },
    // 1.1.获取DDoS攻击指标数据
    describeDDoSTrend (date) {
      let params = {
        Version: '2018-07-09',
        Business: this.business,
        Ip: this.ddosAttack['Ip.0'],
        MetricName: this.metricName,
        StartTime: this.startTime,
        EndTime: this.endTime,
        Period: this.Period
      }
      this.axios.post(DDOS_TREND, params).then(res => {
        if (res.Response.Error === undefined) {
          this.bps = res.Response.Data
          this.drawLine(res.Response.Data, date)
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },

    // 1.2.获取DDoS攻击事件列表
    describeDDoSEvList () {
      this.loading = true
      let params = {
        Version: '2018-07-09',
        Business: this.business,
        StartTime: this.startTime,
        EndTime: this.endTime,
        'IpList.0': this.ddosAttack['Ip.0']
      }
      this.axios.post(DDOS_EV_LIST, params).then(res => {
        // console.log(res)
        if (res.Response.Error === undefined) {
          this.tableDataBegin = res.Response.Data
          this.totalItems = this.tableDataBegin.length
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
        this.loading = false
      })
    },

    timedone (end, start, p) {
      var num = end.getTime() - start.getTime()
      var arr = []
      for (var i = 0; i <= num / p; i++) {
        var d = new Date(end.getTime() - p * i)
        arr.push(moment(d).format('MM-DD'))
      }
      this.timey = arr
    },
    // 选择时间
    thisTime (thisTime) {
      this.clickFlag = true
      // var ipt1 = document.querySelector(".newDataTime input:nth-child(2)");
      // var ipt2 = document.querySelector(".newDataTime input:nth-child(4)");
      let start
      let end = moment()
      const times = []
      if (thisTime == '1') {
        start = moment().startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          // times.push(start.add(1, "h").format("YYYY-MM-DD HH:mm:ss"));
          times.push(start.add(5, 'm').format('YYYY-MM-DD HH:mm:ss'))
        }
        //  ipt1.value = moment().format("YYYY-MM-DD")
        // ipt2.value = moment().format("YYYY-MM-DD");
        this.startTime = moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 今天：0点到当前的时间，粒度5分钟一个值
        this.Period = 300 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
        this.timeValue = [this.startTime, this.endTime]
      } else if (thisTime == '2') {
        start = moment()
          .subtract(6, 'd')
          .startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(1, 'h').format('YYYY-MM-DD HH:mm:ss'))
        }
        // ipt1.value = moment()
        //   .subtract(6, "d")
        //   .format("YYYY-MM-DD");
        // ipt2.value = moment().format("YYYY-MM-DD");
        this.startTime = moment()
          .subtract(6, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 2-5天：时间粒度为30分钟一个值
        this.Period = 3600 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
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
        //  ipt1.value = moment()
        //   .subtract(14, "d")
        //   .format("YYYY-MM-DD");
        // ipt2.value = moment().format("YYYY-MM-DD");
        this.startTime = moment()
          .subtract(14, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 6-15天：时间粒度为1小时一个值
        this.Period = 3600
        this.timey = times
        this.timeValue = [this.startTime, this.endTime]
        // ddos攻击-攻击流量带宽
      } else if (thisTime == '4') {
        start = moment()
          .subtract(29, 'd')
          .startOf('day')
        times.push(start.format('YYYY-MM-DD HH:mm:ss'))
        while (!start.isSameOrAfter(end)) {
          times.push(start.add(6, 'h').format('YYYY-MM-DD HH:mm:ss'))
        }
        // ipt1.value = moment()
        //   .subtract(29, "d")
        //   .format("YYYY-MM-DD");
        // ipt2.value = moment().format("YYYY-MM-DD");
        this.startTime = moment()
          .subtract(29, 'd')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment()
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        // 16-30天：时间粒度为6小时一个值
        this.Period = 21600 // 统计粒度，取值[300(5分钟)，3600(小时)，86400(天)]
        this.timey = times
        this.timeValue = [this.startTime, this.endTime]
      }
      this.describeDDoSTrend(this.timey)
      this.describeDDoSEvList()
    },

    drawLine (y, date) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        color: ['rgb(124, 181, 236)'],
        title: { text: '' },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: date
        },
        yAxis: {
          type: 'value',
          axisLine: {
            // y轴
            show: false
          },
          axisTick: {
            // 刻度线
            show: false
          },
          splitLine: {
            // 网格线
            show: false
          },
          axisLabel: {
            formatter: '{value}Mbps'
          },
          boundaryGap: true
        },
        series: [
          {
            symbol: 'none',
            name: '攻擊流量寬頻',
            type: 'line',
            data: y,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: 'rgb(124, 181, 236)'
                }
              }
            }
          }
        ],
        legend: {
          // 默认横向布局，纵向布局值为'vertical'
          orient: 'vertical',
          x: 'center', // 可设定图例在左、右、居中
          y: 'bottom',
          icon: 'line', // 图例样式
          textStyle: {
            // 文字样式
            fontWeight: 'bold'
          },
          lineStyle: {
            color: 'rgb(124, 181, 236)'
          }
        }
      })
    },
    // 时间格式化'yyyy-MM-dd hh:mm:ss'
    getDateString (date) {
      let o = {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
      }
      for (const i in o) {
        o[i] = (o[i] + '').length == 1 ? '0' + o[i] : o[i]
      }
      return o.y + '-' + o.M + '-' + o.d + ' ' + o.h + ':' + o.m + ':' + o.s
    },

    handleSizeChange (val) {
      this.pageSize = val
      this.handleCurrentChange(this.currentPage)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      // 需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd)
      } else {
        this.currentChangePage(this.filterTableDataEnd)
      }
    }, // 组件自带监控当前页码
    currentChangePage (list) {
      let from = (this.currentPage - 1) * this.pageSize
      let to = this.currentPage * this.pageSize
      this.tableDataEnd = []
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from])
        }
      }
    },
    // 获取持续时间
    durationDate (endTime, StartTime) {
      let durationTime = ''
      let stime = new Date(StartTime).getTime()
      let etime = new Date(endTime).getTime()
      let dateDiff = etime - stime
      let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天数
      if (dayDiff > 0) {
        durationTime += dayDiff + '天'
      }
      let leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000)) // 计算出小时数
      if (hours > 0) {
        durationTime += hours + '小時'
      }
      // 计算相差分钟数
      let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000)) // 计算相差分钟数
      if (minutes > 0) {
        durationTime += minutes + '分鐘'
      }
      // 计算相差秒数
      let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000)
      let leave4 = leave3 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      let minseconds = Math.round(leave4 / 1000)
      if (minseconds > 0) {
        durationTime += minseconds + '秒'
      }
      return durationTime
    }
  }
}
</script>
<style lang="scss">
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
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.newClear:after {
  clear: both;
  display: block;
  content: "";
}
.buttonGroupAll {
  float: left;
}
.buttonGroup {
  width: 66px;
  height: 30px;
  border-radius: 0;
  padding: 0 !important;
  text-align: center;
  line-height: 30px;
  float: left;
}
.buttonGroup:nth-child(1) {
  border-radius: 0 !important;
}
.buttonGroup:nth-child(5) {
  border-radius: 0 !important;
}
.newDataTime {
  float: left;
  height: 30px !important;
  border-radius: 0 !important;
  margin-left: -1px;
  span.el-range-separator {
    line-height: 24px;
    width: 8%;
  }
  i.el-range__icon {
    line-height: 24px;
  }
}
#myChart {
  width: 100%;
  height: 380px;
  margin: 20px 0;
}
</style>
