<template>
  <div v-loading="loadShow">
    <div class="topHead">
      <i class="el-icon-back" @click="returnBack"></i>{{this.$route.query.Name}}
    </div>
    <div class="conTabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <div class="wrapper">
            <BasicInfo :Con="allCon"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="推流配置" name="second">
          <div class="wrapper">
            <pushStreamSet/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="模板配置" name="third">
          <div class="wrapper">
            <templateconfig/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import BasicInfo from './tabs/BasicInfo'
import pushStreamSet from './tabs/pushStreamSet'
import templateconfig from './tabs/templateconfig'
export default {
  data(){
    return{
      activeName: 'first',
      loadShow:false,//加载
      allCon:{},//详情内容
    }
  },
  components:{
    BasicInfo:BasicInfo,
    pushStreamSet:pushStreamSet,
    templateconfig:templateconfig
  },
  mounted(){
    console.log(this.$route.query)
    this.allCon=this.$route.query;
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //返回列表页
    returnBack(){
      this.$router.push({
        name:'domainManagement'
      })
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