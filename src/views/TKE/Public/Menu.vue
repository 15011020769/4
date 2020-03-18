<template>
  <div class="CLA">
    <div class="big-title">容器服務</div>
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
      <el-menu-item index="/overview" @click="_class" :class="{'active':classValue=='/overview'}">
        <span slot="title">概覽</span>
      </el-menu-item>
      <el-menu-item index="/colony" @click="_class" :class="{'active':classValue=='/colony'}">
        <span slot="title">集群</span>
      </el-menu-item>
      <el-menu-item index="/helm">
        <span slot="title" @click="_class" :class="{'active':classValue=='/helm'}">Helm应用</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title" @click="_class" :class="{'active':classValue=='/title'}">
          <span>映像倉庫</span>
        </template>
        <el-menu-item-group style="margin-left: 30px;">
          <el-menu-item index="/myMirror" @click="_class" :class="{'active':classValue=='/myMirror'}">
            <span slot="title">我的映像</span>
          </el-menu-item>
          <el-menu-item index="/myFavorite" @click="_class" :class="{'active':classValue=='/myFavorite'}">
            <span slot="title">我的收藏</span>
          </el-menu-item>
          <!-- <el-menu-item index="/DockerHub" @click="_class" :class="{'active':classValue=='/DockerHub'}">
            <span slot="title">DockerHub镜像</span>
          </el-menu-item> -->
          <el-menu-item index="/totalMirror" @click="_class" :class="{'active':classValue=='/totalMirror'}">
            <span slot="title">公有映像</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/logCollection" @click="_class" :class="{'active':classValue=='/logCollection'}">
        <span slot="title">日誌採集</span>
      </el-menu-item>
      <!-- <el-menu-item index="/warnings" @click="_class" :class="{'active':classValue=='/warnings'}">
        <span slot="title">告警设置</span>
      </el-menu-item> -->
      <el-menu-item index="/persistence" @click="_class" :class="{'active':classValue=='/persistence'}">
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
      activeIndex2: "1",
      classValue: '',
    };
  },
  created() {
    this.classValue = this.$route.name
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    _class(key) {
      this.classValue = key.index;
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

  .active {
    background-color: #20222c !important;
    color: white;
  }
}
</style>
