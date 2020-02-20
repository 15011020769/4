 <!-- Master&Etcd-事件 -->
<template>
  <div class="colony-main">
    <div class="tke-reminder">资源事件只保存最近1小时内发生的事件，请尽快查阅。</div>
    <div class="tke-grid ">
      <!-- 右侧 -->
      <div class="grid-right">
        <span>自动刷新</span><el-switch class="ml10" v-model="autoRefresh" @change="changeSwitch(e)"></el-switch>
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
            <p></p>
          </template>
        </el-table-column>
        <el-table-column
          label="最后出现时间"
          >
          <template slot-scope="scope">
            <p></p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="级别"
          >
          <template slot-scope="scope">
              <span class="text-red"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="资源类型"
          >
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        
        <el-table-column
          prop=""
          label="资源名称"
          >
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="内容">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nodeTotal"
          label="详细描述">
          <template slot-scope="scope">
            <p></p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="出现次数">
          <template slot-scope="scope">
            <p></p>
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
import { ALL_CITY, POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "masteretcdDetailEvent",
  data() {
    return {
      loadShow: false, //加载是否显示
      autoRefresh: true, //自动刷新
      list:[], //列表
      node: '',
      timer: null,
      clusterId: ''
    };
  },
  components: {
    Loading
  },
  created() {
    // 从路由获取集群Id
    this.clusterId = this.$route.query.clusterId;
    this.node = this.$route.query.node;
    this.getEventList();
    let autoRefresh = this.autoRefresh;
    if(autoRefresh) {
      if(!this.timer) {
        this.timer = setInterval(() => {
          this.getEventList();
        }, 1000 * 20);
      }
    }
  },
  methods: {
    async getEventList() {
      const param = {
        Method: "GET",
        Path: "/api/v1/namespaces/default/events?fieldSelector=involvedObject.kind=Node,involvedObject.name="+this.node,
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          let response = JSON.parse(res.Response.ResponseBody);
          if(response.items.length > 0) {
            this.list = response.items;
          }
        } else {
          this.loadShow = false;
          let ErrTips = {
            
          };
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
    //是否刷新
    changeSwitch() {
      console.log(this.autoRefresh,"val")
      let autoRefresh = this.autoRefresh;
      if(autoRefresh) {
        if(!this.timer) {
          this.timer = setInterval(() => {
            this.getEventList();
          }, 1000 * 20);
        }
      } else {
        if(this.timer) { //如果定时器在运行则关闭
          clearInterval(this.timer); 
        }
      }
    },
    //返回上一层
    goBack(){
      this.$router.go(-1);
    },
    destroyed(){
      if(this.timer) { //如果定时器在运行则关闭
        clearInterval(this.timer); 
      }
    }
  }
};
</script>

<style lang="scss" scoped>




</style>

