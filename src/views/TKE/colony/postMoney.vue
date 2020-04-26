<template>
  <div class="room">
      <div class="post-top">
          核对信息
      </div>
      <div class="post-center">
          <el-table
        :data="param"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="产品名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="meta"
          label="配置信息"
          width="280">
           <template slot-scope="scope">
             <div>地域：{{scope.row.meta.local}}</div>
             <div>可用区：{{scope.row.meta.login}}</div>
             <div>机型：系列3、标准型{{scope.row.meta.seriesCpu}}核CPU、{{scope.row.meta.seriesMemory}}G内存</div>
             <div>镜像：{{scope.row.meta.mirror|mirrors}}</div>
             <div>存储：系统盘（{{scope.row.meta.systemSize}}G{{scope.row.meta.systemDiskType|systemDiskTypes}}）</div>
             <div>网络：{{scope.row.meta.groupVps}}|{{scope.row.meta.subnetId}}</div>
             <div>带宽：{{scope.row.meta.internetChargeType|internetChargeTypes}}（带宽{{scope.row.meta.internetMaxBandwidthOut}}Mbps）</div>
             <div v-if="scope.row.meta.name">名称：{{scope.row.meta.name}}</div>
             <div v-if="!scope.row.meta.name">名称：tke_{{scope.row.meta.clusterId}}_worker</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="moneyMonth"
          label="单价"
          width="180">
          <template slot-scope="scope">
            NT${{scope.row.moneyMonth}}每个月
          </template>
        </el-table-column>
        <el-table-column
          prop="instanceCount"
          label="数量"
          width="180">
        </el-table-column>
        <el-table-column
          label="付费方式"
          width="180">
          预付费
        </el-table-column>
        <el-table-column
          prop="period"
          label="购买时长">
          <template slot-scope="scope">
            {{scope.row.period}}个月
          </template>
        </el-table-column>
        <el-table-column
          label="优惠">
          无
        </el-table-column>
        <el-table-column
          prop="money"
          label="费用"
          width="200">
          <template slot-scope="scope">
            <span style="color:#fa7821;">NT${{scope.row.money}}</span>
          </template>
        </el-table-column>
      </el-table>
        <div class="post-bottom">
          <div class="bottom-one">
            <div class="bottom-two">
              <span>统计费用（含税）:<span style="color:#fa7821;font-size:16px">NT${{param[0].money}}</span></span>
              <el-button size="mini" style="height:40px" type="warning" @click="submitOk">立即支付</el-button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import {
  TKE_ADD_NODE,
} from "@/constants";
export default {
  data(){
    return{
      param:[],
      renew:"NOTIFY_AND_MANUAL_RENEW"
    }
  },
  created(){
    this.param.push(JSON.parse(localStorage.getItem('info')))
  },
  methods:{
    async submitOk() {
      let arr = JSON.parse(this.param[0].params.RunInstancePara) 
      if(this.param[0].renew){
        arr['InstanceChargePrepaid']={'RenewFlag':this.renew,'Period':this.param[0].period}
      } else {
        arr['InstanceChargePrepaid']={'Period':this.param[0].period}
      }
      if(!this.param[0].meta.name){
        arr['InstanceName']="tke_"+this.param[0].meta.clusterId+"_worker"
      }
      this.param[0].params['RunInstancePara']=JSON.stringify(arr)
      let param =  this.param[0].params
      await this.axios.post(TKE_ADD_NODE, param).then(res => {
        if(res.Response.Error === undefined) {
          this.$message({
            message: "創建成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.goBack();
        } else {
          let ErrTips = {
            "FailedOperation":"操作失敗",
            "InternalError": "内部錯誤",
            "InternalError.CvmCommon": "cvm配額不足,請釋放部分資源後再創建",
            "InternalError.CvmNotFound": "cvm不存在。",
            "InternalError.Db": "db錯誤。",
            "InternalError.DbAffectivedRows": "DB錯誤",
            "InternalError.DbRecordNotFound": "記錄未找到。",
            "InternalError.ImageIdNotFound": "映像未找到。",
            "InternalError.OsNotSupport": "映像OS不支持。",
            "InternalError.Param": "Param。",
            "InternalError.QuotaMaxClsLimit": "超過配額限制。",
            "InternalError.QuotaMaxNodLimit":"超過配額限制。",
            "InternalError.QuotaMaxRtLimit":"超過配額限制。",
            "InternalError.UnexceptedInternal":"内部錯誤",
            "InternalError.VpcCommon":"VPC報錯。",
            "InternalError.VpcPeerNotFound":"對等連接不存在。",
            "InternalError.VpcRecodrNotFound": "未發現vpc記錄。",
            "InvalidParameter": "參數錯誤",
            "MissingParameter":"缺少參數錯誤",
            "ResourceInUse":"資源被佔用",
            "ResourceNotFound":	"資源不存在",
            "ResourceUnavailable":	"資源不可用",
            "UnauthorizedOperation":"未授權操作",
            "UnknownParameter": "未知參數錯誤",
            "UnsupportedOperation": "操作不支持"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      })
    },
    goBack() {
      this.$router.go(-2);
    },
  },
  filters:{
    systemDiskTypes(val) {
        if(val === 'CLOUD_PREMIUM'){
            return '高性能云硬盘'
        } else {
            return 'SSD云硬盘'
        }
    },
    internetChargeTypes(val) {
      if(val) {
        if(val === 'BANDWIDTH_POSTPAID_BY_HOUR' ||  val === 'BANDWIDTH_PREPAID') {
          return '按頻寬計費';
        } else {
          return '按使用流量';
        }
      }
    },
    mirrors(val){
      return val.replace('bit','位')
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
                    width: 300px;
                    display: flex;
                    justify-content: space-between;
                    position: absolute;
                    align-items: center;
                }
            }
        }
    }
</style>