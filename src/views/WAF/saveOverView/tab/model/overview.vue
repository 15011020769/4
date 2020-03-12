<template>
  <div class="contentNum">
        <el-row>
          <el-col :span="8">
            <div class="rowContain">
              <p v-loading="loading">
                <span class="green">{{upPeakValue}}</span>
                <span>bps</span>
              </p>
              <p>{{t('上行带宽峰值', 'WAF.sxdkfz')}}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="rowContain">
              <p v-loading="loading">
                <span class="oarnge">{{downPeakValue}}</span>
                <span>bps</span>
              </p>
              <p>{{t('下行带宽峰值', 'WAF.xxdkfz')}}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="rowContain">
              <p v-loading="loading">
                <span class="blue">{{qpsRequest}}</span>
                <span>QPS</span>
              </p>
              <p>{{t('请求峰值', 'WAF.qqfz')}}</p>
            </div>
          </el-col>
        </el-row>
      </div>
</template>
<script>
import { DESCRIBE_PEAK_VALUE, DESCRIBE_BOT_COUNT } from '@/constants'
export default {
  props: {
    times: Array,
    domain: String,
    showModules: Array,
    id: Number,
  },
  data() {
    return {
      upPeakValue: 0, // 上行峰值
      downPeakValue: 0, // 下行峰值
      qpsRequest: 0, // QPS请求
      loading: true,
    }
  },
  watch: {
    showModules(val, oldVal) {
      if (val.join() !== oldVal.join()) {
        this.getPeakValue()
      }
    },
    times(val, oldVal) {
      if (
        val[0] !== oldVal[0]
        || val[1] !== oldVal[1]
      ) {
        this.getPeakValue()
      }
    },
    domain(val, oldVal) {
      if (val !== oldVal) {
        this.getPeakValue()
      }
    },
    id() {
      this.getPeakValue()
    },
  },
  mounted() {
    this.getPeakValue()
  },
  methods: {
    // 获取峰值
    getPeakValue() {
      this.loading = true
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
      }
      if (this.domain) {
        params["Domain"] = this.domain
      }
      this.axios.post(DESCRIBE_PEAK_VALUE, params).then((resp) => {
        this.generalRespHandler(resp, ({Up, Down, Access}) => {
          this.upPeakValue = Up * 8
          this.downPeakValue = Down * 8
          this.qpsRequest = Access
        })
      }).then(() => {
        this.loading = false
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .contentNum {
    width: 100%;
    height: 110px;
    padding: 15px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    .rowContain {
      text-align: center;
      p:nth-child(1) {
        margin-bottom: 16px;
        font-size: 14px;
        span:nth-child(1) {
          font-size: 36px;
        }
        span.green {
          color: #29cc85;
        }
        span.oarnge {
          color: #ff9d00;
        }
        span.blue {
          color: #006eff;
        }
      }
    }
  }
</style>