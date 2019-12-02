<template>
  <div class="DDOS">
    <div class="big-title">DDoS</div>
    <!-- <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true">
      <el-menu-item index="appId">
        <i class="iconfont">&#xe615;</i>
        <span slot="title">APPID列表</span>
      </el-menu-item>
    </el-menu>-->
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#292b36"
      text-color="#fff"
      active-text-color="#fff"
      :router="true"
    >
      <el-menu-item index="ProtectOverview">
        <span slot="title">防护概览</span>
      </el-menu-item>
      <el-menu-item index="basicProtection">
        <span slot="title">基础防护</span>
      </el-menu-item>
      <el-submenu index="IpProfessional">
        <template slot="title">
          <span>高防IP专业版</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="IpProfessional">统计报表</el-menu-item>
          <el-menu-item class="selectMenu" index="ProtectionConfig">防护配置</el-menu-item>
          <el-menu-item class="selectMenu" index="AccessConfig">接入配置</el-menu-item>
          <el-menu-item class="selectMenu" index="AssetList">资产列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="unBlocking">
        <template slot="title">
          <span>自助解封</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="unBlocking">解封操作</el-menu-item>
          <el-menu-item class="selectMenu" index="UnblockingRecord">解封操作记录</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1"
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="scss" scoped>
.DDOS {
  ::v-deep .el-menu {
    border-right: 0 !important;
  }
  .big-title {
    font-size: 16px;
    font-weight: bold;
    color: white;
    padding: 20px 0 15px 20px;
    background: #292b36;
    height: 45px;
    margin: 10px 0;
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
    height: 45px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
}
.selectMenu {
  text-indent: 20px;
}
</style>
