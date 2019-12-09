<template>
  <div id="addIpList">
    <div class="ccProtectPartFour">
      <div class="topBtnList">
        <el-button-group class="btnGroup">
          <el-button @click="checkListBtn(1)" :style="thisType==1?'color:#006eff;border:1px solid #006eff;':''">URL白名单</el-button>
          <el-button @click="checkListBtn(2)" :style="thisType==2?'color:#006eff;border:1px solid #006eff;':''">IP白名单</el-button>
          <el-button @click="checkListBtn(3)" :style="thisType==3?'color:#006eff;border:1px solid #006eff;':''">IP黑名单</el-button>
        </el-button-group>
      </div>
      <div>
        <urlWhitelist :resourceId='resourceId' :ccUrlWhiteList='ccUrlWhiteList' v-if="thisType==1?true:false"/>
        <ipWhitelist :resourceId='resourceId' v-if="thisType==2?true:false"/>
        <ipBlacklist :resourceId='resourceId' v-if="thisType==3?true:false"/>
      </div>
    </div>
  </div>
</template>
<script>
import urlWhitelist from './components/urlWhitelist'
import ipWhitelist from './components/ipWhitelist'
import ipBlacklist from './components/ipBlacklist'
export default {
  props: {
    resourceId:'',//资源ID
    ccUrlWhiteList: [], //CC的Url白名单
  },
  data(){
    return{
      thisType:1,//默认选择URl白名单
    }
  },
  components:{
    urlWhitelist:urlWhitelist,
    ipWhitelist:ipWhitelist,
    ipBlacklist:ipBlacklist
  },
  methods:{
    //选择名单属性
    checkListBtn(thisType){
      this.thisType=thisType
    }
  }
}
</script>
<style lang="scss">
#addIpList{
  .ccProtectPartFour{
    margin-top:20px;
  }
  .topBtnList{
    margin-bottom:12px;
    .btnGroup{
      button{
        height:30px;
        border-radius: 0;
        line-height:30px;
        padding:0 20px;
        margin-right:0;
      }
    }
  }
}
</style>