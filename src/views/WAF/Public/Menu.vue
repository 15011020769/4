<template>
  <div class="CLA">
    <div class="big-title">Web {{t('应用防火墙', 'WAF.yyfhq')}}</div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#292b36"
      text-color="#fff"
      active-text-color="#fff"
      :router="true"
    >
    
      <el-menu-item index="/saveOverView">{{t('安全概览', 'WAF.aqgl')}}</el-menu-item>
      <el-submenu index="webFirewall">
        <template slot="title">
          <span>Web {{t('应用防火墙', 'WAF.yyfhq')}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="/protectionSettings">{{t('防护设置', 'WAF.fhsz')}}</el-menu-item>
          <el-menu-item class="selectMenu" index="/attackDetails">{{t('攻击详情', 'WAF.gjxq')}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!-- <el-submenu index="saveOverView">
        <template slot="title">
          <span>web安全检测</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="/hijackDetection">DNS劫持检测</el-menu-item>
        </el-menu-item-group>
      </el-submenu> -->
      <el-submenu index="ipMan">
        <template slot="title">
          <span>IP管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="/ipSearch">IP {{t('查询', 'WAF.js')}}</el-menu-item>
          <el-menu-item class="selectMenu" index="/ipList">IP {{t('黑白名单', 'WAF.hbmd')}}</el-menu-item>
          <el-menu-item class="selectMenu" index="/ipStatus">IP {{t('封堵状态', 'WAF.fdzt')}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="botMan">
        <template slot="title">
          <span>BOT {{t('行为管理', 'WAF.xwgl')}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="/botOverview">BOT {{t('概览', 'WAF.gl')}}</el-menu-item>
          <el-menu-item class="selectMenu" index="/botSetting">BOT {{t('设置', 'WAF.sz')}}</el-menu-item>
          <el-menu-item class="selectMenu" index="/botDetail">BOT {{t('详情', 'WAF.xq')}}</el-menu-item>
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
