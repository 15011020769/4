<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>访问用户区域分布</h3>
      <i class="el-icon-download icon" />
    </el-row>
    <el-row type="flex" class="header" justify="space-between">
      <el-radio-group v-model="type" size="small">
        <el-radio-button label="flux">流量</el-radio-button>
        <el-radio-button label="count">访问次数</el-radio-button>
      </el-radio-group>
    </el-row>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      type: 'flux',
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