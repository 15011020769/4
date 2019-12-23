<template>
  <div>
    <div>
      <el-dialog
        title="鉴权配置"
        :visible.sync="isShow"
        width="45%"
        :before-close="handleClose">
        <div class="newClear">
          <div class="newClear conList">
            <p>推流鉴权</p>
            <p>
              <el-switch
                v-model="switchvalue"
                active-color="#006eff"
                inactive-color="#ddd">
              </el-switch>
            </p>
          </div>
          <div class="newClear conList">
            <p>主KEY</p>
            <p>
              <el-input v-model="mainKey"></el-input><br/>
              <span>仅支持大写字母，小写字母和数字，最大长度32位。</span>
            </p>
          </div>
          <div class="newClear conList">
            <p>备KEY</p>
            <p>
              <el-input v-model="readyKey"></el-input><br/>
              <span>仅支持大写字母，小写字母和数字，最大长度32位。</span>
            </p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveSet">保存</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow:{
      required: false,
      type: Boolean
    }
  },
  data(){
    return{
      switchvalue:true,//开关
      mainKey:'',//主KEY
      readyKey:'',//备KEY
    }
  },
  methods:{
    //关闭
    handleClose(){
      this.$emit("closeModel",false)
    },
    //保存按钮
    saveSet(){
      this.$emit("closeModel",false)
    }
  }
}
</script>
<style lang="scss" scoped> 
.newClear:after{
  content:"";
  display: block;
  clear:both;
}
::v-deep .el-dialog__title{
  font-size:14px;
  font-weight: 600;
}
::v-deep .el-dialog__footer{
  text-align:center;
}
::v-deep input{
  width:300px;
  height:30px;
  border-radius: 0;
}
.conList{
  margin-bottom:20px;
  p:nth-child(1){
    width:70px;
    float:left;
    color:#999;
    font-size:12px;
  }
  p:nth-child(2){
    float:left;
    width:calc(100% - 70px);
    span{
      color:#999;
      font-size:12px;
    }
  }
}
</style>