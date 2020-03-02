<template>
  <div class="overview-wrap">
    <HeadCom title="概览"></HeadCom>
    <div class="app-tke-fe-content__inner">
      <div class="tf-g">
        <el-row>
          <!-- 左边内容 -->
          <el-col >
            <!-- 第一行内容 -->
            <div class="resource-overview">
              <h3 class="font" style="margin-bottom:20px">资源概览</h3>
              <ul class="ro-data-card"  v-loading="shows">
                <li class="ro-data-card-list">
                  <div class="font ">
                    <h3 class="ro-data-card-hd font">集群</h3>
                    <div>
                      <span class="font-big">{{ TotalCount }}</span>
                      <span class="ro-data-card-value">个</span>
                    </div>
                  </div>
                </li>
                <li class="ro-data-card-list" >
                  <div class="font  border-set">
                    <h3 class="ro-data-card-hd font">节点</h3>
                    <div>
                      <span class="font-big">{{ nodeNum }}</span>
                      <span>个（</span>
                      <span class="font-red">异常{{ abnormalNodeNum }}个</span>
                      <span>）</span>
                    </div>
                  </div>
                </li>
                <li class="ro-data-card-list">
                  <div class="font  ">
                    <h5 class="ro-data-card-hd font">工作负载</h5>
                    <div>
                      <span class="font-big">{{ workLoad }}</span>
                      <span>个（</span>
                      <span class="font-red">异常{{ abWorkLoad }}个</span>
                      <el-tooltip content="Pod副本数不符合预期" placement="top">
                        <i
                          style="margin-left:5px"
                          class="data-card-icon el-icon-info"
                        ></i>
                      </el-tooltip>
                      <span>）</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
     <!--  -->
      <div class="chars-wrap">
          <h3>使用统计</h3>
         <el-button size="small"  class="btn" readonly="readonly"  style="margin-top:20px">台湾台北</el-button>
         <div style="margin-top:10px">
             <div class="chartShowTit">
            <el-button-group>
              <el-button v-for="(v,i) in arr" :key="i" @click="selectA(i)" :class="{'addColor':selectIndex==i,'initColor':true}">
                <span>{{v}}</span>
              </el-button>
            </el-button-group>
          </div>
             <TimeDropDown :TimeArr='TimeArr' :Datecontrol='true' :Graincontrol='true' :Difference="'H'"
                v-on:switchData="GetDat" />
            <p class="box-dis">
               <i class="el-icon-info"></i>注釋：Max、Min和Avg數值統計為當前折線圖內所有點的最大值、最小值和平均值
            </p>
            
         </div>
         <div style="margin-top:5px">
            <el-table :data="tableData" style="width: 100%;" :show-header="showHeader" empty-text="暂无数据">
              <el-table-column prop width="150">
                <template slot-scope="scope">
                  <span style="font-size:12px;font-weight:bolder; color:#333;font-weight:600;">
                    {{scope.row.MetricName}}
                    <span class="symbol">{{scope.row.symbol}}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="DataPoints">
                <template slot-scope="scope">
                    {{scope.row.DataPoints}}
                  <!-- <p v-if="scope.row.DataPoints[0].Values.length==0">暂无数据</p>
                  <div class="echart" v-if="scope.row.DataPoints[0].Values.length!=0">
                    <echart-line id="diskEchearrts-line" :time="scope.row.DataPoints[0].Timestamps | UpTime"
                      :opData="scope.row.DataPoints[0].Values" :scale="3" :period="period" :xdata="false">
                    </echart-line>
                  </div> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import TimeDropDown from '@/components/public/TimeDropDown' //引入时间组件
