<template>
  <div>
    <el-button-group class="btn-group">
      <el-button @click.native="changeCity(city)" v-for="(city, index) in cities" :key="index" :type="value === city[key] ? 'primary' : ''">{{ city[label] }}</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: 'cities',
  props: {
    value: { // 地区Region v-model
      required: true,
      type: String,
    },
    cities: { // 地区列表
      required: true,
      type: Array,
    },
    key: { // 比较的字段名  和value prop比较 一致则为激活状态
      type: String,
      default: 'Region',
    },
    label: { // 要显示的字段名
      type: String,
      default: 'zone',
    },
  },
  methods: {
    changeCity(city) {
      this.$emit('update:value', city[this.key])
      this.$emit('changeCity', city)
    },
  },
}
</script>

<style scoped lang="scss">
  .btn-group{
    .el-button{
      // width: 48px;
      height: 27px;
      font-size: 12px;
      line-height:3px;
      margin-right:8px!important;
      border-radius: 2px;

      span{
        text-align: center;
      }
    }
     .el-button:active:hover {
      color: #fff;
      background-color: #164e8f;
      border-color: #0d2f56;
    }
    // .el-button:hover {
    //   color: #333;
    //   background-color: #d4d4d4;
    //   border-color: #939393;
    // }

  }
</style>
