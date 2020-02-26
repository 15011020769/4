<template>
   <attack-Type
    :seriesPie="seriesPie"
    :colorPie="colorPie"
    :legendTextPie="legendTextPie"
    :seriesPieAttack="seriesPieAttack"
    :legendTextPieAttack="legendTextPieAttack"
  />
</template>
<script>
export default {
  props: {
    times: Array,
    domain: String,
  },
  data() {
    return {
      seriesPie: [
        {value: 0, name: '正常访问'},
        {value: 0, name: 'WEB攻击次数'},
        {value: 0, name: 'CC攻击次数'},
        {value: 0, name: ''},
      ],
      colorPie: ['#006eff', '#434348', '#74BD48', "#F7A35C"],
      legendTextPie: ['正常访问', 'WEB攻击次数', 'CC攻击次数', ''],
      seriesPieAttack: [],
      legendTextPieAttack: [],
    }
  }
}
</script>
<style lang="scss" scoped>

</style>