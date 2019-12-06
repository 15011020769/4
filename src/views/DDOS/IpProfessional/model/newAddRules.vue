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
              <el-input v-model="RuleName"></el-input><p>注意：域名信息用于规则说明，不用作转发规则匹配</p>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">转发协议</span>
            <span class="ruleListIpt">
              <el-select v-model="Protocol" class="forwardHttp">
                <el-option label="TCP" value="TCP"></el-option>
                <el-option label="UDP" value="UDP"></el-option>
              </el-select>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">转发端口</span>
            <span class="ruleListIpt">
              <el-input v-model="VirtualPort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">源站端口</span>
            <span class="ruleListIpt">
              <el-input v-model="SourcePort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">回源方式</span>
            <span class="ruleListIpt">
              <el-button-group>
                <el-button class="BackResouse" @click="BackResouse(2)" :style="SourceType==2?'color:#006eff;border:1px solid #006eff':''">IP回源</el-button>
                <el-button class="BackResouse" @click="BackResouse(1)" :style="SourceType==1?'color:#006eff;border:1px solid #006eff':''">域名回源</el-button>
              </el-button-group>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">负载均衡方式</span>
            <span class="ruleListIpt">
              <el-button class="BackResouse" :style="LbType==1?'color:#006eff;border:1px solid #006eff':''">加权轮询</el-button>
            </span>
          </div>
          <div class="ruleList newClear" v-if="dominShow">
            <span class="ruleListLabel">源站IP + 权重</span>
            <span class="ruleListIpt">
              <el-input type="textarea" class="resoureStation" v-model="IpResource"/>
              <p>	
请输入源站IP + 权重，中间由空格分隔，例如：1.1.1.1 50。用回车分隔多个源站IP + 权重，最多支持20个</p>
            </span>
          </div>
          <div class="ruleList newClear" v-if="!dominShow">
            <span class="ruleListLabel">源站域名</span>
            <span class="ruleListIpt">
              <el-input type="textarea" class="resoureStation" v-model="HttpResource"/>
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
import { L4RULES_CREATE } from '@/constants'
export default {
  props:{
    isShow:Boolean,
    resourceId: String,
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
      // 添加L4规则参数
        RuleName: '',//业务域名
        Protocol: 'TCP',//转发协议，取值[TCP, UDP]
        VirtualPort: '',//转发端口
        SourcePort: '',//源站端口
        SourceType: 2,//回源方式，取值[1(域名回源)，2(IP回源)]
        KeepTime: 0,//会话保持时间，单位秒
        // 回源列表SourceList
        IpResource: '',
        HttpResource: '',
        LbType: 1,//负载均衡方式，取值[1(加权轮询)，2(源IP hash)]
        KeepEnable: 0,//会话保持开关，取值[0(会话保持关闭)，1(会话保持开启)]
      dominShow: true,
    }
  },
  methods:{
    //弹框确定按钮
    addRulesSure(){
      console.log('create')
      this.createL4Rules()
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
      this.SourceType = thisType;
      if(thisType=="2"){
        this.dominShow=true;
      }else if(thisType=="1"){
        this.dominShow=false;
      }
    },
    // 1.1.添加L4转发规则
    createL4Rules() {
      let params = {
        Version: '2018-07-09',
        Business:'net',
        Id: this.resourceId,
        'Rules.0.RuleName': this.RuleName,
        'Rules.0.Protocol': this.Protocol,
        'Rules.0.VirtualPort': this.VirtualPort,
        'Rules.0.SourcePort': this.SourcePort,
        'Rules.0.SourceType': this.SourceType,
        'Rules.0.LbType': this.LbType,
        'Rules.0.KeepTime': this.KeepTime,
        'Rules.0.KeepEnable': this.KeepEnable,
      }
      if(this.SourceType == 1) {//域名
        let arr = this.HttpResource.split(/[\s\n]/)
        for(let i=0; i<arr.length; i++) {
          params['Rules.0.SourceList.'+i+'.Source'] = arr[i]
          params['Rules.0.SourceList.'+i+'.Weight'] = '0'
        }
      } else if(this.SourceType == 2) {//IP
        let arr = this.IpResource.split(/[\s\n]/)
        for(let i=0; i<arr.length/2; i++) {
          params['Rules.0.SourceList.'+i+'.Source'] = arr[i*2]
          params['Rules.0.SourceList.'+i+'.Weight'] = arr[i*2 + 1]
        }
      }
      console.log(params)
      this.axios.post(L4RULES_CREATE, params).then(res => {
        if('Success' in res.Response) {
          alert(res.Response.Success.Message)
        } else if('Error' in res.Response) {
          console.log(res.Response.Error)
        }
      })
    },
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