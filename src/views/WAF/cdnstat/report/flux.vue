<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>流量</h3>
      <i class="el-icon-download icon" />
    </el-row>
    <el-radio-group v-model="type" size="small">
      <el-radio-button label="billing">计费流量</el-radio-button>
      <el-radio-button label="origin">回源流量</el-radio-button>
    </el-radio-group>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      type: 'billing'
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