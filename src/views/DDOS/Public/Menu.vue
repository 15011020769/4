<template>
  <div class="DDOS">
    <div class="big-title">DDoS 基礎防護</div>
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
      @select="handleSelect"
      background-color="#292b36"
      text-color="#fff"
      active-text-color="#fff"
      :router="true"
    >
      <el-menu-item index="ProtectOverview" :class="{'menu-active': ddosMenu === 'ProtectOverview'}">
        <span slot="title">防護概覽</span>
      </el-menu-item>
      <el-menu-item index="basicProtection" :class="{'menu-active': ddosMenu === 'basicProtection'}">
        <span slot="title">基礎防護</span>
      </el-menu-item>
      <el-submenu index="IpProfessional">
        <template slot="title">
          <span>DDoS 高防IP專業版</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="IpProfessional" :class="{'menu-active': ddosMenu === 'IpProfessional'}">統計報表</el-menu-item>
          <el-menu-item class="selectMenu" index="ProtectionConfig" :class="{'menu-active': ddosMenu === 'ProtectionConfig'}">防護配置</el-menu-item>
          <el-menu-item class="selectMenu" index="AccessConfig" :class="{'menu-active': ddosMenu === 'AccessConfig'}">接入配置</el-menu-item>
          <el-menu-item class="selectMenu" index="AssetList" :class="{'menu-active': ddosMenu === 'AssetList'}">資產清單</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="unBlocking">
        <template slot="title">
          <span>自助解封</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="unBlocking" :class="{'menu-active': ddosMenu === 'unBlocking'}">解封操作</el-menu-item>
          <el-menu-item class="selectMenu" index="UnblockingRecord" :class="{'menu-active': ddosMenu === 'UnblockingRecord'}">解封操作記錄</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ddosMenu: localStorage.getItem('ddosMenu') ? localStorage.getItem('ddosMenu') : 'ProtectOverview'       // 默认选中的菜单
    };
  },
  methods: {
    // 选中菜单点击事件
    handleSelect(key, keyPath) {
      this.ddosMenu = key
      localStorage.setItem('ddosMenu', key)
    },
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
  .menu-active {
    background-color: #20222c !important;
    color: white;
  }
}
.selectMenu {
  text-indent: 20px;
}
</style>
