 <!-- 自动伸缩-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">asdas</div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">default</div>
        </el-form-item>
        <el-form-item label="关联deployment">
          <div class="tke-form-item_text">asdasd</div>
        </el-form-item>
        <el-form-item label="HPA指标">
          <div class="tke-form-item_text">CPU使用量 1核</div>
        </el-form-item>
        <el-form-item label="最小副本数">
          <div class="tke-form-item_text">1</div>
        </el-form-item>
        <el-form-item label="最大副本数">
          <div class="tke-form-item_text">2</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "hpaDetailInfo",
  data() {
    return {
      
        
   
    };
  },
  components: {
   
  },
  created() {
     // 从路由获取类型
   
  },
  methods: {
   
  }
};
</script>

<style lang="scss" scoped>




</style>

