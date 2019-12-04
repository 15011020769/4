<template>
  <div>
    <div>
      <el-dialog class="dialogModel"
        title="添加转发规则"
        :visible.sync="getIsShow"
        width="30%"
        :before-close="handleClose">
        <div class="createRulesForm">
          <div class="ruleList newClear">
            <span class="ruleListLabel">业务域名</span>
            <span class="ruleListIpt">
              <el-input v-model="ruleName"></el-input><p>注意：域名信息用于规则说明，不用作转发规则匹配</p>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">转发协议</span>
            <span class="ruleListIpt">
              <el-select v-model="forwardHttp" class="forwardHttp">
                <el-option label="TCP" value="TCP"></el-option>
              </el-select>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">转发端口</span>
            <span class="ruleListIpt">
              <el-input v-model="forwardPort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">源站端口</span>
            <span class="ruleListIpt">
              <el-input v-model="sourceStaPort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">回源方式</span>
            <span class="ruleListIpt">
              <el-button-group>
                <el-button class="BackResouse" @click="BackResouse(1)" :style="thisType==1?'color:#006eff;border:1px solid #006eff':''">IP回源</el-button>
                <el-button class="BackResouse" @click="BackResouse(2)" :style="thisType==2?'color:#006eff;border:1px solid #006eff':''">域名回源</el-button>
              </el-button-group>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">负载均衡方式</span>
            <span class="ruleListIpt">
              <el-button class="BackResouse" :style="thisTypeOne==1?'color:#006eff;border:1px solid #006eff':''">加权轮询</el-button>
            </span>
          </div>
          <div class="ruleList newClear" v-if="dominShow">
            <span class="ruleListLabel">源站IP + 权重</span>
            <span class="ruleListIpt">
              <el-input type="textarea" class="resoureStation" v-model="IPResoure"/>
              <p>	
请输入源站IP + 权重，中间由空格分隔，例如：1.1.1.1 50。用回车分隔多个源站IP + 权重，最多支持20个</p>
            </span>
          </div>
          <div class="ruleList newClear" v-if="!dominShow">
            <span class="ruleListLabel">源站域名</span>
            <span class="ruleListIpt">
              <el-input type="textarea" class="resoureStation" v-model="dominRwsoure"/>
              <p>请输入源站域名，用回车分隔多个源站域名，最多支持20个</p>
            </span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addRulesSure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow:Boolean,
  },
  computed:{
    getIsShow(){
      this.dialogVisible=this.isShow
      return this.isShow
    }
  },
  data(){
    return{
      dialogVisible:'',//弹框
      ruleName:"",//业务域名
      forwardHttp:'TCP',//转发协议
      forwardPort:'',//转发端口
      sourceStaPort:'',//源站端口
      thisType:'1',//回源方式默认
      dominShow:'true',//根据回源方式下面内容隐藏显示
      thisTypeOne:"1",//负载均衡方式
      IPResoure:"",//源站IP + 权重
      dominRwsoure:"",//源站域名
    }
  },
  methods:{
    //弹框确定按钮
    addRulesSure(){
      this.dialogVisible=false;
      this.$emit("addRulesSure",this.dialogVisible)
    },
    //弹框关闭按钮
    handleClose(){
      this.dialogVisible=false;
      this.$emit("closeModel",this.dialogVisible)
    },
    //回源方式点击按钮
    BackResouse(thisType){
      this.thisType=thisType;
      if(thisType=="1"){
        this.dominShow=true;
      }else if(thisType=="2"){
        this.dominShow=false;
      }
    }
  }
}
</script>
<style lang="scss">
.newClear:after{
  display: block;
  content:"";
  clear:both;
}
.dialogModel{
  .el-dialog__header{
    font-size:14px!important;
    font-weight:600;
    .el-dialog__title{
      font-size:14px!important;
      font-weight:600;
    }
  }
  .el-dialog__body{
    padding:10px 20px;
  }
  .titleTip{
    font-size:14px;
    font-weight: 600;
    color:#000;
    margin-bottom:12px;
  }
  .lookDetails{
    font-size:12px;
    color:#000;
    .fontweight{
      font-size:12px;
      font-weight:600;
    }
  }
}
.createRulesForm{
  padding:10px 0;
  .ruleList{
    margin-bottom:15px;
    color:#999;
    font-size:12px;
    input{
      border-radius: 0;
      width:178px;
      height:30px;
    }
    span.ruleListLabel{
      display: inline-block;
      width:100px;
      text-align:left;
      float:left;
    }
    span.ruleListIpt{
      float:left;
      width: calc(100% - 100px);
      .forwardHttp{
        width:178px;
        div{
          width:178px;
        }
      }
      .BackResouse{
        padding:0 20px;
        line-height:30px;
        height:30px;
        border-radius: 0;
      }
      .el-button:not(:last-child){
        margin-right:0;
      }
      .resoureStation{
        width:65%;
        height:100px;
        border-radius: 0;
        resize: none;
        textarea{
          width:100%;
          height:100px;
          border-radius: 0;
          resize: none;
        }
      }
    }
  }
}
</style>