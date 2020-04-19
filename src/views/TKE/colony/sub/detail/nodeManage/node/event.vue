 <!-- 节点-事件 -->
<template>
  <div class="colony-main">
    <div class="tke-reminder">{{$t('TKE.storage.zysjjbczq1xs')}}</div>
    <div class="tke-grid ">
      <!-- 右侧 -->
      <div class="grid-right">
        <span>{{$t('TKE.colony.zdcxzl')}}</span><el-switch class="ml10" v-model="autoRefresh" @change="changeSwitch()"></el-switch>
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
            <p>{{scope.row.firstTime}}</p>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('TKE.event.zhcxsj')"
          >
          <template slot-scope="scope">
            <p>{{scope.row.lastTime}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.event.jb')"
          >
          <template slot-scope="scope">
            <span :class="[scope.row.type !== 'Normal'?'text-red':'']">{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.event.zylx')"
          >
          <template slot-scope="scope">
            <span>{{scope.row.involvedObject.kind}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          :label="$t('TKE.event.zymc')"
          >
          <template slot-scope="scope">
            <span>{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="内容">
          <template slot-scope="scope">
            <span>{{scope.row.reason}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nodeTotal"
          :label="$t('TKE.event.xxms')">
          <template slot-scope="scope">
            <p>{{scope.row.message}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.event.cxcs')">
          <template slot-scope="scope">
            <p>{{scope.row.count}}</p>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
import Loading from "@/components/public/Loading";
import moment from 'moment';
import { ALL_CITY,POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "nodeDetailEvent",
  data() {
    return {
      loadShow: false, //加载是否显示
      autoRefresh: false, //自动重新整理
      list:[], //列表
      node: '',//节点
      // timer: null,//定时器
      clusterId: '',//集群名称
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
  },
  watch:{
    autoRefresh(val){
      if(val){
        this.timer = setInterval(()=>{
          this.getEventList()
        },1000 * 10)
      } else {
        window.clearInterval(this.timer)
        this.timer=null
      }
    },
    deep:true,
    immediate :true
  },
  methods: {
    async getEventList() {
      const param = {
        Method: "GET",
        Path: "/api/v1/namespaces/default/events?fieldSelector=involvedObject.kind=Node,involvedObject.name="+this.node,
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }
      this.loadShow = true;
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          let response = JSON.parse(res.Response.ResponseBody);
          if(response.items.length > 0) {
            response.items.map(event => {
              event.firstTime = moment(event.firstTimestamp).format("YYYY-MM-DD HH:mm:ss");
              event.lastTime = moment(event.lastTimestamp).format("YYYY-MM-DD HH:mm:ss");
            });
            this.list = response.items;
          }
          this.loadShow = false;
          this.autoRefresh = true;
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
    //是否重新整理
    changeSwitch() {
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
          this.timer = null;
        }
      }
    },
    //返回上一层
    goBack(){
      this.$router.go(-1);
    }
  },
  beforeDestroy(){
    if(this.timer) { //如果定时器在运行则关闭
      clearInterval(this.timer); 
    }
  }

};
</script>

<style lang="scss" scoped>




</style>

