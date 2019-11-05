<template>
  <div>
    <el-button-group class="btn-group">
      <el-button @click.native="changeBilling(Area)" v-for="(Area, index) in BillingArr" :key="index" :type="value === Area[keys] ? 'primary' : ''">{{ Area[label] }}</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: 'Billing',
  props: {
    value: {
      required: true,
      type: String
    },
    BillingArr: { // 计费模式
      required: true,
      type: Array
    },
    keys: { // 比较的字段名  和value prop比较 一致则为激活状态
      type: String,
      default: 'value'
    },
    label: { // 要显示的字段名
      type: String,
      default: 'label'
    }
  },
  methods: {
    changeBilling (city) {
      this.$emit('update:value', city[this.keys])
      this.$emit('changeBilling', city)
    }
  }
}
</script>

<style scoped lang="scss">
  .btn-group{
    .el-button{
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
  }
</style>
