<template>
  <div>
    <div class="contentMain">
      <div class="contentMainList newClear">
        <div class="newClear">
          <el-button-group class="bthGroup">
            <el-button @click="thisTime(1)">实时</el-button>
            <el-button @click="thisTime(2)">近24小时</el-button>
            <el-button @click="thisTime(3)">近七天</el-button>
          </el-button-group>
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="runningTime">
          </el-date-picker>
          <el-button v-if="dataChange" @click="timeNodeShow" class="dataChange">数据对比</el-button>
          <span v-if="timeNode2">
              对比：
              <el-date-picker
                v-model="value2"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="runningTime2">
              </el-date-picker>
              <i class="el-icon-close" @click="closeTimeNode2"></i>
          </span>
          <span>
            时间粒度：
            <el-select v-model="hourOrDay"> 
              <el-option label="1小时" value="hour"></el-option>
              <el-option label="1天" value="day"></el-option>
            </el-select>
          </span>
          <span class="resher"><a href="#">刷新</a></span>
        </div>
        <div class="echartsShowData newClear">
          <p class="newClear">
            <span><i class="el-icon-info"></i>注释：Max、Min和Avg数值统计为当前折线图内所有点的最大值、最小值和平均值</span>
            <span>导出数据</span>
          </p>
          <div>
            <el-table :data="tableData">
              <el-table-column
                width="270">
                <template slot-scope="scope">
                  <span>{{tableData[scope.$index].name}}</span><span class="spanColor">{{tableData[scope.$index].pre}}</span><i class="el-icon-info"></i>
                </template>
              </el-table-column>
              <el-table-column prop="dataPoints"
                width="600">
                <template slot-scope="scope">
                  <p v-if="scope.row.dataPoints[0]===null"> 暂无数据</p>
                  <div class='echart'
                    v-if="scope.row.dataPoints[0]!==null">
                    <!-- <echart-line id="diskEchearrts-line"
                      :time='timeData'
                      :opData='scope.row.dataPoints'
                      :unit='diskUnit'
                      :title="diskTitle"
                      :period=period
                      :scale=3
                      :xdata=false>
                    </echart-line> -->
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
                    @click="Modality(scope.$index,scope.row.dataPoints)">
                  </i>
                  <el-dialog :title="newTitle"
                    :visible.sync="dialogVisible"
                    width="60%"
                    :before-close="handleClose">
                    <!-- <XTimeX v-on:qiehuan="GetDat"
                      :classsvalue='value'></XTimeX> -->
                      <div class="newClear">
                        <el-button-group class="bthGroup">
                          <el-button @click="thisTime(1)">实时</el-button>
                          <el-button @click="thisTime(2)">近24小时</el-button>
                          <el-button @click="thisTime(3)">近七天</el-button>
                        </el-button-group>
                        <el-date-picker
                          v-model="value1"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          class="runningTime">
                        </el-date-picker>
                        
                        <span v-if="timeNode2">
                            对比：
                            <el-date-picker
                              v-model="value2"
                              type="datetimerange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              class="runningTime2">
                            </el-date-picker>
                        </span>
                        <div class="resher">
                          <span>
                            时间粒度：
                            <el-select v-model="hourOrDay"> 
                              <el-option label="1小时" value="hour"></el-option>
                              <el-option label="1天" value="day"></el-option>
                            </el-select>
                          </span>
                          <span ><a href="#">刷新</a></span>
                        </div>
                      </div>
                    <!-- <echart-line id="diskEchearrts-line"
                      class="echart-wh"
                      :time='timeData'
                      :opData='opDiskData'
                      :unit='diskUnit'
                      :period=period
                      :title="diskTitle"
                      :xdata=true>
                    </echart-line> -->
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
//import XTimeX from '@/components/TimeX'
import echartLine from '@/components/echars-line'
//import { CVM_MONITOR } from '@/constants'
export default {
  data() {
    return {
      value1:'',
      value2:'',
      dataChange:true,
      timeNode2:false,
      hourOrDay:"1小时",
      timeData: [], // 折线图的x轴数据
      period: '',
      diskTitle:"",
      diskUnit:'',
      newTitle:"",
      activeIndex:-1,
      posiAbsoluShow:false,
      flag:true,
      dialogVisible:false,
      tableData:[
        {
          name:"调用次数",
          pre:"次",
          dataPoints:[{}]
        },
        { 
          name:"运行时间",
          pre:"ms",
          dataPoints:[{}]
        },
        {
          name:"错误次数",
          pre:"次",
          dataPoints:[{}]
        },
        {
          name:"并发执行次数",
          pre:"次",
          dataPoints:[{}]
        },
        {
          name:"外网出流量",
          pre:"KB",
          dataPoints:[{}]
        },
        {
          name:"系统内部错误(HTTP 5xx)",
          pre:"次",
          dataPoints:[{}]
        },
        {
          name:"函数错误次数(HTTP 4xx)",
          pre:"次",
          dataPoints:[{}]
        },
        {
          name:"正确调用次数(HTTP 2xx)",
          pre:"次",
          dataPoints:[{}]
        }
      ]
    };
  },
  components: {
    echartLine,
    //XTimeX
  },
  methods: {
    timeNodeShow(){
      this.timeNode2=true;
      this.dataChange=false;
    },
    closeTimeNode2(){
      this.timeNode2=false;
      this.dataChange=true;
    },
    thisTime(thisTime){
      var ipt1=document.querySelector(".runningTime input:nth-child(2)");
      var ipt2=document.querySelector(".runningTime input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if(thisTime=="1"){
        start.setTime(start.getTime() - 3600 * 1000 );
      }
      else if(thisTime=="2"){
        start.setTime(start.getTime() - 3600 * 1000 * 24);
      }
      else if(thisTime=="3"){
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      }
      ipt1.value=start.toLocaleString('chinese',{hour12:false}).replace(/\//g,'-');
      ipt2.value=end.toLocaleString('chinese',{hour12:false}).replace(/\//g,'-')
    },
    handleClose(){
      this.dialogVisible=false;
    },
    Modality(newIndex,allEchartData){
      //console.log(newIndex)
      this.dialogVisible=true;
      this.newTitle=this.tableData[newIndex].name;
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
  }
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