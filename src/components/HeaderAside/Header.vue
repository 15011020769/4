<template>
  <div class="portal-header">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo floatLeft"
      mode="horizontal"
      @select="handleSelect"
      background-color="#000"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item class="manuList" index="0">
        <img src="@/assets/logo_5.svg" alt />
      </el-menu-item>
      <el-menu-item class="manuList" index="1">产品中心</el-menu-item>
      <el-menu-item class="manuList" index="2">定价</el-menu-item>
    </el-menu>
    <div class="floatRight">
      <el-button>控制台</el-button>
      <el-button>登录</el-button>
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
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="scss" scoped>
.portal-header{
  img{
    width: 140px;
    height: 60px;
  }
.el-menu{
  font-size:16px;
}
  .el-menu-item:nth-child(1){
    margin-right: 20%;
  }
}
.el-menu-demo{
  float:left;
  .manuList{
    font-size:18px;
  }
}
.floatLeft{
  float:left;
  width:calc(100% - 200px);
}
.floatRight{
  float:right;
  width:200px;
  height:60px;
  background-color:#000;
  button{
    font-size:18px;
    border:none;
    color:#fff;
    height:60px;
    line-height:32px;
    background-color:transparent;
  }
}
</style>