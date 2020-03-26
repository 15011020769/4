 <!-- 自动伸缩-事件 -->
<template>
  <div class="colony-main">
    <div class="tke-reminder">资源事件只保存最近1小时内发生的事件，请尽快查阅。</div>
    <div class="tke-grid ">
      <!-- 右侧 -->
      <div class="grid-right">
        <span>自动重新整理</span><el-switch class="ml10" v-model="autoRefresh" @change="useAuto"></el-switch>
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
            <p>{{timeFormat(scope.row.firstTimestamp)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="最后出现时间"
          >
          <template slot-scope="scope">
            <p>{{timeFormat(scope.row.lastTimestamp)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="级别"
          >
          <template slot-scope="scope">
              <span :class="{'text-red':scope.row.type=='Warning'}">{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="资源类型"
          >
          <template slot-scope="scope">
            <span>{{scope.row.involvedObject.kind}}</span>
          </template>
        </el-table-column>
        
        <el-table-column
          prop=""
          label="资源名称"
          >
          <template slot-scope="scope">
            <span>{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="reason"
          label="内容">
          <!-- <template slot-scope="scope">
            <span>FailedGetPodsMetric</span>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="message"
          :show-overflow-tooltip="true"
          label="详细描述">
          <!-- <template slot-scope="scope">
            <p>Error: ImagePullBackOff</p>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="count"
          label="出现次数">
          <!-- <template slot-scope="scope">
            <p>2617</p>
          </template> -->
        </el-table-column>
      </el-table>
      
    </div>
  </div>
</template>

<script>
import Loading from "@/components/public/Loading";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY ,TKE_COLONY_QUERY} from "@/constants";
export default {
  name: "hpaDetailEvent",
  data() {
    return {
      loadShow: false, //加载是否显示
      autoRefresh: true, //自动重新整理
      list:[ ], //列表
      name:'',
      np:'',
      clusterId:'',
      timer:'',
    };
  },
  components: {
    Loading
  },
  created() {
     // 从路由获取类型
      this.clusterId=this.$route.query.clusterId;
      this.name=this.$route.query.name;
      this.np=this.$route.query.np;
      if(this.name&&this.np&&this.clusterId){
        this.listData()
      }
      this.useAuto();

  },
  methods: {
    //返回上一层
    goBack(){
          this.$router.go(-1);
    },

    listData(){
      var params={
        ClusterName: this.clusterId,
        Method: "GET",
        Path: "/apis/autoscaling/v2beta1/namespaces/"+this.np+"/horizontalpodautoscalers/"+this.name+"/events",
        Version: "2018-05-25",
      }

      this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
        if (res.Response.Error == undefined){
          var data = JSON.parse(res.Response.ResponseBody);
            if(data.items){
            // console.log(data.items)
              this.list=data.items
            }
        }
      })
    },
    //自动重新整理
    useAuto(){
      if(this.autoRefresh){
       this.timer=setInterval(()=>{
             this.listData()
          },9000)
      }else{
           clearInterval(this.timer)
      }
    },
    timeFormat(times) {
        var d = new Date(times);
        var n = d.getFullYear();
        var y = d.getMonth() + 1;
        var r = d.getDate();
        var h = d.getHours(); //12
        var m = d.getMinutes(); //12
        var s = d.getSeconds();
        h < 10 ? h = "0" + h : h;
        m < 10 ? m = "0" + m : m

        return n + '-' + y + '-' + r + ' ' + h + ':' + m + ':' + s
    },
  }
};
</script>

<style lang="scss" scoped>

.text-red {
    color: rgb(225, 80, 74);
}


</style>

