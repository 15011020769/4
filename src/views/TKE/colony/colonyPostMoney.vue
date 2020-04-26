<template>
  <div class="room">
    <div class="post-top">
      核對信息
    </div>
    <div class="post-center">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="產品名稱" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.rowType === 1 ? '新購云伺服' : '新購彈性云硬碟'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="配置訊息" width="250">
          <template slot-scope="scope">
            <div v-if="scope.row.rowType === 1">
              <p>地域:台灣台北</p>
              <p>可用區:台北一區</p>
              <p>機型:系列{{scope.row.modelType | modelType}}、{{scope.row.modelType | modelType1}}{{scope.row.modelHe}}核CPU、{{scope.row.modelGB}}G記憶體</p>
              <p>鏡像:{{clusterOs}}</p>
              <p>存儲:系統盤({{scope.row.systemDiskNumber}}G{{scope.row.systemDiskValue}})</p>
              <p>網路:{{vpcId}}|{{scope.row.workerNodeNetworkVal}}</p>
              <p>頻寬:{{scope.row.broadbandValue}}(頻寬{{scope.row.broadbandNumber}}Mbps)</p>
              <p>名稱:</p>
            </div>
            <div v-if="scope.row.rowType === 2">
              <p>磁盤屬性:數據盤</p>
              <p>容量:{{scope.row.dataDiskNum}}GB</p>
              <p>磁盤類型:{{scope.row.dataDiskVal | dataDiskVal}}</p>
              <p>可用區:台北一區</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="單價" width="150">
          <template slot-scope="scope">
            <span>NT${{scope.row.singleMoney}}月</span>
          </template>
        </el-table-column>
        <el-table-column label="數量" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.dataNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="付費方式" width="150">
          <template>
            <span>預付費</span>
          </template>
        </el-table-column>
        <el-table-column label="購買時長" width="150">
          <template>
            <span>{{buyTime}}個月</span>
          </template>
        </el-table-column>
        <el-table-column label="優惠" width="100">
          <template>
            <span>無</span>
          </template>
        </el-table-column>
        <el-table-column label="費用" width="150">
          <template slot-scope="scope">
            <span>NT${{scope.row.costMoney}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="post-bottom">
        <div class="bottom-one">
          <div class="bottom-two">
            <span>统计费用（含税）:<span style="color:#ed711f;font-size: 20px;font-style: normal;font-weight: 400">NT${{colonyMoney}}</span></span>
            <el-button size="mini" style="height:40px" type="warning" @click="_submit">立即支付</el-button>
          </div>
        </div>
     </div>
    </div>
  </div>
</template>
<script>
  import { ErrorTips } from "@/components/ErrorTips";
  import {TKE_CREATW_CLUSTERS} from "@/constants";
  export default {
    data(){
      return{
        tableData: [],//表格数据
        param:{},//参数对象
        clusterOs: '',//镜像
        vpcId: '',//公网id
        buyTime: '',//購買時長
        colonyMoney: '',//总金额
      }
    },
    created(){
      this.param = JSON.parse(localStorage.getItem('clusterParam'));
      this.tableData = JSON.parse(localStorage.getItem("colonyCostList"));
      console.log("tableData",this.tableData);
      this.clusterOs = localStorage.getItem("clusterOs");
      this.vpcId = localStorage.getItem("vpcId");
      this.buyTime = localStorage.getItem("buyTime");
      this.colonyMoney = localStorage.getItem("colonyMoney");
    },
    methods:{
      //立即支付
      _submit() {
        let param = this.param;
        this.axios.post(TKE_CREATW_CLUSTERS, param).then(res => {
          if (res.Response.Error === undefined) {
            this.$router.go(-1);
          } else {
            let ErrTips = {
              "InternalError": "内部錯誤",
              "InternalError.AccountUserNotAuthenticated": "帳戶未通過認證。",
              "InternalError.AsCommon": "伸縮組資源創建報錯。",
              "InternalError.CidrConflictWithOtherCluster":
                "CIDR和其他集群CIDR衝突。",
              "InternalError.CidrConflictWithOtherRoute": "CIDR和其他路由衝突。",
              "InternalError.CidrConflictWithVpcCidr": "CIDR和vpc衝突。",
              "InternalError.CidrConflictWithVpcGlobalRoute":
                "CIDR和全局路由衝突。",
              "InternalError.CidrInvali": "CIDR無效。",
              "InternalError.CidrMaskSizeOutOfRange": "CIDR掩碼無效。",
              "InternalError.CreateMasterFailed": "創建集群失敗。",
              "InternalError.CvmCommon": "cvm配額不足,請釋放部分資源後再創建",
              "InternalError.Db": "db錯誤。",
              "InternalError.DbAffectivedRows": "DB錯誤",
              "InternalError.DfwGetUSGCount": "獲得當前安全組總數失敗。",
              "InternalError.DfwGetUSGQuota": "獲得安全組配額失敗。",
              "InternalError.InitMasterFailed": "初始化master失敗。",
              "InternalError.InvalidPrivateNetworkCidr": "無效CIDR。",
              "InternalError.Param": "Param。",
              "InternalError.PublicClusterOpNotSupport": "集群不支持當前操作。",
              "InternalError.QuotaMaxClsLimit": "超過配額限制。",
              "InternalError.QuotaMaxNodLimit": "超過配額限制。",
              "InternalError.QuotaUSGLimit": "安全組配額不足。",
              "InternalError.UnexceptedInternal": "内部錯誤",
              "InternalError.VpcCommon": "VPC報錯。",
              "InternalError.VpcRecodrNotFound": "未發現vpc記錄。",
              "InvalidParameter": "參數錯誤",
              "LimitExceeded": "超過配額限制"
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
    },
    filters: {
      modelType(val) {
        if(val) {
          return val.substring(val.length - 1, val.length);
        }
      },
      modelType1(val) {
        if(val) {
          return val.substring(0, val.length - 1);
        }
      },
      dataDiskVal(val) {
        if(val) {
          if(val === 'CLOUD_PREMIUM'){
            return '高性能云硬碟'
          } else {
            return 'SSD云硬碟'
          }
        }
      }
    }  
  }  
</script>
<style scoped lang="scss">
    .post-top{
        width: 100%;
        height: 100px;
        line-height: 100px;
        padding-left: 50px;
        background: white;
        font-size: 24px;
        font-weight: 700;
    }
    .post-center{
        margin:20px 60px;
        height: 100px;
        background: white;
    }
    .room{
        // position: relative;
        // height: 100%;
        .post-bottom{
            line-height: 100px;
            height: 100px;
            background: white;
            .bottom-one{
                position: relative;
                .bottom-two{
                    right:30px;
                    height:100px;
                    line-height: 100px;
                    width: 500px;
                    display: flex;
                    justify-content: space-between;
                    position: absolute;
                    align-items: center;
                }
            }
        }
    }
</style>