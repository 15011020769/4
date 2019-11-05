<template>
  <div class="CLA">
    <div class="big-title">CLA</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true">
      <el-menu-item index="CloudAudit">
        <i class="iconfont">&#xe615;</i>
        <span slot="title">操作记录</span>
      </el-menu-item>
      <el-menu-item index="Audit">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">跟踪集</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss" scoped>
.CLA {
  ::v-deep .el-menu{
    border-right: 0 !important;
  }
  .big-title{
    font-size: 16px;
    color: white;
    padding: 20px 0 15px 20px;
  }
  .iconfont {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 16px;
    vertical-align: middle;
  }
  ::v-deep .el-menu-item {
    padding-left: 20px !important;
  }
}
</style>
