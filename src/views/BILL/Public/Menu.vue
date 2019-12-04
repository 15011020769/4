<template>
  <div class="CCN">
    <div class="big-title">费用中心</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" 
      @select="handleSelect"
      background-color="#292b36" 
      text-color="#fff" 
      active-text-color="#ffd04b" 
      :router="true"
    >
      <el-menu-item index="deal" :class="{'menu-active': activeMenu === 'deal'}">
        <span slot="title">订单管理</span>
      </el-menu-item>
      <el-menu-item index="overview" :class="{'menu-active': activeMenu === 'overview'}">
        <span slot="title">账单概览</span>
      </el-menu-item>
      <el-menu-item index="detail" :class="{'menu-active': activeMenu === 'detail'}">
        <span slot="title">账单明细</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: 'deal'        // 默认选中的菜单
    };
  },
  methods: {
    // 选中菜单点击事件
    handleSelect(key, keyPath) {
      this.activeMenu = key
    }
  }
};
</script>

<style lang="scss" scoped>
.CCN {
  ::v-deep .el-menu {
    border-right: 0 !important;
  }
  .big-title {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    margin: 10px 0;
    padding-left: 30px;
    display: block;
    height: 45px;
    line-height: 45px;
  }
  ::v-deep .el-menu-item {
    padding-left: 30px !important;
    display: block;
    height: 45px;
    line-height: 45px;
    color: white !important;
    font-size: 14px;
  }
  .menu-active{
    background-color: #20222c !important;
    color: white;
  }
}
</style>
