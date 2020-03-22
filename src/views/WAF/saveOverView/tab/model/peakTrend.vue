<template>
  <el-row class="echartsShowfirst">
    <h3 class="topfont">
      {{t('业务峰值趋势', 'WAF.ywfzqs')}}
    </h3>
    <el-row class="empty" v-if="series1.length == 0 ? true : false">
      {{t('暂无数据', 'WAF.zwsj')}}
    </el-row>
    <ELine
      :xAxis="xAxis1"
      :series1="series1"
      :series2="series2"
      :series3="series3"
      :color="color"
      :legendText="legendText1"
      v-loading="loading"
      :tooltip="tooltip"
      v-else
    />
  </el-row>
</template>
<script>
import moment from "moment";
import { DESCRIBE_PEAK_POINTS, DESCRIBE_PEAK_VALUE } from '@/constants'
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
      legendText1: ['QPS', this.t('上行带宽', 'WAF.sxdk'), this.t('下行带宽', 'WAF.xxdk')], // 业务攻击趋势
      color: ["#006eff", "#29CC85", "#FF9D00"],
      loading: true,
      tootip: {},
      // tooltip: {
      //   trigger: 'axis',
      //   formatter(params) {
      //     let relVal = params[0].name;
      //     params.forEach(v => {
      //       if(v.seriesName == "QPS") {
      //         relVal += '<br/>' + v.marker + v.seriesName + ' : ' + v.value;
      //       } else {
      //         relVal += '<br/>' + v.marker + v.seriesName + ' : ' + v.value + "bps";
      //       }
      //     })  
      //     return relVal;  
      //   }
      // },
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
    tranBps (upBps, downBps) {
        upBps = upBps * 8, downBps = downBps * 8;
        let kbps = 1024, mbps = 1024 * kbps, gbps = 1024 * mbps, tbps = 1024 * gbps;
        if (upBps > kbps * 10 && upBps < mbps * 10 && downBps > kbps) {
            return {
                upPs: Number((upBps / kbps).toFixed(3)),
                downPs: Number((downBps / kbps).toFixed(3)),
                unit: "Kbps",
                number: kbps
            };
        } else if (upBps >= mbps * 10 && upBps < gbps * 10 && downBps >= mbps * 10) {
            return {
                upPs: Number((upBps / mbps).toFixed(3)),
                downPs: Number((downBps / mbps).toFixed(3)),
                unit: "Mbps",
                number: mbps
            };
        } else if (upBps >= gbps * 10 && upBps < tbps * 10 && downBps >= gbps * 10) {
            return {
                upPs: Number((upBps / gbps).toFixed(3)),
                downPs: Number((downBps / gbps).toFixed(3)),
                unit: "Gbps",
                number: gbps
            };
        } else if (upBps >= tbps && downBps >= tbps) {
            return {
                upPs: Number((upBps / tbps).toFixed(3)),
                downPs: Number((downBps / tbps).toFixed(3)),
                unit: "Tbps",
                number: tbps
            };
        } else {
            return {
                upPs: upBps,
                downPs: downBps,
                unit: "bps",
                number: 1
            };
        }
    },
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
      let downQps = []
      const upQps = []
      this.axios.post(DESCRIBE_PEAK_POINTS, params).then(resp => {
        this.generalRespHandler(resp, ({Points}) => {
          Points.map((v) => {
            downQps.push(v.Down * 8)
            upQps.push(v.Up * 8)
            axixArr.push(moment.unix(v.Time).format("YYYY-MM-DD HH:mm:ss"))
            series1Arr.push(v.Access)
          })
          let maxDps = Math.max.apply(null, downQps)
          let maxUps = Math.max.apply(null, upQps)
          let { upPs, downPs, unit, number } = this.tranBps(maxDps, maxUps)
          this.xAxis1 = axixArr
          this.series1 = series1Arr
          this.series2 = upQps.map(item => Number((item / number).toFixed(3)))
          this.series3 = downQps.map(item => Number((item / number).toFixed(3)))
          this.tooltip = {
            trigger: 'axis',
            formatter(params) {
              let relVal = params[0].name;
              params.forEach(v => {
                if(v.seriesName == "QPS") {
                  relVal += '<br/>' + v.marker + v.seriesName + ' : ' + v.value;
                } else {
                  relVal += '<br/>' + v.marker + v.seriesName + ' : ' + v.value + unit;
                }
              })  
              return relVal;  
            }
          }
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
     .empty {
      height: 300px;
      width: 100%;
      line-height: 300px;
      text-align: center;
      font-weight: bold
    }
  }
</style>