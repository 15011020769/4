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
            {{this.clusterId}}(tfy_test1) /
          </span>
          <h2 class="header-title">DaemonSet:{{this.rowData.metadata.name}}({{spaceName}})</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>

    <!-- 详情子菜单导航 -->
    <div class="tke-detial-nav">
      <router-link class="nav-item" :to="{name:'daemonSetDetailPod',query: {clusterId: clusterId,spaceName: spaceName,rowData: rowData}}">Pod管理</router-link>
      <router-link class="nav-item" :to="{name:'daemonSetDetailEvent',query: {clusterId: clusterId,spaceName: spaceName,rowData: rowData}}">事件</router-link>
      <router-link class="nav-item" :to="{name:'daemonSetDetailLog',query: {clusterId: clusterId,spaceName: spaceName,rowData: rowData,statefulSetList: statefulSetList,potList: potList}}">日誌</router-link>
      <router-link class="nav-item" :to="{name:'daemonSetDetailInfo',query: {clusterId: clusterId,spaceName: spaceName,rowData: rowData}}">詳情</router-link>
      <router-link class="nav-item" :to="{name:'daemonSetDetailYaml',query: {clusterId: clusterId,spaceName: spaceName,rowData: rowData}}">YAML</router-link>
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
import { ALL_CITY,POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import moment from 'moment';
export default {
  name: "deploymentDetail",
  data() {
    return {
      clusterId:'',//集群id
      rowData: {},//传过来的数据
      spaceName: '',//路由传过来的命名空间名称
      statefulSetList: [],//statefulSet列表
      potList: []//pod列表
    };
  },
  components: {
    
  },
  created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
    this.spaceName = this.$route.query.spaceName;
    this.rowData = this.$route.query.rowData;
    this.statefulSetList = this.$route.query.statefulSetList;
    this.getDaemonSetPodList();
  },
  methods: {
    //获取列表
    async getDaemonSetPodList() {
      this.loadShow = true;
      let params = {
        Method: "GET",
        Path: "/apis/apps/v1beta2/namespaces/"+this.rowData.metadata.namespace+"/daemonsets/"+this.rowData.metadata.name+"/pods",
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, params).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          this.potList = response.items;
        } else {
          this.loadShow = false;
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    //返回上一层
    goBack(){
      this.$router.push({
        name:'colonyResourceDaemonSet',
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

