<template>
  <div>
    <div class="statistReportTit">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">接入配置</h3>
        <el-button class="ReportTitBtn" type="primary" @click="newBuy">新购</el-button>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="非网站业务" name="first">
            <div class="mainContent">
              <el-input class="mainConListOneIpt" placeholder="请输入要查询的ID或名称"/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName:"first",
    }
  },
  mounted() {
    
  },
  methods:{
    handleClick(){},
    newBuy(){
      this.$router.push({
        path: '/choose'
      })
    },
  }
}
</script>
<style lang="scss">
.newClear{
  content:"";
  display: block;
  clear:both;
}
.statistReportTit{
  width:100%;
  height:84px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
  padding:12px 20px 0;
  .ReportTitH3{
    float:left;
    font-size:16px;
    font-weight:600;
  }
  .ReportTitBtn{
    float:right;
    height:32px;
    line-height: 32px;
    padding:0;
  }
}
.mainContent{
  width:100%;
  min-height:100px;
  background-color:#fff;
  padding:20px;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  border:1px solid #ddd;
  margin-bottom:20px;
  .mainConListOneIpt{
    width:200px;
    input{
      width:200px;
    }
  }
}

</style>