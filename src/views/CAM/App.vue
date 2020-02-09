<template>
  <div id="CAM">
    <el-container v-if="$route.meta.keepAlive">
      <el-header>
        <nav-header></nav-header>
      </el-header>
      <el-container height="100%">
        <el-aside width="200px" height="100%">
          <left-aside></left-aside>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import NavHeader from "@/components/HeaderAside/Header";
import LeftAside from "./Public/Menu";
import { ALL_CITY } from "@/constants";
export default {
  data() {
    return {};
  },
  components: {
    NavHeader,
    LeftAside
  }
};
</script>
<style lang="scss" scoped>
#CAM >>> .el-aside {
  background: #292b36 !important;
  height: 100%;
}

#CAM >>> .el-menu {
  height: 100%;
}

#CAM >>> .el-container {
  height: 100vh !important;
  overflow: -moz-scrollbars-none; //兼容firehox
  -ms-overflow-style: none; //兼容ie 10+
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0 !important; //兼容chrome safiri
  }
}

#CAM {
  height: 100%;
  display: flex;
  flex-direction: column;

  .el-container {
    height: 100%;

    .el-header {
      padding: 0 0 !important;
    }

    .el-aside,
    .CAM {
      background-color: rgb(84, 92, 100);
      height: 100%;
    }

    .el-main {
      padding: 0;
      background: #f2f2f2;
      height: 100%;
    }
  }
}
</style>
