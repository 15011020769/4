<template>
  <div>
    <div class="topTitle">
      攻击日志
    </div>
    <div class="tabList">
      <el-tabs v-model="attackLog" @tab-click="handleClick">
        <el-tab-pane label="日志查询" name="first">
          <logQuery/>
        </el-tab-pane>
        <el-tab-pane label="下载任务" name="second">
          <downloadTask/>
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
  methods:{
    //tab切换
    handleClick(tab, event) {
      console.log(tab, event);
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