<template>
  <div id="CM">
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
  export default {
    data() {
      return {};
    },
    components: {
      NavHeader,
      LeftAside
    },
    mounted() {

    },
    methods: {}
  };

</script>
<style lang="scss" scoped>
  #CM>>>.el-aside {
    background: #292b36 !important;
  }

  #CM {
    height: 100%;

    .el-container {
      height: 100%;

      .el-header {
        padding: 0 0 !important;
      }

      .el-aside {
        background-color: rgb(84, 92, 100);
      }

      .el-main {
        padding: 0;
        background: #f2f2f2;
        height: 100%;
      }
    }
  }

</style>
