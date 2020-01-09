<template>
  <div class="CLA">
    <div class="big-title">雲直播</div>
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
      <el-menu-item index="/domainManagement">
        <span slot="title">域名管理</span>
      </el-menu-item>
      <el-menu-item index="/streamManagement">
        <span slot="title">流管理</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <span>功能模板</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/transcribe">
            <span slot="title">录制配置</span>
          </el-menu-item>
          <el-menu-item index="/transcoding">
            <span slot="title">转码设置</span>
          </el-menu-item>
          <el-menu-item index="/screenshot">
            <span slot="title">截图鉴黄配置</span>
          </el-menu-item>
          <el-menu-item index="/watermark">
            <span slot="title">水印配置</span>
          </el-menu-item>
          <el-menu-item index="/callback">
            <span slot="title">回调配置</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <span>统计分析</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/appreciation">
            <span slot="title">增值功能</span>
          </el-menu-item>
          <el-menu-item index="/streamlookup">
            <span slot="title">流查询</span>
          </el-menu-item>
          <el-menu-item index="/operation">
            <span slot="title">运营数据</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/logManagement">
        <span slot="title">日志分析</span>
      </el-menu-item>
      <!-- <el-submenu index="3">
        <template slot="title">
          <span>直播SDK</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="license">
            <span slot="title">License</span>
          </el-menu-item>
          <el-menu-item index="application">
            <span slot="title">应用管理</span>
          </el-menu-item>
          <el-menu-item index="statistic">
            <span slot="title">统计分析</span>
          </el-menu-item>
          <el-menu-item index="meerkat">
            <span slot="title">移动直播连麦</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <span>慢直播</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="domainLive">
            <span slot="title">域名管理</span>
          </el-menu-item>
          <el-menu-item index="configuration">
            <span slot="title">模板配置</span>
          </el-menu-item>
          <el-menu-item index="statisticLive">
            <span slot="title">统计分析</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu> -->
      <el-submenu index="5">
        <template slot="title">
          <span>辅助工具</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/cutout">
            <span slot="title">断流诊断</span>
          </el-menu-item>
          <el-menu-item index="/builder">
            <span slot="title">地址生成器</span>
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
