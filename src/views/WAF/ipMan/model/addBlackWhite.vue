<template>
  <div>
    <div>
      <el-dialog
        title="添加黑白IP"
        :visible.sync="isShow"
        width="45%"
        :before-close="handleClose">
        <div class="newClear">
          <div class="newClear newList">
            <p>类别</p>
            <p>
              <el-radio-group v-model="blackWhiteCh">
                <el-radio label="黑名单"></el-radio>
                <el-radio label="白名单"></el-radio>
              </el-radio-group>
            </p>
          </div>
          <div class="newClear newList">
            <p>IP地址</p>
            <p>
              <el-input  type="textarea" v-model="ipAddress"></el-input>
            </p>
          </div>
          <div class="newClear newList">
            <p>截止日期<i class="required">*</i></p>
            <p>
              <el-date-picker
                class="datatime"
                v-model="datatime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <el-time-select
                class="datatime"
                v-model="timeValue"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                placeholder="选择时间">
              </el-time-select>
            </p>
          </div>
          <div class="newClear newList">
            <p>备注</p>
            <p>
              <el-input class="des" v-model="des"></el-input>
            </p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addSure">添加</el-button>
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
      required:false,
      type:Boolean
    }
  },
  data(){
    return{
      blackWhiteCh:'黑名单',//黑白名单
      ipAddress:'',//ip地址
      datatime:'',//选择日期
      timeValue:'',//选择时间
      des:'',//备注
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.$emit("closeModel",false)
    },
    //确定按钮
    addSure(){
      this.$emit("closeModel",false)
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display: block;
  content:'';
  clear:both;
}
::v-deep .el-dialog__title{
  font-size:14px;
  color:#000;
  font-weight: 600;
}
::v-deep .el-dialog__footer{
  text-align:center;
}
::v-deep textarea{
  width:60%;
  height:100px;
  border-radius: 0;
  resize: none;
}
.newList{
  margin-bottom:20px;
  p:nth-child(1){
    font-size:12px;
    color:#999;
    float:left;
    width:80px;
    .required{
      color:red;
    }
  }
  p:nth-child(2){
    font-size:12px;
    color:#000;
    float:left;
    width:calc(100% - 80px);
  }
}
.datatime{
  width:120px;
  margin-right:16px;
  ::v-deep .el-input__icon{
    line-height: 26px;
  }
}
.des{
  width:60%;
}
</style>