<template>
  <div class="CCN">
    <div class="big-title">{{$t('BILL.Deal.bigTitle')}}</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleSelect" background-color="#292b36" text-color="#fff" active-text-color="#ffd04b" :router="true">
      <el-menu-item index="deal" :class="{'menu-active': billMenu === 'deal'}">
        <span slot="title">{{$t('BILL.Deal.title')}}</span>
      </el-menu-item>
      <el-menu-item index="overview" :class="{'menu-active': billMenu === 'overview'}">
        <span slot="title">{{$t('BILL.Overview.title')}}</span>
      </el-menu-item>
      <el-menu-item index="detail" :class="{'menu-active': billMenu === 'detail'}">
        <span slot="title">{{$t('BILL.Detail.title')}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      billMenu: localStorage.getItem('billMenu') ? localStorage.getItem('billMenu') : 'deal'       // 默认选中的菜单
    };
  },
  methods: {
    // 选中菜单点击事件
    handleSelect(key, keyPath) {
      this.billMenu = key
      localStorage.setItem('billMenu', key)
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
  .menu-active {
    background-color: #20222c !important;
    color: white;
  }
}
</style>
