<template>
  <div class="log-management-wrap">
    <HeaderCom title="日志分析" />
    <div class="log-management-main">
      <el-tabs v-model="activeName" class="tabs-wrap">
          <el-tab-pane label="实时日志分析" name="first">
            <div class="wrapper">
              <Analyze/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="日志下载" name="second">
            <div class="wrapper">
              <Download/>
            </div>
          </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import HeaderCom from "@/components/public/Head"
import Analyze from './tab/analyze'
import Download from './tab/download'
export default {
  name:'logManagement',
  components: {
    Analyze,
    Download,
    HeaderCom
  },
  data(){
    return{
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped>
.log-management-wrap {
  .tabs-wrap >>> .el-tabs__nav-scroll {
    background: #fff;
  }
  .log-management-main {
    // background-color: black;
  }
  .log-management-main >>> .el-tabs {
    background: yellow;
  }
}
</style>