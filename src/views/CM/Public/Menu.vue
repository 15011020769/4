<template>
  <div class="CLA">
    <div class="big-title">云监控</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true">
      <el-menu-item index="overview">
        <i class="iconfont">&#xe615;</i>
        <span slot="title">监控概览</span>
      </el-menu-item>
      <el-menu-item index="Dashboard">
        <i class="iconfont">&#xe615;</i>
        <span slot="title">Dashboard</span>
      </el-menu-item>
      <el-menu-item index="Casegrouping">
        <i class="iconfont">&#xe615;</i>
        <span slot="title">实例分组</span>
      </el-menu-item>
      <el-menu-item index="History">
        <i class="iconfont">&#xe615;</i>
        <span slot="title">告警历史</span>
      </el-menu-item>


      <el-collapse v-model="activeName" accordion>
      
        <el-collapse-item name="1">
          <template slot="title">
            <i class="iconfont">&#xe615;</i>
            告警配置
          </template>
          <el-menu-item index="Toconfigure">
            <i class="iconfont">&#xe615;</i>
            <span slot="title">告警配置</span>
          </el-menu-item>
        </el-collapse-item>

      </el-collapse>











      <el-menu-item index="EventCenter">
        <i class="iconfont">&#xe615;</i>
        <span slot="title">事件中心</span>
      </el-menu-item>
      <el-menu-item index="Custom">
        <i class="iconfont">&#xe615;</i>
        <span slot="title">自定义监控</span>
      </el-menu-item>

      <el-menu-item index="flow">
        <i class="iconfont">&#xe615;</i>
        <span slot="title">流量监控</span>
      </el-menu-item>
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

      <!-- <el-menu-item index="peerConnect">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">对等连接</span>
      </el-menu-item> -->
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
    data() {
      return {
        activeName: '',
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
  .CLA {
    ::v-deep .el-menu {
      border-right: 0 !important;
    }

    ::v-deep .el-collapse-item__content {
      padding: 0;
    }
    ::v-deep .el-collapse-item__header {
      padding: 0;
      padding-left: 20px;
      background-color: rgb(84, 92, 100);
      color: white;
    }
    ::v-deep .el-collapse {
      border: none;
    }
    .big-title {
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
