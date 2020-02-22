<template>
  <div class="CLA">
    <div class="big-title">容器服务</div>
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
      <el-menu-item index="/overview">
        <span slot="title">概览</span>
      </el-menu-item>
      <el-menu-item index="/colony">
        <span slot="title">集群</span>
      </el-menu-item>
      <el-menu-item index="/helm">
        <span slot="title">Helm应用</span>
      </el-menu-item>
      <!-- <el-submenu index="1">
        <template slot="title">
          <span>镜像仓库</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/myMirror">
            <span slot="title">我的镜像</span>
          </el-menu-item>
          <el-menu-item index="/myFavorite">
            <span slot="title">我的收藏</span>
          </el-menu-item>
          <el-menu-item index="/DockerHub">
            <span slot="title">DockerHub镜像</span>
          </el-menu-item>
          <el-menu-item index="/totalMirror">
            <span slot="title">公有镜像</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu> -->
      <el-menu-item index="/logCollection">
        <span slot="title">日志采集</span>
      </el-menu-item>
      <!-- <el-menu-item index="/warnings">
        <span slot="title">告警设置</span>
      </el-menu-item> -->
      <el-menu-item index="/persistence">
        <span slot="title">事件持久化</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "",
      activeName1: "",
      activeName2: "",
      activeIndex: "1",
      activeIndex2: "1"
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    }
  }
};
</script>

<style lang="scss" scoped>
.CLA {
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
}
</style>
