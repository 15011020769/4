<template>
  <el-row class="echartsShowfirst">
    <h3 class="topfont">
      {{t('攻击趋势', 'WAF.gjqs')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <ELine
      :xAxis="xAxis1"
      :series1="series1"
      :series2="series2"
      :series3="series3"
      :color="color"
      v-loading="loading"
      :legendText="domain == '' ? legendText2 : legendText1"
    />
  </el-row>
</template>
<script>
import moment from 'moment'
import { DESCRIBE_PEAK_POINTS, DESCRIBE_BOT_POINTS } from '@/constants'
import ELine from "../../components/line"
export default {
  props: {
    times: Array,
    domain: String,
    showModules: Array,
    id: Number,
  },
  components: {
    ELine,
  },
  data() {
    return {
      xAxis1: [],
      series1: [],
      series2: [],
      series3: [],
      legendText1: [this.t('WEB攻击次数', 'WAF.webgjcs'), this.t('CC攻击次数', 'WAF.ccgjcs'), this.t('BOT请求次数', 'WAF.botqqcs')],
      legendText2: [this.t('WEB攻击次数', 'WAF.webgjcs'), this.t('CC攻击次数', 'WAF.ccgjcs')],
      color: ["#FF584C", "#FF9D00", "#006eff"],
      loading: true,
    }
  },
  watch: {
    showModules(val, oldVal) {
      if (val.join() !== oldVal.join()) {
        this.getPeakPoints()
      }
    },
    times(val, oldVal) {
      if (val.join() !== oldVal.join()) {
        this.getPeakPoints()
      }
    },
    domain(val, oldVal) {
      if (val !== oldVal) {
        this.getPeakPoints()
      }
    },
    id() {
      this.getPeakPoints()
    },
  },
  mounted() {
    this.getPeakPoints()
  },
  methods: {
    // 获取业务攻击趋势
    getPeakPoints() {
      this.loading = true
      const axixArr = []
      const series1Arr = []
      const series2Arr = []
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
      }
      if (this.domain) {
        params["Domain"] = this.domain
        this.getBotPoints()
      } else {
        this.series3 = []
      }
      this.axios.post(DESCRIBE_PEAK_POINTS, params).then(resp => {
        this.generalRespHandler(resp, ({Points}) => {
            Points.map((v) => {
              axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
              series1Arr.push(v.Attack)
              series2Arr.push(v.Cc)
            })
            this.xAxis1 = axixArr
            this.series1 = series1Arr
            this.series2 = series2Arr
        })
      }).then(() => {
        this.loading = false
      })
    },
    // 查询Bot趋势
    getBotPoints() {
      this.loading = true
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
        Edition: "clb-waf",
        Host: this.domain
      }
      this.axios.post(DESCRIBE_BOT_POINTS, params).then((resp) => {
        this.generalRespHandler(resp, ({Points}) => {
          this.series3 = Points
        })
      }).then(() => {
        this.loading = false
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .echartsShowfirst {
    width: 100%;
    height: 378px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    .topfont{
      padding-left: 20px;
    }
  }
</style>