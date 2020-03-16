<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>TOP10 URL</h3>
      <i class="el-icon-download icon" />
    </el-row>
    <el-radio-group v-model="type" size="small">
      <el-radio-button label="used">使用量</el-radio-button>
      <el-radio-button label="request">请求数</el-radio-button>
    </el-radio-group>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      type: 'used'
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