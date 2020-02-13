<template>
  <div class="contant">
    <div class="CAM">
      <div class="big-title">訪問管理 CAM</div>
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
        <el-menu-item index="/UserListNew">
          <i class="iconfont"></i>
          <span slot="title">{{$t('CAM.userList.listTitle')}}</span>
        </el-menu-item>
        <el-menu-item index="/UserGroup">
          <i class="iconfont"></i>
          <span slot="title">{{$t('CAM.userList.userGroup')}}</span>
        </el-menu-item>
        <el-menu-item index="/Strategy">
          <i class="iconfont"></i>
          <span slot="title">{{$t('CAM.Role.strategy')}}</span>
        </el-menu-item>
        <el-menu-item index="/Role">
          <i class="iconfont"></i>
          <span slot="title">{{$t('CAM.Role.title')}}</span>
        </el-menu-item>
        <el-menu-item index="/IdentityProvider">
          <i class="iconfont"></i>
          <span slot="title">{{$t('CAM.Role.identityProvider')}}</span>
        </el-menu-item>
        <el-menu-item index="/ApiKeyManager">
          <i class="iconfont"></i>
          <span slot="title">{{$t('CAM.userList.APISecret')}}</span>
        </el-menu-item>
        <!-- <el-submenu index="2">
          <template slot="title">
            <i class="iconfont"></i>
            <span>访问密钥</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="ApiKeyManager">
              <i class="iconfont"></i>
              <span slot="title">API密钥管理</span>
            </el-menu-item>
            <el-menu-item index="ProgrameKey">
              <i class="iconfont"></i>
              <span slot="title">项目密钥管理</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu> -->
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1"
    };
  },
  methods: {
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
// .leftSide{
//   height:100%;
//   background-color:#000;
// }
.CAM{
  background: rgb(41, 43, 54) !important;
}
.big-title {
  font-size: 16px;
  font-weight: bold;
  color: white;
  padding: 20px 0 15px 20px;
  background: rgb(41, 43, 54);
  height: 45px;
  margin: 10px 0;
}
.contant {
  height: 100%;
  overflow: hidden;
}
.CAM {
  background: #000;
}
.CLA {
  ::v-deep .el-menu {
    border-right: 0 !important;
  }
  .big-title {
    font-size: 16px;
    color: white;
    display: none;
    padding: 20px 0 15px 20px;
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
