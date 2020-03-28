<template>
  <div class="Monitor">
    <div class="Tips">
      <p>{{$t('SCF.total.hswpzgj')}}<a href="../CM/index.html#/strategy/create"> [前往新增告警]</a>{{$t('SCF.total.whstjcl')}}</p>
    </div>
    <div class="Monitortip">
      <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
        v-on:switchData="GetDat" @switchData2='GetDat2' />
      <p @click="_GetBase">{{$t('SCF.total.sx')}}</p>
    </div>

    <div class="box-dis">
      <p>
        <i class="el-icon-info"></i>{{$t('SCF.total.zs')}}
      </p>
      <div class="exportExcel">
        <el-button size="small" @click="exportExcel" :disabled="TableLoad">{{$t('SCF.total.dc')}}</el-button>
      </div>
    </div>
    <div class="box-table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading='TableLoad'>
        <el-table-column prop width="200">
          <template slot-scope="scope">
            <p>
              <span class='span_1'>{{disName[scope.row.MetricName]}}</span>
              <span class='span_2'>{{Company[scope.row.MetricName]}}</span>
              <el-popover placement="bottom-start" title width="200" trigger="hover">
                <p>{{Tips[scope.row.MetricName]}}</p>
                <i class="el-icon-warning" slot="reference"></i>
              </el-popover>
            </p>
          </template>
        </el-table-column>

        <el-table-column width="550">
          <template slot-scope="scope">
            <p v-if="scope.row.DataPoints[0].Values.length==0">{{$t('SCF.total.zwsj')}}</p>
            <div v-if="scope.row.DataPoints[0].Timestamps.length!=0">
              <echart-line  v-if="Object.keys(Time2).length==0"    :id="scope.row.MetricName + 1" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                :MetricName='disName[scope.row.MetricName]' :Company='Company[scope.row.MetricName]'></echart-line>
              <echartsLineComparsion v-if="Object.keys(Time2).length!='0'" 
              :id="scope.row.MetricName + 1" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                :time2="scope.row.DataPoints2[0].Timestamps | UpTime"
              :opData="scope.row.DataPoints[0].Values" 
              :opData2="scope.row.DataPoints2[0].Values"
              :scale="3" :period="Period" :xdata="false"
              :MetricName='disName[scope.row.MetricName]' :Company='Company[scope.row.MetricName]'
              ></echartsLineComparsion>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Max:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMax}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>
        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Min:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMin}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Avg:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMAvg}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <!-- <a class="a-1" @click="downPng(scope.row)">導出圖片</a> -->
            <a :id="scope.row.MetricName" class="a-1" :download="disName[scope.row.MetricName]"
              @click="downCsvOne(scope.row)">{{$t('SCF.total.dcsj')}}</a>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <div class="box-table" v-show="false">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading='TableLoad' id="exportTable">
        <el-table-column prop width="200">

          <template slot-scope="scope">
            <p>
              <span class='span_1'>{{disName[scope.row.MetricName]}}</span>
              <span class='span_2'>{{Company[scope.row.MetricName]}}</span>
              <el-popover placement="bottom-start" title width="200" trigger="hover">
                <p>{{Tips[scope.row.MetricName]}}</p>
                <i class="el-icon-warning" slot="reference"></i>
              </el-popover>
            </p>
          </template>

        </el-table-column>
        <el-table-column label="日期" width="550">
          <template slot-scope="scope">
            <p v-if="scope.row.DataPoints[0].Values.length==0">{{$t('SCF.total.zwsj')}}</p>
            <div v-if="scope.row.DataPoints[0].Values.length!=0">
              <p v-for="(item,index) in scope.row.DataPoints[0].Timestamps" :key="index">
                {{item | UpTime1}}、
              </p>

            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('SCF.total.sju')" width="550">
          <template slot-scope="scope">
            <p v-if="scope.row.DataPoints[0].Values.length==0">{{$t('SCF.total.zwsj')}}</p>
            <div v-if="scope.row.DataPoints[0].Values.length!=0">
              <p v-for="(item,index) in scope.row.DataPoints[0].Values" :key="index">
                {{item}}、
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Max:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMax}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>
        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Min:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMMin}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p style="font-size:12px;color:#bbb;font-weight:600">Avg:</p>
            <template v-if="scope.row.DataPoints[0].Values.length!==0">
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.DataPoints[0].Values|CMAvg}}</span>
              <span style="color:#333;font-weight:600;font-size: 12px;">{{scope.row.symbol}}</span>
            </template>
            <template v-if="scope.row.DataPoints[0].Values.length==0">-</template>
          </template>
        </el-table-column>

        <el-table-column prop>
          <template slot-scope="scope">
            <p></p>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>
