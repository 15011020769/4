<template>
  <div>
    <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'D'"
      v-on:switchData="GetDat" />

    <EcharS :time='time' :series='series' :period='period' />
  </div>
</template>
<script>
  import TimeDropDown from '@/components/public/TimeDropDown'
  import EcharS from '@/components/public/EcharS'
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
          },
          {
            name: '近15天',
            Time: 'Nearly_15_days',
            TimeGranularity: [{
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
            name: '今天',
            Time: 'Today',
            TimeGranularity: [{
                value: "1099999",
                label: "777777秒"
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
            name: '昨天',
            Time: 'Yesterday',
          },
          {
            name: '近15天',
            Time: 'Nearly_15_days',
            TimeGranularity: [{
                value: "3600",
                label: "1小時"
              },
              {
                value: "86400",
                label: "1天"
              }
            ]
          }, {
            name: '近30天',
            Time: 'Nearly_30_days',
          },
        ],
        time: [1, 2, 3, 4, 5, 6, 7],
        series: [{

            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {

            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
        ],
        period: '10'
      }
    },
    components: {
      TimeDropDown,
      EcharS
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
