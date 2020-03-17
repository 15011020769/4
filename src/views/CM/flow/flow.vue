<template>
  <div class="history-wrap">
    <div class="head">
      <Header title="流量监控" />
      <el-tabs v-model="activeName">
        <el-tab-pane label="外网出带宽" name="first">
          <div class="history-main">
            <div class="box">
              <div class="table-top">
                <div class="table_top_head">
                  <div style>
                    <TimeDropDown :TimeArr='TimeArr'  :Datecontrol="true" :Graincontrol="false" v-on:switchData="GetDate" :Difference="'D'" v-if=""></TimeDropDown>
                  </div>
                  <!-- <div class="contrast">
                    <el-button @click="contrast">数据对比</el-button>
                    <span><span>对比</span><span>&times;</span></p>
                  </div> -->
                  <div class="export">
                    <a @click="exportExcel" style="margin-right:10px;">导出数据</a>
                  </div>
                </div>
                <h3>外网出带宽</h3>
                <!-- <div class="echarts" style="width:100%" v-if="Points.length"> -->
                  <!-- <Ecarts/> -->
                   <EcharLine :xdata="true" :time="times" :opData='Points' :period="Period" style="height:300px;width:100%" v-if="times.length"></EcharLine>
                <!-- </div> -->
              </div>
              <h3>报表详情</h3>
              <div class="table">
                <el-table
                  :data="tableData"
                  style="width: 100%"
                  height="450"
                  :default-sort="{prop: 'date', order: 'descending'}"
                  v-loading="loadShow"
                  id='exportTable'
                >
                  <el-table-column prop="times" label="时间" sortable>
                      <template slot-scope="scope">
                        {{scope.row.times}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="Points" label="外出带宽" >
                     <template slot-scope="scope">
                        {{scope.row.Points}}Mbps
                      </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="Right-style pagstyle">
                  <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
                  <el-pagination
                    :page-size="pagesize"
                    :pager-count="7"
                    layout="sizes,prev, pager, next"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="TotalCount"
                  ></el-pagination>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import XTimeX from "@/components/public/TimeN";
import TimeDropDown from "@/components/public/TimeDropDown.vue"
import {All_MONITOR} from "@/constants"
import moment from 'moment';
import EcharLine from '@/components/public/echars-line.vue'
import XLSX from "xlsx";
import FileSaver from "file-saver";
// import Ecarts from "@/components/public/echars-line"
export default {
  name: "history",
  data() {
    return {
      activeName: "first",
      value: 1,
      dialogVisible: false, //购买短信弹出框
      input: "", //搜索框的值
      tableData: [],// table数据
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      StartTime:"",//开始时间
      EndTime:"",//结束时间
      Period:"",// 粒度
      loadShow:true,
      Points:[],//带宽
      times:[],// 时间
      TimeArr: [{
          name: '实时',
          Time: 'realTime',
          TimeGranularity: [
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
          name: '近一天',
          Time: 'Nearly_24_hours',
          TimeGranularity: [
            {
              value: "300",
              label: "5分鐘"
            },
            {
              value: "3600",
              label: "1小時"
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
              label: "24小时"
            }
          ]
        }
      ],
    };
  },
  components: {
    Header,
    TimeDropDown,
    EcharLine
  },
  created() {},
  methods: {
    GetDate(val){
      this.Period = val[0]
      this.StartTime = moment(val[1].StartTIme).format()
      this.EndTime = moment(val[1].EndTIme).format()
      this.loadShow = true
      this.GetMonitor()
      console.log(val)
    },
    //获取数据
    GetMonitor() {
        const param={
          'Dimensions.0.appId': "1300560919",
          EndTime: this.EndTime,
          MetricName: "total_outtraffic",
          Namespace: "qce/lb",
          Period: this.Period,
          StartTime: this.StartTime,
          Version: "2017-03-12",
        }
        this.axios.post(All_MONITOR, param).then(res => {
          let times = new Date(res.Response.StartTime).getTime()
          let Points = res.Response.DataPoints[0].Points
          console.log(new Date(res.Response.StartTime).getTime())
          this.tableData=[]
          this.times=[]
          this.Points=[]
          let table = []
          for(let i in Points){
            if(Points[i]!=null){
              table.push({
                times:moment(times+(this.Period*1000)*i).format("YYYY-MM-DD HH:mm:ss"),
                Points:Points[i]
              })
              this.times.push(moment(times+(this.Period*1000)*i).format("YYYY-MM-DD HH:mm:ss"))
              this.Points.push(Points[i])
            }
          }
          // 分页处理
          for(let j = (this.currpage-1)*this.pagesize ; j <table.length;j++){
              if(j<(this.currpage-1)*this.pagesize+this.pagesize){
                  this.tableData.push(table[j])  
              }
          }
          this.TotalCount = table.length
          this.loadShow = false
        })
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
      this.loadShow = true
      this.GetMonitor()
    },
    //整分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadShow = true
      this.GetMonitor()
    },
     //导出表格
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      console.log(wb)
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
          '1300560919-monitor-data'+ ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    exportImg() {
      //导出图片
      alert("导出图片");
    }
  }
};
</script>

<style lang="scss" scoped>
.history-wrap >>> .header {
  border: 0;
  margin-bottom: -8px;
}
.history-wrap >>> a:hover {
  border-bottom: 1px solid #006eff;
}
.history-wrap >>> .el-tabs__header {
  margin: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
.history-wrap >>> .el-button,
.history-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.history-wrap {
  .head {
    background: white;
  }
  .Right-style {
    display: flex;
    justify-content: flex-end;

    .esach-inputL {
      width: 300px;
      margin-right: 20px;
    }
  }
  .pagstyle {
    padding: 20px;

    .pagtotal {
      font-size: 13px;
      font-weight: 400;
      color: #565656;
      line-height: 32px;
    }
  }
  a {
    color: #006eff;
    cursor: pointer;
  }
  .cursor {
    cursor: pointer;
  }
  .history-main {
    padding: 20px;
    box-sizing: border-box;
    background: #f2f2f2;

    .icons {
      display: flex;
      align-items: center;

      i {
        font-size: 15px;
        color: #666;
        margin-left: 5px;
        cursor: pointer;
        padding: 5px;
        box-sizing: border-box;
      }
      i:hover {
        background: #f2f2f2;
      }
    }

    .box {
      background: white;
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;
    }
    .table-top {
      // border: 1px solid #ccc;
      height: 450px;
      margin-bottom: 10px;
      .table_top_head {
        width: 100%;
        display: flex;
        align-items: center;
        .contrast {
          margin: 23px 10px 0 10px;
          display: flex;
          cursor: pointer;
          span.del {
            font-size: 16px;
          }
        }
        .export {
          // margin-top: 22px;
          margin-left: 15px;
        }
      }
      h3 {
        margin: 20px;
      }
      .echarts {
        border: 1px solid #ccc;
        width: 100%;
        height: 340px;
      }
    }
  }
}
</style>