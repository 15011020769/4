<template>
  <div>
    <div>
      <el-dialog class="dialogModel"
        :title="$t('DDOS.AccesstoCon.BulkImport')"
        :visible.sync="getIsShow1"
        width="30%"
        :before-close="handleClose">
        <div class="importAll">
          <span class="importLabel">{{$t('DDOS.accessCopy.raleAcc')}}</span>
          <span class="importIpt">
            <el-input type="textarea" v-model="importRules"/>
            <p class="margibBot">{{$t('DDOS.accessCopy.importTitle')}}</p>
            <p>{{$t('DDOS.accessCopy.TextBiness')}}:</p>
            <p>dayu.com TCP 1234 4321 1.1.1.1 10或dayu.com TCP 1234 4321 a.com</p>
            <p>{{$t('DDOS.accessCopy.noTextBin')}}:</p>
            <p class="margibBot">TCP 1234 4321 1.1.1.1 10或TCP 1234 4321 a.com</p>
            <p class="margibBot">{{$t('DDOS.accessCopy.binessTitle')}}</p>
          </span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="batchImportSure">{{$t('DDOS.accessCopy.domainSure')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { L4RULES_CREATE } from '@/constants'
export default {
  props:{
    isShow1:Boolean,
    resourceId: String,
  },
  computed:{
    getIsShow1(){
      this.dialogVisible1=this.isShow1
      return this.isShow1
    }
  },
  data(){
    return{
      dialogVisible1:'',//批量导入弹框
      importRules:'',//批量导入规则
      rules: [],//批量导入的数据
      flag: false,//业务域名是否省略
    }
  },
  methods:{
    //弹框确定按钮
    batchImportSure(){
      console.log(this.importRules)
      //1.解析转换字符串
      // 1.1.按行分割
      let arr = this.importRules.split(/[\r\n]/)
      // 1.2.遍历数组，按空格分割后添加到rules数组，并确定业务域名是否省略
      for(let i in arr) {
        this.rules.push(arr[i].split(/[\s]/))
      }
      if(this.rules[0][0] == 'TCP' | this.rules[0][0] == 'UDP'){
        this.flag = true
      }
      // 1.3.遍历rules数组，调用createL4Rules方法，完成批量添加
      for(let j in this.rules) {
        this.createL4Rules(this.rules[j])
      }
      this.dialogVisible1=false;
      this.$emit("batchImportSure",this.dialogVisible1)
    },
    //弹框关闭按钮
    handleClose(){
      this.dialogVisible1=false;
      this.$emit("closeModelIpt",this.dialogVisible1)
    },
    // 1.1.添加L4转发规则
    createL4Rules(rule) {//业务域名(选填)、协议、转发端口、源站端口、回源IP和权重（或回源域名）
      let add = 0
      add = this.flag?0:1
      
      let params = {
        Version: '2018-07-09',
        Region: localStorage.getItem("regionv2"),
        Business:'net',
        Id: this.resourceId,
        'Rules.0.Protocol': rule[0+add],
        'Rules.0.VirtualPort': rule[1+add],
        'Rules.0.SourcePort': rule[2+add],
        'Rules.0.LbType': 1,
        'Rules.0.KeepTime': 0,
        'Rules.0.KeepEnable': 0,
      }
      
      // 判断回源IP和权重（或回源域名）
      if(this.flag) { //业务域名省略
        if(rule.length == 4) { //回源域名
          params['Rules.0.SourceType'] = 1,
          params['Rules.0.SourceList.0.Source'] = rule[3]
          params['Rules.0.SourceList.0.Weight'] = 0
        } else if(rule.length == 5) { //回源IP和权重
          params['Rules.0.SourceType'] = 2,
          params['Rules.0.SourceList.0.Source'] = rule[3]
          params['Rules.0.SourceList.0.Weight'] = rule[4]
        }
      } else { //业务域名未省略
        // 判断添加业务域名
        params['Rules.0.RuleName'] = rule[0]
        if(rule.length == 5) { //回源域名
          params['Rules.0.SourceType'] = 1,
          params['Rules.0.SourceList.0.Source'] = rule[4]
          params['Rules.0.SourceList.0.Weight'] = 0
        } else if(rule.length == 6) { //回源IP和权重
          params['Rules.0.SourceType'] = 2,
          params['Rules.0.SourceList.0.Source'] = rule[4]
          params['Rules.0.SourceList.0.Weight'] = rule[5]
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
.importAll{
  font-size:12px;
  color:#999;
  span.importLabel{
    float:left;
    width:100px;
  }
  span.importIpt{
    float:left;
    width:calc(100% - 100px);
    textarea{
      width:80%;
      height:100px;
      resize: none;
    }
    .margibBot{
      margin-bottom:25px;
    }
  }
}
</style>