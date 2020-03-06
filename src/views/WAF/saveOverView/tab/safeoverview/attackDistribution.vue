<template>
  <el-row class="echartsShowFour">
    <h3 class="topfont">
      {{t('攻击来源区域分布', 'WAF.gjlyqyfb')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <EMap :series="seriesMap" v-loading="loading" :max="5000" />
  </el-row>
</template>
<script>
import EMap from '../../components/worldMap'
import { DESCRIBE_ATTACK_WORLD_MAP } from '@/constants'
export default {
  props: {
    times: Array,
    domain: String,
    showModules: Array,
    id: Number,
  },
  components: {
    EMap
  },
  watch: {
    showModules(val, oldVal) {
      if (val.join() !== oldVal.join()) {
        this.getAttackWorldMap()
      }
    },
    times(val, oldVal) {
      if (val.join() !== oldVal.join()) {
        this.getAttackWorldMap()
      }
    },
    domain(val, oldVal) {
      if (val !== oldVal) {
        this.getAttackWorldMap()
      }
    },
     id() {
      this.getAttackWorldMap()
    },
  },
  data() {
    return {
      seriesMap: [],
      loading: true,
    }
  },
  mounted() {
    this.getAttackWorldMap()
  },
  methods: {
    // 获取攻击城市分布
    getAttackWorldMap() {
      this.loading = true
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
      let regionsArr = []
      this.axios.post(DESCRIBE_ATTACK_WORLD_MAP, params).then((resp) => {
        this.generalRespHandler(resp, ({Map}) => {
          Map && Map.map(v => {
            regionsArr.push({
              name: v.Country,
              value: v.Count
            })
          })
        })
        this.seriesMap = regionsArr
      }).then(() => {
        this.loading = false
      })
    },
  }
}
</script>
<style lang="scss" scoped>
 .echartsShowFour {
    width: 100%;
    height: 658px;
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