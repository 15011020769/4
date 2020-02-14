 <!-- deployment-日志 -->
<template>
  <div class="colony-main">
    <div class="tke-card mt10 tke-formpanel-wrap">
      <el-card class='box-card'> 
        <div class='box-black'>1</div>
      </el-card>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "deploymenDetailLog",
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
  .box-card {
    width: 100%;
    margin:20px 0;
  }
	.box-black{
    margin:10px;
    background:black;
  }
</style>

