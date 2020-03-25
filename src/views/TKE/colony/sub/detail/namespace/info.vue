 <!-- 命名空间-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4  class="tke-formpanel-title">{{$t('TKE.overview.jbxx')}}</h4>
      <el-form  class="tke-form" label-position='left' label-width="120px" size="mini">
        <el-form-item :label="$t('TKE.overview.mc')">
          <div class="tke-form-item_text">{{detail.metadata&&detail.metadata.name}}</div>
        </el-form-item>
        <el-form-item :label="$t('TKE.overview.zt')">
          <div class="tke-form-item_text"><span class="text-green">{{detail.status && detail.status.phase}}</span></div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="tke-form-item_text">{{detail.metadata&&detail.metadata.annotations?detail.metadata.annotations.description:'-'}}</div>
        </el-form-item>
        <el-form-item :label="$t('TKE.overview.cjsj')">
          <div class="tke-form-item_text">{{detail.metadata&&changeTime(detail.metadata.creationTimestamp)}}</div>
        </el-form-item>
        <!-- <el-form-item :label="$t('TKE.subList.jxckmy')">
          <div style="overflow: visible; max-width: 550px;">
            <el-table
              :data="secretsList"
              style="width: 100%">
              <el-table-column
                :label="$t('TKE.overview.mc')"
                width="300"
                >
                <template slot-scope="scope">
                  <span>{{scope.row.metadata.name}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                :label="$t('TKE.overview.zt')"
                >
                <template slot-scope="scope">
                  <span v-if="scope.row.status===true" class="text-green">已{{$t('TKE.subList.xfa')}} <i class="el-icon-success"></i></span>
                  <span v-else class="text-red">未{{$t('TKE.subList.xfa')}} <i class="el-icon-warning"></i></span>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="操作"
                >
                <template slot-scope="scope">
                  <el-tooltip v-if="scope.row.status===true" effect="dark" :content="$t('TKE.subList.dqmyyxf')" placement="right">
                    <span  class="text-gray" @click="sendDown(scope.row)">{{$t('TKE.subList.xfa')}}</span>
                  </el-tooltip>
                  <span v-else class="tke-text-link">{{$t('TKE.subList.xfa')}}</span>
                </template>
              </el-table-column>
              
            </el-table>
          </div>
        </el-form-item> -->
        
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
      isShowSendDown: false,//是否显示下发modal
      secret: {},//选择的某一条秘钥对象
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
          console.log(this.detail,'this.detail')
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
          console.log("list",response.items);
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
    sendDown(secret) {
      this.isShowSendDown = true;
      this.secret = secret;
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

