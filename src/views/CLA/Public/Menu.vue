<template>
  <div class="CLA">
    <div class="big-title">{{ $t('CLA.total.ysj') }} CloudAudit</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      background-color="#292b36" text-color="#fff" active-text-color="#fff" :router="true">

      <el-menu-item index="CloudAudit" @click="_class" :class="{'active':classValue=='CloudAudit'}">
        <span slot="title">{{ $t('CLA.total.czjl') }}</span>
      </el-menu-item>
      <el-menu-item index="Audit" @click="_class" :class="{'active':classValue=='Audit'}">
        <span slot="title">{{ $t('CLA.total.gzj') }}</span>
      </el-menu-item>
      <!-- <el-menu-item index="History">
        <span slot="title">{{ $t('CLA.total.lsjldc') }}</span>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: "1",
        activeIndex2: "1",
        classValue: localStorage.getItem('classValue') ? localStorage.getItem('classValue') : 'CloudAudit'       // 默认选中的菜单
      };
    },
    created() {
      this.classValue = this.$route.name
    },
    methods: {
      _class(key) {
        this.classValue = key.index
      },
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
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

    .active {
      background-color: #20222c !important;
      color: white;
    }
  }

</style>
