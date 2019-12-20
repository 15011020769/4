<template>
  <div>
    <div>
      <el-dialog
        title="选择域名类型"
        :visible.sync="addDominModel"
        width="45%"
        :before-close="handleClose">
        <div>
          <el-radio-group v-model="checkDomin">
            <p class="pDomin"><el-radio :label="1">&nbsp;</el-radio><span class="dominChos"><i>自有域名：</i>使用自己现有备案过的域名</span></p>
            <p><el-radio :label="2">&nbsp;</el-radio><span class="dominChos"><i>域名租赁：</i>若您无自有域名，可付费租赁直播域名供短期使用，租赁需先完成人脸身份核验</span></p>
          </el-radio-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addDominSure">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="添加域名"
        :visible.sync="addDominModel2"
        width="45%"
        :before-close="handleClose1">
        <div class="newClear">
          <div class="newClear conList">
            <p>域名</p>
            <p>
              <el-input class="ipt" placeholder="请填写域名，如：www.test.com"></el-input>
            </p>
          </div>
          <div class="newClear conList">
            <p>类型</p>
            <p>
              <el-select v-model="typeDomin" @change="selectDomin" class="ipt">
                <el-option label="播放域名" value="1"></el-option>
                <el-option label="推流域名" value="2"></el-option>
              </el-select>
            </p>
          </div>
          <div class="newClear conList" v-if="selectChange=='1'?true:false">
            <p>加速区域</p>
            <p>
              <el-select v-model="speedOrign" @change="speedAre" class="ipt">
                <el-option label="中国大陆" value="1"></el-option>
                <el-option label="全球加速" value="2"></el-option>
                <el-option label="中国港澳台地区及海外地区" value="3"></el-option>
              </el-select>
            </p>
          </div>
          <div class="newClear conList" v-if="speedAre1">
            <p><i class="el-icon-warning"></i></p>
            <p class="spe">您正申请开通全球加速，海外直播价格与国内直播价格不同，请知悉。</p>
          </div>
          <div class="newClear conList" v-if="speedAre2">
            <p><i class="el-icon-warning"></i></p>
            <p class="spe">您正申请开通中国港澳台地区及海外地区直播加速，中国大陆的请求将无法解析，请知悉。</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose1">取 消</el-button>
          <el-button type="primary" @click="addDominSure1">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="域名租赁-身份核验"
        :visible.sync="addDominModel3"
        width="45%"
        :before-close="handleClose1">
        <div>
          123131313
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose1">取 消</el-button>
          <el-button type="primary" @click="addDominSure2">确 定</el-button>
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
  computed:{
    addDominModel(){
      return this.isShow
    }
  },
  data(){
    return{
      dialogmodel:'',//弹框
      checkDomin:'',//选择域名类型
      addDominModel2:false,//添加域名
      addDominModel3:false,
      typeDomin:'播放域名',//域名类型
      selectChange:'',//监测select改变的值
      speedOrign:'',//加速区域
      speedAre1:false,//监测加速区域select  全球
      speedAre2:false,//监测加速区域select  全球
    }
  },
  methods:{
    //关闭弹框
    handleClose(){
      this.dialogmodel=false;
      this.$emit("closeAddModel",this.dialogmodel)
    },
    //添加域名确定按钮
    addDominSure(){
      this.dialogmodel=false;
      this.$emit("closeAddModel",this.dialogmodel);
     if(this.checkDomin=='1'){
        this.addDominModel2=true;
        this.addDominModel3=false;
      }else if(this.checkDomin=='2'){
        // this.addDominModel2=false;
        // this.addDominModel3=false;
      }
    },
    //添加域名确定按钮
    addDominSure1(){
      this.addDominModel2=false;
    },
    addDominSure2(){
      this.addDominModel3=false;
    },
    //关闭弹框
    handleClose1(){
      this.addDominModel2=false;
      this.addDominModel3=false;
    },
    //域名类型change事件
    selectDomin(){
      console.log(this.typeDomin)
      this.selectChange=this.typeDomin
    },
    //加速区域change事件
    speedAre(){
      if(this.speedOrign=='2'){
        this.speedAre1=true;
        this.speedAre2=false;
      }else if(this.speedOrign=='3'){
        this.speedAre2=true;
        this.speedAre1=false;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display:block;
  content:'';
  clear:both;
}
::v-deep .el-dialog__title{
  font-size:14px;
  font-weight:600;
}
::v-deep .el-dialog__footer{
  text-align:center;
}
.dominChos{
  font-size:12px;
  color:#999;
  i{
    font-style: normal;
    font-weight: 600;
    color:#000;
  }
}
.pDomin{
  margin-bottom:16px;
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
  }
}
::v-deep input{
  height:30px;
  border-radius: 0;
}
.ipt{
  width:70%;
  input{
    width:100%;
  }
}
.el-icon-warning{
  color:red;
}
.spe{
  font-weight:600;
  font-size:12px;
  color:gray;
}
</style>