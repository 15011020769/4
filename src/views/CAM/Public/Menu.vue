<template>
  <div class="CAM">
    <div class="big-title">CAM</div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true">
      <el-menu-item index="UserList">
        <i class="iconfont">&#58884;</i>
        <span slot="title">用户列表</span>
      </el-menu-item>
      <el-menu-item index="UserGroup">
        <i class="iconfont">&#58966;</i>
        <span slot="title">用户组</span>
      </el-menu-item>
      <el-menu-item index="Strategy">
        <i class="iconfont">&#58900;</i>
        <span slot="title">策略</span>
      </el-menu-item>
      <el-menu-item index="Role">
        <i class="iconfont">&#58899;</i>
        <span slot="title">角色</span>
      </el-menu-item>
      <el-menu-item index="IdentityProvider">
        <i class="iconfont">&#58881;</i>
        <span slot="title">身份提供商</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="iconfont">&#58883;</i>
          <span>访问密钥</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="ApiKeyManager">
            <i class="iconfont">&#xe7a5;</i>
            <span slot="title">API密钥管理</span>
          </el-menu-item>
          <el-menu-item index="ProgrameKey">
            <i class="iconfont">&#xe7a5;</i>
            <span slot="title">项目密钥管理</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss" scoped>
.CLA {
  ::v-deep .el-menu{
    border-right: 0 !important;
  }
  .big-title{
    font-size: 16px;
    color: white;
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
  }
}
</style>
