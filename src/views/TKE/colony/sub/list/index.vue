 <!-- 集群详情 -->
<template>
  <div class='tke-colony-sub'>
    <!-- 顶部标题 -->
    <div class="tke-content-header " >
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
            <span>集群 /</span>
          </span>
          
          <h2 class="header-title">cls-n1xokuh6(DBA-test)</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right">
          <el-button size="small" type="primary">YAML创建资源</el-button>
        </div>
      </div>
    </div>

    <!-- 主体 -->
    <el-container >
      <el-container>
        <!-- 左侧子菜单 -->
        <el-aside class="tke-sub-menu" style="width:180px">
          <el-menu
            default-active="/colony/sub/list/basic"
            :router="true"
            :default-active="this.$route.path"
          >
            <el-menu-item index="/colony/sub/list/basic">基本信息</el-menu-item>
            <el-submenu index="2">
              <template slot="title"><span>节点管理</span></template>
              <el-menu-item index="/colony/sub/list/nodeManage/node">节点</el-menu-item>
              <el-menu-item index="/colony/sub/list/nodeManage/masteretcd">Master&amp;Etcd</el-menu-item>
              <el-menu-item index="/colony/sub/list/nodeManage/asg">伸缩组</el-menu-item>
            </el-submenu>
            <el-menu-item index="/colony/sub/list/namespace" >命名空间</el-menu-item>
            <el-submenu index="4">
              <template slot="title"><span>工作负载</span></template>
              <el-menu-item index="/colony/sub/list/resource/deployment">Deployment</el-menu-item>
              <el-menu-item index="/colony/sub/list/resource/statefulSet">StatefulSet</el-menu-item>
              <el-menu-item index="/colony/sub/list/resource/daemonSet">DaemonSet</el-menu-item>
              <el-menu-item index="/colony/sub/list/resource/job">Job</el-menu-item>
              <el-menu-item index="/colony/sub/list/resource/cronJob">CronJob</el-menu-item>
            </el-submenu>
            <el-menu-item index="/colony/sub/list/hpa" >自动伸缩</el-menu-item>
            <el-submenu index="6">
              <template slot="title"><span>服务</span></template>
              <el-menu-item index="/colony/sub/list/service/svc">Service</el-menu-item>
              <el-menu-item index="/colony/sub/list/service/ingress">Ingress</el-menu-item>
            </el-submenu>
            <el-submenu index="7">
              <template slot="title"><span>配置管理</span></template>
              <el-menu-item index="/colony/sub/list/config/configMap">ConfigMap</el-menu-item>
              <el-menu-item index="/colony/sub/list/config/secret">Secret</el-menu-item>
            </el-submenu>
            <el-submenu index="8">
              <template slot="title"><span>存储</span></template>
              <el-menu-item index="/colony/sub/list/storage/pv">PersistentVolume</el-menu-item>
              <el-menu-item index="/colony/sub/list/storage/pvc">PersistentVolumeClaim</el-menu-item>
              <el-menu-item index="/colony/sub/list/storage/sc">StorageClass</el-menu-item>
            </el-submenu>
            <el-menu-item index="/colony/sub/list/log">日志</el-menu-item>
            <el-menu-item index="/colony/sub/list/event">事件</el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 右侧内容区域 -->
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
    
  </div>
</template>

<script>
// import HeadCom from "@/components/public/Head";
// import SEARCH from "@/components/public/SEARCH";
// import FileSaver from "file-saver";
// import XLSX from "xlsx";
import Loading from "@/components/public/Loading";
import { ALL_CITY } from "@/constants";
export default {
  name: "create",
  data() {
    return {

    };
  },
  components: {
    Loading
  },
  created() {
  
  },
  mounted() {
    console.log(this.ClusterIds)
  },
  methods: {
    //返回上一层
    goBack(){
      this.$router.push({
        name:'colony'
      })
    },

  }
};
</script>

<style lang="scss" tke-formpanel>
.tke-colony-sub{
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .el-container{
    height: 100%;
  }
  .el-menu-item, .el-submenu__title{
    height: 34px;
    line-height: 34px;
    font-size: 12px;
    padding: 0 0 0 20px;
    min-width: auto;
  }
}
.tke-sub-menu{
    border-right: 1px solid #ddd;
    background: #fff;
    .el-menu{
      border-right: none;
    }
}
</style>

