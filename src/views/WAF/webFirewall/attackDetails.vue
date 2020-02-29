<template>
  <div>
    <div class="topTitle">
      {{t('攻击日志', 'WAF.gjrz')}}
    </div>
    <div class="tabList">
      <el-tabs v-model="attackLog">
        <el-tab-pane :label="t('日志查询', 'WAF.rzcx')" name="first">
          <logQuery/>
        </el-tab-pane>
        <el-tab-pane :label="t('下载任务', 'WAF.xzrw')" name="second">
          <downloadTask :active="attackLog"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import logQuery from './tab/logQuery'
import downloadTask from './tab/downloadTask'
export default {
  data(){
    return{
      attackLog:'first',//tab
    }
  },
  components:{
    logQuery:logQuery,//日志查询
    downloadTask:downloadTask,//下载任务
  },
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display:block;
  content:'';
  clear:both;
}
.topTitle{
  width:100%;
  height:50px;
  line-height:50px;
  font-size:16px;
  font-weight: 600;
  padding:0 20px;
  background-color:#fff;
}
.tabList{
  height:40px;
  padding:0 20px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
}
</style>