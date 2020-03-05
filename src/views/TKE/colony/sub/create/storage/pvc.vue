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
          <h2 class="header-title">新建PersistentVolumeClaim</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form  class="tke-form m0" :model="pv" label-position='left' label-width="120px" size="mini"
        :rules="rules" ref="pv">
          <el-form-item label="名称" class="m0" prop='name'>
            <el-input class="w200" v-model="pv.name" placeholder="请输入名称"></el-input>
            <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          <el-form-item label="命名空间" style="margin-top:20px;">
            <el-select v-model="pv.nameValue" placeholder="请选择">
              <el-option
                v-for="(item,index) in Namespace"
                :key="index"
                :label="item.metadata.name"
                :value="item.metadata.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Provisioner" class="m0">
            <el-radio-group v-model="pv.ps" style="margin-bottom: 30px;">
              <el-radio-button label="CBS">云硬盘CBS</el-radio-button>
              <el-radio-button label="CFS" disabled>文件存储CFS</el-radio-button>
              <el-radio-button label="COS" disabled>对象存储COS</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="读写权利" class="m0">
              <el-radio-group v-model="pv.rw" style="margin-bottom: 30px;">
                <el-radio-button label="ReadWriteOnce">单机读写</el-radio-button>
                <el-radio-button label="tor" :disabled="pv.ps=='CBS'">多机只读
                </el-radio-button>
                <el-radio-button label="trw" :disabled="pv.ps=='CBS'">多机读写</el-radio-button>
              </el-radio-group>
            </el-form-item>
          <div v-if="pv.ps=='CBS'">
            <el-form-item label="StorageClass" class="m0" >
              <el-select v-model="pv.storageValue" placeholder="请选择">
                <el-option
                  v-for="(item,index) in StorageClass"
                  :key="index"
                  :label="item.metadata.name"
                  :value="item.metadata.name">
                </el-option>
              </el-select>
              <el-button size="mini" style="height:28px;padding-bottom:2px;border:none;" icon="el-icon-refresh"></el-button>
              <div>PersistentVolumeClaim将自动绑定具有相同StoragClass，且容量大于或等于当前PVC设置的容量大小的静态创建的PersistentVolume</div>
            </el-form-item>
            <el-form-item label="云盘类型">
              <div>普通云硬盘</div>
              <div>StorageClass为cbs，默认为普通云硬盘，最小为10GiB，<span class="red">若普通云盘售罄时将自动创建高性能云硬盘，最小为10GiB</span></div>
            </el-form-item>
            <el-form-item label="容量" prop="input">
              <el-tooltip content="普通云硬盘硬盘大小为10GB,最大为16000GB" placement="top" effect="light">
                <el-input style="width:150px" v-model="pv.input" @change="getMoney()">
                  <template slot="append">GiB</template>
                </el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="费用">
              <div>请先输入合法的云盘容量</div>
            </el-form-item>
          </div>
          <div v-if="pv.ps=='CFS'">
            <el-form-item label="StorageClass" class="m0">
              <el-select class="err" v-model="pv.storageValue" placeholder="暂无数据" disabled>
                <el-option
                  v-for="(item,index) in pv.StorageClass"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <el-button size="mini" style="height:28px;padding-bottom:2px;border:none;" icon="el-icon-refresh" @click="GetStorageValue()"></el-button>
              <i class="el-icon-warning red"></i>
              <div>当前类型无可用StorageClass，请前往<a href="">StorageClass</a><i class="el-icon-edit-outline"></i>新建</div>
            </el-form-item>
          </div>
        </el-form>
       
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click ="submitForm('pv')">新建PersistentVolumeClaim</el-button>
          <el-button size="small" @click="jump()">取消</el-button>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY,POINT_REQUEST,TKE_PAY_MONEY } from "@/constants";
