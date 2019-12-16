<template>
  <div>
    <div>
      <el-dialog
        title="扩展域名包"
        :visible.sync="buyDominPack"
        width="45%"
        :before-close="handleClose">
        <div class="newClear">
          <div class="newClear dominPackList">
            <p>购买数量</p>
            <p>
              <el-input-number v-model="buyNum" @change="handleChange"></el-input-number>
            </p>
          </div>
          <div class="newClear dominPackList">
            <p>到期时间</p>
            <p>2020-01-12 16：00:00</p>
          </div>
          <div class="newClear dominPackList">
            <p>说明</p>
            <p>每个域名包包含10个域名防护，仅支持1个一级域名；一次最多购买500个。</p>
          </div>
          <div class="newClear dominPackList">
            <p>费用</p>
            <p class="totalMoney">9,534.24元</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="buyImmediate" @click="buyImmediate">立即购买</el-button>
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
      buyNum:'5',//购买数量
    }
  },
  computed:{
    buyDominPack(){
      this.dialogModel=this.isShow;
      return this.isShow;
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.dialogModel=false;
      this.$emit("buyDominPacModelClose",this.dialogModel)
    },
    //立即购买按钮
    buyImmediate(){
      this.dialogModel=false;
      this.$emit("buyDominPacModelClose",this.dialogModel)
    },
    //监测数量改变、
    handleChange(){

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