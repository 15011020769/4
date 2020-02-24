 <!-- 命名空间-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">基本信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">{{detail.metadata.name}}</div>
        </el-form-item>
        <el-form-item label="状态">
          <div class="tke-form-item_text"><span class="text-green">{{detail.status && detail.status.phase}}</span></div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="tke-form-item_text">{{detail.metadata.annotations?detail.metadata.annotations.description:'-'}}</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">{{changeTime(detail.metadata.creationTimestamp)}}</div>
        </el-form-item>
        <el-form-item label="镜像仓库秘钥">
          <div style="overflow: visible; max-width: 550px;">
            <el-table
              :data="secretsList"
              
              style="width: 100%">
              <el-table-column
                prop="name"
                label="名称"
                 width="300"
                >
                <template slot-scope="scope">
                  <span>{{scope.row.metadata.name}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="状态"
                >
                <template slot-scope="scope">
                  <span v-if="scope.row.status===true" class="text-green">已下发 <i class="el-icon-success"></i></span>
                  <span v-else class="text-red">未下发 <i class="el-icon-warning"></i></span>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="操作"
                >
                <template slot-scope="scope">
                  <el-tooltip v-if="scope.row.status===true" effect="dark" content="当前密钥已下发，无需再次下发" placement="right">
                    <span  class="text-gray">下发</span>
                  </el-tooltip>
                  <span v-else class="tke-text-link">下发</span>
                </template>
              </el-table-column>
              
            </el-table>
          </div>
        </el-form-item>
        
      </el-form>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips";
import moment from 'moment';
export default {
  name: "namespaceDetailInfo",
  data() {
    return {
      list:[
        {
          name:'qcloudregistrykey',
          status:true,
        },
        {
          name:'tencenthubkey',
          status:false,
        },
      ], //列表
      clusterId:'',//集群id
      name: '',//命名空间名称
      loadShow: false, //加载是否显示
      detail: {},//详情数据
      secretsList: [],//秘钥列表
    };
  },
  components: {
    Loading
  },
  created() {
    // 从路由获取参数
    this.clusterId=this.$route.query.clusterId;
    this.name = this.$route.query.name;
    this.getNameSpaceInfo();
    this.getSecretsList();
  },
  methods: {
    async getNameSpaceInfo() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/api/v1/namespaces/"+this.name,
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          this.detail = response;
          console.log(this.detail,"detail");
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
    //获取镜像仓库秘钥列表
    async getSecretsList() {
      this.loadShow = true;
      let param = {
        Method: "GET",
        Path: "/api/v1/namespaces/"+this.name+"/secrets",
        Version: "2018-05-25",
        ClusterName: this.clusterId
      }

      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          let response = JSON.parse(res.Response.ResponseBody);
          this.secretsList = response.items;
          // this.detail = response;
          console.log(response,"response");
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
    //时间格式化
    changeTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="scss" scoped>




</style>

