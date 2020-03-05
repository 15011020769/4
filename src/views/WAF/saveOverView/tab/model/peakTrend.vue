<template>
  <el-row class="echartsShowfirst">
    <h3 class="topfont">
      {{t('业务峰值趋势', 'WAF.ywfzqs')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <ELine
      :xAxis="xAxis1"
      :series1="series1"
      :series2="series2"
      :series3="series3"
      :color="color"
      :legendText="legendText1"
      v-loading="loading"
    />
  </el-row>
</template>
<script>
import moment from "moment";
import { DESCRIBE_PEAK_POINTS } from '@/constants'
import ELine from "../../components/line"
export default {
  props: {
    times: Array,
    domain: String,
    showModules: Array,
    id: Number,
  },
  components: {
    ELine
  },
  data() {
    return {
      xAxis1: [], // 业务攻击趋势
      series1: [], // 业务攻击趋势
      series2: [], // 业务攻击趋势
      series3: [], // 业务攻击趋势
      legendText1: ['QPS', '上行带宽', '下行带宽'], // 业务攻击趋势
      color: ["#006eff", "#29CC85", "#FF9D00"],
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
      if (
        val[0] !== oldVal[0]
        || val[1] !== oldVal[1]
      ) {
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
      const series3Arr = []
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
      }
      if (this.domain) {
        params["Domain"] = this.domain
      }
      this.axios.post(DESCRIBE_PEAK_POINTS, params).then(resp => {
        this.generalRespHandler(resp, ({Points}) => {
          Points.map((v) => {
            axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
            series1Arr.push(v.Access)
            series2Arr.push(v.Up * 8)
            series3Arr.push(v.Down * 8)
          })
          this.xAxis1 = axixArr
          this.series1 = series1Arr
          this.series2 = series2Arr
          this.series3 = series3Arr
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