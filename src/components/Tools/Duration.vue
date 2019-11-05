<template>
  <div>
    <el-button-group class="btn-group">
      <el-button @click.native="changeDuration(Area)" v-for="(Area, index) in DurationArr" :key="index" :type="value === Area[keys] ? 'primary' : ''">{{ Area[label] }}</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: 'Duration',
  props: {
    value: {
      required: true,
      type: String
    },
    DurationArr: { // 计费模式
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
    changeDuration (city) {
      this.$emit('update:value', city[this.keys])
      this.$emit('changeDuration', city)
    }
  }
}
</script>

<style scoped lang="scss">
  .btn-group{
    .el-button{
      width: 70px;
      height: 27px;
      font-size: 12px;
      line-height:3px;
      border-radius: 2px;
      margin-top: 5px;
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
