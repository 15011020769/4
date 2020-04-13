<template>
  <div class="CLA">
    <div class="big-title">{{ $t("menu.title1") }} CM</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      background-color="#292b36" text-color="#fff" active-text-color="#fff" :router="true">
      <el-menu-item index="/overview">
        <span slot="title">監控概覽</span>
      </el-menu-item>
      <el-menu-item index="/Dashboard">
        <span slot="title">Dashboard</span>
      </el-menu-item>
      <el-menu-item index="/Casegrouping">
        <span slot="title">實例分組</span>
      </el-menu-item>
      <el-menu-item index="/History">
        <span slot="title">告警曆史</span>
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title">
          <span>告警配置</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/strategy">
            <span slot="title">告警策略</span>
          </el-menu-item>
          <el-menu-item index="/subscription">
            <span slot="title">平台事件訂閱</span>
          </el-menu-item>
          <el-menu-item index="/message">
            <span slot="title">自定義訊息</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/Template">
        <span slot="title">觸發條件範本</span>
      </el-menu-item>
      <el-submenu index="5">
        <template slot="title">
          <span>事件中心</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/product">
            <span slot="title">産品事件</span>
          </el-menu-item>
          <el-menu-item index="/platform">
            <span slot="title">平台事件</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!-- <el-submenu index="6">
        <template slot="title">
          <span>自定義監控</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/configuration">
            <span slot="title">監控配置</span>
          </el-menu-item>
          <el-menu-item index="/view">
            <span slot="title">監控視圖</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu> -->
      <el-menu-item index="/flow">
        <span slot="title">流量監控</span>
      </el-menu-item>
      <el-menu-item index="/CVM" @click="_class" :class="{ active: classValue == 'CVM' }">
        <span slot="title">{{ $t("menu.title2") }}</span>
      </el-menu-item>
      <el-menu-item index="/cloudDisk" @click="_class" :class="{ active: classValue == 'cloudDisk' }">
        <span slot="title">{{ $t("menu.title3") }}</span>
      </el-menu-item>
      <el-menu-item index="/CLBload" @click="_class" :class="{ active: classValue == 'CLBload' }">
        <span slot="title">{{ $t("menu.title4") }}</span>
      </el-menu-item>

      <el-submenu index="1">
        <template slot="title">
          <span>{{ $t("menu.title5") }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/cloudMysql" @click="_class" :class="{ active: classValue == 'cloudMysql' }">
            <span slot="title">{{ $t("menu.title6") }}</span>
          </el-menu-item>
          <el-menu-item index="/Redis" @click="_class" :class="{ active: classValue == 'Redis' }">
            <span slot="title">{{ $t("menu.title7") }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <span>{{ $t("menu.title8") }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/NATgateway" @click="_class" :class="{ active: classValue == 'NATgateway' }">
            <span slot="title">{{ $t("menu.title9") }}</span>
          </el-menu-item>
          <el-menu-item index="/VPNgateway" @click="_class" :class="{ active: classValue == 'VPNgateway' }">
            <span slot="title">{{ $t("menu.title10") }}</span>
          </el-menu-item>
          <el-menu-item index="/VPNchannel" @click="_class" :class="{ active: classValue == 'VPNchannel' }">
            <span slot="title">{{ $t("menu.title11") }}</span>
          </el-menu-item>
          <el-menu-item index="/networkIP" @click="_class" :class="{ active: classValue == 'networkIP' }">
            <span slot="title">{{ $t("menu.title12") }}</span>
          </el-menu-item>
          <el-menu-item index="/PrivateGateway" @click="_class" :class="{ active: classValue == 'PrivateGateway' }">
            <span slot="title">{{ $t("CVM.zxwg") }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <span>{{ $t("menu.title13") }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/Physics" @click="_class" :class="{ active: classValue == 'Physics' }">
            <span slot="title">{{ $t("menu.title14") }}</span>
          </el-menu-item>
          <el-menu-item index="/Private" @click="_class" :class="{ active: classValue == 'Private' }">
            <span slot="title">{{ $t("menu.title15") }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!-- <el-menu-item index="peerConnect">
        <i class="iconfont">&#xe679;</i>
        <span slot="title">對等連接</span>
      </el-menu-item>-->

      <el-menu-item index="/objectStorage" @click="_class" :class="{ active: classValue == 'objectStorage' }">
        <span slot="title">{{ $t("menu.title16") }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: "1",
        routeName: "",
        classValue: ""
      };
    },
    watch: {
      $route(val) {
        this.routeName = val;
      }
    },
    created() {
      this.classValue = this.$route.name;
    },
    methods: {
      _class(key) {
        this.classValue = key.index;
      },
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

    .active {
      background-color: #20222c !important;
      color: white;
    }
  }

</style>
