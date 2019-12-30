<template>
  <div id="Overview">

    <!-- title -->
    <div class="ovew">
      <span class="bill">{{$t('BILL.Overview.title')}}</span>
      <el-date-picker v-model="month" type="month" value-format="yyyy-MM-dd" size="small" @change="getDataChar()" style="padding-left: 5px;">
      </el-date-picker>
      <span style="padding-left: 10px; font-size: 12px;">{{$t('BILL.Overview.note')}}</span>
    </div>

    <!-- 費用趨勢 -->
    <el-card class="ovew-echar">
      <el-row :gutter="20">
        <el-col :span="24">
          <span style="font-size: 14px; font-weight: 700; line-height:1">{{$t('BILL.Overview.costTrend')}}</span>
          <span style="font-size: 12px; color: #888;  margin-left: 5px; line-height:1">{{$t('BILL.Overview.unit')}}</span>
          <el-button-group style="float: right; padding-right:5px;">
            <el-button @click="initChartBar('half')" :class="{'btn-active': yearvalue === 'half'}" size="small">{{$t('BILL.Overview.half')}}</el-button>
            <el-button @click="initChartBar('year')" :class="{'btn-active': yearvalue === 'year'}" size="small">{{$t('BILL.Overview.year')}}</el-button>
          </el-button-group>
          <div id="J_chartBarBox" class="chart-box" style="height: 300px;"></div>
        </el-col>
      </el-row>
    </el-card>

    <br>

    <!-- 账单汇总 -->
    <el-card class="table-card">
      <span class="span-1">{{this.month.split('-')[0]}}年{{this.month.split('-')[1]}}月{{$t('BILL.Overview.billSum')}}</span>
      <span class="span-2">{{$t('BILL.Overview.unit')}}</span>
      <div><br></div>
      <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">

          <!-- 按产品汇总 -->
          <el-tab-pane :label="$t('BILL.Overview.productSum')" name="first">
            <div id="main2" style="float:left; width:1067px; height: 300px"></div>
            <el-table :data="dataList1" v-loading="dataListLoading" style="width: 100%;">
              <template slot="empty">{{$t('BILL.Overview.none')}}</template>
              <el-table-column prop="business_code_name" :label="$t('BILL.Overview.businessCodeName')">
              </el-table-column>
              <el-table-column prop="totalAmount" align="center" :label="$t('BILL.Overview.cashAmount')">
              </el-table-column>
              <el-table-column prop="totalAmount" align="center" :label="$t('BILL.Overview.totalAmount')">
              </el-table-column>
              <el-table-column prop="state" align="center" width="100" :label="$t('BILL.Overview.costTrend')">
                <template slot-scope="scope">
                  <div slot="reference">
                    <el-popover placement="left" width="700" ref="popover" trigger="hover">
                      <div slot="reference">
                        <svg t="1574819723346" :index="scope.$index" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2324" width="40" height="20">
                          <path d="M664.1 783c-3.8 0-7.6-0.2-11.3-0.5-36.3-3.1-68.9-20.6-96.9-52.1-28.4-32-52.5-79.4-71.4-140.8-32.4-105-66.1-182.6-100.3-230.6-25.5-35.8-50.2-54-73.4-54h-0.4c-38.8 0.4-84.8 51-129.3 142.7-37 76.2-59.4 153-59.7 153.8L64 582.6c1-3.4 24.3-83.1 63.7-164.3 56.8-117 118.1-176.6 182.1-177.3h1c43 0 83.8 26.7 121.2 79.3 38.2 53.7 75.1 137.5 109.5 249.3 29.3 94.9 68.3 145.1 116 149.1 21.3 1.8 45.6-5.2 72.2-20.9 24.5-14.4 50.3-35.8 76.8-63.5 49.6-51.9 87.7-111.9 100.1-137.6L960 526c-14.6 30.4-56.4 96.4-111.4 154-30.4 31.8-60.6 56.6-89.9 73.9-32.8 19.3-64.6 29.1-94.6 29.1z" fill="#1296db" p-id="2325"></path>
                        </svg>
                      </div>
                      <div name="tableLine1" style="height: 250px; width:650px"></div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- <div class="paging">
              <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage1" layout="total, sizes, prev, pager, next, jumper" style="float: right;">
              </el-pagination>
            </div> -->
            <div class="Right-style pagstyle" style="height:70px;display:flex;align-items:center;">
              <span class="pagtotal">共&nbsp;{{totalPage1}}&nbsp;條</span>
              <el-pagination
                :page-size="pageSize"
                :pager-count="7"
                layout="prev, pager, next"
                @current-change="currentChangeHandle"
                :total="totalPage1"
              ></el-pagination>
            </div>
          </el-tab-pane>

          <!-- 按项目汇总 -->
          <el-tab-pane :label="$t('BILL.Overview.projectSum')" name="second" style="width:100%">
            <div id="main3" style="float: left; width: 1067px; height: 300px"></div>
            <el-table :data="dataList2" row-key="id" :tree-props="{children: 'children'}" v-loading="dataListLoading" style="width: 100%;">
              <template slot="empty">{{$t('BILL.Overview.none')}}</template>
              <el-table-column prop="project_name" :label="$t('BILL.Overview.projectName')"></el-table-column>
              <el-table-column prop="cashAmount" align="right" :label="$t('BILL.Overview.cashAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.cashAmount}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="incentiveAmount" align="right" :label="$t('BILL.Overview.incentiveAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.incentiveAmount}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="voucherAmount" align="right" :label="$t('BILL.Overview.voucherAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.voucherAmount}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalAmount" align="right" :label="$t('BILL.Overview.totalAmount')">
                <template slot-scope="scope">
                  <span>{{scope.row.totalAmount}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="state" align="center" width="100" :label="$t('BILL.Overview.costTrend')">
                <template slot-scope="scope">
                  <div slot="reference">
                    <el-popover placement="left" width="700" ref="popover" trigger="hover">
                      <div slot="reference">
                        <svg t="1574819723346" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2324" width="40" height="20">
                          <path d="M664.1 783c-3.8 0-7.6-0.2-11.3-0.5-36.3-3.1-68.9-20.6-96.9-52.1-28.4-32-52.5-79.4-71.4-140.8-32.4-105-66.1-182.6-100.3-230.6-25.5-35.8-50.2-54-73.4-54h-0.4c-38.8 0.4-84.8 51-129.3 142.7-37 76.2-59.4 153-59.7 153.8L64 582.6c1-3.4 24.3-83.1 63.7-164.3 56.8-117 118.1-176.6 182.1-177.3h1c43 0 83.8 26.7 121.2 79.3 38.2 53.7 75.1 137.5 109.5 249.3 29.3 94.9 68.3 145.1 116 149.1 21.3 1.8 45.6-5.2 72.2-20.9 24.5-14.4 50.3-35.8 76.8-63.5 49.6-51.9 87.7-111.9 100.1-137.6L960 526c-14.6 30.4-56.4 96.4-111.4 154-30.4 31.8-60.6 56.6-89.9 73.9-32.8 19.3-64.6 29.1-94.6 29.1z" fill="#1296db" p-id="2325"></path>
                        </svg>
                      </div>
                      <div name="tableLine2" :id="'tableLine2-'+scope.row.id" style="height: 250px; width:650px"></div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- <div class="paging">
              <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage2" layout="total, sizes, prev, pager, next, jumper" style="float: right;">
              </el-pagination>
            </div> -->
            <div class="Right-style pagstyle" style="height:70px;display:flex;align-items:center;">
              <span class="pagtotal">共&nbsp;{{totalPage2}}&nbsp;條</span>
              <el-pagination
                :page-size="pageSize"
                :pager-count="7"
                layout="prev, pager, next"
                @current-change="currentChangeHandle1"
                :total="totalPage2"
              ></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import echarts from 'echarts'
import { COST_TREND, PRODUCT_TOTAL, PRODUCT_TOTAL_LIST, GET_LINE_LIST, PROJECT_COL, PROJECT_COL_LIST } from '@/constants/BILL.js'     // 获取接口
export default {
  data() {
    return {
      chartBar: null,
      chartRing: null,
      chartShadow: null,
      charLine1: null,
      charLine2: null,
      activeName: 'first',        // 标签页参数
      dataList1: [],              // 按产品汇总表格接口返回的数据
      dataList2: [],              // 按项目（组）汇总表格接口返回的数据
      month: moment(new Date()).format('YYYY-MM'),                  // 账单月份
      value: 'total',                  // 费用下拉框组件中的值
      yearvalue: 'half',          // 半年、一年过滤参数
      total: 0,                   // 费用计算-總費用
      cash: '',                   // 费用计算-现金支付
      incentive: '',              // 费用计算-赠送金支付
      voucher: '',                // 费用计算-代金券支付
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage1: 1,              // 按产品汇总-表格的总条数
      totalPage2: 1,              // 按项目（租）汇总-表格的总条数
    }
  },
  mounted() {
    this.initChartBar()     // 获取费用趋势
    this.initChart()        // 按产品汇总-环状图
    this.getDataList1()     // 按产品汇总-表格
  },
  activated() {
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
    // 修改月份时重新加载以下接口数据
    getDataChar() {
      this.initChartBar()     // 获取费用趋势
      this.initChart()        // 按产品汇总-环状图
      this.getDataList1()     // 按产品汇总-表格
    },

    // 获取费用趋势 柱状图
    initChartBar(val) {
      if (val === undefined || val === '') {
        this.yearvalue = 'half'
      } else {
        this.yearvalue = val
      }
      let params = {
        date: this.month,
        year: this.yearvalue,
        uin: this.$cookie.get('uin')
      }

      this.axios.post(`${process.env.VUE_APP_adminUrl + COST_TREND}`, params).then(data => {
        var list = data.chart
        const months = []
        var totalAmounts = []
        for (var i = 0; i < list.length; i++) {
          months.push(list[i].month)
          if (this.value === 'total') {
            totalAmounts.push(list[i].totalAmount)
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

    // 点击产品 项目tab 触发
    handleClick(tab, event) {
      if (tab.name === 'second') {
        this.pageIndex = 1
        this.initShadow()       // 按项目（组）汇总-条形图
        this.getDataList2()     // 按项目（组）汇总-表格
      }else if(tab.name === 'first'){
        this.pageIndex = 1
      }
    },

    // 按产品汇总-环状图
    initChart() {
      let params = {
        date: this.month,
        uin: this.$cookie.get('uin')
      }
      this.axios.post(`${process.env.VUE_APP_adminUrl + PRODUCT_TOTAL}`, params).then(data => {
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
                formatter: '{active|總費用（含稅）}' + '\n\r' + '{total|' + total.toFixed(2) + '}',
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

    // 按产品汇总-表格
    getDataList1() {
      let params = {
        date: this.month,
        uin: this.$cookie.get('uin'),
        page: this.pageIndex,
        limit: this.pageSize
      }
      this.dataListLoading = true
      this.axios.post(`${process.env.VUE_APP_adminUrl + PRODUCT_TOTAL_LIST}`, params).then(data => {
        if (data && data.code === 0) {
          this.dataList1 = data.data.list
          this.totalPage1 = data.data.totalCount
          this.dataListLoading = false
          this.initLine1()
        } else {
          this.dataList1 = []
          this.totalPage1 = 0
        }
      })
    },

    // 按产品汇总-表格后面的折线图
    initLine1() {
      this.dataList1.forEach((row, index) => {
        const productName = row.business_code_name
        let params = {
          date: this.month,
          uin: this.$cookie.get('uin'),
          businessCodeName: productName
        }
        this.axios.post(`${process.env.VUE_APP_adminUrl + GET_LINE_LIST}`, params).then(data => {
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
              text: productName + '的費用趨勢'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['總費用'],
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
            series: [{
              name: '總費用',
              type: 'line',
              stack: '總量',
              data: yTotalAmounts
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

    // 按项目（组）汇总-条形图
    initShadow() {
      let params = {
        date: this.month,
        uin: this.$cookie.get('uin')
      }
      this.axios.post(`${process.env.VUE_APP_adminUrl + PROJECT_COL}`, params).then(data => {
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

    // 按项目（组）汇总-表格
    getDataList2() {
      let params = {
        date: this.month,
        uin: this.$cookie.get('uin'),
        page: this.pageIndex,
        limit: this.pageSize
      }
      this.dataListLoading = true
      this.axios.post(`${process.env.VUE_APP_adminUrl + PROJECT_COL_LIST}`, params).then(data => {
        if (data && data.code === 0) {
          this.dataList2 = data.data.list
          this.totalPage2 = data.data.totalCount
          this.initLine2()
          this.dataListLoading = false
        } else {
          this.dataList2 = []
          this.totalPage2 = 0
        }
      })
    },

    // 按项目（组）汇总-表格后面的折线图
    initLine2() {
      this.dataList2.forEach((row, index) => {
        const project = row.project_name
        let params = {
          date: this.month,
          uin: this.$cookie.get('uin'),
          projectName: project
        }
        this.axios.post(`${process.env.VUE_APP_adminUrl + GET_LINE_LIST}`, params).then(data => {
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
              text: project + '的費用趨勢'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['總費用'],
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
            series: [{
              name: '總費用',
              type: 'line',
              stack: '總量',
              data: yTotalAmounts
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
            let params = {
              date: this.month,
              uin: this.$cookie.get('uin'),
              projectName: project,
              businessCodeName: value.project_name
            }
            this.axios.post(`${process.env.VUE_APP_adminUrl + GET_LINE_LIST}`, params).then(data => {
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
                  text: value.project_name + '的費用趨勢'
                },
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data: ['總費用'],
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
                series: [{
                  name: '總費用',
                  type: 'line',
                  stack: '總量',
                  data: yTotalAmounts
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

    // 按产品/项目汇总-表格每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList1()
    },

    // 按产品汇总-表格当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList1()
    },

    // 按项目汇总-表格当前页
    currentChangeHandle1(val) {
      this.pageIndex = val
      this.getDataList2()
    }
  }

}

</script>

<style lang="scss" scoped>
.Right-style{
  display: flex;
  width: 100%;
  justify-content: flex-end;
}
.pagstyle{
  padding: 5px;
  .pagtotal{
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.ovew {
  color: #000;
  height: 50px;
  line-height: 50px;
  margin-bottom: 20px;
  padding: 0 20px;
  background: #fff;
  font-size: 16px;
  .bill {
    margin-right: 20px;
  }
}

.ovew-echar {
  margin: 0 20px;
}

.table-card {
  margin: 0 20px 30px 20px;
  .span-1 {
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
  }
  .span-2 {
    font-size: 12px;
    color: #888;
    margin-left: 5px;
    line-height: 1;
  }
}

.paging {
  width: 100%;
  height: 30px;
  background: rgb(255, 255, 255);
  padding: 10px;
  /* display: flex; */
  justify-content: space-between;
  line-height: 30px;
}

::v-deep .el-table__expand-icon {
  display: inline-block !important;
}
.btn-active {
  border-color: #71a9e0;
  background: #d8ebff;
  color: #2277da;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  z-index: 1;
}
</style>