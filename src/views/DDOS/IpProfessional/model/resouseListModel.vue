<template>
  <div id="IPprofessionalDetail">
    <div>
      <el-dialog class="modelDetail"
        title="net-0000006y"
        :visible.sync="resouseListShow"
        width="30%"
        :before-close="handleClose">
        <div class="contentDetail">
          <div class="contentDetailTop">
            <h2>基础信息<a href="#">编辑</a></h2>
            <div class="basicInfo">
              <div><span class="basicLabel">资源ID</span><span class="basicIpt">net-0000006y</span></div>
              <div>
                <span class="basicLabel">资源名称</span>
                <span class="basicIpt">789</span>
              </div>
              <div><span class="basicLabel">CNAME</span><span class="basicIpt">	4f7a7511.dayugslb.com</span></div>
              <div><span class="basicLabel">初始区域</span><span class="basicIpt">中国台湾</span></div>
              <div><span class="basicLabel">当前区域</span><span class="basicIpt">中国台湾</span></div>
              <div><span class="basicLabel">当前状态</span><span class="basicIpt">回收中</span></div>
              <div><span class="basicLabel">标签</span><span class="basicIpt">无</span></div>
            </div>
          </div>
          <div class="contentDetailBot">
            <h2>防护信息</h2>
          </div>
        </div>
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
    resouseListShow(){
      return this.isShow
    }
  },
  data(){
    return{
      dialogModel:'',//模态框
    }
  },
  mounted(){
    console.log(this.dialogModel)
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.dialogModel=false;
      this.$emit("closeListDetail",this.dialogModel)
    }
  }
}
</script>
<style lang="scss">
#IPprofessionalDetail{
  .newClear:after{
    display:block;
    content:'';
    clear:both;
  }
  .contentDetailTop{
    h2{
      font-size:14px;
      font-weight:600;
    }
    .basicInfo{
      div{
        margin-bottom:20px;
        font-size:12px;
        span:nth-child(1).basicLabel{
          float:left;
          width:70px;
          color:#999;
        }
        span:nth-child(2).basicIpt{
          float:left;
          width:calc(100% - 70px);
          color:#000;
        }
      }
    }
  }
  .contentDetailBot{
    h2{
      font-size:14px;
      font-weight:600;
    }
  }
  .modelDetail{
    .el-dialog__header{
      font-size:14px;
      font-weight:600;
      .el-dialog__title{
        font-size:14px;
        font-weight:600;
      }
    }
  }
}
  
  
</style>