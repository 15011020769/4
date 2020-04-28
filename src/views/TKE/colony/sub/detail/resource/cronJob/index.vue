 <!-- deployment-详情 -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header tke-detail-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack()">
            <i class="el-icon-back"></i>
          </span>
          <span class="goback" @click="goColonyList()">
            集群(台灣台北) /
          </span>
          <span class="goback" @click="goBack()">
            cls-gwblk71e(tfy_test1) /
          </span>
          <h2 class="header-title">Node:10.0.0.9</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>

    <!-- 详情子菜单导航 -->
    <div class="tke-detial-nav">
      <router-link class="nav-item" :to="{name:'cronJobDetailEvent',query: {clusterId: clusterId,spaceName: spaceName,rowData: rowData}}">事件</router-link>
      <router-link class="nav-item" :to="{name:'cronJobDetailInfo',query: {clusterId: clusterId,spaceName: spaceName,rowData: rowData}}">詳情</router-link>
      <router-link class="nav-item" :to="{name:'cronJobDetailYaml',query: {clusterId: clusterId,spaceName: spaceName,rowData: rowData}}">YAML</router-link>
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
  name: "cronJobDetail",
  data() {
    return {
      clusterId:'',//集群id
      rowData: {},//传过来的数据
      spaceName: '',//路由传过来的命名空间名称
    };
  },
  components: {
    
  },
  created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
    this.spaceName = this.$route.query.spaceName;
    this.rowData = this.$route.query.rowData;
  },
  methods: {
    //返回上一层
    goBack(){
      this.$router.push({
        name:'colonyResourceCronJob',
      })
    },
    //返回集群列表
    goColonyList(){
      this.$router.push({
        name:'colony',
        
      })
    },
  }
};
</script>

<style lang="scss" scoped>



</style>

