<template>
  <div id="WAF">
    <el-container v-if="$route.meta.keepAlive">
      <el-header>
        <nav-header></nav-header>
      </el-header>
      <el-container height="100%">
        <el-aside width="200px" height="100%" v-if="$route.meta.leftNav">
          <left-aside></left-aside>
        </el-aside>
        <el-main>
        　　<router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
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
  },
  mounted() {
    this.GetCity();
  },
  methods: {
    // 获取城市列表
    GetCity() {
      this.axios.get(ALL_CITY).then(data => {
        let city = data.data[0];
        this.$cookie.set("regionv1", city.regionCode);
        this.$cookie.set("regionv2", city.Region);
      });
    },
    // 获取项目列表
    getProgectList() {
      var params = {};
      this.axios.post("account/DescribeProject", params).then(data => {
        let projectList = data.data;
        let defaultPro = {
          projectId: 0,
          projectInfo: "默认项目",
          projectName: "默认项目"
        };
        projectList.unshift(defaultPro);
        // localStorage存储对象或者数据，必须先转成字符串JSON.stringify存储，在用JSON.parse进行解析
        localStorage.setItem("projectList", JSON.stringify(projectList));
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#WAF >>> .el-aside {
  background: #292b36 !important;
}
#WAF {
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
<style lang="scss">
.el-pagination {
  position: relative;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #ebeef5;
  color: black;
  padding: 17px 0 15px 0 !important;
}
.el-pagination__total {
  position: absolute;
  left: 7px;
}
</style>