export default {
  name: "pvCreate",
  data() {
     var validatePass = (rule, value, callback) => {
       const version = /^(?!-)(?![0-9])(?!.*-$)[a-z0-9-]+$/
       if(!version.test(this.pv.name)){
         callback(new Error('格式不正确'))
       } else {
         callback()
       }
     }
      var validatePass2 = (rule, value, callback) => {
      //  const version = /^(?!_)(?!.*-$)[a-z0-9_]+$/
      // console.log(value)
       if(this.pv.input%10!==0){
         callback(new Error('硬盘大小需为10的倍数'))
       } else if(this.pv.input >= 16000) {
         callback(new Error('最大为16000GB'))
       } else {
         callback()
       }
     }
    return {
      pv: {
        name: '',
        tabPosition: 'jt',
        ps: 'CBS',
        rw:'ReadWriteOnce',
        storageValue: '',
        nameValue: this.$route.query.np,
        radio: '1',
        input:''
      },
      StorageClass: [],
      Namespace:[],
      rules:{
         name: [
          { required: true, message: '名称不能为空',trigger: 'blur,change' },
          { max: 63, message: '名称不能超过63个字符', trigger: 'blur,change' },
          { validator: validatePass, trigger: 'blur,change' }
        ],
        input: [
          { required: true,  message:'容量不能为空',trigger: 'blur,change' },
          { validator: validatePass2, trigger: 'blur,change' }
        ],
      }
    }
  },
  components: {
    
  },
  created() {
     // 从路由获取类型
   this.GetStorageValue()
   this.GetSpaceValue()
  },
  methods: {
    //返回上一层
    goBack(){
          this.$router.go(-1);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.pv.input){
            let row = this.pv.input+"Gi"
            this.SetNewValue(row)
            this.$router.push({
              name: "pvcDetailEvent",
              query: {
                clusterId: this.$route.query.clusterId,
                np:this.$route.query.np,
                resourceIns:this.pv.name
              }
            });
          }
          // alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 取消跳转
    jump(){
      this.$router.push({
        name: 'colonyStoragePvc',
        query: {
          clusterId:this.$route.query.clusterId,
        }
      })
    },
      // 获取storageValue
    GetStorageValue() {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path: "/apis/storage.k8s.io/v1/storageclasses",
        Version: "2018-05-25"
      }
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          console.log(mes);
          this.pv.storageValue = mes.items[0].metadata.name
          this.StorageClass = mes.items
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          })
        }
      })
    },
    // 获取命名空间
     GetSpaceValue() {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path: "/api/v1/namespaces",
        Version: "2018-05-25"
      }
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          console.log(mes);
          // this.pv.nameValue = mes.items[0].metadata.name
          this.Namespace = mes.items
          // console.log(this.Namespace)
          // console.log(this.list)
          // this.loadShow = false
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          })
          
        }
      })
    },
    // 新建
    SetNewValue(row) {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "POST",
        RequestBody: JSON.stringify({"kind":"PersistentVolumeClaim","apiVersion":"v1","metadata":{"name":this.pv.name,"namespace":this.pv.nameValue},"spec":{"accessModes":[this.pv.rw],"storageClassName":this.pv.storageValue,"resources":{"requests":{"storage":row}}}}),
        Path: "/api/v1/namespaces/"+this.pv.nameValue+"/persistentvolumeclaims",
        Version: "2018-05-25"
      }
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
            if(res.Response.Error.Code == "InternalError"){
              this.$message({
                message: "persistentvolumeclaims "+"'" +this.pv.name +"'"+" already exists",
                type: "error",
                showClose: true,
                duration: 2000
              });
           } else {
              let ErrTips = {}
              let ErrOr = Object.assign(ErrorTips, ErrTips);
              this.$message({
                  message: ErrOr[res.Response.Error.Code],
                  type: "error",
                  showClose: true,
                  duration: 0
              })
           }
        }
      })
    },
    getMoney(){
      if(this.pv.input){
        var params = {
        DiskChargeType: "POSTPAID_BY_HOUR",
        DiskSize: this.pv.input,
        DiskType: "CLOUD_BASIC",
        Version: "2017-03-12"
        }
        this.axios.post(TKE_PAY_MONEY, params).then(res => {
          if (res.Response.Error === undefined) {
              console.log(res)
          }
          else{
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
        } else {
          return 
        }
      }
    }
};
// ClusterName: "cls-n1xokuh6"
// Method: "POST"
// Path: "/api/v1/namespaces/qwe/persistentvolumeclaims"
// RequestBody: "{"kind":"PersistentVolumeClaim","apiVersion":"v1","metadata":{"name":"weq232","namespace":"qwe"},"spec":{"accessModes":["ReadWriteOnce"],"storageClassName":"asqw4","resources":{"requests":{"storage":"20Gi"}}}}"
// Version: "2018-05-25"
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

