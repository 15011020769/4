 <!-- deployment-事件 -->
<template>
  <div class="colony-main">
    <div class="tke-reminder">资源事件只保存最近1小时内发生的事件，请尽快查阅。</div>
    <div class="tke-grid ">
      <!-- 右侧 -->
      <div class="grid-right">
        <span>自动刷新</span><el-switch class="ml10" v-model="autoRefresh" ></el-switch>
      </div>
    </div>
    
    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table
        :data="list"
        v-loading="loadShow"
        style="width: 100%">
        <el-table-column
          label="首次出现时间"
          >
          <template slot-scope="scope">
            <p>2020-01-09 19:10:37</p>
          </template>
        </el-table-column>
        <el-table-column
          label="最后出现时间"
          >
          <template slot-scope="scope">
            <p>2020-01-10 17:01:02</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="级别"
          >
          <template slot-scope="scope">
              <span class="text-red">Warning</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="资源类型"
          >
          <template slot-scope="scope">
            <span>HorizontalPodAutoscaler</span>
          </template>
        </el-table-column>
        
        <el-table-column
          prop=""
          label="资源名称"
          >
          <template slot-scope="scope">
            <span>asdas.15e83372c763e97e</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="内容">
          <template slot-scope="scope">
            <span>FailedGetPodsMetric</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nodeTotal"
          label="详细描述">
          <template slot-scope="scope">
            <p>Error: ImagePullBackOff</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="出现次数">
          <template slot-scope="scope">
            <p>2617</p>
          </template>
        </el-table-column>
      </el-table>
      
    </div>
  </div>
</template>

<script>
import Loading from "@/components/public/Loading";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "deploymentDetailEvent",
  data() {
    return {
      loadShow: false, //加载是否显示
      autoRefresh: true, //自动刷新
      list:[
        {
          status:false
        },
        {
          status:true
        },
        {
          status:true
        },
        {
          status:true
        }
      ], //列表
    };
  },
  components: {
    Loading
  },
  created() {
     // 从路由获取类型
   
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

