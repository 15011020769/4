<template>
  <div id="addAccessModel">
    <div>
      <el-dialog
        class="addAccessModel"
        :title="$t('DDOS.accessCopy.AddAsk')"
        :visible.sync="dislogModelShow"
        width="40%"
        :before-close="handleClose">
        <div>
          <div class="topBlueAcc" v-show="!editFlag">
            {{$t('DDOS.accessCopy.AddAskTitle')}}
          </div>
          <div class="formList">
            <div class="newClear">
              <p>{{$t('DDOS.accessCopy.strageName')}}</p>
              <p>
                <el-input class="accessName" :disabled="editFlag" v-model="policyForm.Name" :placeholder="$t('DDOS.accessCopy.searchStarge')"></el-input>
              </p>
            </div>
            <div class="newClear">
              <p>{{$t('DDOS.accessCopy.agreement')}}</p>
              <p>
                <el-radio :disabled="editFlag" label="http" v-model="policyForm.Protocol" value="http">HTTP</el-radio>
              </p>
            </div>
            <div class="newClear">
              <p>模式</p>
              <p>
                <el-radio-group v-model="policyForm.Smode">
                  <el-radio label="matching">匹配模式</el-radio>
                  <el-radio label="speedlimit">限速模式</el-radio>
                </el-radio-group><br/>
                <span v-if="policyForm.Smode=='matching'?false:true" class="executionSpan">{{$t('DDOS.accessCopy.speedModelTitle')}}</span>
              </p>
            </div>
            <div class="newClear" v-if="policyForm.Smode=='matching'?false:true">
              <p>策略</p>
              <p>{{$t('DDOS.accessCopy.ipAsk')}}<el-input class="xiansuNub" v-model="policyForm.Frequency"></el-input>{{$t('DDOS.accessCopy.askTime')}}</p>
            </div>
            <div class="newClear" v-if="policyForm.Smode=='matching'?true:false">
              <p>策略</p>
              <p>
                <table class="">
                  <tr class="t-body" v-for="(item, index) in ruleList" :key="index">
                    <td v-if="index==0">當</td>
                    <td v-else>且當</td>
                    <td width="110px">
                      <el-select v-model="item.Skey" class="hoseDomin">
                        <el-option label="host" value="host"></el-option>
                        <el-option label="CGI" value="cgi"></el-option>
                        <el-option label="user_agent" value="ua"></el-option>
                        <el-option label="referer" value="referer"></el-option>
                      </el-select>
                    </td>
                    <td width="90px">
                      <el-select v-model="item.Operator" class="relese">
                        <el-option label="包含" value="include"></el-option>
                        <el-option :label="$t('DDOS.accessCopy.equalTo')" value="not_include"></el-option>
                        <el-option :label="$t('DDOS.accessCopy.noEqua')" value="equal"></el-option>
                      </el-select>
                    </td>
                    <td width="150px">
                      <el-input class="iptText" v-model="item.Value"></el-input>{{$t('DDOS.accessCopy.when')}}
                    </td>
                    <td>
                      <a v-on:click="removeRow(index)" v-show="index > 0">删除</a>
                    </td>
                  </tr>
                </table>
                <a v-on:click="addRow()" v-if="ruleList.length<4?true:false">+添加一行</a>
              </p>
            </div>
            <div class="newClear" v-if="policyForm.Smode=='matching'?true:false">
              <p>{{$t('DDOS.accessCopy.perform')}}</p>
              <p>
                <el-select v-model="policyForm.ExeMode">
                  <el-option :label="$t('DDOS.accessCopy.intercept')" value='drop'></el-option>
                  <el-option :label="$t('DDOS.accessCopy.identification')" value="alg"></el-option>
                </el-select>
                <span class="executionSpan" v-if="policyForm.ExeMode=='alg'">{{$t('DDOS.accessCopy.identificationTitle')}}</span>
              </p>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addAccessSureBtn">{{$t('DDOS.accessCopy.domainSure')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { CCSELFDEFINEPOLICY_CREATE, CCSELFDEFINEPOLICY_MODIFY } from "@/constants";
