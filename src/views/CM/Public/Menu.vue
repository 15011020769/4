<template>
  <div class="CLA">
    <div class="big-title">CLA</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true">
      <el-menu-item index="CVM">
        <i class="iconfont">&#xe615;</i>
        <span slot="title">云服务器</span>
      </el-menu-item>
      <el-menu-item index="cloudDisk">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">云硬盘</span>
      </el-menu-item>
      <el-menu-item index="cloudMysql">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">云数据库</span>
      </el-menu-item>
      <el-menu-item index="NATgateway">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">NAT网关</span>
      </el-menu-item>

      <el-menu-item index="peerConnect">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">对等连接</span>
      </el-menu-item>
      <el-menu-item index="VPNgateway">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">VPN网关</span>
      </el-menu-item>
      <el-menu-item index="VPNchannel">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">VPN通道</span>
      </el-menu-item>
      <el-menu-item index="objectStorage">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">对象存储</span>
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
