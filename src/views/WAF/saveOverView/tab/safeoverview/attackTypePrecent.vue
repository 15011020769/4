<template>
  <el-row class="echartsShowThird">
    <el-col :span="12">
      <h3 class="topfont">
        {{t('访问类型占比', 'WAF.fwlxzb')}}
        <span style="color:#bbb;">(%)</span>
      </h3>
      <el-row class="empty" v-if="seriesPie.length == 0 ? true : false">{{t('暂无数据', 'WAF.zwsj')}}</el-row>
      <EPie
        :series="seriesPie"
        :color="colorPie"
        :legendText="legendTextPie"
        v-loading="loading"
        v-else
      />
    </el-col>
    <el-col :span="12">
      <h3 class="topfont">
        {{t('攻击类型占比', 'WAF.gjlxzb')}}
        <span style="color:#bbb;">(次)</span>
      </h3>
      <el-row class="empty" v-if="seriesPieAttack.length == 0 ? true : false">{{t('暂无数据', 'WAF.zwsj')}}</el-row>
      <EPie
        :series="seriesPieAttack"
        :color="colorPie"
        :legendText="legendTextPieAttack"
        v-loading="loading"
        v-else
      />
    </el-col>
  </el-row>
</template>
<script>
import EPie from "../../components/pie"
import {
  DESCRIBE_PEAK_VALUE,
  DESCRIBE_ATTACK_TYPE,
  DESCRIBE_ATTACK_WORLD_MAP,
  DESCRIBE_ATTACK_COUNT,
  DESCRIBE_REQUEST_COUNT,
  DESCRIBE_BOT_COUNT,
  DESCRIBE_BOT_POINTS
  } from '@/constants'
export default {
  props: {
    times: Array,
    domain: String,
    showModules: Array,
    id: Number,
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
  components: {
    EPie,
  },
  data() {
    return {
      seriesPie: [
        {value: 0, name: this.t('正常访问', 'WAF.zzfw')},
        {value: 0, name: this.t('WEB攻击次数', 'WAF.webgjcs')},
        {value: 0, name: this.t('CC攻击次数', 'WAF.ccgjcs')},
        {value: 0, name: ''},
      ],
      colorPie: ['#006eff', '#434348', '#74BD48', "#F7A35C", '#8D62AE'],
      legendTextPie: [this.t('正常访问', 'WAF.zzfw'), this.t('WEB攻击次数', 'WAF.webgjcs'), this.t('CC攻击次数', 'WAF.ccgjcs'), ''],
      seriesPieAttack: [],
      legendTextPieAttack: [],
      loading: true,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getPeakValue()
      this.getNormalRequest()
      this.getWebAttack()
      this.getAttackType()
    },
    // 获取正常访问次数
    getNormalRequest() {
      this.loading = true
      const params =  {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
      }
      if (this.domain) {
        params["Domain"] = this.domain
      }
      this.axios.post(DESCRIBE_REQUEST_COUNT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.$set(this.seriesPie, 0, {value: `${Response.Count}`, name: this.t('正常访问', 'WAF.zzfw')},)
        })
      }).then(() => {
        this.loading = false
      })
    },
     // 获取web攻击次数
    getWebAttack() {
      this.loading = true
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
        QueryField: "web",
        Mode: 0,
        Host: "all",
        Edition: "clb-waf"
      }
      if (this.domain) {
        params["Host"] = this.domain
      }
      this.axios.post(DESCRIBE_ATTACK_COUNT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.$set(this.seriesPie, 1, {value: `${Response.Count}`, name: this.t('WEB攻击次数', 'WAF.webgjcs')},)
        })
      }).then(() => {
        this.loading = false
      })
    },
     // 获取业务攻击峰值
    getPeakValue() {
      this.loading = true
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
      }
      if (this.domain) {
        params["Domain"] = this.domain
        this.getBotCount()
      } else {
        this.$set(this.seriesPie, 3, {value: 0, name: ''},)
      }
      this.axios.post(DESCRIBE_PEAK_VALUE, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.$set(this.seriesPie, 2, {value: `${Response.Cc}`, name: this.t('CC攻击次数', 'WAF.ccgjcs')},)
        })
      }).then(() => {
        this.loading = false
      })
    },
    // 查询bot数量
    getBotCount() {
      this.loading = true
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
          this.$set(this.seriesPie, 3, {value: `${Response.Count}`, name: this.t('BOT请求次数', 'WAF.botqqcs')})
          this.$set(this.legendTextPie, 3, this.t('BOT请求次数', 'WAF.botqqcs'))
          console.log(this.seriesPie)
        })
      }).then(() => {
        this.loading = false
      })
    },
    // 查询TOP N攻击类型饼图
    getAttackType() {
      this.loading = true
      let typeArr = []
      let typeLegend = []
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
        Host: "all",
        Edition: "clb-waf"
      }
      if (this.domain) {
        params["Host"] = this.domain
      }
      this.axios.post(DESCRIBE_ATTACK_TYPE, params).then((resp) => {
        this.generalRespHandler(resp, ({Piechart}) => {
          Piechart && Piechart.map(v => {
            typeArr.push({value:v.Count, name: v.Type, })
            typeLegend.push(v.Type)
          })
          this.seriesPieAttack = typeArr
          this.legendTextPieAttack = typeLegend    
        })
      }).then(() => {
        this.loading = false
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.echartsShowThird {
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