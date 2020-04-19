 <!-- PersistentVolumeClaim-事件 -->
<template>
  <div class="colony-main">
    <div class="tke-reminder">{{$t('TKE.storage.zysjjbczq1xs')}}</div>
    <div class="tke-grid ">
      <!-- 右侧 -->
      <div class="grid-right">
        <span>{{$t('TKE.overview.zdsx')}}</span><el-switch class="ml10" v-model="autoRefresh"></el-switch>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table
        :data="list"
        v-loading="loadShow"
        style="width: 100%">
        <el-table-column
          :label="$t('TKE.event.sccxsj')"
          >
          <template slot-scope="scope">
            <p class='point-white'>{{scope.row.firstTimestamp|creationTimestamps}}</p>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('TKE.event.zhcxsj')"
          >
          <template slot-scope="scope">
            <p class='point-white'>{{scope.row.lastTimestamp|creationTimestamps}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.event.jb')"
          >
          <template slot-scope="scope">
              <span class='point-white'>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.event.zylx')"
          >
          <template slot-scope="scope">
            <span class='point-white'>{{scope.row.involvedObject.kind}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          :label="$t('TKE.event.zymc')"
          >
          <template slot-scope="scope">
            <p class='point-white'>{{scope.row.metadata.name}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="内容">
          <template slot-scope="scope">
            <p class='point-white'>{{scope.row.reason}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="message"
          :label="$t('TKE.event.xxms')">
          <template slot-scope="scope">
            <p class='point-white'>{{scope.row.message}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          :label="$t('TKE.event.cxcs')">
          <template slot-scope="scope">
            <p class='point-white'>{{scope.row.count}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/public/Loading";
import FileSaver from "file-saver";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import XLSX from "xlsx";
import { ALL_CITY ,POINT_REQUEST} from "@/constants";
export default {
  name: "pvcDetailEvent",
  data() {
    return {
      loadShow: false, //加载是否显示
      autoRefresh: "", //自动重新整理
      list:[], //列表
      timeId:null
    };
  },
  components: {
    Loading
  },
  created() {
    this.SearchList()
  },
  watch:{
    autoRefresh(val){
       if(val){
          this.timeId = setInterval(()=>{
          if(this.$route.name != "pvcDetailEvent"){
              clearInterval(this.timeId)
              this.timeId =null
          }
          this.SearchList()
        },4000)
      } else {
          window.clearInterval(this.timeId)
          this.timeId=null
      }

    },
    deep:true,
    immediate :true
  },
  methods: {
    //返回上一层
    goBack(){
          this.$router.go(-1);
    },
    //  getFlag(){
    //    this.autoRefresh = !this.autoRefresh
    //  },
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
          this.list = mes.items;
          this.autoRefresh =true
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

