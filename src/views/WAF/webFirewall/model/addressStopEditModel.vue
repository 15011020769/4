<template>
  <div>
    <el-dialog
      title="选择封禁地区"
      :visible.sync="addressModel"
      width="45%"
      :before-close="handleClose">
      <div class="newClear">
        <div class="newClear addressList">
          <div class="addreLabel">国内</div>
          <div class="addreIpt">
            <el-radio-group v-model="addressRadio">
              <el-radio label="全部"></el-radio>
              <el-radio label="选择省市自治区"></el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="newClear addressList">
          <div class="addreLabel">请选择</div>
          <div class="addreIpt">
            <el-checkbox-group v-model="addressCheck">
              <el-checkbox v-for="(item,index) in cityLsit" :label="item" :key="index" name="type"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="newClear addressList">
          <div class="addreLabel">国外</div>
          <div class="addreIpt">
            <el-radio-group v-model="addressOutCon">
              <el-radio label="全部"></el-radio>
              <el-radio label="选择国家/地区"></el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <span class="footer">
        <el-button class="sureAddress" @click="sureAddress">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props:{
    isShow:Boolean
  },
  data(){
    return{
      addressModelB:'',//弹框
      addressRadio:'选择省市自治区',//国内
      addressCheck:[],//城市选择
      cityLsit:["北京","天津","河北","澳门","安徽","重庆","福建","广东","广西","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
      addressOutCon:'',//国外
    }
  },
  computed:{
    addressModel(){
      this.addressModelB=this.isShow;
      return this.isShow;
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.addressModelB=false;
      this.$emit("closeAddressModel",this.addressModelB)
    },
    //确定按钮
    sureAddress(){
      this.addressModelB=false;
      this.$emit("closeAddressModel",this.addressModelB)
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:'';
  clear:both;
  display:block;
}
::v-deep .el-dialog__title{
  font-size:14px;
  font-weight: 600;
}
.footer{
  display:inline-block;
  width:100%;
  text-align:center;
  .sureAddress{
    background-color:#006eff;
    color:#fff;
  }
}
.addressList{
  margin-bottom:16px;
  div:nth-child(1).addreLabel{
    float:left;
    width:60px;
    font-size:12px;
  }
  div:nth-child(2).addreIpt{
    float:left;
    width:calc(100% - 60px);
  } 
}
</style>