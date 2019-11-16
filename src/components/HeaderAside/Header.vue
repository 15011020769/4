<template>
  <div class="portal-header">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo floatLeft"
      mode="horizontal"
      @select="handleSelect"
      background-color="#2C303A "
      text-color="#fff"
      active-text-color="#fff"
    >
      <el-menu-item class="manuList" index="0">
        <img src="@/assets/logo_5.svg" width="140px" height="60px" alt />
      </el-menu-item>
      <el-menu-item class="manuList" index="1" @mouseenter.native="Show">产品中心</el-menu-item>
      <el-menu-item class="manuList" index="2">定价</el-menu-item>
    </el-menu>
    <div class="floatRight">
      <el-button>控制台</el-button>
      <el-button>登录</el-button>
    </div>

    <transition-group name="hehe">
      <div class="PRO-style" v-if="show" :key="1" @mouseleave="leavel">
        <product-center></product-center>
      </div>
    </transition-group>
  </div>
</template>

<script>
import productCenter from "./ProductCenter";
export default {
  data() {
    return {
      activeIndex: "", // 默认选中的一个导航菜单
      show: false
    };
  },
  components: {
    productCenter
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    Show() {
      this.show = true;
    },
    leavel(e) {
      if (
        e.toElement &&
        (e.toElement.className ===
          "el-autocomplete-suggestion__wrap el-scrollbar__wrap el-scrollbar__wrap--hidden-default" ||
          e.toElement.className === "name" ||
          e.toElement.className === "el-scrollbar" ||
          e.toElement.className === "el-menu-item is-active" ||
          e.toElement.className ===
            "el-autocomplete-suggestion__wrap el-scrollbar__wrap" ||
          e.toElement.className === "" ||
          e.toElement.className === "el-menu-item")
      ) {
      } else {
        this.show = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.PRO-style {
  background-color: #ffffff;
  color: #000000;
  display: show;
  overflow: hidden;
  z-index: 999;
  position: absolute;
  top: 60px;
  left: 200px;
}
.portal-header {
  .el-menu-demo {
    border: 0 !important;
  }

  .el-menu-item {
    font-size: 16px;
    color: white;
    border-bottom: 0;
    background-color: #000 !important;

    &:hover {
      background-color: rgb(61, 65, 75) !important;
    }

    .el-button {
      background: #fdcd00;
      color: #333333;
      border: 0;
    }
  }
  .logo {
    width: 350px;
    text-align: left;
    border-bottom: 0 !important;
    cursor: default;
    line-height: 0;

    img {
      cursor: pointer;
    }

    &:hover {
      background-color: #2c303a !important;
    }
    &:focus {
      border-bottom: 0;
    }
  }

  .right-item {
    float: right;
  }
}
.count-li {
  text-align: center;
  &:hover {
    background-color: #3d414b !important;
  }
}
.span-read {
  display: inline-block;
  height: 16px;
  line-height: 16px;
  padding: 0 7px;
  margin-left: 10px;
  font-size: 12px;
  color: #fff;
  background: #fdc733;
  border-radius: 100px;
}
.floatRight {
  float: right;
  width: 200px;
  height: 60px;
  background-color: #000;
  button {
    font-size: 18px;
    border: none;
    color: #fff;
    height: 60px;
    line-height: 32px;
    background-color: transparent;
  }
}
.floatLeft {
  float: left;
  width: calc(100% - 200px);
  li {
    border-bottom-color: #fdcd00 !important;
  }
  li:nth-child(2) {
    margin-left: 200px;
  }
}
</style>

<style>
/* 暂时在此处处理下拉框的宽度，后期若有变化，再处理 */
.el-menu--popup {
  min-width: 138px !important;
}
.el-menu--horizontal {
  border-bottom: 0 solid #fff !important;
  background-color: #000 !important;
}
</style>