<script>
  import FileSaver from "file-saver";
  import XLSX from "xlsx";
  import moment from "moment";
  import TimeDropDown from './/TimeDropDowncopy' //引入时间组件
  import echartLine from "@/components/public/echars-line"; //引入图标组件
  import echartsLineComparsion from '../echartsline-comparsion'
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import {
    ALL_Basics,
    All_MONITOR
  } from '@/constants'
  import {
    initDownload,
    downloadEchartPic
  } from "@/components/public/derive"
  export default {
    props: ['FunctionVersion'],
    data() {
      return {
        TimeArr: [{
            name: '實時',
            Time: 'realTime',
            TimeGranularity: [{
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
            name: '近24小時',
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
        ],
        functionName: this.$route.query.functionName,
        comparseFlag:false,
        BaseList: [], //全部指标列表
        BaseListK: [], //用到的指标列表
        TableLoad: true,
        Period: '', //粒度
        Time: {}, //监控传递时间
        Time2:{},//数据对比监控传递时间
        MonitorData: [], //监控数据
        tableData: [], // 组合数据
        disName: {
          'Duration': '運行時間',
          'Invocation': '調用次數',
          'Error': '調用錯誤次數',
          'ConcurrentExecutions': '並發執行次數',
          'ConfigMem': '配置記憶體',
          'FunctionErrorPercentage': '函數錯誤率',
          'Http2xx': '正確調用次數',
          'Http432': '資源超過限制',
          'Http433': '函數執行超時',
          'Http434': '記憶體超過限制',
          'Http4xx': '函數錯誤次數',
          'Invocation': '函數調用次數',
          'Mem': '運行記憶體',
          'MemDuration': '時間記憶體',
          'OutFlow': '外網出流量',
          'ServerErrorPercentage': '平台錯誤率',
          'Syserr': '系統內部錯誤次數',
          'Throttle': '函數運行受限次數'

        },
        Company: {
          'Duration': '毫秒(ms)',
          'Invocation': '次',
          'Error': '次',
          'ConcurrentExecutions': '次',
          'ConfigMem': 'MB',
          'FunctionErrorPercentage': '%',
          'Http2xx': '次',
          'Http432': '次',
          'Http433': '次',
          'Http434': '次',
          'Http4xx': '次',
          'Invocation': '次',
          'Mem': 'MB',
          'MemDuration': 'MB/ms',
          'OutFlow': '次',
          'ServerErrorPercentage': '%',
          'Syserr': '次',
          'Throttle': '次'
        },
        Tips: {
          'Duration': '函數運行時間，按粒度（1分鐘、5分鐘）統計求平均值',
          'Invocation': '函數調用次數，按粒度（1分鐘、5分鐘）統計求和',
          'Error': '調用錯誤次數',
          'ConcurrentExecutions': '並發執行次數',
          'ConfigMem': '配置記憶體',
          'FunctionErrorPercentage': '函數錯誤率',
          'Http2xx': '正確調用次數',
          'Http432': '資源超過限制',
          'Http433': '函數執行超時',
          'Http434': '記憶體超過限制',
          'Http4xx': '函數運行錯誤次數，按粒度（1分鐘、5分鐘）統計求和',
          'Invocation': '函數調用次數',
          'Mem': '運行記憶體',
          'MemDuration': '時間記憶體',
          'OutFlow': '外網出流量',
          'ServerErrorPercentage': '平台錯誤率',
          'Syserr': '系統內部錯誤次數',
          'Throttle': '函數運行受限次數'
        },

      }
    },
    components: {
      TimeDropDown,
      echartLine,
      echartsLineComparsion
    },
    watch: {
      // MonitorData(val) {
      //   if (this.MonitorData) {
      //     this.MonitorData.forEach(element => {
      //       this.BaseListK.forEach(item => {
      //         if (item.MetricName === element.MetricName) {
      //           item.DataPoints = element.DataPoints
      //           if(element.DataPoints2){
      //             item.DataPoints2 = element.DataPoints2
      //           }
      //         }
      //       });
      //     });
      //     if (this.BaseListK.length == val.length) {
      //       this.tableData = this.BaseListK
      //       console.log(this.tableData,'this.tableData')
      //       this.TableLoad = false
      //     }
      //   }
      // },
      MonitorData:{
        handler(val){
          if (this.MonitorData) {
           this.MonitorData.forEach(element => {
              this.BaseListK.forEach(item => {
             if(item.MetricName === element.MetricName) {
                  item.DataPoints = element.DataPoints
                  if(element.DataPoints2){
                    item.DataPoints2 = element.DataPoints2
                  }
                }
              });
            });
            if(this.BaseListK.length == val.length){
              this.tableData = this.BaseListK
              console.log(this.tableData,'this.tableData')
              this.TableLoad = false
            }
         } 
        },
        deep:true
      }

    },
    methods: {
      //导出表格
      exportExcel() {
        /* generate workbook object from table */
        var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
        /* get binary string as output */
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], {
              type: "application/octet-stream"
            }),
            "SCF" + ".xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      },
      GetDat(data) {
        console.log(data,'data++++++++++++++++=time')
        this.Period = data[0]
        this.Time ={...data[1]} 
        this._GetBase()
      },
      GetDat2(data){
        console.log(this.Time2,'this.Time2222222222222++++++++++++++++=time')
        this.Time2={...data[1]} 
         this._GetBase()
      },
     
      //获取基础指标详情
      _GetBase() {
        this.TableLoad = true
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/SCF_V2'
        }
        this.axios.post(ALL_Basics, parms).then(res => {
          if (res.Response.Error == undefined) {
            this.BaseList = res.Response.MetricSet
            this.MonitorData = []
            this.BaseListK = []
            console.log(this.Time,'time1')
            console.log(this.Time2,'time2')
            this.BaseList.forEach(item => {
              if (item.Period.indexOf(Number(this.Period)) !== -1) {
                this.BaseListK.push(item)
                this._GetMonitorData(item.MetricName)
                if(Object.keys(this.Time2).length!=0){
                 this._GetMonitorData2(item.MetricName)
                }
              }
            });
          } else {
            this.$message({
              message: ErrorTips[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      //获取监控数据
      _GetMonitorData(MetricName) {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/SCF_V2',
          Period: this.Period,
          StartTime: this.Time.StartTIme,
          EndTime: this.Time.EndTIme,
          MetricName: MetricName,
          'Instances.0.Dimensions.0.Name': 'functionName',
          'Instances.0.Dimensions.0.Value': this.functionName,
          'Instances.0.Dimensions.1.Name': 'version',
          'Instances.0.Dimensions.1.Value': this.FunctionVersion
        }
        console.log(parms,'_GetMonitorData1111111111111111111111111')
        this.axios.post(All_MONITOR, parms).then(data => {
          if (data.Response.Error == undefined) {
            this.MonitorData.push(data.Response);
          } else {
            this.$message({
              message: ErrorTips[data.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      _GetMonitorData2(MetricName) {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/SCF_V2',
          Period: this.Period,
          StartTime: this.Time2.StartTIme,
          EndTime: this.Time2.EndTIme,
          MetricName: MetricName,
          'Instances.0.Dimensions.0.Name': 'functionName',
          'Instances.0.Dimensions.0.Value': this.functionName,
          'Instances.0.Dimensions.1.Name': 'version',
          'Instances.0.Dimensions.1.Value': this.FunctionVersion
        }
         console.log(parms,'_GetMonitorData22222222222222')
        this.axios.post(All_MONITOR, parms).then(data => {
          let arr=[];
          if (data.Response.Error == undefined) {
            this.MonitorData.forEach(item=>{
              if(item.MetricName==data.Response.MetricName){
                 item.DataPoints2 = data.Response.DataPoints
              }
            })
            // return  this.MonitorData
            // this.MonitorData.push(data.Response);
            console.log( this.MonitorData,' this.MonitorDatadata.Response')
          } else {
            this.$message({
              message: ErrorTips[data.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },

      // 单个导出
      downCsvOne(data) {
        if (data.DataPoints[0].Values.length !== 0) {
          let title = { // 表头
            time: '時間',
            data: '數據'
          }
          let dataArr = [] // 表体的数据
          for (let i = 0; i < data.DataPoints[0].Values.length; i++) {
            dataArr.push({
              time: moment((data.DataPoints[0].Timestamps)[i] * 1000).format("YYYY-MM-DD HH:mm:ss"),
              data: data.DataPoints[0].Values[i]
            })
          }
          initDownload(data.MetricName, title, dataArr)
        } else {
          this.$message({
            message: '無數據',
            type: "warning",
            showClose: true,
            duration: 0
          });
        }
      },

    },
    filters: {
      UpTime(value) {
        let timeArr = [];
        for (let i = 0; i < value.length; i++) {
          let uptime = moment(value[i] * 1000).format("YYYY-MM-DD HH:mm:ss");
          timeArr.push(uptime);
        }
        return timeArr;
      },
      UpTime1(value) {

        let uptime = moment(value * 1000).format("YYYY-MM-DD HH:mm:ss");

        return uptime;
      }
    }
  }

</script>
<style lang="scss" scoped>
  .Monitor {
    background: #ffffff;
    margin-top: 20px;
    margin-bottom: 50px;
    border: 1px solid #cccccc;
    -webkit-box-shadow: 0px 3px 3px #c8c8c8;
    -moz-box-shadow: 0px 3px 3px #c8c8c8;
    box-shadow: 0px 3px 3px #c8c8c8;
    padding: 20px;

    .Monitortip {
      display: flex;
      justify-content: space-between;

      p {
        color: #006eff;
        cursor: pointer;
      }
    }

    .Tips {
      padding: 20px;
      margin-bottom: 20px;
      color: #0046b9;
      border-width: 0;
      border-radius: 0;
      background: #d5e7ff;

      a {
        cursor: pointer;
      }
    }

    .box-dis {
      margin-top: 20px;
      color: #ccc;
      font-size: 14px;
    }

    .exportExcel {
      text-align: right;
    }

    .box-table {
      .span_1 {
        font-size: 14px;
        font-weight: bold;
        color: black;
      }

      .span_2 {
        font-size: 12px;
        color: #bbbbbb;
      }

      .a-1 {
        display: block;
        cursor: pointer;
      }
    }
  }

</style>
