<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>{{$t('CDNT.report.33')}}</h3>
    </el-row>
    <el-radio-group v-model="type" size="small">
      <el-radio-button label="delay">{{$t('CDNT.report.34')}}</el-radio-button>
      <el-radio-button label="useability">{{$t('CDNT.report.35')}}</el-radio-button>
    </el-radio-group>
    <outside-china
      :series="outDelayData"
      :pieces="piecesDelay"
      :tooltip="tooltipDelay"
      v-if="type === 'delay'"
    />
    <outside-china
      :series="outUseData"
      :pieces="piecesUse"
      :tooltip="tooltipUse"
      :inverse='false'
      v-if="type === 'useability'"
    />
  </el-card>
</template>
<script>
import outsideChina from '../components/ousideChina'
import Ja from '../report/r'
export default {
  data() {
    return {
      type: 'delay',
      Ja,
      outDelayData: [],
      outUseData: [],
      piecesDelay: [
        {lte: 1, label: '好(<1s)',color: '#319a18'},
        {gt: 1, lte: 2, label: '較好(1-5s)',color: '#51af32'},
        {gt: 2, lte: 3, label: '告警(2-3s)',color: '#ffb800'},
        {gt: 3, lte: 5, label: '較差(3-5s)',color: '#e1504a'},
        {gt: 5, label: '差(>5s)',color: '#e32310'},
      ],
      piecesUse: [
        {lte: 92, label: '差(<92%)',color: '#e32310'},
        {gt: 92, lte: 94, label: '較差(94-92%)',color: '#e1504a'},
        {gt: 94, lte: 96, label: '告警(96-94%)',color: '#ffb800'},
        {gt: 96, lte: 98, label: '較好(98-96%)',color: '#51af32'},
        {gt: 98, label: '好(>98%)',color: '#319a18'},
      ],
      tooltipDelay: {
        trigger: 'item',
        formatter: function (val) {
          let relVal = '';
          if (!val.data) {
            return
          }
          if(val.data.value == 0) {
            relVal = val.data.name + '<br/>' + '時延'  + ' : ' + '--';
          } else {
            relVal = val.data.name + '<br/>' + '時延'  + ' : ' + (val.data.value * 1000).toFixed(2) + 'ms';
          }
          return relVal
        }
      },
      tooltipUse: {
        trigger: 'item',
        formatter: function (val) {
          let relVal = '';
          if (!val.data) {
            return
          }
          relVal = val.data.name + '<br/>' + '可用性'  + ' : ' + val.data.value + '%';
          return relVal
        }
      }
    }
  },
  components: {
    outsideChina,
  },
  mounted() {
    this.getOutsideData()
  },
  methods: {
    getOutsideData() {
      const params = {
        Version: '2018-06-06',
      }
      let tempDelay = []
      let tempDelayout = []
      let tempUse = []
      let tempUseOut = []
      let Names = []
      this.axios.post('cdn2/DescribeOverseaMonitorRealtimeData', params)
          .then(({Response}) => {
            if(Response.Data && Response.Data.length) {
              Response.Data.forEach(item => {
                Names.push(item.EnglishName)
                this.Ja.world.features.forEach(val => {
                  if(val.properties.continent === item.EnglishName) {
                    tempDelay.push({name: val.properties.name, value: (item.DelayTime / 1000)})
                    tempUse.push({name: val.properties.name, value: (item.SuccRate).toFixed(2)})
                  }
                })
              })
              this.Ja.world.features.forEach(val => {
                if(!Names.includes(val.properties.continent)) {
                  tempDelayout.push({name: val.properties.name, value: 0})
                  tempUseOut.push({name: val.properties.name, value: 99.99})
                }
              })
              this.outDelayData = tempDelay.concat(tempDelayout)
              this.outUseData = tempUse.concat(tempUseOut)
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