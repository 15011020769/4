<template>
  <div class="Monitor">
    <div class="Monitortip">
      <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
        v-on:switchData="GetDat" />
      <p @click="_GetBase">刷新</p>
    </div>

    <div class="box-dis">
      <p>
        <i class="el-icon-info"></i>{{$t('SCF.total.zs')}}
      </p>
      <div class="exportExcel">
        <el-button size="small" @click="exportExcel" :disabled="TableLoad">導出</el-button>
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
            <div v-if="scope.row.DataPoints[0].Values.length!=0">
              <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                :MetricName='disName[scope.row.MetricName]'></echart-line>
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
            <p @click="kkk"></p>
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
              <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                :opData="scope.row.DataPoints[0].Values" :scale="3" :period="Period" :xdata="false"
                :MetricName='disName[scope.row.MetricName]'></echart-line>
            </div>
            <div v-if="scope.row.DataPoints[0].Values.length!=0">
              <p v-for="(item,index) in scope.row.DataPoints[0].Timestamps" :key="index">
                {{item|UpTime}}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="數據" width="550">
          <template slot-scope="scope">
            <p v-if="scope.row.DataPoints[0].Values.length==0">{{$t('SCF.total.zwsj')}}</p>
            <div v-if="scope.row.DataPoints[0].Values.length!=0">
              <p v-for="(item,index) in scope.row.DataPoints[0].Values" :key="index">
                {{item}}
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
            <p @click="kkk"></p>
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
  import TimeDropDown from '@/components/public/TimeDropDown' //引入时间组件
  import echartLine from "@/components/public/echars-line"; //引入图标组件
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import {
    ALL_Basics,
    All_MONITOR
  } from '@/constants'
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
        BaseList: [], //全部指标列表
        BaseListK: [], //用到的指标列表
        TableLoad: true,
        Period: '', //粒度
        Time: {}, //监控传递时间
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
      echartLine
    },
    watch: {
      MonitorData(val) {
        if (this.MonitorData) {
          this.MonitorData.forEach(element => {
            this.BaseListK.forEach(item => {
              if (item.MetricName === element.MetricName) {
                item.DataPoints = element.DataPoints
              }
            });
          });
          if (this.BaseListK.length == val.length) {
            this.tableData = this.BaseListK
            this.TableLoad = false
          }
        }
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
        this.Period = data[0]
        this.Time = data[1]
        this.TableLoad = true
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
            this.BaseList.forEach(item => {
              if (item.Period.indexOf(Number(this.Period)) !== -1) {
                this.BaseListK.push(item)
                this._GetMonitorData(item.MetricName)
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
      kkk() {

      }

    },
    filters: {
      UpTime(value) {
        let timeArr = [];
        for (let i = 0; i < value.length; i++) {
          let uptime = moment(value[i] * 1000).format("YYYY-MM-DD HH:mm:ss");
          timeArr.push(uptime);
        }
        return timeArr;
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

    .box-dis {
      margin-top: 20px;
      color: #ccc;
      font-size: 14px;
    }

    .exportExcel {
      text-align: right
    }

    .box-table {
      .span_1 {
        font-size: 14px;
        font-weight: bold;
        color: black;
      }

      .span_2 {
        font-size: 12px;
        color: #BBBBBB;
      }
    }
  }

</style>
