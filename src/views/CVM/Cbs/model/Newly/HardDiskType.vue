<template>
  <div>
    <el-button-group class="btn-group">
      <el-button @click.native="changeType(Area)" v-for="(Area, index) in DiskTypeArr" :key="index" :type="value === Area[keys] ? 'primary' : ''">{{ Area[label] |Toconfigurefilter()}}</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: 'HardDiskType',
  props: {
    value: {
      required: true,
      type: String
    },
    DiskTypeArr: { // 硬盘列表
      required: true,
      type: Array
    },
    keys: { // 比较的字段名  和value prop比较 一致则为激活状态
      type: String,
      default: 'DiskType'
    },
    label: { // 要显示的字段名
      type: String,
      default: 'DiskType'
    }
  },
  methods: {
    changeType (city) {
      this.$emit('update:value', city[this.keys])
      this.$emit('changeType', city)
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
