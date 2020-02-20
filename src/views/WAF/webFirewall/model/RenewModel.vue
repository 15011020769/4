<template>
  <div>
    <div>
      <el-dialog
        :title="t('Web应用防火墙套餐续费', 'WAF.renew')"
        :visible.sync="isShow"
        width="45%"
        :before-close="handleClose">
        <div class="newClear">
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('套餐类型', 'WAF.tclx')}}</p>
            <p class="renewListCon">{{package.Level && PACKAGE_CFG_TYPES[package.Level].name}}</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">域名包</p>
            <p class="renewListCon">{{package.DomainPkg && package.DomainPkg.Count || 0}} {{t('个（包含10个域名防护，仅支持1个一级域名）', 'WAF.ghbym')}}</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('安全日志服务包', 'WAF.aqrzfwb')}}</p>
            <p class="renewListCon">{{package.Cls && package.Cls.Count || 0}}{{t('个', 'WAF.g')}}</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('QPS扩展包', 'WAF.qpskzb')}}</p>
            <p class="renewListCon">{{package.QPS && package.QPS.Count || 0}}{{t('个', 'WAF.g')}}</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('到期时间', 'WAF.dqsj')}}</p>
            <p class="renewListCon">{{package.ValidTime}}</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('续费时长', 'WAF.xfsc')}}</p>
            <p class="renewListCon">
              <el-radio-group v-model="month">
                <el-radio-button :label="1">1{{t('个', 'WAF.g')}}月</el-radio-button>
                <el-radio-button :label="2">2{{t('个', 'WAF.g')}}月</el-radio-button>
                <el-radio-button :label="3">3{{t('个', 'WAF.g')}}月</el-radio-button>
                <el-radio-button :label="6">6{{t('个', 'WAF.g')}}月</el-radio-button>
                <el-radio-button :label="12">12{{t('个', 'WAF.g')}}月</el-radio-button>
                <el-radio-button :label="24">24{{t('个', 'WAF.g')}}月</el-radio-button>
                <el-radio-button :label="36">36{{t('个', 'WAF.g')}}月</el-radio-button>
              </el-radio-group>
            </p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('费用', 'WAF.fy')}}</p>
            <p class="renewListCon">
              <span class="totalMoney">3,880.00元</span>
            </p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="buyImmediate" @click="renewImmediate">{{t('立即续费', 'WAF.ljxf')}}</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { DESCRIBE_WAF_PRICE } from '@/constants'
import { PACKAGE_CFG_TYPES } from '../../constants'
export default {
  props:{
    isShow: Boolean,
    package: Object
  },
  data(){
    return{
      PACKAGE_CFG_TYPES,
      month: 0,
      dialogModel:'',//弹框
      thisType:'1',//默认选中
    }
  },
  watch: {
    month() {
      this.queryPrice()
    },
    isShow(n) {
      if (n) {
        this.month = 1
      }
    }
  },
  methods:{
    queryPrice() {
      this.axios.post(DESCRIBE_WAF_PRICE, {
        Version: '2018-01-25',
        ResInfo: [{
          "goodsCategoryId":101205,
          "regionId":1,
          "projectId":0,
          "goodsNum":1,
          "payMode":1,
          "platform":1,
          "goodsDetail":{
            "timeSpan": this.month,
            "timeUnit":"m",
            "pid":1001152,
            "sv_wsm_waf_package_enterprise_clb":1
            }
          }]
      })
    },
    //关闭按钮
    handleClose(){
      this.dialogModel=false;
      this.$emit("renewModelClose",this.dialogModel)
    },
    //立即购买按钮
    renewImmediate(){
      this.$emit("renewModelClose",this.dialogModel)
    },
    //点击续费时长按钮
    checkType(type){
      this.thisType=type;
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:'';
  display:block;
  clear:both;
}
::v-deep .el-dialog__title{
  font-size:14px;
  font-weight:600;
}
::v-deep .el-dialog__footer{
  text-align:center;
}
::v-deep button.buyImmediate{
  background-color:#ff9700;
  color:#fff;
  border:none;
}
::v-deep button{
  height:30px;
  line-height:30px;
  border-radius: 0;
}
::v-deep .el-input__inner{
  height:32px;
}
::v-deep .el-input-number{
  line-height: 30px;
}
.renewList{
  margin-bottom:20px;
  p:nth-child(1).renewListLabel{
    font-size:12px;
    color:#999;
    width:100px;
    float:left;
  }
  p:nth-child(2).renewListCon{
    float:left;
    width:calc(100% - 100px);
    color:#000;
    font-size:12px;
    .totalMoney{
      font-size:24px;
      color:#ff7800;
    }
    .packageTypeBtn{
      width:68px;
      padding:0;
      text-align:center;
      margin-right:0;
      font-size:12px;
    }
    .addBoderC{
      border:1px solid #006eff;
      color:#006eff;
    }
  }
}
</style>