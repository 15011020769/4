<!-- 添加已有节点 -->
<template>
  <div class="colony-wrap">

    <!-- 头部 -->
    <div class="tke-content-header " >
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">cls-gwblk71e（tfy_test1）</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>

    <div class="colony-main">
      
      <div class="tke-card tke-formpanel-wrap mb60">
        <div class="tke-step tke-grid">
          <div class="tke-step-item is-curr">
            <span class="num">1</span>
            <span class="title">选择节点</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="tke-step-item">
            <span class="num">2</span>
            <span class="title">云服务器配置</span>
          </div>
        </div>
        <hr style="margin-left:-20px;margin-right:-20px">
          
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small">取消</el-button>
          <el-button size="small" type="primary">下一步</el-button>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import SEARCH from "@/components/public/SEARCH";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "clusterAddExist",
  data() {
    return {
      colony: {
        chargingMode:'mode1',
        
      }  
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  created() {

  },
  methods: {
    //返回上一层
    goBack(){
          this.$router.go(-1);
    },
  }
};
</script>

<style lang="scss" scoped>


</style>

