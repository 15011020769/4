<template>
  <div>
    <TimeDropDown :TimeArr='TimeArr' v-on:switchData="GetDat" />
  </div>
</template>
<script>
  import TimeDropDown from '@/components/public/TimeDropDown'
  export default {
    data() {
      return {
        TimeArr: [{
            name: '实时',
            Time: 'realTime',
            TimeGranularity: [{
              value: 1,
              label: "1分钟"
            }, {
              value: 5,
              label: "5分钟"
            }]
          },
          {
            name: '近24小时',
            Time: 'Nearly_24_hours',
            TimeGranularity: [{
              value: 1,
              label: "1分钟"
            }, {
              value: 5,
              label: "5分钟"
            }, {
              value: 10,
              label: "1小时"
            }, {
              value: 242,
              label: "1天"
            }]
          },
          {
            name: '近7天',
            Time: 'Nearly_7_days',
            TimeGranularity: [{
              value: 1,
              label: "1小时"
            }, {
              value: 5,
              label: "1天"
            }]
          }
        ]
      }
    },
    components: {
      TimeDropDown
    },
    methods: {
      GetDat(data) {
        console.log(data)
      }
    },
  }

</script>
<style lang="scss" scoped>

</style>
