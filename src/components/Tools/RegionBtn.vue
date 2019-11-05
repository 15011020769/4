<template>
  <div>
    <el-button-group class="btn-group">
      <el-button @click.native="changeCity(city)"
        size="small"
        v-for="(city, index) in CityArr"
        :key="index"
        :type="value === city.Region ? 'primary' : ''">{{ city[label]}}</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  props: {
    parm: {
      // 接口参数
      required: true,
      type: String
    },
    label: {
      // 要显示的字段名
      type: String,
      default: 'zone'
    }
  },
  data () {
    return {
      url: 'pub/zoneAll', // 城市列表接口
      CityArr: [],
      selectedRegion: '', // 默认选中城市
      selectedCity: {}, // 切换城市
      key: '',
      value: ''
    }
  },
  watch: {
    // 监听城市变化----数据变化
    selectedRegion () {}
  },
  created () {
    this.ObtainCity()
  },
  methods: {
    // 获取城市列表
    ObtainCity () {
      var parms = {
        product: this.parm
      }
      this.axios.post(this.url, parms).then(data => {
        this.CityArr = data.data
        this.selectedRegion = this.$cookie.get('regionv2')
        this.value = this.selectedRegion
        this.selectedCity = data.data[0]
      })
    },
    // 切换城市
    changeCity (city) {
      console.log(city)
      this.value = city.Region
      this.selectedCity = city
      this.$cookie.set('regionv1', city.regionCode)
      this.$cookie.set('regionv2', city.Region)
      this.$emit('changeCity', city)
    }
  }
}
</script>

<style scoped lang="scss">
.btn-group {
  .el-button {
    margin-bottom: 10px;
  }
}
</style>
