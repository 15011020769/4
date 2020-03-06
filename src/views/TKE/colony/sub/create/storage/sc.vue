 <!-- 新建PersistentVolume -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建StorageClass</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form  :model="pv" label-position='left' label-width="120px" size="mini"
         :rules="rules" ref="pv">
          <el-form-item label="名称" prop="name">
            <el-input class="w200" v-model="pv.name" placeholder="请输入StorageClass名称"></el-input>
            <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          <el-form-item label="Provisioner" class="m0">
            <el-radio-group v-model="pv.cloud" style="margin-bottom: 30px;">
              <el-radio-button label="cloud.tencent.com/qcloud-cbs">云硬盘CBS</el-radio-button>
              <el-radio-button label="cloud.tencent.com/qcloud-cfs" disabled>文件存储CFS</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="地域">
            <div>港澳台地区(中国台北)</div>
          </el-form-item>
          <el-form-item label="可用区">
              <!-- <el-checkbox v-model="pv.city">随机可用区</el-checkbox> -->
              <el-checkbox-group v-model="pv.city">
                 <el-checkbox v-for="(item,index) in pv.checkListT" :label="item" :key="index" disabled></el-checkbox>
              </el-checkbox-group>
          </el-form-item>
          <el-form-item label="计费模式">
            <el-radio-group v-model="pv.money" @change="getChange($event)">
              <el-radio-button label="POSTPAID">按量计费</el-radio-button>
              <el-radio-button label="PREPAID">包年包月</el-radio-button>
            </el-radio-group>
            <div v-show="!flag">支持删除和保留的回收策略</div>
            <div v-show="flag">
              <p>仅支持保留的回收策略</p>
              <p>如您需要购买包年包月云硬盘，需要为角色TKE_QCSRole添加策略 QcloudCVMFinanceAccess 配置支付权限， 否则可能因为没支付权限导致创建基于包年包月storageclass的PVC失败。<a>点击前往角色控制台进行授权</a></p>
            </div>
          </el-form-item>
          <el-form-item label="云盘类型">
            <el-radio-group v-model="pv.ps">
              <el-radio-button label="CLOUD_PREMIUM">高性能云硬盘</el-radio-button>
              <el-radio-button label="CLOUD_SSD">SSD云硬盘</el-radio-button>
            </el-radio-group>
            <div>容量限制可查看<a href="">CBS类型说明</a></div>
          </el-form-item>
          <el-form-item label="回收策略" class="m0">
            <el-radio-group v-model="pv.del" style="margin-bottom: 30px;">
              <el-radio-button label="Delete" :disabled="flag">删除</el-radio-button>
              <el-radio-button label="Retain">保留</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="定期备份" class="m0">
            <el-checkbox v-model="pv.checked" @change="!pv.checked">设置定期备份</el-checkbox>
            <div v-show="pv.checked">
               <el-select v-model="pv.backup" filterable placeholder="请选择"  :filter-method="dataFilter">
                  <el-option
                    v-for="item in info"
                    :key="item.AutoSnapshotPolicyId"
                    :label="item.AutoSnapshotPolicyName+'|'+getfilterWeek(item.Policy[0].DayOfWeek[0])+'|'+getfilterDay(item.Policy[0].Hour[0])+'|'+getfilterRetention(item.RetentionDays)"
                    :value="item.AutoSnapshotPolicyId">
                  </el-option>
                </el-select>
                <span style="margin-left:10px;">策略详情<i class="el-icon-info"></i></span>
                <p>设置定期备份可有效保护数据安全，备份数据将产生额外费用，请见<a>价格总览</a><i class="el-icon-edit-outline"></i></p>
            </div>
          </el-form-item>
        </el-form>

       
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="submitForm('pv')">新建StorageClass</el-button>
          <el-button size="small" @click="jump()">取消</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import FileSaver from "file-saver";
