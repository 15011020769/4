<template>
  <div class="CLA">
    <div class="big-title">雲直播 CSS</div>
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
        <span slot="title">{{$t('CSS.leftSide.0')}}</span>
      </el-menu-item>
      <el-menu-item index="/domainManagement">
        <span slot="title">{{$t('CSS.leftSide.1')}}</span>
      </el-menu-item>
      <el-menu-item index="/streamManagement">
        <span slot="title">{{$t('CSS.leftSide.2')}}</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <span>{{$t('CSS.leftSide.3')}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/transcribe">
            <span slot="title">{{$t('CSS.leftSide.4')}}</span>
          </el-menu-item>
          <el-menu-item index="/transcoding">
            <span slot="title">{{$t('CSS.leftSide.5')}}</span>
          </el-menu-item>
          <el-menu-item index="/screenshot">
            <span slot="title">截圖配置</span>
          </el-menu-item>
          <el-menu-item index="/watermark">
            <span slot="title">{{$t('CSS.leftSide.7')}}</span>
          </el-menu-item>
          <el-menu-item index="/callback">
            <span slot="title">{{$t('CSS.leftSide.8')}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <span>{{$t('CSS.leftSide.9')}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/appreciation">
            <span slot="title">{{$t('CSS.leftSide.10')}}</span>
          </el-menu-item>
          <el-menu-item index="/streamlookup">
            <span slot="title">{{$t('CSS.leftSide.11')}}</span>
          </el-menu-item>
          <el-menu-item index="/operation">
            <span slot="title">{{$t('CSS.leftSide.12')}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!-- <el-menu-item index="/logManagement">
        <span slot="title">{{$t('CSS.leftSide.13')}}</span>
      </el-menu-item> -->
      <!-- <el-submenu index="3">
        <template slot="title">
          <span>{{$t('CSS.leftSide.14')}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="license">
            <span slot="title">License</span>
          </el-menu-item>
          <el-menu-item index="application">
            <span slot="title">{{$t('CSS.leftSide.15')}}</span>
          </el-menu-item>
          <el-menu-item index="statistic">
            <span slot="title">{{$t('CSS.leftSide.16')}}</span>
          </el-menu-item>
          <el-menu-item index="meerkat">
            <span slot="title">{{$t('CSS.leftSide.17')}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <span>{{$t('CSS.leftSide.18')}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="domainLive">
            <span slot="title">{{$t('CSS.leftSide.19')}}</span>
          </el-menu-item>
          <el-menu-item index="configuration">
            <span slot="title">{{$t('CSS.leftSide.20')}}</span>
          </el-menu-item>
          <el-menu-item index="statisticLive">
            <span slot="title">{{$t('CSS.leftSide.21')}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu> -->
      <el-submenu index="4">
        <template slot="title">
          <span>慢直播</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/slow/domains">
            <span slot="title">域名管理</span>
          </el-menu-item>
          <el-menu-item index="/slow/templates">
            <span slot="title">範本配置</span>
          </el-menu-item>
          <el-menu-item index="/slow/stat">
            <span slot="title">統計分析</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <span>{{$t('CSS.leftSide.22')}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/cutout">
            <span slot="title">{{$t('CSS.leftSide.23')}}</span>
          </el-menu-item>
          <el-menu-item index="/builder">
            <span slot="title">{{$t('CSS.leftSide.24')}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
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
