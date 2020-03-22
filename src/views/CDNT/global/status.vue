<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>{{$t('CDNT.report.36')}}</h3>
    </el-row>

    <el-row type="flex" align="center">
      <el-button-group>
        <el-button size="mini" :type="createTimeType === 0 ? 'primary' : ''" @click="onTimeClick(0)">今日</el-button>
        <el-button size="mini" :type="createTimeType === 1 ? 'primary' : ''" @click="onTimeClick(1)">昨日</el-button>
        <el-button size="mini" :type="createTimeType === 7 ? 'primary' : ''" @click="onTimeClick(7)">近7天</el-button>
      </el-button-group>
      <el-date-picker
        size="mini"
        style="border-left: none;"
        v-model="timeValue"
        format="yyyy-MM-dd"
        type="datetimerange"
        :picker-options="pickerOptions"
        :clearable="false"
        :editable="false"
        @change="onChangeDate"
      ></el-date-picker>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-dropdown trigger="click" :hide-on-click="false" ref="dropdown" style="width: 610px;">
        <span class="el-dropdown-link">
          <div class="region-container">
            <el-tag
              v-for="name in regionNames"
              :key="name"
              closable
              type="info"
              @close="remove(name)"
            >
              {{name}}
            </el-tag>
            <div class="placeholder">{{$t('CDNT.report.37')}}</div>
          </div>
        </span>
        <el-dropdown-menu slot="dropdown" style="width: 610px;">
          <el-dropdown-item>
            <h3 class="title">{{$t('CDNT.report.38')}}</h3>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-row type="flex" :gutter="20">
              <span class="continent">大洋洲</span>
              <el-checkbox label="aus|澳大利亞" v-model="regions">澳大利亞</el-checkbox>
            </el-row>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-row type="flex" :gutter="20">
              <span class="continent">北美洲</span>
              <el-checkbox label="usa|美國" v-model="regions">美國</el-checkbox>
              <el-checkbox label="can|加拿大" v-model="regions">加拿大</el-checkbox>
            </el-row>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-row type="flex" :gutter="20">
              <span class="continent">歐洲</span>
              <el-checkbox label="deu|德國" v-model="regions">德國</el-checkbox>
              <el-checkbox label="fra|法國" v-model="regions">法國</el-checkbox>
              <el-checkbox label="gbr|英國" v-model="regions">英國</el-checkbox>
            </el-row>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-row type="flex" :gutter="20">
              <span class="continent">亞洲</span>
              <el-checkbox label="ind|印度" v-model="regions">印度</el-checkbox>
              <el-checkbox label="jpn|日本" v-model="regions">日本</el-checkbox>
              <el-checkbox label="kor|韓國" v-model="regions">韓國</el-checkbox>
              <el-checkbox label="hkg|中國香港" v-model="regions">中國香港</el-checkbox>
            </el-row>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <el-row type="flex" justify="center">
              <el-button size="small" @click="addTags" type="primary">{{$t('CDNT.report.39')}}</el-button>
              <el-button size="small">取消</el-button>
            </el-row>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <el-row type="flex" justify="space-between" class="chart-wrap">
      <h3>時延(ms)</h3>
      <i class="el-icon-download icon" @click="_export('時延', 'ms', 'delayTime')" />
    </el-row>
    <div ref="delay" class="chart">暫無數據</div>
    <el-row type="flex" justify="space-between" class="chart-wrap">
      <h3>可用性(%)</h3>
      <i class="el-icon-download icon" @click="_export('可用性', '%', 'succRate')" />
    </el-row>
    <div ref="usability" class="chart">暫無數據</div>
  </el-card>
