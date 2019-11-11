<template>
  <div>
   <div class="appIdTit">
     <div class="topTit newClear">
       <span>APPID列表</span>
       <span><a href="#">验证码服务使用帮助<i class="el-icon-share"></i></a></span>
     </div>
     <div class="appIdListCon">
       <el-tabs class="allTabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="APPID列表" name="first">
          <div class="allConListMain">
            <div class="allButton">
              <el-button type="primary">新建验证</el-button>
              <el-button>导入原有验证</el-button>
              <el-button>领取免费包</el-button>
            </div>
            <div></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="套餐包管理" name="second">
          <div>
            6464646464646446464
          </div>
        </el-tab-pane>
      </el-tabs>
     </div>
   </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first'
    }
  },
  methods:{
    handleClick(tab, event) {
        console.log(tab, event);
      }
  }
}
</script>

<style scoped lang="scss">
.newClear:after{
  clear:both;
  display:block;
  content:"";
}
.appIdTit{
  width:100%;
  padding:20px 20px 0;
  background-color:#fff;
  height:90px;
  .topTit{
    span:nth-child(1){
      float:left;
      font-size:16px;
      font-weight:600;
    }
    span:nth-child(2){
      float:right;
    }
  }
}
.allTabs{
  margin-top:13px;
  .allConListMain{
    padding:20px;
  }
}

</style>