import echartLine from "@/components/public/echars-line"; //引入图标组件
import HeadCom from "@/components/public/Head";
import { TKE_COLONY_LIST, TKE_COLONY_STATUS_JZ,All_MONITOR,ALL_Basics } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "overview",
  data() {
    return {
      isShow: false,
      selectIndex:'',
      shows:true,
      showHeader:false,
      TotalCount: "",
      nodeNum: 0,
      abnormalNodeNum: 0,
      workLoad: 0,
      abWorkLoad: 0,
      clusters: [], //集群
      arr:['CPU使用率','CPU平均负载','内存使用量','内存利用率','TCP连接数'],
     TimeArr: [{
            name: '实时',
            Time: 'realTime',
            TimeGranularity: [{
                value: "5",
                label: "5秒"
              }, {
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
        ],
        MonitorData: [], //监控数据
        BaseList: [], //全部指标列表
        BaseListK: [], //用到的指标列表
        Time: {}, //监控传递时间
        MonitorData: [], //监控数据
        tableData: [], // 组合数据
        period:'',
        Start_End:"",
    };
  },
  components: {
    HeadCom,TimeDropDown,echartLine
  },

  created() {
    this.resourceStatusData();
  },
   watch: {
    //   MonitorData(val) {
    //     if (this.MonitorData) {
    //       this.MonitorData.forEach(element => {
    //         this.BaseListK.forEach(item => {
    //           if (item.MetricName === element.MetricName) {
    //             item.DataPoints = element.DataPoints
    //           }
    //         });
    //       });
    //       console.log(this.BaseListK.length, val.length)
    //       if (this.BaseListK.length == val.length) {
    //         this.tableData = this.BaseListK
    //         console.log(this.tableData)
    //       }
    //     }
    //   }
    },
  methods: {
      GetDat(data) {
         this.Period = data[0]
        this.Time = data[1]
        // this._GetMonitorData('CPUUsage')
      },
      //获取监控数据
      _GetMonitorData(MetricName) {
        let parms = {
          Version: '2018-07-24',
          Region: localStorage.getItem('regionv2'),
          Namespace: 'QCE/BLOCK_STORAGE',
          Period: this.Period,
          StartTime: this.Time.StartTIme,
          EndTime: this.Time.EndTIme,
          MetricName: MetricName,
          'Instances.0.Dimensions.0.Name': 'diskId',
          'Instances.0.Dimensions.0.Value': this.ID,
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
    
    //概览数据
    resourceStatusData() {
      var params = {
        Version: "2018-05-25",
        Region: this.$cookie.get("regionv2"),
        "dimensions.0": "workload",
        "dimensions.1": "node"
      };
      this.axios.post(TKE_COLONY_STATUS_JZ, params).then(res => {
        console.log(res);
        if (res.Error === undefined) {
          var sum = 0,
            absum = 0,
            sum2 = 0,
            absum2 = 0;
          res.data.clusterResourceStatusList.map(val => {
            return val.status.map(v => {
              if (v.dimension == "node") {
                sum += v.total;
                absum += v.abnormal;
              }
              if (v.dimension == "workload") {
                sum2 += v.total;
                absum2 += v.abnormal;
              }
            });
          });
          this.shows=false;
          this.nodeNum = sum;//节点总数
          this.abnormalNodeNum = absum;//异常节点数
          this.workLoad = sum2;//负载总数
          this.abWorkLoad = absum2;//异常负载数
          this.TotalCount = res.data.clusterResourceStatusList.length;//集群数
        }
      });
    },
    show() {
      this.isShow = !this.isShow;
    },
    selectA(index){
        this.selectIndex=index;
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
};
</script>

<style lang="scss" scoped>

.data-card-icon {
  font-size: 10px;
}
.data-card-list {
  margin-left: 20px;
}

.font-big {
  font-size: 36px;
}

.font-red {
  color: #e54545;
}
.app-tke-fe-content__inner {
  max-width: 1360px;
  margin: 0 auto;
  padding: 20px 15px 20px;
}
.tf-g {
  font-size: 0;
  margin-bottom: 16px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.resource-overview {
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
.font {
  font-size: 15px;
  margin-bottom: 20px;
}
.border-set{
  border-left: solid 1px #ddd;
  border-right: solid 1px #ddd;
  padding-left: 20px;
  margin-right: 20px;
}
.ro-data-card {
  display: flex;
  justify-content: space-between;
  margin: -10px 0;
}
.ro-data-card-hd {
  margin: 10px 0;
}
.ro-data-card-list{
  width:33%
}
.chars-wrap{
    padding:20px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    background:white;
    width:100%;
    min-height:400px;
    .btn{
        background:#ECF5FF;
        color:#409eff;
    }
    .box-dis {
      margin-top: 20px;
      color: #ccc;
      font-size: 14px;
    }
  .chartShowTit {
    width: 100%;
    border-bottom: 1px solid #eaeaea;
    height: 35px;
    line-height: 38px;

    button {
      padding: 5px 10px;
      border-bottom: 2px solid transparent;
      margin-right: 20px !important;
      border: none;
      border-radius: 0;

      span {
        font-size: 12px;
        color: #888;
      }
    }
    .initColor{
         border-bottom: 2px solid transparent;
         margin-bottom:10px;
    }
    .addColor {
      border-bottom: 2px solid #006eff !important;
      background-color: transparent;
      font-weight: 600;
      color: #000;
    }
  }
}
</style>
