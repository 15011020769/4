<template>
  <div>
    <div class="topHead">
      <i class="el-icon-back"></i>1345645646
    </div>
    <div class="conTabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <div class="wrapper">
            <BasicInfo/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="推流配置" name="second">
          <div class="wrapper">

          </div>
        </el-tab-pane>
        <el-tab-pane label="模板配置" name="third">
          <div class="wrapper">

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import BasicInfo from './tabs/BasicInfo'
export default {
  data(){
    return{
      activeName: 'first'
    }
  },
  components:{
    BasicInfo:BasicInfo
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
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
.topHead{
  width:100%;
  height:50px;
  background-color:#fff;
  line-height: 50px;
  padding:0 20px;
  font-size:16px;
  font-weight: 600;
  .el-icon-back{
    margin-right:40px;
    font-size:24px;
    color:#006eff;
  }
}
.conTabs{
  width:100%;
  height:40px;
  background-color:#fff;
  padding:0 20px;
  border-bottom:1px solid #ddd;
}
.wrapper{
  width:100%;
}
</style>