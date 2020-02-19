<template>
  <div class="CLA">
    <div class="big-title">Web 应用防火墙</div>
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
    
      <el-menu-item index="/saveOverView">安全概览</el-menu-item>
      <el-submenu index="webFirewall">
        <template slot="title">
          <span>web应用防火墙</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="/protectionSettings">防护设置</el-menu-item>
          <el-menu-item class="selectMenu" index="/attackDetails">攻击详情</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="saveOverView">
        <template slot="title">
          <span>web安全检测</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="/hijackDetection">DNS劫持检测</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="ipMan">
        <template slot="title">
          <span>IP管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="/ipSearch">IP 查询</el-menu-item>
          <el-menu-item class="selectMenu" index="/ipList">IP 黑白名单</el-menu-item>
          <el-menu-item class="selectMenu" index="/ipStatus">IP 封堵状态</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="botMan">
        <template slot="title">
          <span>BOT 行为管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="/botOverview">BOT 概览</el-menu-item>
          <el-menu-item class="selectMenu" index="/botSetting">BOT 设置</el-menu-item>
          <el-menu-item class="selectMenu" index="/botDetail">BOT 详情</el-menu-item>
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
.CLA {
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
  .selectMenu{
    padding-left: 40px!important;
  }
}
</style>
