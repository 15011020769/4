 <!-- Master&Etcd-详情 -->
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
          <h2 class="header-title">Node:10.0.0.5</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>

    <!-- 详情子菜单导航 -->
    <div class="tke-detial-nav">
      <router-link class="nav-item" :to="{name:'masteretcdDetailPod',query: {clusterId: clusterId,node: node}}">Pod管理</router-link>
      <router-link class="nav-item" :to="{name:'masteretcdDetailEvent',query: {clusterId: clusterId,node: node}}">事件</router-link>
      <router-link class="nav-item" :to="{name:'masteretcdDetailInfo',query: {clusterId: clusterId,detail: detail}}">详情</router-link>
      <router-link class="nav-item" :to="{name:'masteretcdDetailYaml',query: {clusterId: clusterId,node: node}}">YAML</router-link>
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
  name: "masteretcdDetail",
  data() {
    return {
      clusterId:'',
      node: '',
      detail: {}
    };
  },
  components: {
    
  },
  created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
    this.node = this.$route.query.node;
    this.detail = this.$route.query.detail;
    console.log("asdsadsadasd",node);
  },
  methods: {
    //返回上一层
    goBack(){
      this.$router.push({
        name:'colonyNodeManageMasteretcd',
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

