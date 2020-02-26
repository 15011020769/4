<template>
  <el-row class="echartsShowFour">
    <h3 class="topfont">
      {{t('攻击来源区域分布', 'WAF.gjlyqyfb')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <EMap :series="seriesMap" />
  </el-row>
</template>
<script>
export default {
  
}
</script>
<style lang="scss" scoped>

</style>