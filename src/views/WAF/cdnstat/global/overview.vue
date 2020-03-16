<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>全网实时状态概览</h3>
    </el-row>
    <el-radio-group v-model="type" size="small">
      <el-radio-button label="delay">时延</el-radio-button>
      <el-radio-button label="usability">可用性</el-radio-button>
    </el-radio-group>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      type: 'delay',
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  margin-bottom: 15px;
}
</style>