<template>
  <el-row class="echartsShowSecond">
    <el-col :span="12">
    <h3 class="topfont">
      {{t('攻击来源地域TOP5', 'WAF.gjlydy')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <EBar
      :xAxis="xAxisBarLocal"
      :series="seriesBarLocal"
      :legendText="legendTextBarIp"
      v-loading="loading"
      v-if="xAxisBarLocal.length == 0 ? false : true"
    />
    <el-row class="empty" v-else>{{t('暂无数据', 'WAF.zwsj')}}</el-row>
    </el-col>
    <el-col :span="12">
    <h3 class="topfont">
      {{t('攻击来源IP TOP5', 'WAF.gjlyip')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <EBar
      :xAxis="xAxisBarIp"
      :series="seriesBarIp"
      :legendText="legendTextBarIp"
      v-loading="loading"
      v-if="xAxisBarIp.length == 0 ? false : true"
    />
    <el-row class="empty" v-else>{{t('暂无数据', 'WAF.zwsj')}}</el-row>
    </el-col>
  </el-row>
</template>
<script>
import EBar from "../../components/bar"
import { DESCRIBE_HISTOGRAM } from '@/constants'
export default {
  props: {
    times: Array,
    domain: String,
    showModules: Array,
    id: Number,
  },
  data() {
    return {
      seriesBarLocal: [],
      xAxisBarLocal: [],
      seriesBarIp: [],
      xAxisBarIp: [],
      legendTextBarIp: this.t('次数','WAF.cscs'),
      loading: true,
    }
  },
  components: {
    EBar,
  },
  watch: {
    showModules(val, oldVal) {
      if (val.join() !== oldVal.join()) {
        this.init()
      }
    },
    times(val, oldVal) {
      if (val.join() !== oldVal.join()) {
        this.init()
      }
    },
    domain(val, oldVal) {
      if (val !== oldVal) {
        this.init()
      }
    },
    id() {
      this.init()
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getAttackIp("ip")
      this.getAttackIp("local")
    },
    // 获取攻击来源地址和ip柱状图
    getAttackIp(type) {
      this.loading = true
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
        Host: "all",
        Edition: "clb-waf",
        QueryField: type,
        Source: "attack",
      }
      if (this.domain) {
        params["Host"] = this.domain
      }
      this.axios.post(DESCRIBE_HISTOGRAM, params).then((resp) => {
        let ipArrCount = []
        let ipArr = []
        let localArr = []
        let localArrCount = []
        if (type == "ip") {
          this.generalRespHandler(resp, ({Histogram}) => {
            Histogram && Histogram.map(v => {
              ipArrCount.push(v.count)
              ipArr.push(v.ip)
            })
            this.xAxisBarIp = ipArr
            this.seriesBarIp = ipArrCount
          })
        } else if(type == "local") {
          this.generalRespHandler(resp, ({Histogram}) => {
            Histogram && Histogram.map(v => {
              localArrCount.push(v.count)
              localArr.push(v.local)
            })
            this.xAxisBarLocal = localArr
            this.seriesBarLocal = localArrCount
          })
        }
      }).then(() => {
        this.loading = false
      })
    },
  }
}
</script>
<style lang="scss" scoped>
 .echartsShowSecond {
    width: 100%;
    height: 258px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .topfont{
      padding-left: 20px;
    }
    .empty {
      height: 200px;
      width: 100%;
      line-height: 200px;
      text-align: center;
      font-weight: bold
    }
  }
</style>