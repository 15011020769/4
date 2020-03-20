<template>
  <div>
    <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'D'"
      v-on:switchData="GetDat" />

    <EcharS :time='time' :series='series' :period='period' />
    <type v-on:PassData="PassData" :projectId='projectId' :searchParam='searchParam' :productValue='productValue' />
    <div style="width: 600px">
      <Cam></Cam>
    </div>

    <el-button @click="ceshi">dss</el-button>
  </div>
</template>
<script>
  import {
    CREATDASHBORD
  } from "@/constants";
  import TimeDropDown from '@/components/public/TimeDropDown'
  import EcharS from '@/components/public/EcharS'
  import Cam from '@/views/CM/CM_assembly/Cam'
  import type from '@/views/CM/CM_assembly/product_type'
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
        period: '10000',
        shuian: [{
          name: 'Pod重启次数',
          id: 'podid',
          danwei: '(次)',
          y: [2, 244, 52, 52]
        }],
        projectId: 0,
        searchParam: {},
        ceshi999: '',
        productValue: 'nat_tc_stat'
      }
    },
    components: {
      TimeDropDown,
      EcharS,
      Cam,
      type
    },
    created() {
      this.TEST()
    },
    methods: {
      GetDat(data) {
        console.log(data)
        data.forEach(item => {
          this.shuian.forEach(element => {
            if (element.id === item.id && item.podid == element.podid) {
              console.log(item)
              element.y = item.y
            }
          });

        });
      },
      PassData(data) {
        console.log(data)
        this.ceshi999 = data.productValue
        console.log(this.ceshi999)
      },
      TEST() {
        const param = {
          Version: '2018-07-24',
          Region: 'ap-taipei',
          Module: 'monitor',
          DescName: 'bobin9999',
          Namespace: 'qce/cvm',
          DashboardID: '80429',
          Instances: JSON.stringify(["{'regionId':'1','unInstanceId':'ins-ins-6oz38wnu'}"]),
          Meta: {
            "aggregateType": "detail",
            "aggregations": ["Avg", "Max", "Min"],
            "chartTypes": ["column"],
            "configId": "cvm",
            "layout": {
              "h": "5",
              "h2": "0",
              "w": "4",
              "x": "0",
              "y": "0"
            },
            "timeAggregate": "last"
          },
        };

        this.axios.post(CREATDASHBORD, param).then(data => {
          console.log(data)
          if (data.Response.Error == undefined) {

          } else {

          }
        });
      },
      ceshi() {
        this.projectId = '0'
        this.searchParam = {
          value: "ins-6oz38wnu",
          label: "instance-id"
        }
      }
    },
  }

</script>
<style lang="scss" scoped>

</style>
