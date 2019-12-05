<template>
  <div class="CLA">
    <div class="big-title">{{$t("CM.menu.title1")}}</div>
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
      <el-menu-item index="CVM">
        <span slot="title">{{$t("CM.menu.title2")}}</span>
      </el-menu-item>
      <el-menu-item index="cloudDisk">
        <span slot="title">{{$t("CM.menu.title3")}}</span>
      </el-menu-item>
      <el-menu-item index="CLBload">
        <span slot="title">{{$t("CM.menu.title4")}}</span>
      </el-menu-item>

      <el-submenu index="1">
        <template slot="title">
          <span>{{$t("CM.menu.title5")}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="cloudMysql">
            <span slot="title">{{$t("CM.menu.title6")}}</span>
          </el-menu-item>
          <el-menu-item index="Redis">
            <span slot="title">{{$t("CM.menu.title7")}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <span>{{$t("CM.menu.title8")}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="NATgateway">
            <span slot="title">{{$t("CM.menu.title9")}}</span>
          </el-menu-item>
          <el-menu-item index="VPNgateway">
            <span slot="title">{{$t("CM.menu.title10")}}</span>
          </el-menu-item>
          <el-menu-item index="VPNchannel">
            <span slot="title">{{$t("CM.menu.title11")}}</span>
          </el-menu-item>
          <el-menu-item index="networkIP">
            <span slot="title">{{$t("CM.menu.title12")}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <span>{{$t("CM.menu.title13")}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="Physics">
            <span slot="title">{{$t("CM.menu.title14")}}</span>
          </el-menu-item>
          <el-menu-item index="Private">
            <span slot="title">{{$t("CM.menu.title15")}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!-- <el-menu-item index="peerConnect">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">对等连接</span>
      </el-menu-item>-->

      <el-menu-item index="objectStorage">
        <span slot="title">{{$t("CM.menu.title16")}}</span>
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
  
}
</style>
