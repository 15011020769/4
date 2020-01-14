 <!-- 新建节点 -->
<template>
  <div class="colony-wrap">
    <!-- <HeadCom title="集群管理">
      <el-button style="margin-left:10px;" v-if="!btnload">{{region}}</el-button>
      <el-button style="margin-left:10px;"  icon="el-icon-loading"></el-button>
    </HeadCom> -->
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建节点</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-step tke-grid">
        <div class="tke-step-item is-curr">
          <span class="num">1</span>
          <span class="title">集群信息</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="tke-step-item is-curr">
          <span class="num">2</span>
          <span class="title">选择机型</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="tke-step-item">
          <span class="num">3</span>
          <span class="title">云服务器配置</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="tke-step-item">
          <span class="num">4</span>
          <span class="title">信息确认</span>
        </div>

      </div>
      <hr>

      <div class="tke-card tke-formpanel-wrap mb60">
        <h4  class="tke-formpanel-title">已选配置</h4>
        
        <el-form  class="tke-form" :model="colony" label-position='left' label-width="120px" size="mini">
          <el-form-item label="集群名">
            <div class="tke-form-item_text"><span>tfy_test1</span></div>
          </el-form-item>
          <el-form-item label="Kubernetes版本">
            <div class="tke-form-item_text"><span>1.10.5</span></div>
          </el-form-item>
          <el-form-item label="所在地域">
            <div class="tke-form-item_text"><span>港澳台地区(中国台北)</span></div>
          </el-form-item>
          <el-form-item label="容器网络">
            <div class="tke-form-item_text"><span>172.16.0.0/16</span></div>
          </el-form-item>
          <el-form-item >
            <span slot="label">操作系统 <i class="el-icon-info"></i></span>
            <div class="tke-form-item_text"><span>Ubuntu Server 16.04.1 LTS 64bit</span></div>
          </el-form-item>
          <hr>
          
          <el-form-item label="计费模式">
            <el-radio-group  v-model="colony.chargingMode" size="small">
              <el-radio-button label="mode1">按量计费</el-radio-button>
              <el-radio-button label="mode2">包年包月</el-radio-button>
            </el-radio-group>
            <span class="tke-text-link ml5">详细对比</span>
          </el-form-item>
          <el-form-item label="所在地域">
            <div class="tke-form-item_text"><span>港澳台地区(中国台北)</span></div>
          </el-form-item>
          
        </el-form>

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
  name: "clusterExpand",
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

