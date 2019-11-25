<template>
  <div>
    <div class="newClear">
      <el-button-group class="buttonGroupAll">
        <el-button class="buttonGroup" @click="thisTime(1)">今天</el-button>
        <el-button class="buttonGroup" @click="thisTime(2)">近7天</el-button>
        <el-button class="buttonGroup" @click="thisTime(3)">近15天</el-button>
        <el-button class="buttonGroup" @click="thisTime(4)">近30天</el-button>
        <el-button class="buttonGroup" @click="thisTime(5)">近半年</el-button>
      </el-button-group>
      <el-date-picker
        v-model="timeValue"
        type="daterange"
        class="newDataTime"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div id="myChart">

    </div>
  </div>
</template>
<script>
import moment from 'moment';
export default {
  data(){
    return {
      timeValue:'',
      thisStart:'',
      thisEnd:""
    }
  },
  mounted(){
    this.drawLine();
  },
  methods:{
    //选择时间
    thisTime(thisTime) {
      var ipt1 = document.querySelector(".newDataTime input:nth-child(2)");
      var ipt2 = document.querySelector(".newDataTime input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (thisTime == "1") {
        start.setTime(start.getTime() - 3600 * 1000);
      } else if (thisTime == "2") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      } else if (thisTime == "3") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
      }else if (thisTime == "4") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      }else if (thisTime == "5") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
      }
      //console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),start)
      ipt1.value = moment(start).format('YYYY-MM-DD');
      ipt2.value = moment(end).format('YYYY-MM-DD');
      //this.thisStart=moment(start).format('YYYY-MM-DD');
      //this.thisEnd=moment(end).format('YYYY-MM-DD');
      //this.$emit('timeNode1',[this.thisStart,this.thisEnd])
    },
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        color:["rgb(124, 181, 236)"],
        title: { text: '' },
        tooltip: {},
        xAxis: {
            data: ["11-11","11-12","11-13","11-14","11-15","11-16"]
        },
        yAxis: {
          axisLine:{     //y轴   
            show:false
          },
          axisTick:{       //刻度线 
            show:false
          },
          "splitLine": {     //网格线
            "show": false
          },
          axisLabel:{
            formatter:'{value}bps'
          },
          boundaryGap:true
        },
        series: [{
            name: '攻击流量宽带',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0],
            itemStyle : {    
              normal : {    
                lineStyle:{    
                  color:'rgb(124, 181, 236)'
                }    
              }    
            },    
        }],
        legend:{
          //默认横向布局，纵向布局值为'vertical'
          orient: 'vertical',
          x:'center',      //可设定图例在左、右、居中
          y:'bottom',
          icon: "line",//图例样式
          textStyle: {
            //文字样式
            fontWeight: "bold"
          },
          lineStyle:{    
            color:'rgb(124, 181, 236)'
          } 
        }
      });
    }
  }
}
</script>
<style lang="scss">
.newClear:after{
  clear:both;
  display: block;
  content:"";
}
.buttonGroupAll{
  float:left;
}
.buttonGroup{
  width:66px;
  height:30px;
  border-radius: 0;
  padding:0!important;
  text-align:center;
  line-height: 30px;
  float:left;
}
.buttonGroup:nth-child(1){
  border-radius: 0!important;
}
.buttonGroup:nth-child(5){
  border-radius: 0!important;
}
.newDataTime{
  float:left;
  height:30px!important;
  border-radius: 0!important;
  margin-left:-1px;
  span.el-range-separator{
    line-height:24px;
    width:8%;
  }
  i.el-range__icon{
    line-height:24px;
  }
}
#myChart{
  width:100%;
  height:380px;
  margin:20px 0;
}
</style>