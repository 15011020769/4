<template>
 <el-row class="echartsShowSecond">
    <el-col :span="12">
    <h3 class="topfont">
      {{t('服务器响应状态', 'WAF.fwqxyzt')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    </el-col>
    <el-col :span="12">
    <h3 class="topfont">
      {{t('浏览器类型', 'WAF.llqlx')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <!-- <EBar
      :xAxis="xAxisBar"
      :series="seriesBar"
      :legendText="legendTextBar"
    /> -->
    </el-col>
  </el-row>
</template>
<script>
import moment from "moment";
import { DESCRIBE_PIECHART } from '@/constants'
import ELine from "../../components/line"
export default {
  props: {
    times: Array,
    domain: String,
    showModules: Array
  },
  components: {
    ELine
  },
  data() {
    return {
      seriesPieServer: [], // 服务器响应状态
      legendTextPieServer: [], // 服务器响应状态
      seriesPieBrowser: [], // 浏览器类型
      legendTextPieBrowser: [], // 浏览器类型
    }
  },
  watch: {
    showModules(val, oldVal) {
      if (val.join() !== oldVal.join()) {
        this.init()
      }
    },
    times(val, oldVal) {
      if (
        val[0] !== oldVal[0]
        || val[1] !== oldVal[1]
      ) {
        this.init()
      }
    },
    domain(val, oldVal) {
      if (val !== oldVal) {
        this.init()
      }
    }
  },
  mounted() {
    this.getPieChart("us");
    this.getPieChart("ua");
  },
  methods: {
    init() {
      this.getPieChart("us");
      this.getPieChart("ua");
    },
    // 获取服务器响应浏览器类型
    getPieChart(type) {
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
        QueryField: type,
        Host: "all",
        Edition: "clb-waf"
      }
      if (this.domain) {
        params["Host"] = this.domain
      }
      if (type == "us") {
        this.axios.post(DESCRIBE_PIECHART, params).then((resp) => {
          let serverArrCount = []
          let serverArr = []
          this.generalRespHandler(resp, (Response) => {
            console.log(Response.Piechart)
          })
        })
      } else if (type == "ua") {
        this.axios.post(DESCRIBE_PIECHART, params).then((resp) => {
          let browserArrCount = []
          let browserArr = []
          this.generalRespHandler(resp, (Response) => {
            console.log(Response.Piechart)
          })
        })
      }
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
  }
</style>