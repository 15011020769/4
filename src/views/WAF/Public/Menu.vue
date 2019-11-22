<template>
  <div class="CLA">
    <div class="big-title"></div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true">
      <el-submenu index="ipMan">
        <template slot="title">
          <span>IP管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="ipSearch">IP 查询</el-menu-item>
          <el-menu-item class="selectMenu" index="ipList">IP 黑白名单</el-menu-item>
          <el-menu-item class="selectMenu" index="ipStatus">IP 封堵状态</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="botMan">
        <template slot="title">
          <span>BOT 行为管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="selectMenu" index="botOverview">BOT 概览</el-menu-item>
          <el-menu-item class="selectMenu" index="botSetting">BOT 设置</el-menu-item>
          <el-menu-item class="selectMenu" index="botDetail">BOT 详情</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
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