import { ErrorTips } from "@/components/ErrorTips";
import XLSX from "xlsx";
import { ALL_CITY ,TKE_CBS_POLICIES,POINT_REQUEST} from "@/constants";
export default {
  name: "pvCreate",
  data() {
     var validatePass = (rule, value, callback) => {
      const version = /^(?!_)(?!.*-$)[a-z0-9_]+$/
      if (value === '') {
        // console.log(222)
        callback(new Error('请输入应用户名'))
      } else if(!version.test(value)){
        callback(new Error('格式不正确'))
      } else if(value.length>63){
        callback(new Error('长度不能超过63个字符'))
      }else {
        callback()
      }
    }
    return {
      pv: {
        cloud:"cloud.tencent.com/qcloud-cbs",
        money:"POSTPAID",
        ps: 'CLOUD_PREMIUM',
        del:'Delete',
        name: '',
        checked: false,
        checkListO:[],
        checkListT:["台北一区"],
        city:["台北一区"],
        backup:''//备份数据
      },
      info:[],
      flag:false,
      rules:{
        name:[
           { validator: validatePass, trigger: 'blur' }
        ]
      }
    };
  },
  components: {
    
  },
  created() {
     // 从路由获取类型
    this.GetPolicies()
  },
  methods: {
    //返回上一层
    goBack(){
        this.$router.go(-1);
    },
    dataFilter(val){
      console.log(val)
    },
    getfilterWeek(val){
        if(val == 1){
          return "星期一"
        } else if(val == 2){
          return "星期二"
        } else if(val == 3){
          return "星期三"
        } else if(val == 4){
          return "星期四"
        } else if(val == 5){
          return "星期五"
        } else if(val == 6){
          return "星期六"
        } else if(val == 7){
          return "星期七"
        }
    },
    getfilterDay(val){
        return val+":00"
    },
    getfilterRetention(val){
      if(val){
        return "保留"+val+"后自动删除"
      } else {
        return "永久保留"
      }
    },
    getChange(val){
      console.log(val)
        if(val == "PREPAID"){
            this.flag = true
            this.pv.del = "Retain"
        } else {
            this.flag = false
        }
    },
    // 取消跳转
     jump(){
      this.$router.push({
        name: 'colonyStorageSc',
        query: {
          clusterId:this.$route.query.clusterId,
        }
      })
    },
    // 提交按钮
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.setValue()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    GetPolicies(){
      const param = {
          "Filters.0.Name":"auto-snapshot-policy-state",
          "Filters.0.Values.0":"NORMAL",
          TryCreateDefaultAutoSnapshotPolicy: true,
          Version: "2017-03-12"
        }
        this.axios.post(TKE_CBS_POLICIES, param).then(res => {
          // console.log(res)
            if (res.Response.Error == undefined) {
              console.log(res)
              this.info = res.Response.AutoSnapshotPolicySet
              this.pv.backup =res.Response.AutoSnapshotPolicySet[0].AutoSnapshotPolicyId
              console.log(this.info)
              // this.loadShow = false
            } else {
               let ErrTips = {};
                let ErrOr = Object.assign(ErrorTips, ErrTips);
                this.$message({
                    message: ErrOr[res.Response.Error.Code],
                    type: "error",
                    showClose: true,
                    duration: 0
                })
            }
          })
    },
    // 新建
    setValue(){
      if(this.pv.checked){
        var RequestValue = {"kind":"StorageClass","apiVersion":"storage.k8s.io/v1","metadata":{"name":this.pv.name},"provisioner":this.pv.cloud,"parameters":{"type":this.pv.ps,"paymode":this.pv.money,"aspid":this.pv.backup},"reclaimPolicy":this.pv.del}
      } else {
        var RequestValue = {"kind":"StorageClass","apiVersion":"storage.k8s.io/v1","metadata":{"name":this.pv.name},"provisioner":this.pv.cloud,"parameters":{"type":this.pv.ps,"paymode":this.pv.money},"reclaimPolicy":this.pv.del}
      }
      const param = {
            ClusterName: this.$route.query.clusterId,
            Method: "POST",
            Path: "/apis/storage.k8s.io/v1/storageclasses",
            RequestBody: JSON.stringify(RequestValue),
            Version: "2018-05-25"
        }
        this.axios.post(POINT_REQUEST, param).then(res => {
          console.log(res)
            if (res.Response.Error == undefined) {
              console.log(res)
              this.$router.push({
                name: 'scDetailEvent',
                query: {
                  clusterId:this.$route.query.clusterId,
                  resourceIns:this.pv.name
                }
              })
            } else {
              let ErrTips = {};
              let ErrOr = Object.assign(ErrorTips, ErrTips);
              this.$message({
                  message: ErrOr[res.Response.Error.Code],
                  type: "error",
                  showClose: true,
                  duration: 0
              })
            }
          })
    }
  },
};
</script>

<style lang="scss" scoped>
.m0 {
  margin:0;
};
.red {
  color: #e54545;
};
.err {
  border: 1px solid #e54544;
}
</style>

