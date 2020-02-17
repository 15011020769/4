<template>
  <div class="container">
    <div class="wrapper">
      <div class="refesher">
        <i class="el-icon-refresh"></i>
      </div>
      <el-row type="flex">
        <el-col>
          <h2>WAF开关</h2>
          <el-row>
            <el-col>WAF状态</el-col>
            <el-col>
              <el-radio />
              <p>关闭WAF总开关后，WAF将不再对经过负载均衡监听器的流量进行防护，WAF所有功能也将失效。</p>
            </el-col>
          </el-row>
        </el-col>
        <el-col>
          <h2>WAF防护状态</h2>
          <el-row>
            <el-col>规则使用模式</el-col>
            <el-col>
               <el-radio-group size="small">
                  <el-radio-button label="上海">观察</el-radio-button>
                  <el-radio-button label="北京">拦截</el-radio-button>
               </el-radio-group>
              <el-button>高级设置</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <addressStopEditModel :isShow="addressModel" @closeAddressModel="closeAddressModel"/>
    </div>
  </div>
</template>
<script>
import addressStopEditModel from '../model/addressStopEditModel'
export default {
  data() {
    return {
    }
  },
  components:{
    addressStopEditModel:addressStopEditModel
  },
  methods:{
    //编辑按钮
    editH(){
      this.$router.push({
        name:'editDominList'
      })
    },
    //观察拦截事件
    ruleUseType(thisType){
      this.thisType=thisType;
      // console.log(thisType);
    },
    //WAF状态事件
    switchChange(){

    },
    //地域编辑按钮
    editAddress(){
      this.addressModel=true;
    },
    //关闭地域编辑弹框
    closeAddressModel(isShow){
      this.addressModel=isShow;
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
  padding:20px;
  .refesher{
    text-align:right;
    .el-icon-refresh{
      font-size:20px;
    }
  }
}
</style>