<template>
  <div id="Overview">
    <span style="font-size: 16px; font-weight: 700; line-height:3;">账单概览</span>
    <el-date-picker v-model="month" type="month" value-format="yyyy-MM" size="small" @change="getDataChar()" style="padding-left: 5px;">
    </el-date-picker>
    <span style="padding-left: 10px; font-size: 12px;">按扣费周期（按扣费时间统计生产月度账单）</span>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="18">
          <span style="font-size: 14px; font-weight: 700; line-height:1">费用趋势</span>
          <span style="font-size: 12px; color: #888;  margin-left: 5px; line-height:1">（单位：元）</span>
          <el-select style="float: right;" v-model="yearvalue" @change="selectYear" size="small">
            <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value" size="mini">
            </el-option>
          </el-select>
          <el-select style="float: right;" v-model="value" @change="changeSelect" size="small">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" size="mini">
            </el-option>
          </el-select>
          <div id="J_chartBarBox" class="chart-box" style="height: 250px;"></div>
        </el-col>
        <el-col :span="6">
          <el-form>
            <span style="font-size: 16px; color: #000; line-height: 50px;">{{this.month.split('-')[0]}} 年 {{this.month.split('-')[1]}} 月</span>
            <el-form-item style="height: 20px;">
              <span style="font-size: 12px; color: #666;">统计周期</span>
              <span style="float: right; font-size: 12px; color: #666;">按扣费周期</span>
            </el-form-item>
            <el-form-item style="height: 20px;">
              <span style="font-size: 12px; color: #666;">总费用</span>
              <span style="font-size: 16px; float: right; color: #006EFF;">{{this.total}}</span>
            </el-form-item>
            <span style="float: right;">=</span>
            <el-form-item style="height: 20px;">
              <span style="font-size: 12px; color: #666;">现金支付</span>
              <span style="font-size: 16px; float: right;">{{this.cash}}</span>
            </el-form-item>
            <span style="float: right;">+</span>
            <el-form-item style="height: 20px;">
              <span style="font-size: 12px; color: #666;">赠送金支付</span>
              <span style="font-size: 16px; float: right;">{{this.incentive}}</span>
            </el-form-item>
            <span style="float: right;">+</span>
            <el-form-item style="height: 20px;">
              <span style="font-size: 12px; color: #666;">代金券支付</span>
              <span style="font-size: 16px; float: right;">{{this.voucher}}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <br>
    <el-card>
      <span style="font-size: 14px; font-weight: 700; line-height:1">{{this.month.split('-')[0]}}年{{this.month.split('-')[1]}}月账单汇总</span>
      <span style="font-size: 12px; color: #888;  margin-left: 5px; line-height:1">（单位：元）</span>
      <div><br></div>
      <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="按产品汇总" name="first">
            <div id="main2" style="float:left; width:1067px; height: 300px"></div>
            <el-table :data="dataList1" v-loading="dataListLoading" style="width: 100%;">
              <el-table-column prop="business_code_name" label="产品名称">
              </el-table-column>
              <el-table-column prop="cashAmount" header-align="center" align="center" label="现金支付">
                <template slot-scope="scope">
                  <span>{{scope.row.cashAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="incentiveAmount" header-align="center" align="center" label="赠送金支付">
                <template slot-scope="scope">
                  <span>{{scope.row.incentiveAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="voucherAmount" header-align="center" align="center" label="代金券支付">
                <template slot-scope="scope">
                  <span>{{scope.row.voucherAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalAmount" header-align="center" align="center" label="总费用">
                <template slot-scope="scope">
                  <span>{{scope.row.totalAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="state" header-align="center" align="center" label="费用趋势">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="按项目（组）汇总" name="second" style="width:100%">
            <div id="main3" style="float: left; width: 1067px; height: 300px"></div>
            <el-table :data="dataList2" row-key="id" :tree-props="{children: 'children'}"  v-loading="dataListLoading" style="width: 100%; margin-bottom: 20px;">
              <el-table-column prop="project_name" label="项目名称" ></el-table-column>
              <el-table-column prop="cashAmount" header-align="center" align="center" label="现金支付">
                <template slot-scope="scope">
                  <span>{{scope.row.cashAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="incentiveAmount" header-align="center" align="center" label="赠送金支付">
                <template slot-scope="scope">
                  <span>{{scope.row.incentiveAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="voucherAmount" header-align="center" align="center" label="代金券支付">
                <template slot-scope="scope">
                  <span>{{scope.row.voucherAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalAmount" header-align="center" align="center" label="总费用">
                <template slot-scope="scope">
                  <span>{{scope.row.totalAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="state" header-align="center" align="center" label="费用趋势"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import echarts from 'echarts'
export default {
  data () {
    return {
      chartBar: null,
      chartRing: null,
      chartShadow: null,
      activeName: 'first',
      dataList1: [],
      dataList2: [],
      month: '',
      value: '',
      yearvalue: '',
      total: '',
      cash: '',
      incentive: '',
      voucher: '',
      dataListLoading: false,
      options: [{
        value: 'total',
        label: '总费用'
      }, {
        value: 'cash',
        label: '现金支付'
      }, {
        value: 'incentive',
        label: '赠送金支付'
      }, {
        value: 'voucher',
        label: '代金券支付'
      }],
      years: [{
        value: 'half',
        label: '近半年'
      }, {
        value: 'year',
        label: '近一年'
      }]
    }
  },
  mounted () {
    this.month = moment(new Date()).format('YYYY-MM-DD')
    this.initChartBar()
    this.initChart()
    this.initShadow()
    this.initCost()
    this.getDataList1()
    this.getDataList2()
    this.initLine()
  },
  activated () {
    if (this.chartBar) {
      this.chartBar.resize()
    }
    if (this.chartRing) {
      this.chartRing.resize()
    }
    if (this.chartShadow) {
      this.chartShadow.resize()
    }
  },
  methods: {
    // 柱状图
    initChartBar () {
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/costTrend?date=` + this.month + `&year=` + this.yearvalue + `&costType=` + this.value + `&uin=` + `100011921910`).then(data => {
        var list = data.chart
        const months = []
        var totalAmounts = []
        for (var i = 0; i < list.length; i++) {
          months.push(list[i].month)
          if (this.value == 'total') {
            totalAmounts.push(list[i].totalAmount)
          } else if (this.value == 'cash') {
            totalAmounts.push(list[i].cashAmount)
          } else if (this.value == 'incentive') {
            totalAmounts.push(list[i].incentiveAmount)
          } else if (this.value == 'voucher') {
            totalAmounts.push(list[i].voucherAmount)
          }
        }
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: months
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: function (value, index) {
                return value.toFixed(2)
              }
            }
          }],
          label: {
            normal: {
              show: true,
              position: 'top',
              textStyle: {
                color: '#006EFF'
              }
            }
          },
          series: [{
            type: 'bar',
            color: '#006EFF',
            barWidth: 30,
            data: totalAmounts
          }]
        }
        this.chartBar = this.$echarts.init(document.getElementById('J_chartBarBox'))
        this.chartBar.setOption(option)
        window.addEventListener('resize', () => {
          this.chartBar.resize()
        })
      })
    },
    // 费用计算
    initCost () {
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/costTrend?date=` + this.month + `&year=` + this
        .yearvalue + `&costType=` + this.value + `&uin=` + `100011921910`).then(data => {
        this.total = data.chart[data.chart.length - 1].totalAmount
        this.cash = data.chart[data.chart.length - 1].cashAmount
        this.incentive = data.chart[data.chart.length - 1].incentiveAmount
        this.voucher = data.chart[data.chart.length - 1].voucherAmount
      })
    },
    // 环状图
    initChart () {
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/productTotal?date=` + this.month + `&uin=` +
        `100011921910`).then(data => {
        var list = data.chart
        var arr = []
        var values = []
        var names = []
        let total = 0
        for (var i = 0; i < list.length; i++) {
          arr.push({
            'name': list[i].business_code_name,
            'value': list[i].totalAmount
          })
          values.push(list[i].totalAmount)
          names.push(list[i].business_code_name)
          total += list[i].totalAmount
        }
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} </br>{c} ({d}%)'
          },
          //color: colors,
          legend: {
            orient: 'vertical',
            x: 'right',
            y: 'center',
            data: names,
            left: 600,
            icon: 'circle',
            formatter: function (name) {
              let tarValue = 0
              let _index = 0
              list.forEach((item, i) => {
                if (item.business_code_name == name) {
                  _index = i
                  tarValue = item.totalAmount
                }
              })
              let p = (tarValue / total * 100).toFixed(2)
              let arr
              arr = [
                name,
                list[_index].totalAmount + '(' + p + '%）'
              ]
              return arr.join('       ')
            }
          },
          series: [{
            type: 'pie',
            center: ['20%', '50%'], // 饼图的圆心坐标
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: { //  饼图图形上的文本标签
              normal: {
                show: true,
                position: 'center',
                formatter: '{active|总费用}' + '\n\r' + '{total|' + total.toFixed(2) + '}' + '{active|元}',
                rich: {
                  total: {
                    fontSize: 20,
                    color: '#000',
                    fontWeight: '200'
                  },
                  active: {
                    fontSize: 12,
                    color: '#888',
                    lineHeight: 30
                  }
                }
              }
            },
            data: arr
          }]
        }
        this.chartRing = echarts.init(document.getElementById('main2'))
        this.chartRing.setOption(option)
        window.addEventListener('resize', () => {
          this.chartRing.resize()
        })
      })
    },
    // 表格1
    getDataList1 () {
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/productTotalList?date=` + this.month + `&uin=` +
        `100011921910`).then(data => {
        console.log('---' + data)
        if (data && data.code === 0) {
          this.dataList1 = data.list
        // this.totalPage = data.page.totalCount
        } else {
          this.dataList1 = []
        // this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 条形图
    initShadow () {
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/projectCol?date=` + this.month + `&uin=` +
        `100011921910`).then(data => {
        var list = data.chart
        var projects = []
        var totalAmounts = []
        for (var i = 0; i < list.length; i++) {
          projects.push(list[i].project_name)
          totalAmounts.push(list[i].totalAmount)
        }
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: 100,
            right: 10
            // right: '40%',
            // bottom: '3%',
            // containLabel: true
          },
          xAxis: {
            type: 'value',
            axisTick: {
              show: false //不显示坐标轴刻度线
            },
            axisLine: {
              show: false //不显示坐标轴线
            },
            axisLabel: {
              show: false //不显示坐标轴上的文字
            },
            splitLine: {
              show: false //不显示网格线
            }
          },
          yAxis: {
            data: projects,
            type: 'category',
            axisLine: {
              show: false //不显示坐标轴线
            },
            axisTick: {
              show: false //不显示坐标轴刻度线
            }
          },
          series: [{
            type: 'bar',
            color: '#006EFF',
            barWidth: 30,
            data: totalAmounts
          }]
        }
        this.chartShadow = echarts.init(document.getElementById('main3'))
        this.chartShadow.setOption(option)
        window.addEventListener('resize', () => {
          this.chartShadow.resize()
        })
      })
    },
    // 表格2
    getDataList2 () {
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/projectCol?date=` + this.month + `&uin=` +
        `100011921910`).then(data => {
        console.log('---' + data)
        if (data && data.code === 0) {
          this.dataList2 = data.chart
        // this.totalPage = data.page.totalCount
        } else {
          this.dataList2 = []
        // this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 折线图
    initLine () {
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbilldetails/getLineList?date=` + this.month + `&uin=` +
        `100011921910`).then(data => {
        var list = data.chart
        var projects = []
        var totalAmounts = []
        for (var i = 0; i < list.length; i++) {
          projects.push(list[i].project_name)
          totalAmounts.push(list[i].totalAmount)
        }
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: 100,
            right: 10
            // right: '40%',
            // bottom: '3%',
            // containLabel: true
          },
          xAxis: {
            type: 'value',
            axisTick: {
              show: false //不显示坐标轴刻度线
            },
            axisLine: {
              show: false //不显示坐标轴线
            },
            axisLabel: {
              show: false //不显示坐标轴上的文字
            },
            splitLine: {
              show: false //不显示网格线
            }
          },
          yAxis: {
            data: projects,
            type: 'category',
            axisLine: {
              show: false //不显示坐标轴线
            },
            axisTick: {
              show: false //不显示坐标轴刻度线
            }
          },
          series: [{
            type: 'bar',
            color: '#006EFF',
            barWidth: 30,
            data: totalAmounts
          }]
        }
        this.chartShadow = echarts.init(document.getElementById('main4'))
        this.chartShadow.setOption(option)
        window.addEventListener('resize', () => {
          this.chartShadow.resize()
        })
      })
    },
    selectYear () {
      this.initChartBar()
    },
    changeSelect () {
      this.initChartBar()
    },
    getDataChar () {
      this.initChartBar()
      this.initChart()
      this.initShadow()
      this.initCost()
      this.getDataList1()
      this.getDataList2()
    },
    handleClick (tab, event) {
      console.log(tab, event)
    }
  },
  created () {
    this.value = this.options[0].value
    this.yearvalue = this.years[0].value
  }
}
</script>

<style lang="scss">
 .el-table__expand-icon {
   float: left
 }
</style>
