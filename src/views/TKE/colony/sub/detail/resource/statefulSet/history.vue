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
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
import moment from 'moment';
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "deploymentDetailHistory",
  data() {
    return {
      loadShow: false, //加载是否显示
      clusterId:'',//集群id
      rowData: {},//传过来的数据
      spaceName: '',//路由传过来的命名空间名称
      list:[], //列表
     
    };
  },
  components: {
   
  },
  created() {
     // 从路由获取类型
    this.clusterId=this.$route.query.clusterId;
    this.spaceName = this.$route.query.spaceName;
    this.rowData = this.$route.query.rowData;
    this.getHistoryList();
  },
  methods: {
    //获取修订历史列表
    async getHistoryList() {
      this.loadShow = true;
      // let selector = this.rowData.spec.selector.matchLabels;
      // let selectorList = Object.keys(selector);
      // let param = '';
      // if(selectorList.length > 0) {
      //   for(var i = 0; i < selectorList.length; i++) {
      //     debugger
      //     console.log("selectorList[i]",selectorList[i]);
      //     console.log("selector.selectorList[i]",selector.selectorList[i])
      //     let key = selectorList[i];
      //     param += key + "=" + selector.key +",";
      //   }
      // }
      let params = {
        Method: "GET",
        Path: "/apis/apps/v1beta2/namespaces/"+this.rowData.metadata.namespace+"/replicasets?labelSelector=qcloud-app=cbs-provisioner",
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, params).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          console.log(response);
          if(response.items.length > 0) {
            response.items.map(pod => {
              pod.addTime = moment(pod.metadata.creationTimestamp).format("YYYY-MM-DD HH:mm:ss");
            });
          }
          this.list = response.items;
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
    }
  }
};
</script>

<style lang="scss" scoped>


</style>

