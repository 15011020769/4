 <!-- deployment-修订历史 -->
<template>
  <div class="colony-main">
   
    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table
        :data="list"
        v-loading="loadShow"
        style="width: 100%">
        <el-table-column
          label="版本号"
          >
          <template>
            <span>ip-masq-agent-7jdzn</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="版本详情"
          >
          <template>
              <span class="text-green">Running</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="镜像"
          >
          <template>
              <span>10.0.128.8</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="更新时间"
          >
          <template>
            <span>172.16.1.4</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template>
            <span class="tke-text-link">回滚</span>
          </template>
        </el-table-column>
      </el-table>
      

      <!-- 分页 -->
      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "deploymentDetailHistory",
  data() {
    return {
      loadShow: false, //加载是否显示
      list:[
        {
          container:[{},{}]
        },
        {
          container:[{},{}]
        },
        {
          container:[{},{}]
        },
        {
          container:[{},{}]
        },
        {
          container:[{},{}]
        },
        {
          container:[{},{}]
        },
      ], //列表
      total:0,
      pageSize:10,
      pageIndex:0
    };
  },
  components: {
   
  },
  created() {
     // 从路由获取类型
   
  },
  methods: {
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val-1;
      // this.getColonyList();
      this.pageIndex+=1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize=val;
      // this.getColonyList();
    }
  }
};
</script>

<style lang="scss" scoped>


</style>

