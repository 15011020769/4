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
    <div>
      <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
        <el-table-column prop="attackTime" label="攻击时间"></el-table-column>
        <el-table-column prop="durnTime" label="持续时间"></el-table-column>
        <el-table-column prop="attackType" label="攻击类型"></el-table-column>
        <el-table-column prop="attackStatus" label="攻击状态"></el-table-column>
      </el-table>
    </div>
    <div class="tabListPage">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalItems"
      ></el-pagination>
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
      thisEnd:"",
      tableDataBegin: [],
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      dialogVisible: false,
      deleteIndex: "",
      deleteBegin: {},
      allData: [
        {
          attackTime: "2019-11-25 10:25：25",
          durnTime: "25小时",
          attackType: "攻击类型",
          attackStatus: "攻击状态"
        }
      ],
    }
  },
  created() {
    this.getData()
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
    },
    getData() {
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      let params = {
        // Action: "ListFunctions",
        Version: "2018-04-16",
        Region: arr[1]
      };
      //this.$axios.post('scf/ListFunctions', params).then(res => {
        // console.log(res.data.functions);
        //this.tableDataBegin = res.data.functions;
        this.tableDataBegin = this.allData;
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tableDataBegin.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin;
        }
      //});
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
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