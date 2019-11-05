<template>
  <div class="CVM">
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true">
      <el-menu-item index="OverView">
        <i class="iconfont">&#xe603;</i>
        <span slot="title">概览</span>
      </el-menu-item>
      <el-menu-item index="Cvm">
        <i class="iconfont">&#xe601;</i>
        <span slot="title">实例</span>
      </el-menu-item>
      <el-menu-item index="Image">
        <i class="iconfont">&#xe604;</i>
        <span slot="title">镜像</span>
      </el-menu-item>
      <el-menu-item index="Cbs">
        <i class="iconfont">&#xe60a;</i>
        <span slot="title">云硬盘</span>
      </el-menu-item>
      <el-menu-item index="Snapshot">
        <i class="iconfont">&#xe609;</i>
        <span slot="title">快照列表</span>
      </el-menu-item>
      <el-menu-item index="Sshkey">
        <i class="iconfont">&#xe608;</i>
        <span slot="title">SSH密钥</span>
      </el-menu-item>
      <el-menu-item index="SecurityGroup">
        <i class="iconfont">&#xe606;</i>
        <span slot="title">安全组</span>
      </el-menu-item>
      <el-menu-item index="Eip">
        <i class="iconfont">&#xe605;</i>
        <span slot="title">弹性公网IP</span>
      </el-menu-item>
      <el-submenu index="9">
        <template slot="title">
          <i class="iconfont">&#xe607;</i>
          <span>回收站</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="CvmRecycle">
            <i class="iconfont">&#xe7a5;</i>
            <span slot="title">云服务器回收站</span>
          </el-menu-item>
          <el-menu-item index="CbsRecycle">
            <i class="iconfont">&#xe7a5;</i>
            <span slot="title">云硬盘回收站</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss" scoped>
.CVM {
  ::v-deep .el-menu{
    border-right: 0 !important;
  }
  .iconfont {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 16px;
    vertical-align: middle;
  }
  ::v-deep .el-menu-item{
    padding-left: 20px!important;
  }
}
</style>
