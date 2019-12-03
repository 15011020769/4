<template>
  <div id="Overview">
    <div class="ovew">
      <span class="bill" style="font-size: 16px; font-weight: 700; line-height:3;">{{$t('BILL.BILL.Overview.title')}}</span>
      <el-date-picker v-model="month" type="month" value-format="yyyy-MM-dd" size="small" @change="getDataChar()" style="padding-left: 5px;">
      </el-date-picker>
      <span style="padding-left: 10px; font-size: 12px;">{{$t('BILL.BILL.Overview.note')}}</span>
    </div>
    <el-card class="ovew-echar">
      <el-row :gutter="20">
        <el-col :span="18">
          <span style="font-size: 14px; font-weight: 700; line-height:1">{{$t('BILL.BILL.Overview.costTrend')}}</span>
          <span style="font-size: 12px; color: #888;  margin-left: 5px; line-height:1">{{$t('BILL.BILL.Overview.unit')}}</span>
          <el-select style="float: right;" v-model="value" @change="changeSelect" size="small">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" size="mini">
            </el-option>
          </el-select>
          <el-button-group style="float: right; padding-right:5px;">
            <el-button @click="initChartBar('half')" size="small">{{$t('BILL.BILL.Overview.half')}}</el-button>
            <el-button @click="initChartBar('year')" size="small">{{$t('BILL.BILL.Overview.year')}}</el-button>
          </el-button-group>
          <div id="J_chartBarBox" class="chart-box" style="height: 250px;"></div>
        </el-col>
        <el-col :span="6">
          <el-form>
            <span style="font-size: 16px; color: #000; line-height: 50px;">{{this.month.split('-')[0]}} 年 {{this.month.split('-')[1]}} 月</span>
            <el-form-item style="height: 20px;">
              <span style="font-size: 12px; color: #666;">{{$t('BILL.BILL.Overview.statCycle')}}</span>
              <span style="float: right; font-size: 12px; color: #666;">{{$t('BILL.BILL.Overview.feeCycle')}}</span>
            </el-form-item>
            <el-form-item style="height: 20px;">
              <span style="font-size: 12px; color: #666;">{{$t('BILL.BILL.Overview.totalAmount')}}</span>
              <span style="font-size: 16px; float: right; color: #006EFF;">{{this.total}}</span>
            </el-form-item>
            <span style="float: right;">=</span>
            <el-form-item style="height: 20px;">
              <span style="font-size: 12px; color: #666;">{{$t('BILL.BILL.Overview.cashAmount')}}</span>
              <span style="font-size: 16px; float: right;">{{this.cash}}</span>
            </el-form-item>
            <span style="float: right;">+</span>
            <el-form-item style="height: 20px;">
              <span style="font-size: 12px; color: #666;">{{$t('BILL.BILL.Overview.incentiveAmount')}}</span>
              <span style="font-size: 16px; float: right;">{{this.incentive}}</span>
            </el-form-item>
            <span style="float: right;">+</span>
            <el-form-item style="height: 20px;">
              <span style="font-size: 12px; color: #666;">{{$t('BILL.BILL.Overview.voucherAmount')}}</span>
              <span style="font-size: 16px; float: right;">{{this.voucher}}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <br>
    <el-card>
      <span style="font-size: 14px; font-weight: 700; line-height:1">{{this.month.split('-')[0]}}年{{this.month.split('-')[1]}}月{{$t('BILL.BILL.Overview.billSum')}}</span>
      <span style="font-size: 12px; color: #888;  margin-left: 5px; line-height:1">{{$t('BILL.BILL.Overview.unit')}}</span>
      <div><br></div>
      <div>
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane :label="$t('BILL.BILL.Overview.productSum')" name="first">
            <div id="main2" style="float:left; width:1067px; height: 300px"></div>
            <el-table :data="dataList1" v-loading="dataListLoading" style="width: 100%;">
              <el-table-column prop="business_code_name" :label="$t('BILL.BILL.Overview.businessCodeName')">
              </el-table-column>
              <el-table-column prop="cashAmount" align="right" :label="$t('BILL.BILL.Overview.cashAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.cashAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="incentiveAmount" align="right" :label="$t('BILL.BILL.Overview.incentiveAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.incentiveAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="voucherAmount" align="right" :label="$t('BILL.BILL.Overview.voucherAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.voucherAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalAmount" align="right" :label="$t('BILL.BILL.Overview.totalAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.totalAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="state" align="center" :label="$t('BILL.BILL.Overview.costTrend')">
                <template slot-scope="scope">
                  <div slot="reference" >
                    <el-popover placement="left" width="700" ref="popover" trigger="hover" >
                      <div slot="reference">
                        <svg t="1574819723346" :index="scope.$index" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2324" width="40" height="20"><path d="M664.1 783c-3.8 0-7.6-0.2-11.3-0.5-36.3-3.1-68.9-20.6-96.9-52.1-28.4-32-52.5-79.4-71.4-140.8-32.4-105-66.1-182.6-100.3-230.6-25.5-35.8-50.2-54-73.4-54h-0.4c-38.8 0.4-84.8 51-129.3 142.7-37 76.2-59.4 153-59.7 153.8L64 582.6c1-3.4 24.3-83.1 63.7-164.3 56.8-117 118.1-176.6 182.1-177.3h1c43 0 83.8 26.7 121.2 79.3 38.2 53.7 75.1 137.5 109.5 249.3 29.3 94.9 68.3 145.1 116 149.1 21.3 1.8 45.6-5.2 72.2-20.9 24.5-14.4 50.3-35.8 76.8-63.5 49.6-51.9 87.7-111.9 100.1-137.6L960 526c-14.6 30.4-56.4 96.4-111.4 154-30.4 31.8-60.6 56.6-89.9 73.9-32.8 19.3-64.6 29.1-94.6 29.1z" fill="#1296db" p-id="2325"></path></svg>
                      </div>
                      <div name="tableLine1" style="height: 250px; width:650px"></div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('BILL.BILL.Overview.projectSum')" name="second" style="width:100%">
            <div id="main3" style="float: left; width: 1067px; height: 300px"></div>
            <el-table :data="dataList2" row-key="id" :tree-props="{children: 'children'}"  v-loading="dataListLoading" style="width: 100%;">
              <el-table-column prop="project_name" :label="$t('BILL.BILL.Overview.projectName')" ></el-table-column>
              <el-table-column prop="cashAmount" align="right" :label="$t('BILL.BILL.Overview.cashAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.cashAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="incentiveAmount" align="right" :label="$t('BILL.BILL.Overview.incentiveAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.incentiveAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="voucherAmount" align="right" :label="$t('BILL.BILL.Overview.voucherAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.voucherAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalAmount" align="right" :label="$t('BILL.BILL.Overview.totalAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.totalAmount}} 元</span>
                </template>
              </el-table-column>
              <el-table-column prop="state" align="center" :label="$t('BILL.BILL.Overview.costTrend')">
                <template slot-scope="scope">
                  <div slot="reference" >
                    <el-popover placement="left" width="700" ref="popover" trigger="hover" >
                      <div slot="reference">
                        <svg t="1574819723346" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2324" width="40" height="20"><path d="M664.1 783c-3.8 0-7.6-0.2-11.3-0.5-36.3-3.1-68.9-20.6-96.9-52.1-28.4-32-52.5-79.4-71.4-140.8-32.4-105-66.1-182.6-100.3-230.6-25.5-35.8-50.2-54-73.4-54h-0.4c-38.8 0.4-84.8 51-129.3 142.7-37 76.2-59.4 153-59.7 153.8L64 582.6c1-3.4 24.3-83.1 63.7-164.3 56.8-117 118.1-176.6 182.1-177.3h1c43 0 83.8 26.7 121.2 79.3 38.2 53.7 75.1 137.5 109.5 249.3 29.3 94.9 68.3 145.1 116 149.1 21.3 1.8 45.6-5.2 72.2-20.9 24.5-14.4 50.3-35.8 76.8-63.5 49.6-51.9 87.7-111.9 100.1-137.6L960 526c-14.6 30.4-56.4 96.4-111.4 154-30.4 31.8-60.6 56.6-89.9 73.9-32.8 19.3-64.6 29.1-94.6 29.1z" fill="#1296db" p-id="2325"></path></svg>
                      </div>
                      <div name="tableLine2" :id="'tableLine2-'+scope.row.id" style="height: 250px; width:650px"></div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <div class="paging">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage2" layout="total, sizes, prev, pager, next, jumper" style="float: right;">
            </el-pagination>
          </div>
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
      charLine1: null,
      activeName: 'first',
      dataList1: [],
      dataList2: [],
      month: '',
      value: '',
      yearvalue: 'half',
      total: 0,
      cash: '',
      incentive: '',
      voucher: '',
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage1: 1,
      totalPage2: 1,
      options: [{
        value: 'total',
        label: this.$t('BILL.BILL.Overview.totalAmount')
      }, {
        value: 'cash',
        label: this.$t('BILL.BILL.Overview.cashAmount')
      }, {
        value: 'incentive',
        label: this.$t('BILL.BILL.Overview.incentiveAmount')
      }, {
        value: 'voucher',
        label: this.$t('BILL.BILL.Overview.voucherAmount')
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
    this.initLine1()
    this.initLine2()
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
    if (this.charLine1) {
      this.charLine1.resize()
    }
    if (this.charLine2) {
      this.charLine1.resize()
    }
  },
  methods: {
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList1()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList1()
    },
    // 柱状图
    initChartBar (param) {
      if (param === undefined || param === '') {
        this.yearvalue = 'half'
      } else {
        this.yearvalue = param
      }
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/costTrend?date=` + this.month + `&year=` + this.yearvalue + `&costType=` + this.value + `&uin=` + this.$cookie.get('uin')).then(data => {
        var list = data.chart
        const months = []
        var totalAmounts = []
        for (var i = 0; i < list.length; i++) {
          months.push(list[i].month)
          if (this.value === 'total') {
            totalAmounts.push(list[i].totalAmount)
          } else if (this.value === 'cash') {
            totalAmounts.push(list[i].cashAmount)
          } else if (this.value === 'incentive') {
            totalAmounts.push(list[i].incentiveAmount)
          } else if (this.value === 'voucher') {
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
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/costTrend?date=` + this.month + `&year=` + this
        .yearvalue + `&costType=` + this.value + `&uin=` + this.$cookie.get('uin')).then(data => {
        this.total = data.chart[data.chart.length - 1].totalAmount
        this.cash = data.chart[data.chart.length - 1].cashAmount
        this.incentive = data.chart[data.chart.length - 1].incentiveAmount
        this.voucher = data.chart[data.chart.length - 1].voucherAmount
      })
    },
    // 环状图
    initChart () {
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/productTotal?date=` + this.month + `&uin=` +
        this.$cookie.get('uin')).then(data => {
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
                if (item.business_code_name === name) {
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
            center: ['20%', '50%'],
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
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
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/productTotalList?date=` + this.month + `&uin=` +
        this.$cookie.get('uin') + `&pages=` + this.pageIndex + `&limit=` + this.pageSize).then(data => {
        // console.log('---' + data)
        if (data && data.code === 0) {
          this.dataList1 = data.data.list
          this.totalPage1 = data.data.totalCount
        } else {
          this.dataList1 = []
          this.totalPage1 = 0
        }
        this.initLine1()
        this.dataListLoading = false
      })
    },
    // 条形图
    initShadow () {
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/projectCol?date=` + this.month + `&uin=` +
        this.$cookie.get('uin')).then(data => {
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
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            data: projects,
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          series: [{
            type: 'bar',
            color: '#006EFF',
            barWidth: 24,
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
      this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/projectColList?date=` + this.month + `&uin=` +
        this.$cookie.get('uin') + `&pages=` + this.pageIndex + `&limit=` + this.pageSize).then(data => {
        if (data && data.code === 0) {
          this.dataList2 = data.data.list
          this.totalPage2 = data.data.totalCount
        } else {
          this.dataList2 = []
          this.totalPage2 = 0
        }
        this.initLine2()
        this.dataListLoading = false
      })
    },
    // 折线图1
    initLine1 () {
      this.dataList1.forEach((row, index) => {
        const productName = row.business_code_name
        this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/getLineList?date=` + this.month + `&uin=` +
         this.$cookie.get('uin') + `&businessCodeName=` + productName).then(data => {
          var list = data.chart
          var xMonth = []
          var yTotalAmounts = []
          var yCastAmounts = []
          for (var i = list.length - 1; i >= 0; i--) {
            xMonth.push(list[i].month)
            yTotalAmounts.push(list[i].totalAmount)
            yCastAmounts.push(list[i].cashAmount)
          }
          var option = {
            title: {
              text: productName + '的费用趋势'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['总费用', '现金支付'],
              x: 'right'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xMonth
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '总费用',
                type: 'line',
                stack: '总量',
                data: yTotalAmounts
              },
              {
                name: '现金支付',
                type: 'line',
                stack: '总量',
                data: yCastAmounts
              }
            ]
          }
          document.getElementsByName('tableLine1')[index].id = 'tableLine1' + index
          this.charLine1 = echarts.init(document.getElementById('tableLine1' + index))
          this.charLine1.setOption(option)
          window.addEventListener('resize', () => {
            this.charLine1.resize()
          })
        })
      })
    },
    // 折线图2
    initLine2 () {
      // console.log(this.dataList2)
      this.dataList2.forEach((row, index) => {
        const project = row.project_name
        this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/getLineList?date=` + this.month + `&uin=` +
          this.$cookie.get('uin') + `&projectName=` + project).then(data => {
          var list = data.chart
          var xMonth = []
          var yTotalAmounts = []
          var yCastAmounts = []
          for (var i = list.length - 1; i >= 0; i--) {
            xMonth.push(list[i].month)
            yTotalAmounts.push(list[i].totalAmount)
            yCastAmounts.push(list[i].cashAmount)
          }
          var option = {
            title: {
              text: project + '的费用趋势'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['总费用', '现金支付'],
              x: 'right'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xMonth
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '总费用',
                type: 'line',
                stack: '总量',
                data: yTotalAmounts
              },
              {
                name: '现金支付',
                type: 'line',
                stack: '总量',
                data: yCastAmounts
              }
            ]
          }
          this.charLine2 = echarts.init(document.getElementById('tableLine2-' + row.id))
          this.charLine2.setOption(option)
          window.addEventListener('resize', () => {
            this.charLine2.resize()
          })
          row.children.forEach((value, index) => {
            // console.log(row.id)
            this.$axios.post(`${process.env.VUE_APP_adminUrl}taifucloud/tbillproduct/getLineList?date=` + this.month + `&uin=` +
            this.$cookie.get('uin') + `&projectName=` + project + `&businessCodeName=` + value.project_name).then(data => {
              var list = data.chart
              var xMonth = []
              var yTotalAmounts = []
              var yCastAmounts = []
              for (var i = list.length - 1; i >= 0; i--) {
                xMonth.push(list[i].month)
                yTotalAmounts.push(list[i].totalAmount)
                yCastAmounts.push(list[i].cashAmount)
              }
              var option = {
                title: {
                  text: value.project_name + '的费用趋势'
                },
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data: ['总费用', '现金支付'],
                  x: 'right'
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: xMonth
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name: '总费用',
                    type: 'line',
                    stack: '总量',
                    data: yTotalAmounts
                  },
                  {
                    name: '现金支付',
                    type: 'line',
                    stack: '总量',
                    data: yCastAmounts
                  }
                ]
              }
              this.charLine2 = echarts.init(document.getElementById('tableLine2-' + value.id))
              this.charLine2.setOption(option)
              window.addEventListener('resize', () => {
                this.charLine2.resize()
              })
            })
          })
        })
      })
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
    }
  },
  created () {
    this.value = this.options[0].value
  }
}
</script>

<style lang="scss">

  .el-card{
    width: 96%;
    margin: 0 auto;
  }
  .bill{
    margin-right:20px;
  }
  .paging{
    width: 100%;
    height: 30px;
    background: rgb(255, 255, 255);
    padding: 10px;
    /* display: flex; */
    justify-content: space-between;
    line-height: 30px;
  }
  .ovew{
    color: #000;
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    padding: 0 20px;
    background: #fff;
    font-size: 16px;
    display: -webkit-box;
    display: -ms-flexbox;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin-bottom: 20px;
  }
 .el-table__expand-icon {
   float: left
 }
</style>
