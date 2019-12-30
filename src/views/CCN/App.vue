<template>
  <div id="CCN">
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
import { ALL_PROJECT, ALL_CITY } from "@/constants";
export default {
  data() {
    return {};
  },
  components: {
    NavHeader,
    LeftAside
  },
  mounted() {
    this.GetCity();
  },
  methods: {
    // 获取城市列表
    GetCity() {
      this.axios.get(ALL_CITY).then(data => {
        let city = data.data[0];
        localStorage.setItem("regionv1", city.regionCode);
        localStorage.setItem("regionv2", city.Region);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#CCN >>> .el-aside {
  background: #292b36 !important;
}
#CCN {
  height: 100%;
  font-size: 12px;
  .el-container {
    height: 100%;
    .el-header {
      padding: 0 0 !important;
    }
    .el-aside {
      background-color: #292b36;
    }
    .el-main {
      padding: 0;
      background: #f2f2f2;
      height: 100%;
    }
  }
}
</style>
