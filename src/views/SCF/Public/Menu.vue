<template>
  <div class="SCF">
    <div class="big-title">{{ $t('SCF.total.yhs') }} SCF</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleSelect" @open="handleOpen" @close="handleClose" background-color="#292b36" text-color="#fff" active-text-color="#fff" :router="true">
      <el-menu-item index="overView" :class="{'menu-active': scfMenu === 'overView'}">
        <span slot="title">{{ $t('SCF.total.gl') }}</span>
      </el-menu-item>
      <el-menu-item index="FuncServe" :class="{'menu-active': scfMenu == 'FuncServe'}">
        <span slot="title">{{ $t('SCF.total.hsfw') }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      scfMenu: localStorage.getItem('scfMenu') ? localStorage.getItem('scfMenu') : 'overView'
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 选中菜单点击事件
    handleSelect(key, keyPath) {
      this.scfMenu = key
      localStorage.setItem('scfMenu', key)
    }
  },
};
</script>

<style lang="scss" scoped>
.SCF {
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
</style>
