<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>带宽</h3>
      <i class="el-icon-download icon" />
    </el-row>
    <el-row type="flex" class="header" justify="space-between">
      <el-radio-group v-model="type" size="small">
        <el-radio-button label="billing">计费带宽</el-radio-button>
        <el-radio-button label="origin">回源带宽</el-radio-button>
      </el-radio-group>
      <el-checkbox v-model="peak">显示峰值线</el-checkbox>
    </el-row>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      type: 'billing',
      peak: false,
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  margin-bottom: 15px;
}
.icon {
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
}
</style>