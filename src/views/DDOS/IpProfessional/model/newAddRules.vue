<template>
<!-- 接入配置-添加转发规则 -->
  <div>
    <div>
      <el-dialog class="dialogModel"
         :title="$t('DDOS.AccesstoCon.addAcc')"
        :visible.sync="getIsShow"
        width="30%"
        :before-close="handleClose">
        <div class="createRulesForm">
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.AccesstoCon.businessDoma')}}</span>
            <span class="ruleListIpt">
              <el-input v-model="RuleName"></el-input><p>{{$t('DDOS.accessCopy.accessCopyTitle')}}</p>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.accessCopy.ForwardingPro')}}</span>
            <span class="ruleListIpt">
              <el-select
                class="forwardHttp"
                v-model="Protocol"
              >
                <el-option
                  v-for="(item, index) in protocolList"
                  :label="item.pro"
                  :value="item.pro"
                  :key="index"
                ></el-option>
              </el-select>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.accessCopy.ForwardingExcit')}}</span>
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
            <span class="ruleListLabel">{{$t('DDOS.AccesstoCon.LoadBalancing')}}</span>
            <span class="ruleListIpt">
              <el-button class="BackResouse" :style="LbType==1?'color:#006eff;border:1px solid #006eff':''">{{$t('DDOS.AccesstoCon.WeightedPoll')}}</el-button>
            </span>
          </div>
          <div class="ruleList newClear" v-if="dominShow">
            <span class="ruleListLabel">{{$t('DDOS.accessCopy.SourceIp')}}</span>
            <span class="ruleListIpt">
              <el-input type="textarea" class="resoureStation" v-model="IpResource"/>
              <p>{{$t('DDOS.accessCopy.SoutceTitle')}}</p>
            </span>
          </div>
          <div class="ruleList newClear" v-if="!dominShow">
            <span class="ruleListLabel">源站域名</span>
            <span class="ruleListIpt">
              <el-input type="textarea" class="resoureStation" v-model="HttpResource"/>
              <p>{{$t('DDOS.accessCopy.domainTitle')}}</p>
            </span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="createL4Rules">{{$t('DDOS.accessCopy.domainSure')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { L4RULES_CREATE } from '@/constants';
import { ErrorTips } from "@/components/ErrorTips";
export default {
    //子页面调用L4转发规则的方法
  inject:['describleL4Rules'],
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
      protocolList: [
        {pro: 'TCP'},
        {pro: 'UDP'}
      ],
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
    //弹框关闭按钮
    handleClose(){
      this.dialogVisible=false;
      this.clearData();
      this.$emit("closeModel",this.dialogVisible)
    },
    // 数据清空方法
    clearData() {
      this.RuleName = '',//业务域名
      this.Protocol = 'TCP',//转发协议，取值[TCP, UDP]
      this.protocolList = [{pro: 'TCP'}, {pro: 'UDP'}],
      this.VirtualPort = '',//转发端口
      this.SourcePort = '',//源站端口
      this.SourceType = 2,//回源方式，取值[1(域名回源)，2(IP回源)]
      this.KeepTime = 0,//会话保持时间，单位秒
      // 回源列表SourceList
      this.IpResource = '',
      this.HttpResource = '',
      this.LbType = 1,//负载均衡方式，取值[1(加权轮询)，2(源IP hash)]
      this.KeepEnable = 0//会话保持开关，取值[0(会话保持关闭)，1(会话保持开启)]
    },
    //回源方式点击按钮
    BackResouse(thisType){
      this.SourceType = thisType;
      if(thisType=="2"){
        this.protocolList = [{pro: 'TCP'}, {pro: 'UDP'}];
        this.dominShow=true;
      }else if(thisType=="1"){
        this.Protocol = 'TCP';
        this.protocolList = [{pro: 'TCP'}];
        this.dominShow=false;
      }
    },
    // 1.1.添加L4转发规则(弹框确定按钮)
    createL4Rules() {
      let params = {
        Version: '2018-07-09',
        Region: localStorage.getItem("regionv2"),
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
      // console.log(params)
      this.axios.post(L4RULES_CREATE, params).then(res => {
        if (res.Response.Error === undefined) {
          this.describleL4Rules();
          this.dialogVisible=false;
          this.clearData();
          this.$emit("addRulesSure",this.dialogVisible)
        } else {
          let ErrTips = {};
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