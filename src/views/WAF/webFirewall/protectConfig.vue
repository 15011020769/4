<template>
  <div class="container">
    <div class="editTitle">
      <i class="el-icon-back" @click="backListDomin"></i>防护设置
      <el-select v-model="dominList" class="dominList">
        <el-option v-for="item in dominList" :value="item.value" :label="item.label" :key="item.value"></el-option>
      </el-select>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础设置" name="first">
          <basicSettings/>
        </el-tab-pane>
        <el-tab-pane label="自定义策略" name="second">
          <customStrategy/>
        </el-tab-pane>
        <el-tab-pane label="CC防护设置2.0" name="third">
          <ccProtectSet/>
        </el-tab-pane>
      </el-tabs>
    </div>
    
  </div>
</template>
<script>
import basicSettings from './tab/basicSettings'//基础设置
import customStrategy from './tab/customStrategy'//自定义策略
import ccProtectSet from './tab/ccProtectSet'//cc防护设置2.0
export default {
  data(){
    return{
      dominList:'',//域名列表
      activeName: 'first'
    }
  },
  components:{
    basicSettings,
    customStrategy,
    ccProtectSet,
  },
  methods:{
     //返回域名列表
    backListDomin(){
      this.$router.go(-1)
    },
    //tab点击
    handleClick(){

    }
  }
}
</script>
<style lang="scss" scoped>
.editTitle{
  height:50px;
  // border-bottom:1px solid #ddd;
  padding:0 20px;
  line-height:50px;
  font-size:16px;
  font-weight: 600;
  background-color:#fff;
  .el-icon-back{
    margin-right:12px;
    color:#006eff;
  }
}
::v-deep button{
  height:30px;
  line-height:30px;
  padding:0 16px;
  border-radius: 0;
}
::v-deep input{
  height:30px;
  line-height: 30px;
  border-radius: 0;
}
.dominList{
  margin-left:10px;
}
.tabs{
  width:100%;
  height:40px;
  border-bottom:1px solid #ddd;
  background-color:#fff;
  padding:0 20px;
}
</style>