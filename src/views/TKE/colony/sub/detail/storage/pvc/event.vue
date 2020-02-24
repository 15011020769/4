 <!-- PersistentVolumeClaim-事件 -->
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
            <p>{{scope.row.firstTimestamp|creationTimestamps}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="最后出现时间"
          >
          <template slot-scope="scope">
            <p>{{scope.row.lastTimestamp|creationTimestamps}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="级别"
          >
          <template slot-scope="scope">
              <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="资源类型"
          >
          <template slot-scope="scope">
            <span class='point-white'>{{scope.row.involvedObject.kind}}</span>
          </template>
        </el-table-column>
        
        <el-table-column
          prop=""
          label="资源名称"
          >
          <template slot-scope="scope">
            <p>{{scope.row.metadata.name}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="内容">
          <template slot-scope="scope">
            <p>{{scope.row.reason}}</p>
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
import { ALL_CITY ,POINT_REQUEST} from "@/constants";
export default {
  name: "pvcDetailEvent",
  data() {
    return {
      loadShow: false, //加载是否显示
      autoRefresh: true, //自动刷新
      list:[], //列表
    };
  },
  components: {
    Loading
  },
  created() {
    this.SearchList()
  },
  methods: {
    //返回上一层
    goBack(){
          this.$router.go(-1);
    },
    // 获取列表
    SearchList() {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path: "/api/v1/namespaces/"+this.$route.query.np+"/persistentvolumeclaims/"+this.$route.query.resourceIns+"/events",
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
         console.log(mes);
          this.list = mes.items;
          console.log(this.list)
          // this.loadShow = false
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          });
        }
      });
    },
  },
  filters:{
    creationTimestamps:function(value){
              var d = new Date(value);
              var n = d.getFullYear();
              var y = d.getMonth() + 1;
              var r = d.getDate();
              var h = d.getHours(); //12
              var m = d.getMinutes(); //12
              var s = d.getSeconds();
              h < 10 ? h = "0" + h : h;
              m < 10 ? m = "0" + m : m
              return n + '-' + y + '-' + r + ' ' + h + ':' + m + ':' + s
      }
    }
};
</script>

<style lang="scss" scoped>




</style>

