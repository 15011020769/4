<template>
  <div>
    <div>
      <el-dialog
        :title="t('安全日志服务包', 'WAF.aqrzfwb')"
        :visible.sync="logBackShow"
        width="45%"
        :before-close="handleClose">
        <div class="newClear">
          <div class="newClear dominPackList">
            <p>{{t('购买数量', 'WAF.gmsl')}}</p>
            <p>
              <el-input-number v-model="buyNum" @change="handleChange"></el-input-number> {{t('个', 'WAF.g')}}
            </p>
          </div>
          <div class="newClear dominPackList">
            <p>{{t('到期时间', 'WAF.dqsj')}}</p>
            <p>{{package.Cls && package.Cls.ValidTime || package.ValidTime}}（共{{remainingDays}}天）</p>
          </div>
          <div class="newClear dominPackList">
            <p>{{t('说明', 'WAF.sm')}}</p>
            <p>{{t('一个日志包包含：1T日志服务存储容量（套餐有效期内，日志存储时长为180天）；一次最多购买500个', 'WAF.ygrzbbh')}}</p>
          </div>
          <div class="newClear dominPackList">
            <p>{{t('费用', 'WAF.fy')}}</p>
            <p class="totalMoney">427.44元</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="buyImmediate" @click="nowBuy">{{t('立即购买', 'WAF.ljgm')}}</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props:{
    isShow:Boolean,
    package: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data(){
    return{
      logBackModel: '', // 弹框
      buyNum: 1, // 购买数量
      remainingDays: 0, // 剩余天数
    }
  },
  watch: {
    package(n) {
      if (n) {
        const ValidTime = n.Cls && n.Cls.ValidTime || n.ValidTime
        this.remainingDays = Math.ceil(moment(ValidTime).diff(moment(), 'h')/24)
      }
    }
  },
  computed:{
    //弹框
    logBackShow(){
      this.logBackModel=this.isShow;
      return this.isShow;
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.logBackModel=false;
      this.$emit("closeLogBackModel",this.logBackModel)
    },
    //计数器
    handleChange(){

    },
    //立即购买按钮
    nowBuy(){
      this.logBackModel=false;
      this.$emit("closeLogBackModel",this.logBackModel)
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
.dominPackList{
  margin-bottom:20px;
  p:nth-child(1){
    float:left;
    width:68px;
    font-size:12px;
    color:#999;
  }
  p:nth-child(2){
    float:left;
    width:calc(100% - 68px);
  }
  .totalMoney{
    font-size:24px;
    color:#ff7800;
  }
}
</style>