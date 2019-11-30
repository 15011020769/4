<template>
  <div>
    <div class="contentMain">
      <div class="contentMainList newClear">
        <XTimeX v-on:switchData="GetDat" :classsvalue='value'></XTimeX>
        <div class="echartsShowData newClear">
          <p class="newClear">
            <span><i class="el-icon-info"></i>注释：Max、Min和Avg数值统计为当前折线图内所有点的最大值、最小值和平均值</span>
            <span>导出数据</span>
          </p>
          <div>
            <el-table :data="tableData">
             <el-table-column prop="">
          <template slot-scope="scope">
            <span style="font-size:12px;font-weight:bolder;">
              {{scope.row.MetricName | UpName(value)}}
              <el-popover placement="bottom-start" title="" width="200" trigger="hover">
                <p>{{scope.row.MetricName | UpTitle(value)}}</p>
                <i class="el-icon-warning" slot="reference"></i>
              </el-popover>
            </span>

          </template>
        </el-table-column>
              
              <el-table-column prop="dataPoints" width="600">
                <template slot-scope="scope">
                  <p v-if="scope.row.dataPoints[0]===null"> 暂无数据</p>
                  <div class='echart'
                    v-if="scope.row.dataPoints[0]!==null">
                    <echart-line id="diskEchearrts-line"
                      :time='scope.row.DataPoints[0].Timestamps | UpTime'
                      :opData='scope.row.DataPoints[0].Values'
                      :unit='diskUnit'
                      :title="diskTitle"
                      :period=period
                      :scale=3
                      :xdata=false>
                    </echart-line>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="">
                <template slot-scope="scope">
                  <p>Max:</p>
                  <p>--</p>
                </template>
              </el-table-column>
              <el-table-column prop="">
                <template slot-scope="scope">
                  <p>Min:</p>
                  <p>--</p>
                </template>
              </el-table-column>
              <el-table-column prop="">
                <template slot-scope="scope">
                  <p>Avg:</p>
                  <p>--</p>
                </template>
              </el-table-column>
              <el-table-column
                width="180">
                <template slot-scope="scope">
                  <i class="el-icon-rank"
                    @click="Modality(scope.row.MetricName)">
                  </i>
                  <el-dialog :title="newTitle"
                    :visible.sync="dialogVisible"
                    width="60%"
                    :before-close="handleClose">
                     <XTimeX v-on:switchData="GetDat" :classsvalue='value'></XTimeX>
                     <echart-line id="diskEchearrts-line"
                      class="echart-wh"
                      :time='scope.row.DataPoints[0].Timestamps | UpTime'
                      :opData='scope.row.DataPoints[0].Values'
                      :unit='diskUnit'
                      :period=period
                      :title="diskTitle"
                      :xdata=true>
                    </echart-line>
                  </el-dialog> 
                  <i class="el-icon-menu"
                    @click="posiAbsolu(scope.$index)">
                    <p class="posiAbsolu" v-if="activeIndex===scope.$index?true:false">
                      <span>导出图片</span>
                      <span>导出数据</span>
                    </p>
                  </i>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
 import XTimeX from '@/components/public/TimeX';
