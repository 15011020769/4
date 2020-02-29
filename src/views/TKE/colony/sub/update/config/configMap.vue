 <!-- 新建ConfigMap -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">更新配置</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
       
          
            <div class="border">
              <!-- 头部 -->
              <div class="flex f12 header">
                <div class="pl5" style="width:800px;">变量名</div>
                <div class="pl5" style="width:50%">变量值</div>
              </div>
              <!-- 主体 -->
              <div class="flex " style="padding:10px;border-top:1px solid #ddd;">
                <el-form
                class="set"
                >
                  <el-form-item
                    v-for="(domain, index) in dynamicValidateForm.domains"
                    :key="index"
                    :prop="'domains.' + index + '.value'"
                  >
                    <div class="form-input">
                      <el-input v-model="domain.value" size="mini" placeholder="变量名"></el-input>
                      <span>=</span>
                      <textarea class="text" v-model="domain.valueKey"></textarea>
                      <el-tooltip v-if="dynamicValidateForm.domains.length=='1'"    class="item" effect="dark" content="不可删除，至少设置一项" placement="right">
                        <i class="el-icon-close"></i>
                      </el-tooltip>
                      <el-tooltip v-else   class="item" effect="dark" content="删除" placement="right">
                        <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                      </el-tooltip>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <p  v-show="errorShow" style="color:red;margin:-10px 0px 10px 10px">新增变量名格式不正确，只能包含字母、数字及分隔符("-"、"_"、".")，且必须以字母、数字开头和结尾</p>
                <p>
                <el-link type="primary" style="cursor: pointer;margin:0px 0px 10px 10px" @click="addDomain">新增变量</el-link>
                </p>
            </div>

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="updateConfigmap">完成</el-button>
          <el-button size="small" @click="$router.go(-1)">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import AddValue from '@/views/TKE/colony/sub/create/config/components/addValue.vue'
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY, TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "configmapCreate",
  components: {
  },
  data() {
    return {
     
        fontColor:false,
        errorShow:false,
        nFlag:true,
      cm: {
        name: "",
        value: "default",
        options: ["请选择Namespace"]
      },
      dynamicValidateForm: {
        domains: [{
           value: '',
           valueKey: '',
        }]
      },
      clusterId: ""
    };
  },
  watch:{
    dynamicValidateForm:{
      handler(val){
          let reg= /^[a-z]([a-z0-9]|-|_|.)*([a-z0-9])$/;
          let arr=[];
          val.domains.forEach(v=>{
            arr.push(v.value)
             if(!reg.test(v.value)){
               this.errorShow=true
             }else{
               this.errorShow=false
             } 
          })

         if(arr.length!=Array.from(new Set(arr)).length){
              this.$message({
                message: "函数名不能重复",
                type: "error",
                 showClose: true,
                duration: 0
              });
              this.nFlag=false;
         }else{
             this.nFlag=true
         }   


      },
      deep:true
    }
  },
  created() {
    // 从路由获取类型
    this.clusterId = this.$route.query.clusterId;
    if(this.$route.query.np&&this.$route.query.name){
        this.findData()
    }
    console.log([1].length==[1].length)
  },
  methods: {
    //返回上一层
    goBack(){
       this.$router.go(-1);
    },

    updateConfigmap(){

      
      let arr=this.dynamicValidateForm.domains;
      let obj={};
      arr.forEach(v=>{
        obj[v.value]=v.valueKey
      })

      var params={
       ClusterName: this.clusterId,
       ContentType: "application/strategic-merge-patch+json",
       Method: "PATCH",
       Path: "/api/v1/namespaces/"+this.$route.query.np+"/configmaps/"+this.$route.query.name,
       RequestBody: {
           "data":obj
           },
       Version: "2018-05-25",
      }
      if(!this.errorShow&&this.nFlag){

        this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
          if (res.Response.Error == undefined){
              this.$router.go(-1);
          }
        })
      }

    },
    findData(){
         var params={
          ClusterName: this.clusterId,
          Method: "GET",
          Path: "/api/v1/namespaces/"+this.$route.query.np+"/configmaps?fieldSelector=metadata.name="+this.$route.query.name,
          Version: "2018-05-25",
      }
      this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
        if (res.Response.Error == undefined) {
               var data = JSON.parse(res.Response.ResponseBody);
              var nd=data.items.filter(x=>{
                  return x.metadata.name==this.$route.query.name
              })
              var arr=[];
              for(let i in nd[0].data){
                  arr.push({value:i,valueKey:nd[0].data[i]})
              }
              console.log(arr)
              this.dynamicValidateForm.domains=arr
        }
      })
    },


   
    removeDomain (item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain () {
      this.dynamicValidateForm.domains.push({
        value: '',
        valueKey: '',
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.ipu {
  border: 1px solid #ddd;
}
textarea {
  width: 90%;
  max-width: 260px;
  height: 30px;
  line-height: normal;
  border: 1px solid #ddd;
}
.flex {
  display: flex;
}
.f12 {
  font-size: 12px;
  color: #888;
  font-weight: bold;
}
.pl5 {
  padding-left: 5px;
}
.header {
  width: 300px;
  height: 40px;
  line-height: 40px;
}
.border {
  width: 550px;
  max-height: 400px;
  border: 1px solid #ddd;
}
.text {
  width: 90%;
  max-width: 260px;
  height: 30px;
  line-height: normal;
  border:1px solid #ddd;
}
.form-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom:6px;
    span{
        margin:0 10px;
    }
    i{
        margin:0 10px;
        cursor: pointer;
    }
}
.form-p{
    margin-bottom: 10px;
    font-size: 12px;
    color: #888;

}
.box {
    width: 400px;

    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 60px;
    }

    .right {
      float: right;
      width: 60px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
    }

    .left .el-tooltip__popper,
    .right .el-tooltip__popper {
      padding: 8px 10px;
    }
  }
   .activeColor {
    color: #f56c6c !important;
  }
  .set{
        ::v-deep .el-form-item{
          margin-bottom: 0px !important;
      }
  }
</style>

