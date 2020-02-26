<template>
  <el-row class="echartsShowSecond">
    <el-col :span="12">
    <h3 class="topfont">
      {{t('攻击来源地域TOP5', 'WAF.gjlydy')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <EBar
      :xAxis="xAxisBarLocal"
      :series="seriesBarLocal"
      :legendText="legendTextBarIp"
      v-if="xAxisBarLocal.length == 0 ? false : true"
    />
    <el-row class="empty" v-else>暂无数据</el-row>
    </el-col>
    <el-col :span="12">
    <h3 class="topfont">
      {{t('攻击来源IP TOP5', 'WAF.gjlyip')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <EBar
      :xAxis="xAxisBarIp"
      :series="seriesBarIp"
      :legendText="legendTextBarIp"
      v-if="xAxisBarIp.length == 0 ? false : true"
    />
    <el-row class="empty" v-else>暂无数据</el-row>
    </el-col>
  </el-row>
</template>
<script>
export default {
  
}
</script>
<style lang="scss" scoped>

</style>