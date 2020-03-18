<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>全网实时状态概览</h3>
    </el-row>
    <el-radio-group v-model="region" size="small" style="margin-right: 30px;">
      <el-radio-button label="china">中国境内</el-radio-button>
      <el-radio-button label="world">中国境外</el-radio-button>
    </el-radio-group>
    <el-radio-group v-model="type" size="small">
      <el-radio-button label="delay">时延</el-radio-button>
      <el-radio-button label="usability">可用性</el-radio-button>
    </el-radio-group>
    <outside-china :series="outsideData"/>
  </el-card>
</template>
<script>
import outsideChina from '../components/ousideChina'
import Ja from '../report/r'
export default {
  data() {
    return {
      type: 'delay',
      region: 'world',
      Ja,
      outsideData: []
    }
  },
  components: {
    outsideChina,
  },
  mounted() {
    this.getOutsideData()
    console.log(this.Ja)
  },
  methods: {
    getOutsideData() {
      const params = {
        Version: '2018-06-06',
      }
      let temp = []
      this.axios.post('cdn2/DescribeOverseaMonitorRealtimeData', params)
          .then(({Response}) => {
            if(Response.Data && Response.Data.length) {
              console.log(Response.Data)
              Response.Data.forEach(item => {
                this.Ja.world.features.forEach(val => {
                  if(val.properties.continent === item.EnglishName) {
                    temp.push({name: val.properties.name, value: (item.DelayTime / 1000)})
                  }
                })
              })
              console.log(temp)
              this.outsideData = temp
            }
          })
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  margin-bottom: 15px;
}
</style>