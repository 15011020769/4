<template>
  <div>
    <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' v-on:switchData="GetDat" />
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
                value: "10",
                label: "10秒"
              },
              {
                value: "60",
                label: "1分鐘"
              },
              {
                value: "300",
                label: "5分鐘"
              }
            ]
          },
          {
            name: '近24小时',
            Time: 'Nearly_24_hours',
            TimeGranularity: [{
                value: "60",
                label: "1分鐘"
              },
              {
                value: "300",
                label: "5分鐘"
              },
              {
                value: "3600",
                label: "1小時"
              },
              {
                value: "86400",
                label: "1天"
              }
            ]
          },
          {
            name: '近7天',
            Time: 'Nearly_7_days',
            TimeGranularity: [{
                value: "3600",
                label: "1小時"
              },
              {
                value: "86400",
                label: "1天"
              }
            ]
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
