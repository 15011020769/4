 <!-- PersistentVolume-详情 -->
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
            集群(中国台北) /
          </span>
          <span class="goback" @click="goBack()">
            cls-gwblk71e(tfy_test1) /
          </span>
          <h2 class="header-title">PersistentVolume:sdsd</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>

    <!-- 详情子菜单导航 -->
    <div class="tke-detial-nav">
      <router-link class="nav-item" :to="{name:'pvDetailInfo',query: {clusterId: clusterId,resourceIns:resourceIns}}">详情</router-link>
      <router-link class="nav-item" :to="{name:'pvDetailEvent',query: {clusterId: clusterId,resourceIns:resourceIns}}">事件</router-link>
      <router-link class="nav-item" :to="{name:'pvDetailYaml',query: {clusterId: clusterId,resourceIns:resourceIns}}">YAML</router-link>
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
  name: "pvDetail",
  data() {
    return {
        clusterId:'',
        resourceIns:''
    };
  },
  components: {
    
  },
  created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
    this.resourceIns=this.$route.query.resourceIns;
  },
  methods: {
    //返回上一层
    goBack(){
      this.$router.push({
        name:'colonyStoragePv',
        
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