export default {
  props:{
    isShow: Boolean,
    ccResourceId: String, //资源ID
    editCCPolicy: Object, //编辑对象
    editFlag: Boolean,//是否是编辑
    dateFlag: Date
  },
  data(){
    return{
      policyForm: {
        Protocol: 'http',//cc防护类型，取值[http，https]
        Smode: 'matching',//匹配模式，取值[matching(匹配模式), speedlimit(限速模式)]
        ExeMode: 'alg',//执行策略模式，拦截或者验证码，取值[alg（验证码）, drop（拦截）]
      },//form表单对象
      ruleList: [
        {
          Skey: 'host',//规则的key, 可以为host、cgi、ua、referer
          Operator: 'include',//规则的条件，可以为include、not_include、equal
          Value: '',//规则的值，长度小于31字节
        }
      ],//规则列表对象
      dialogVisible: false,//弹框
    }
  },
  computed:{
    dislogModelShow(){
      this.dialogVisible=this.isShow;
      return this.isShow;
    }
  },
  watch: {
    dateFlag: function() {//监测时间戳，刷新每次进入此HTML的数据
      if(this.editFlag) {
        this.policyForm = JSON.parse(JSON.stringify(this.editCCPolicy));
        this.ruleList = JSON.parse(JSON.stringify(this.editCCPolicy.RuleList));
      } else {
        this.initData();
      }
    }
  },
  methods:{
    initData() {
      this.policyForm = { Protocol: 'http', Smode: 'matching', ExeMode: 'alg' };
      this.ruleList = [{ key: 'host', Operator: 'include', Value: '' }];
    },
    // 1.1.创建CC自定义策略
    createCCSelfDefinePolicy() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.ccResourceId,
        "Policy.Name": this.policyForm.Name,
        "Policy.Smode": this.policyForm.Smode,//匹配模式，取值[matching(匹配模式), speedlimit(限速模式)]
        "Policy.Protocol": this.policyForm.Protocol,//cc防护类型，取值[http，https]
      };
      //区分匹配模式
      if(this.policyForm.Smode == 'matching') {
        params["Policy.ExeMode"] = this.policyForm.ExeMode;
        for(let i=0; i<this.ruleList.length; i++) {
          params["Policy.RuleList."+i+".Skey"] = this.ruleList[i].Skey;
          params["Policy.RuleList."+i+".Operator"] = this.ruleList[i].Operator;
          params["Policy.RuleList."+i+".Value"] = this.ruleList[i].Value
        }
      } else if(this.policyForm.Smode == 'speedlimit') {
        params["Policy.Frequency"] = this.policyForm.Frequency
      }
      this.axios.post(CCSELFDEFINEPOLICY_CREATE, params).then(res => {
        if(res.Response.Success){
          this.$message({
          message: '添加成功',
          type: 'success'
        });
        }
        else{
          if(res.Response.Error.Code == 'LimitExceeded'){
            this.$message.error('CC自定義策略不能超過5個');
          }
          this.$message.error('添加失敗');
        }
        this.$emit('init')
      });
    },
    // 1.2.修改CC自定义策略
    modifyCCSelfDefinePolicy() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.ccResourceId,
        SetId: this.editCCPolicy.SetId,
        "Policy.Name": this.policyForm.Name,
        "Policy.Smode": this.policyForm.Smode,//匹配模式，取值[matching(匹配模式), speedlimit(限速模式)]
        "Policy.Protocol": this.policyForm.Protocol,//cc防护类型，取值[http，https]
      };
      //添加IpList
      for(let i=0; i<this.policyForm.IpList.length; i++) {
        params["Policy.IpList."+i] = this.policyForm.IpList[i];
      }
      //区分匹配模式
      if(this.policyForm.Smode == 'matching') {
        params["Policy.ExeMode"] = this.policyForm.ExeMode;
        for(let i=0; i<this.ruleList.length; i++) {
          params["Policy.RuleList."+i+".Skey"] = this.ruleList[i].Skey;
          params["Policy.RuleList."+i+".Operator"] = this.ruleList[i].Operator;
          params["Policy.RuleList."+i+".Value"] = this.ruleList[i].Value
        }
      } else if(this.policyForm.Smode == 'speedlimit') {
        params["Policy.Frequency"] = this.policyForm.Frequency
      }
      this.axios.post(CCSELFDEFINEPOLICY_MODIFY, params).then(res => {
        // console.log(params, res);
        if(res.Response.Error !== undefined && res.Response.Error.Message == "speedlimit must less than 1"){
          this.$message({
            showClose: true,
            message: "限速模式訪問控制策略最多添加一條",
            type: "error"
          });
        } else if(res.Response.Error !== undefined){
          this.$message({
            showClose: true,
            message: "編輯失敗，請確認參數無誤",
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message: "編輯成功",
            type: "success"
          });
        }
      });
    },
    //弹框关闭按钮
    handleClose(){
      this.dialogVisible=false;
      this.$emit("closeDialogModel",this.dialogVisible);
    },
    //确定按钮
    addAccessSureBtn(){
      //判断是添加还是编辑
      if(this.editFlag){//编辑
        this.modifyCCSelfDefinePolicy();
      } else {//添加
        this.createCCSelfDefinePolicy();
      }
      this.dialogVisible=false;
      this.$emit("addAccessContSure",this.dialogVisible)
    },
    //新增一行
    addRow: function () {
      let des = {
        Skey: 'host',
        Operator: 'include',
        Value: '',
      }
      this.ruleList.push(des)
    },
    // 删除一行
    removeRow: function (idx) {
      this.ruleList.splice(idx, 1);
    }
  }
}
</script>
<style lang="scss">
#addAccessModel{
  .addAccessModel{
    .el-dialog__title{
      font-size:14px;
      font-weight:600;
    }
    .dialog-footer{
      text-align:center;
    }
    .topBlueAcc{
      font-size: 12px;
      line-height: inherit;
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      margin-bottom: 20px;
      background: #e5f0ff;
    }
    .formList{
      div{
        margin-bottom:10px;
        p:nth-child(1){
          font-size:12px;
          color:#999;
          float:left;
          width:70px;
        }
        p:nth-child(2){
          float:left;
          width:calc(100% - 70px);
        }
        .accessName{
          width:200px;
          height:30px;
          input{
            width:100%;
            height:30px;
            border-radius: 0;
            font-size:12px;
          }
        }
        .executionSpan{
          color:#DF9500;
          font-size:12px;
          margin-left:20px;
        }
        .hoseDomin{
          width:100px;
          div{
            width:100px;
            input{
              width:100px;
            }
          }
        }
        .relese{
          width:80px;
          div{
            width:80px;
            input{
              width:80px;
            }
          }
        }
        .iptText{
          width:120px;
          margin-right:10px;
          input{
            width:120px;
          }
        }
      }
    }
  }
}
</style>