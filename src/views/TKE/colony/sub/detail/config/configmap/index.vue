 <!-- ConfigMap-详情 -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header tke-detail-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack()">
            <i class="el-icon-back"></i>
          </span>
          <span class="goback" @click="goColonyList()">集群({{$t('TKE.overview.zgtb')}}) /</span>
          <span class="goback" @click="goBack()">{{clusterId}} /</span>
          <h2 class="header-title">ConfigMap:{{Info.name}}({{Info.np}})</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>

    <!-- 详情子菜单导航 -->
    <div class="tke-detial-nav">
      <router-link
        class="nav-item"
        :to="{name:'configmapDetailInfo',query: {clusterId: clusterId,name:Info.name,np:Info.np}}"
      >{{$t('TKE.overview.xq')}}</router-link>
      <router-link
        class="nav-item"
        :to="{name:'configmapDetailYaml',query: {clusterId: clusterId,name:Info.name,np:Info.np}}"
      >YAML</router-link>
    </div>

    <!-- 子页面 -->
    <keep-alive>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "configmapDetail",
  data() {
    return {
      clusterId: "",
      Info: {
        name: "",
        np: "",
        time: ""
      }
    };
  },
  components: {},
  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    if (this.$route.query.name && this.$route.query.np) {
      this.Info.name = this.$route.query.name;
      this.Info.np = this.$route.query.np;
    }
  },
  methods: {
    timeFormat(times) {
      var d = new Date(times);
      var n = d.getFullYear();
      var y = d.getMonth() + 1;
      var r = d.getDate();
      var h = d.getHours(); //12
      var m = d.getMinutes(); //12
      var s = d.getSeconds();
      h < 10 ? (h = "0" + h) : h;
      m < 10 ? (m = "0" + m) : m;

      return n + "-" + y + "-" + r + " " + h + ":" + m + ":" + s;
    },
    //返回上一层
    goBack() {
      this.$router.push({
        name: "colonyConfigConfigmap"
      });
    },
    //返回集群列表
    goColonyList() {
      this.$router.push({
        name: "colony"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