</template>
<script>
import moment from 'moment'
import XLSX from 'xlsx'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import echartLine from '../components/line'
export default {
  data() {
    return {
      timeValue: [moment(), moment()],
      createTimeType: 0,
      regions: [], // kor|韩国
      regionNames: [], // 韩国
      regionCodes: [], // kor
      color: {
        'aus': 'rgb(46, 117, 246)',
        'usa': 'rgb(224, 99, 55)',
        'can': 'rgb(104, 201, 142)',
        'deu': 'rgb(246, 191, 71)',
        'fra': 'rgb(237, 105, 90)',
        'gbr': 'rgb(143, 71, 211)',
        'ind': 'rgb(151, 241, 89)',
        'jpn': 'rgb(242, 163, 69)',
        'kor': 'rgb(214, 79, 135)',
        'hkg': 'rgb(95, 192, 203)',
      },
      pickerOptions: {
        disabledDate: (date) => {
          return moment(date).isAfter(moment()) || moment(date).isBefore(moment().subtract(1, 'month').subtract(1, 'd'))
        }
      },
      delayChart: undefined,
      usabilityChart: undefined,
      times: [],
      regionCodeData: [],
    }
  },
  components: {
    echartLine,
  },
  methods: {
    onTimeClick(n) {
      this.createTimeType = n
      let start = moment().subtract(n, 'd')
      let end = moment()
      if (n !== 0) {
        end = moment().subtract(1, 'd')
      }
      this.timeValue = [start, end]
      this.query()
    },
    onChangeDate() {
      const start = moment(this.timeValue[0]).format('YYYY-MM-DD')
      const end = moment(this.timeValue[1]).format('YYYY-MM-DD')
      const current = moment().format('YYYY-MM-DD')
      const last = moment().subtract(1, 'd').format('YYYY-MM-DD')
      const last7 = moment().subtract(7, 'd').format('YYYY-MM-DD')
      if (start === end && start === current) {
        this.createTimeType = 0
      } else if (start === end && start === last) {
        this.createTimeType = 1
      } else if (start === last7 && end === last) {
        this.createTimeType = 7
      }
      this.query()
    },
    remove(name) {
      this.regions = this.regions.filter(region => !region.includes(name))
      this.setRegionNameCode()
    },
    addTags() {
      this.$refs.dropdown.visible = false
      this.setRegionNameCode()
    },
    setRegionNameCode() {
      const regionNames = []
      const regionCodes = []
      
      this.regions.forEach(region => {
        regionNames.push(region.split('|')[1])
        regionCodes.push(region.split('|')[0])
      })
      this.regionNames = regionNames
      this.regionCodes = regionCodes
      this.query()
    },
    _export(type, unit, key) {
      const { regionCodeData, regionNames, regionCodes, timeValue, times } = this
      if (regionNames.length === 0) {
        return
      }
      const start = moment(timeValue[0]).format('YYYY-MM-DD') //.split(' ')[0].replace('-', '')
      const end = moment(timeValue[1]).format('YYYY-MM-DD')// timeValue[1].split(' ')[0].replace('-', '')
      let fileName
      if (start === end) {
        fileName = start
      } else {
        fileName = `${start}-${end}`
      }
      fileName += '_delay_time.xlsx'
      const data = [
        ['類型', type],
        ['單位', unit],
        ['開始時間', start],
        ['結束時間', end],
        [],
        ['時間', ...regionNames]
      ]
      times.forEach((time, i) => {
        data.push([time, ...regionCodes.map(code => regionCodeData[code][key][i])])
      })
      // data.pop() // 移除最后一个
      const ws = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws);
      XLSX.writeFile(wb, fileName);
    },
    query() {
      if (this.regionCodes.length) {
        const { timeValue } = this
        this.axios.post('cdn2/DescribeMonitorTrendData', {
          "Version": "2018-06-06",
          Area: "overseas",
          StartDate: moment(timeValue[0]).format('YYYY-MM-DD'),
          EndDate: moment(timeValue[1]).format('YYYY-MM-DD'),
          District: this.regionCodes.join(',')
        })
          .then(({ Response }) => {
            const start = moment(timeValue[0]).clone().startOf('d')
            const end = moment(timeValue[1]).clone().add(1, 'd').startOf('d')
            const times = []
            while(start.isBefore(end)) {
              times.push(start.format('YYYY-MM-DD HH:mm:ss'))
              start.add(Response.Period, 'm')
            }
            times.splice(0, 1, moment(timeValue[0]).format('YYYY-MM-DD 00:00:00'))
            // times.push(moment(timeValue[1]).add(1, 'd').format('YYYY-MM-DD 00:00:00'))
            this.times = times
            const regionCodeData = {}
            Response.Detail.forEach(data => {
              regionCodeData[data.Code] = {
                delayTime: data.DelayTime.filter(d => d),
                succRate: data.SuccRate.filter(d => d),
              }
            })
            this.regionCodeData = regionCodeData
            if (!this.delayChart) {
              this.delayChart = this.$echarts.init(this.$refs.delay)
              this.usabilityChart = this.$echarts.init(this.$refs.usability)
            }
            this.delayChart.clear()
            this.usabilityChart.clear()
            this.setOption(times, regionCodeData)
          })
      } else {
        // 销毁
      }
    },
    setOption(times, regionCodeData) {
      this.delayChart.setOption(this.getOption(times, regionCodeData, 'delayTime', 'ms'))
      this.usabilityChart.setOption(this.getOption(times, regionCodeData, 'succRate', '%'))
    },
    getOption(xAxis, regionCodeData, key, unit) {
      return {
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            let tooltip = [params[0].axisValueLabel]
            tooltip = tooltip.concat(params.map(serie => `${serie.marker} ${serie.seriesName}: ${Math.ceil(serie.value) === serie.value ? serie.value : serie.value.toFixed(2)}${unit}`))
            return tooltip.join('<br />')
          }
        },
        color: this.regionCodes.map(code => this.color[code]),
        legend: {
          data: this.regionNames.map(name => ({ icon: 'circle', name })),
          bottom: 0,
        },
        grid: {
          left: '0%',
          right: '0%',
          top: '30px',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis,
          axisLabel: {
            formatter(value, index) {
              if (value.endsWith('00:00:00')) {
                return value.match(/-(\w+-\w+)/)[1]
              }
              return value.match(/\s(\w+:\w+)/)[1]
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: this.regionCodes.map((code, i) => ({
          name: this.regionNames[i],
          type: 'line',
          symbol: 'none',
          data: regionCodeData[code][key],
          itemStyle: {
            normal: {
            lineStyle: {
                color: this.color[code] //折线颜色
              }
            }
          }
        }))
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.header {
  margin-bottom: 15px;
}
::v-deep .el-date-editor--datetimerange.el-input__inner {
  width: 230px;
}
.region-container {
    cursor: pointer;
    background-color: #fff;
    min-width: 610px;
    width: auto;
    padding: 0 4px;
    border: 1px solid #ddd;
    font-size: 0;
    padding-top: 5px;
    min-height: 30px;
    outline: none;
    padding-top: 5px;
    & > * {
      line-height: 20px;
      margin-bottom: 5px;
    }
    .placeholder {
      font-size: 12px;
      color: #bbb;
      display: inline-block;
      margin-left: 5px;
    }
}
::v-deep .el-tag {
  height: 20px;
    line-height: 18px;
    font-size: 12px;
    margin-right: 5px;
}
::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: transparent;
  color: inherit;
}
h3.title {
  font-size: 14px;
  font-weight: 700;
  color: #000;
}
span.continent {
  display: inline-block;
  width: 60px;
  margin-right: 10px;
  margin-left: 10px;
}
::v-deep .el-checkbox+.el-checkbox {
  margin-left: 0px;
}
.chart-wrap {
  margin-top: 20px;
  .icon {
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
  }
}
.chart {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>