<template>
  <div>
    <div>
      <el-dialog
        title="Web应用防火墙套餐升级"
        :visible.sync="packageUpModelShow"
        width="45%"
        :before-close="handleClose">
        <div>
          <div class="newClear packageType">
            <div class="packpageLabel">套餐类型</div>
            <div>
              <el-button-group>
                <el-button class="packageTypeBtn" @click="checkType(1)" :class="thisType=='1'?'addBoderC':''">企业版</el-button>
                <el-button class="packageTypeBtn" @click="checkType(2)" :class="thisType=='2'?'addBoderC':''">旗舰版</el-button>
              </el-button-group>
              <p class="orangeTip">基于AI + 规则双引擎防护；</p>
              <div v-if="thisType=='1'?true:false">
                <p class="pList">包含高级版所有功能；</p>
                <p class="pList">支持链路劫持检测（5个）；</p>
                <p class="pList">支持高级BOT行为管理；</p>
                <p class="pList">支持非标准端口（不限于80,8080,443，8443）定制（10个）；</p>
                <p class="pList">支持HTTP协议级别自定义规则；</p>
                <p class="pList">独享IP防护；</p>
                <p class="pList">支持防御规则优化专家服务；</p>
                <p class="pList">支持1对1售前售后支持；</p>
                <p class="pList">正常业务请求QPS:5000；</p>
                <p class="pList">CC防护峰值QPS:150000；</p>
                <p class="pList">支持一级域名个数:3；</p>
                <p class="pList">支持二级域名个数:30；</p>
                <p class="pList">业务带宽（云外/云内）: 30Mbps/200Mbps；</p>
              </div>
              <div v-if="thisType=='2'?true:false">
                <p class="pList">包含企业版版所有功能；</p>
                <p class="pList">支持链路劫持检测（10个）；</p>
                <p class="pList">支持高级BOT行为管理；</p>
                <p class="pList">支持非标准端口（不限于80,8080,443，8443）定制（20个）；</p>
                <p class="pList">支持泛域名定制；</p>
                <p class="pList">独享IP防护；</p>
                <p class="pList">支持1对1售前售后支持；</p>
                <p class="pList">正常业务请求QPS:10000；</p>
                <p class="pList">CC防护峰值QPS:500000；</p>
                <p class="pList">支持一级域名个数:4；</p>
                <p class="pList">支持二级域名个数:40；</p>
                <p class="pList">业务带宽（云外/云内）: 50Mbps/200Mbps；</p>
              </div>
            </div>
          </div>
          <div class="newClear packageType">
            <div class="packpageLabel">
              费用
            </div>
            <div>
              <p class="totalMoney">24,657.53元</p>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="upgradeImmediately" @click="upgradeImmediately">立即升级</el-button>
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
      thisType:'1',//旗舰版企业版默认选中
    }
  },
  computed:{
    packageUpModelShow(){
      this.dialogModel=this.isShow;
      return this.isShow;
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.dialogModel=false;
      this.$emit("packageUpModelClose",this.dialogModel)
    },
    //立即升级按钮
    upgradeImmediately(){
      this.$emit("packageUpModelClose",this.dialogModel)
    },
    //企业版旗舰版按钮
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
::v-deep button.upgradeImmediately{
  background-color:#ff9700;
  color:#fff;
  border:none;
}
::v-deep button{
  height:30px;
  line-height:30px;
  border-radius: 0;
}
.packageType{
  div:nth-child(1).packpageLabel{
    float:left;
    width:100px;
    color:#999;
    font-size:12px;
  }
  div:nth-child(2){
    float:left;
    width:calc(100% - 100px);
    font-size:12px;
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
  .orangeTip{
    color:#FF9D00;
    margin:16px 0;
  }
  p.pList{
    margin-bottom:7px;
  }
  .totalMoney{
    font-size:24px;
    color:#ff7800;
  }
}
</style>