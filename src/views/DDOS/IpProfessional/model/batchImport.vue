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
import { L4RULES_CREATE } from '@/constants';
import { ErrorTips } from "@/components/ErrorTips";
export default {
  inject: ['describleL4Rules'],
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
      flag2: false,//IP回源还是域名回源
    }
  },
  methods:{
    //弹框确定按钮
    batchImportSure(){
      this.rules = [];
      //1.解析转换字符串
      // 1.1.按行分割
      let arr = this.importRules.split(/[\r\n]/)
      // 1.2.遍历数组，按空格分割后添加到rules数组
      for(let i in arr) {
        this.rules.push(arr[i].split(/[\s+|,]/))
      }
      // 1.3.判断业务域名是否省略
      if(this.rules[0][0] == 'TCP' || this.rules[0][0] == 'UDP'){
        this.flag = true
      }
      // 1.4.判断IP回源还是域名回源（不支持IP回源规则与域名回源规则同时导入）
      let regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      this.flag2 = regIP.test(this.rules[0][3]);//true:IP回源；false:域名回源
      // 1.5.调用createL4Rules方法，完成批量添加
      this.createL4Rules();

      this.dialogVisible1=false;
      this.$emit("batchImportSure",this.dialogVisible1)
    },
    //弹框关闭按钮
    handleClose(){
      this.dialogVisible1=false;
      this.$emit("closeModelIpt",this.dialogVisible1)
      this.importRules = "";
    },
    // 1.1.添加L4转发规则
    createL4Rules() {//业务域名(选填)、协议、转发端口、源站端口、回源IP和权重（或回源域名）
      let add = this.flag?0:1;
      let params = {
        Version: '2018-07-09',
        Region: localStorage.getItem("regionv2"),
        Business:'net',
        Id: this.resourceId
      }
      for (let i=0; i<this.rules.length; i++) {
        params['Rules.'+i+'.Protocol'] = this.rules[i][0+add];
        params['Rules.'+i+'.VirtualPort'] = this.rules[i][1+add];
        params['Rules.'+i+'.SourcePort'] = this.rules[i][2+add];
        params['Rules.'+i+'.LbType'] = 1;
        params['Rules.'+i+'.KeepTime'] = 0;
        params['Rules.'+i+'.KeepEnable'] = 0;
        if(this.flag) { //业务域名省略
          if(!this.flag2) { //回源域名
            params['Rules.'+i+'.SourceType'] = 1
            for (let j=3; j<this.rules[i].length; j++) {
              params['Rules.'+i+'.SourceList.'+(j-3)+'.Source'] = this.rules[i][j]
              params['Rules.'+i+'.SourceList.'+(j-3)+'.Weight'] = this.rules[i][j+1]
            }
          } else { //回源IP和权重
            params['Rules.'+i+'.SourceType'] = 2
            for (let j=3; j<this.rules[i].length; j++) {
              params['Rules.'+i+'.SourceList.'+parseInt((j-3)/2)+'.Source'] = this.rules[i][j]
              params['Rules.'+i+'.SourceList.'+parseInt((j-3)/2)+'.Weight'] = this.rules[i][++j]
            }
          }
        } else { //业务域名未省略
          params['Rules.'+i+'.RuleName'] = this.rules[i][0] // 判断添加业务域名
          if(!this.flag2) { //回源域名
            params['Rules.'+i+'.SourceType'] = 1
            for (let j=4; j<this.rules[i].length; j++) {
              params['Rules.'+i+'.SourceList.'+(j-4)+'.Source'] = this.rules[i][j]
              params['Rules.'+i+'.SourceList.'+(j-4)+'.Weight'] = this.rules[i][++j]
            }
          } else { //回源IP和权重
            params['Rules.'+i+'.SourceType'] = 2
            for (let j=4; j<this.rules[i].length; j++) {
              params['Rules.'+i+'.SourceList.'+parseInt((j-4)/2)+'.Source'] = this.rules[i][j]
              params['Rules.'+i+'.SourceList.'+parseInt((j-4)/2)+'.Weight'] = this.rules[i][++j]
            }
          }
        }
      }
      this.axios.post(L4RULES_CREATE, params).then(res => {
        if (res.Response.Error === undefined) {
          //添加成功
          this.$message({
            showClose: true,
            message: "導入成功",
            type: "success"
          });
          this.describleL4Rules();
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