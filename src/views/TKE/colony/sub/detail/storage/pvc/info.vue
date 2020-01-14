 <!-- PersistentVolumeClaim-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">vvv</div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">kube-public</div>
        </el-form-item>
        <el-form-item label="Labels">
          <div class="tke-form-item_text">-</div>
        </el-form-item>
        <el-form-item label="状态">
          <div class="tke-form-item_text"><span class="text-green">Bound</span></div>
        </el-form-item>
        <el-form-item label="访问权限">
          <div class="tke-form-item_text">ReadWriteOnce</div>
        </el-form-item>
        <el-form-item label="Storage">
          <div class="tke-form-item_text">10Gi</div>
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
  name: "pvcDetailInfo",
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

