<template>
  <div class="MGC">
    <div class="big-title">訊息中心</div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @select="handleSelect" 
      background-color="#292b36"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
    >
      <el-menu-item index="message" :class="{'menu-active': activeMenu === 'message'}">
        <span slot="title">站内信</span>
      </el-menu-item>
      <el-menu-item index="newsFeeds" :class="{'menu-active': activeMenu === 'newsFeeds'}">
        <span slot="title">通知公告</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: localStorage.getItem('activeMenu') ? localStorage.getItem('activeMenu') : 'message'        // 默认选中的菜单
    };
  },
  methods: {
    // 选中菜单点击事件
    handleSelect(key, keyPath) {
      this.activeMenu = key
      localStorage.setItem('activeMenu', this.activeMenu)
    }
  }
};
</script>

<style lang="scss" scoped>
.MGC {
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
    color: white !important;
    font-size: 14px;
  }
  .menu-active {
    background-color: #20222c !important;
    color: white !important;
  }
}
</style>
