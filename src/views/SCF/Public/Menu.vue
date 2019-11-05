<template>
  <div class="SCF">
    <div class="big-title">SCF</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true">
      <el-menu-item index="OverView">
        <i class="iconfont">&#xe615;</i>
        <span slot="title">概览</span>
      </el-menu-item>
      <el-menu-item index="FuncServe">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">函数服务</span>
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
.SCF {
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
