<template>
  <div>
    <div>
      <el-dialog
        title="Web应用防火墙套餐续费"
        :visible.sync="renewModel"
        width="45%"
        :before-close="handleClose">
        <div class="newClear">
          <div class="newClear renewList">
            <p class="renewListLabel">套餐类型</p>
            <p class="renewListCon">高级版</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">域名包</p>
            <p class="renewListCon">0 个（包含10个域名防护，仅支持1个一级域名）</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">安全日志服务包</p>
            <p class="renewListCon">0个</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">QPS扩展包</p>
            <p class="renewListCon">0个</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">到期时间</p>
            <p class="renewListCon">2020-01-12 16：00：00</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">续费时长</p>
            <p class="renewListCon">
              <el-button-group>
                <el-button class="packageTypeBtn" @click="checkType(1)" :class="thisType=='1'?'addBoderC':''">1个月</el-button>
                <el-button class="packageTypeBtn" @click="checkType(2)" :class="thisType=='2'?'addBoderC':''">2个月</el-button>
                <el-button class="packageTypeBtn" @click="checkType(3)" :class="thisType=='3'?'addBoderC':''">3个月</el-button>
                <el-button class="packageTypeBtn" @click="checkType(4)" :class="thisType=='4'?'addBoderC':''">6个月</el-button>
                <el-button class="packageTypeBtn" @click="checkType(5)" :class="thisType=='5'?'addBoderC':''">1年</el-button>
                <el-button class="packageTypeBtn" @click="checkType(6)" :class="thisType=='6'?'addBoderC':''">2年</el-button>
                <el-button class="packageTypeBtn" @click="checkType(7)" :class="thisType=='7'?'addBoderC':''">3年</el-button>
              </el-button-group>
            </p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">费用</p>
            <p class="renewListCon">
              <span class="totalMoney">3,880.00元</span>
            </p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="buyImmediate" @click="buyImmediate">立即续费</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow:Boolean
  },
  data(){
    return{
      dialogModel:'',//弹框
      thisType:'1',//默认选中
    }
  },
  computed:{
    renewModel(){
      this.dialogModel=this.isShow;
      return this.isShow;
    }
  },
  methods:{
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