import echartLine from '@/components/echars-line'
import { CVM_MONITOR } from '@/constants'
export default {
  data() {
    return {
      ID: this.$route.query.id,
        period: '',
        Start_End: [],
        value: 1,
        dialogVisible: false, // 模态框 （放大后的折线图）
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页数
        totalPage: 0, // 表格数据数组长度
        tableData: [], // 获取列表数据
        timeData: [], // 折线图的x轴数据
        jingData: [],
        MetricName: ''
    };
  },
  components: {
    echartLine,
    XTimeX
  },
  methods: {
    GetDat(data) {
        this.period = data[0];
        this.Start_End = data[1];
        this.value = data[2]
        const metricNArr = [
          'CallNumber',//调用次数
          'RunTime',//运行时间
          'WrongNumber',//错误次数
          'ConcurrentExecution ',//并发执行次数
          'OutgoingNetworkFlow',//外网出流量
          'InternalSystemError',//系统内部错误
          'FunctionError',//函数错误次数
          'RightCall',//正确调用次数
        ];
        this.tableData = []
        for (let i = 0; i < metricNArr.length; i++) {
          this.Obtain(metricNArr[i]);
        }
        if (this.MetricName) {
          this.getModality(this.MetricName)
        }
      },
      Obtain(metricN) {
        const param = {
          Version: '2018-07-24',
          Region: this.$cookie.get('regionv2'),
          Namespace: 'QCE/VBC',
          MetricName: "RegionInPkg",
          'Instances.0.Dimensions.0.Name': 'CcnId',
          'Instances.0.Dimensions.0.Value': this.$route.query.functionName,
          Period: this.period,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme,
        };
        this.axios.post(CVM_MONITOR, param).then((data) => {
          this.tableData.push(data.Response);
        });
      },
      getModality(MetricName) {
        console.log("===========================================================");
        const param = {
          Version: '2018-07-24',
          Region: this.$cookie.get('regionv2'),
          Namespace: 'QCE/VBC',
          MetricName: "RegionInPkg",
          'Instances.0.Dimensions.0.Name': 'CcnId',
          'Instances.0.Dimensions.0.Value': this.$route.query.functionName,
          Period: this.period,
          StartTime: this.Start_End.StartTIme,
          EndTime: this.Start_End.EndTIme,
        };
        console.log(param)
        this.axios.post(CVM_MONITOR, param).then((data) => {
          this.timeData = data.Response.DataPoints[0].Timestamps
          this.jingData = data.Response.DataPoints[0].Values
        });
      },
    handleClose(){
      this.dialogVisible=false;
    },
    Modality(newIndex,allEchartData){
      //console.log(newIndex)
      this.dialogVisible=true;
      this.newTitle=this.tableData[newIndex].name;
      this.MetricName = MetricName
      this.dialogVisible = true;
      this.getModality(this.MetricName)
    },
    posiAbsolu(newIndex1){
      if(this.flag){
        this.activeIndex=newIndex1;
        this.flag=false;
      }else{
        this.activeIndex=-1;
        this.flag=true;
      }
    }
  },
  filters: {
      UpName(value) {
        if (value === 'CallNumber') {
          return (value = '调用次数 次');
        }
        if (value === 'RunTime') {
          return (value = '运行时间 ms');
        }
        if (value === 'WrongNumber') {
          return (value = '错误次数 次');
        }
        if (value === 'ConcurrentExecution') {
          return (value = '并发执行次数 次');
        }
        if (value === 'OutgoingNetworkFlow') {
          return (value = '外网出流量 KB');
        }
        if (value === 'InternalSystemError') {
          return (value = '系统内部错误(HTTP 5xx) 次');
        }
        if (value === 'FunctionError') {
          return (value = '函数错误次数(HTTP 4xx) 次');
        }
        if (value === 'RightCall') {
          return (value = '正确调用次数(HTTP 2xx) 次');
        }
      },
      UpTime(value) {

        let timeArr = []
        for (let i = 0; i < value.length; i++) {
          let uptime = moment(value[i] * 1000).format(
            'YYYY-MM-DD HH:mm:ss',
          );
          timeArr.push(uptime)
        }

        return timeArr
      }
    },
};
</script>
<style lang="scss">
.dataChange{
  margin-right:12px!important;
  margin-left:12px!important;
}
.el-icon-close{
  font-size:20px;
}
.resher{
  float:right;
}
.echartsShowData{
  margin-top:20px;
  p{
    font-size:12px;
    span:nth-child(1){
      float:left;
      color:#bbb;
    }
    span:nth-child(2){
      float:right;
      color:#2d8cf0;
    }
  }
}
.el-icon-rank{
  margin-right:20px;
  font-size:20px;
}
.el-icon-menu{
  font-size:20px;
  .posiAbsolu{
    position:absolute;
    top:42px;
    right:109px;
    width:88px;
    height:50px;
    border:1px solid #ddd;
    text-align:center;
    background-color:#fff;
    color:#888;
    z-index:999;
    span{
      display:inline-block;
      width:100%;
      height:25px;
      line-height: 25px;
      font-size:12px;
      color:#888;
      border-bottom:1px solid #ddd;
    }
    span:nth-child(2){
      color:#888;
    }
  }
  
}
.spanColor{
  color:#ddd;
}
.runningTime2{
  margin-right:20px;
}
</style>