<template>
  <div class="CCN">
    <div class="big-title">雲聯網 CCN</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      background-color="#292b36" text-color="#fff" active-text-color="#fff" :router="true">
      <el-menu-item index="ccnPage" @click="_class" :class="{'active':classValue=='ccnPage'}">
        <span slot="title">雲聯網 CCN</span>
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
        classValue: '',
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
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
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
