 <!-- deployment-日志 -->
<template>
  <div class="colony-main">
    <div class="tke-card mt10 tke-formpanel-wrap">
      <el-card class='box-card'> 
        <el-select v-model="currPod">
          <!-- <el-option v-for="(i,it) in potList" :key="i" :label="it.metadata.name" :value="it.metadata.name"></el-option> -->
        </el-select>
        <el-select v-model="currStateful">
          <!-- <el-option
            v-for="(i,item) in statefulSetList"
            :key="i"
            :label="item.metadata.name"
            :value="item.metadata.name">
          </el-option> -->
        </el-select>
        <el-select v-model="index">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class='box-black'>1</div>
      </el-card>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import moment from 'moment';
export default {
  name: "deploymenDetailLog",
  data() {
    return {
      options: [
        {value: 100,
        label: '显示100条'},
        {value: 200,
        label: '显示200条'},
        {value: 500,
        label: '显示500条'},
        {value: 1000,
        label: '显示1000条'},
      ],
      index: 100,//选中的条数
      statefulSetList: [],//statefulSet列表
      potList:[],//pod列表
      currPod: '',//选中的pod
      currStateful: '',//选中的stateful
      loadShow: false,//是否显示加载
      clusterId:'',//集群id
      rowData: {},//传过来的数据
      spaceName: '',//路由传过来的命名空间名称
    };
  },
  components: {
   
  },
  created() {
     // 从路由获取类型
    this.statefulSetList = this.$route.query.statefulSetList;
    this.clusterId=this.$route.query.clusterId
    this.potList = this.$route.query.potList;
    this.spaceName = this.$route.query.spaceName;
    this.rowData = this.$route.query.rowData;
    this.getstatefulLog();
  },
  methods: {
    async getstatefulLog() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/api/v1/namespaces/"+this.rowData.metadata.namespace+"/pods/"+this.currPod+"/log?container="+this.currStateful+"&timestamps=true&tailLines="+this.index,
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
        } else {
          this.loadShow = false;
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    }
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

