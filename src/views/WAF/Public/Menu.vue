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
      @select="handleSelect"
    >

      <el-menu-item index="/saveOverView" :class="{'menu-active': activeIndex === '/saveOverView'}">{{t('安全概览', 'WAF.aqgl')}}</el-menu-item>
      <el-submenu index="logService">
        <template slot="title">
          <span>{{t('日志服务', 'WAF.rzfw')}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="/attackDetails" :class="{'menu-active': activeIndex === '/attackDetails'}">{{t('攻击日志', 'WAF.gjrz')}}</el-menu-item>
          <el-menu-item class="selectMenu" index="/accessLog" :class="{'menu-active': activeIndex === '/accessLog'}">{{t('访问日志', 'WAF.fwrz')}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="webFirewall">
        <template slot="title">
          <span>Web {{t('应用防火墙', 'WAF.yyfhq')}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="/protectionSettings" :class="{'menu-active': activeIndex === '/protectionSettings'}">{{t('防护设置', 'WAF.fhsz')}}</el-menu-item>
          <!-- <el-menu-item class="selectMenu" index="/attackDetails">{{t('攻击详情', 'WAF.gjxq')}}</el-menu-item> -->
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
          <el-menu-item class="selectMenu" index="/ipSearch" :class="{'menu-active': activeIndex === '/ipSearch'}">IP {{t('查询', 'WAF.js')}}</el-menu-item>
          <el-menu-item class="selectMenu" index="/ipList" :class="{'menu-active': activeIndex === '/ipList'}">IP {{t('黑白名单', 'WAF.hbmd')}}</el-menu-item>
          <el-menu-item class="selectMenu" index="/ipStatus" :class="{'menu-active': activeIndex === '/ipStatus'}">IP {{t('封堵状态', 'WAF.fdzt')}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="botMan">
        <template slot="title">
          <span>BOT {{t('行为管理', 'WAF.xwgl')}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="/botOverview" :class="{'menu-active': activeIndex === '/botOverview'}">BOT {{t('概览', 'WAF.gl')}}</el-menu-item>
          <el-menu-item class="selectMenu" index="/botSetting" :class="{'menu-active': activeIndex === '/botSetting'}">BOT {{t('设置', 'WAF.sz')}}</el-menu-item>
          <el-menu-item class="selectMenu" index="/botDetail" :class="{'menu-active': activeIndex === '/botDetail'}">BOT {{t('详情', 'WAF.xq')}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: localStorage.getItem('activeIndex') ? localStorage.getItem('activeIndex') : '/saveOverView'       // 默认选中的菜单
    }
  },
  methods: {
    // 选中菜单点击事件
    handleSelect(key, keyPath) {
      this.activeIndex = key
      localStorage.setItem('activeIndex', key)
    }
  }
}
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
  .menu-active {
    background-color: #20222c !important;
    color: white;
  }
}
</style>
