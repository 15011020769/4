<template>
  <div class="contentNum">
    <el-row>
      <el-col :span="domain==''?12:8">
        <div class="rowContain">
          <p>
            <span class="red">{{webAttack}}</span>
            <span>次</span>
          </p>
          <p>WEB攻击次数</p>
        </div>
      </el-col>
      <el-col :span="domain==''?12:8">
        <div class="rowContain">
          <p>
            <span class="oarnge">{{ccRequest}}</span>
            <span>个</span>
          </p>
          <p>CC攻击次数</p>
        </div>
      </el-col>
      <el-col :span="domain==''?12:8" v-if="domain==''?false:true">
        <div class="rowContain">
          <p>
            <span class="blue">{{botRequest}}</span>
            <span>次</span>
          </p>
          <p>BOT请求次数</p>
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
    showModules: Array
  },
  data() {
    return {
      webAttack: 0,
      ccRequest: 0,
      botRequest: 0,
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
    }
  },
  mounted() {
    this.getPeakValue()
  },
  methods: {
    // 获取业务攻击峰值
    getPeakValue() {
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
      }
      if (this.domain) {
        params["Domain"] = this.domain
        this.getBotCount()
      } else {
        this.botRequest = 0
      }
      this.axios.post(DESCRIBE_PEAK_VALUE, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.webAttack = Response.Attack
          this.ccRequest = Response.Cc
        })
      })
    },
    // 查询bot数量
    getBotCount() {
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
        Edition: "clb-waf",
        Host: this.domain
      }
      this.axios.post(DESCRIBE_BOT_COUNT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.botRequest = Response.Count
        })
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
      span.red {
        color: #e1504a;
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