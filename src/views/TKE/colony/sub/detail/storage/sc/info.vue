 <!-- StorageClass-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">cbs</div>
        </el-form-item>
        <el-form-item label="云盘类型">
          <div class="tke-form-item_text">普通云硬盘</div>
        </el-form-item>
        <el-form-item label="来源">
          <div class="tke-form-item_text">cloud.tencent.com/qcloud-cbs</div>
        </el-form-item>
        <el-form-item label="回收策略">
          <div class="tke-form-item_text">Delete</div>
        </el-form-item>
        <el-form-item label="Default Class">
          <div class="tke-form-item_text">true</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">2020-01-02 14:02:26</div>
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
  name: "scDetailInfo",
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

