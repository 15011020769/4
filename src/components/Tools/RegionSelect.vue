<template>
  <div>
    <el-select v-model="value" placeholder="请选择" size="small" class="select-region">
      <el-option v-for="item in CityArr" @click.native="changeCity(item)" :key="item.Region" :label="item.lable" :value="item.Region">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    parm: {     // 接口参数
      required: true,
      type: String
    }
  },
  data() {
    return {
      CityArr: [],
      value: this.$cookie.get('regionv2')
    }
  },
  created() {
    this.ObtainCity()
  },
  methods: {
    // 获取城市列表
    ObtainCity() {
      var parms = {
        product: this.parm
      }
      this.axios
        .post('pub/zoneAll', parms)
        .then(data => {
          this.CityArr = data.data
        })
    },
    // 切换城市
    changeCity(city) {
      this.$cookie.set('regionv1', city.regionCode)
      this.$cookie.set('regionv2', city.Region)
      this.$emit('changeSelect', city)
    }
  }
}
</script>

<style scoped lang="scss">
.select-region {
  ::v-deep .el-input {
    width: 160px;
  }
}
</style>
