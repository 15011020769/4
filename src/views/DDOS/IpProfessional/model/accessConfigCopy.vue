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
              <el-input v-model="EnidData.RuleName"></el-input><p>注意：域名信息用于规则说明，不用作转发规则匹配</p>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">转发协议</span>
            <span class="ruleListIpt">
              <el-select v-model="EnidData.Protocol" class="forwardHttp">
                <el-option label="TCP" value="TCP"></el-option>
                <el-option label="UDP" value="UDP"></el-option>
              </el-select>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">转发端口</span>
            <span class="ruleListIpt">
              <el-input v-model="EnidData.VirtualPort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">源站端口</span>
            <span class="ruleListIpt">
              <el-input v-model="EnidData.SourcePort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">回源方式</span>
            <span class="ruleListIpt">
              <el-button-group>
                <el-button class="BackResouse" @click="BackResouse(2)" :style="EnidData.SourceType==2?'color:#006eff;border:1px solid #006eff':''">IP回源</el-button>
                <el-button class="BackResouse" @click="BackResouse(1)" :style="EnidData.SourceType==1?'color:#006eff;border:1px solid #006eff':''" :disabled="true">域名回源</el-button>
              </el-button-group>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">负载均衡方式</span>
            <span class="ruleListIpt">
              <el-button class="BackResouse" :style="EnidData.LbType==1?'color:#006eff;border:1px solid #006eff':''">加权轮询</el-button>
            </span>
          </div>
          <div class="ruleList newClear" v-if="dominShow">
            <span class="ruleListLabel">源站IP + 权重</span>
            <span class="ruleListIpt">
              <el-input type="textarea" class="resoureStation" v-model="IPData"/>
              <p>	
请输入源站IP + 权重，中间由空格分隔，例如：1.1.1.1 50。用回车分隔多个源站IP + 权重，最多支持20个</p>
            </span>
          </div>
          <div class="ruleList newClear" v-if="!dominShow">
            <span class="ruleListLabel">源站域名</span>
            <span class="ruleListIpt">
              <el-input type="textarea" class="resoureStation" v-model="HttpData"/>
              <p>请输入源站域名，用回车分隔多个源站域名，最多支持20个</p>
            </span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="copySure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { L4RULES_CREATE } from '@/constants'
export default {
  //子页面调用L4转发规则的方法
  inject:['describleL4Rules'],
  props:{
    isShow4:Boolean,
    resourceId: String,
  },
  data(){
    return{
      dialogVisible:'',//弹框状态
      RuleName: '',//业务域名
      Protocol: 'TCP',//转发协议，取值[TCP, UDP]
      VirtualPort: '',//转发端口
      SourcePort: '',//源站端口
      SourceType: 2,//回源方式，取值[1(域名回源)，2(IP回源)]
      KeepTime: 0,//会话保持时间，单位秒
      LbType:1,//负载均衡方式
      dominShow:true,//源站IP + 权重/源站域名
      IpResource:'',//源站IP + 权重 绑定数据
      HttpResource:'',//源站域名
      EnidData:'',//获取某一条数据
      IPData:'',//源站IP + 权重获取数据
      HttpData:''//源站域名获取数据
    }
  },
  computed:{
    getIsShow(){
      this.dialogVisible=this.isShow4
      return this.isShow4
    }
  },
  methods:{
    handleClose(){
      this.dialogVisible=false;
      this.$emit("closeCopyModel",this.dialogVisible)
    },
      init(scopeRow){
      this.EnidData = scopeRow
      if(this.EnidData.SourceType == 1) {//域名
         this.HttpData='';
         this.dominShow=false;
        for(let i=0; i<scopeRow.SourceList.length; i++) {
          this.HttpResource=scopeRow.SourceList[i].Source+ '\ '+scopeRow.SourceList[i].Weight+ '\n'
          this.HttpData = this.HttpData.concat(this.HttpResource)
        }
      } else if(this.EnidData.SourceType == 2) {//IP
        this.IPData='';
        this.dominShow=true;
        for(let i=0; i<scopeRow.SourceList.length; i++) {
          this.IpResource=scopeRow.SourceList[i].Source+ '\ '+scopeRow.SourceList[i].Weight+ '\n'
           this.IPData = this.IPData.concat(this.IpResource)
        }
      }
    },
    //复制确定按钮
    copySure(){
      this.dialogVisible=false;
      this.$emit("closeCopyModel",this.dialogVisible)
      let params = {
        Version: '2018-07-09',
        Business:'net',
        Id: 'net-0000006y',
        'Rules.0.RuleName': this.EnidData.RuleName,
        'Rules.0.Protocol': this.EnidData.Protocol,
        'Rules.0.VirtualPort': this.EnidData.VirtualPort,
        'Rules.0.SourcePort': this.EnidData.SourcePort,
        'Rules.0.SourceType': this.EnidData.SourceType,
        'Rules.0.LbType': this.EnidData.LbType,
        'Rules.0.KeepTime': this.EnidData.KeepTime,
        'Rules.0.KeepEnable': this.EnidData.KeepEnable,
      }
     if(this.EnidData.SourceType == 1) {//域名
        let arr = this.EnidData.SourceList
        // console.log(arr)
        for(let i=0; i<arr.length; i++) {
          params['Rules.0.SourceList.'+i+'.Source'] = arr[i].Source
          params['Rules.0.SourceList.'+i+'.Weight'] = arr[i].Weight
        }
      } else if(this.EnidData.SourceType == 2) {//IP
        let arr = this.EnidData.SourceList
        for(let i=0; i<arr.length; i++) {
          params['Rules.0.SourceList.'+i+'.Source'] = arr[i].Source
          params['Rules.0.SourceList.'+i+'.Weight'] = arr[i].Weight
        }
      }
      // console.log(params)
      this.axios.post(L4RULES_CREATE, params).then(res => {
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: 'error'
          });
        }else{
          this.$message({
            showClose: true,
            message: '复制成功',
            type: 'success'
          });
          this.describleL4Rules()
        }
      })
    },
    //回源方式点击按钮
    BackResouse(thisType){
      this.SourceType = thisType;
      if(thisType=="2"){
        this.dominShow=true;
        //这块需要提示会员方式不可以修改
      }else if(thisType=="1"){
        this.dominShow=false;
        //这块需要提示会员方式不可以修改
      }
    },
  }
}
</script>