<template>
  <div>
    <div class="statistReportTit">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">防护配置</h3>
        <el-button class="ReportTitBtn" type="primary">新购</el-button>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="DDoS攻击防护" name="first">
            <div class="mainContent">
              <div class="mainContentInit">

              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="CC防护" name="second">
            
          </el-tab-pane>
          <el-tab-pane label="DDoS高级防护策略" name="third">
            
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
      activeName:"first"
    }
  },
  methods:{
    handleClick(){

    }
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
    padding:0 20px;
  }
}
.mainContent{
  width:100%;
  padding:20px;
  .mainContentInit{
    width:100%;
    min-height:100px;
    background-color:#fff;
    padding:20px;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    border:1px solid #ddd;
  }
}
</style>