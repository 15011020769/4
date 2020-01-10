<template>
  <div class="wrap">
    <h3>{{$t('CSS.appreciation.4')}}{{StartTIme}} 到 {{EndTIme}}{{$t('CSS.appreciation.5')}}</h3>
    <Echart :xAxis="xAxis" :series="series" :legendText="legendText" v-loading="loading"/>
    <div class="table">
      <h3>月度消费量</h3>
      <el-table
        :data="tableData"
        style="width: 100%;margin-top:20px;"
        v-loading="loading"
      >
        <el-table-column prop="time" label="月份"></el-table-column>
        <el-table-column prop="num" label="截图数量（张）"></el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;条</span>
        <el-pagination
          :page-size="pageSize"
          :pager-count="7"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="totalItems"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Echart from "../../components/line";
import { CSS_SCREEN } from "@/constants";
import moment from "moment";
export default {
  name: "tab2",
  data() {
    return {
      tableData: [], //表格数据
      current: 1, //页数
      pageSize: 10, //每页数量
      totalItems: 0, //总条数
      loading: true, //加载状态
      xAxis: [],
      series: [],
      legendText: '截图',
    };
  },
  components: {
    Echart
  },
  props: {
    StartTIme: {
      type: String
    },
    EndTIme: {
      type: String
    }
  },
  created() {
    this.init();
    this.getCharts();
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.current = val;
      this.init();
    },
    //获取表格数据
    init() {
      this.loading = true;
      const params = {
        Version: "2018-08-01",
        Granularity: "Day",
        Zone: "Oversea",
        StartTime : moment().subtract(6, "months").endOf("months").utc().format(),
        EndTime : moment().utc().format(),
      };
      this.axios.post(CSS_SCREEN, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message);
        } else {
          let obj = res.Response.DataInfoList
          var mon = [];
            for (var i = 0; i < obj.length; i++) {
              var repeat = false;
                for (var j = 0; j < mon.length; j++) {
                  if (mon[j].time == obj[i].Time.substring(0,7)) {
                      repeat = true
                      break
                  }
                }
                if (!repeat) {
                  mon.push({time: obj[i].Time.substring(0,7)})
                }
            }
            var monvalue = [];
            var one = 0;
            for(var j = 0; j < mon.length; j++){
              var one = 0;
            for(var i = 0; i < obj.length; i++){
                if(obj[i].Time.substring(0,7) == mon[j].time){
                  one += obj[i].Num;
                }
              }
            monvalue.push({num: one});
            }
            var json_arr = [];
            for (var i = 0; i < mon.length; i++){
              json_arr.push(Object.assign(mon[i],monvalue[i]));
            }
          const brr = json_arr.splice(0,1)
          this.tableData = json_arr.sort((a, b) => new Date(b.time) - new Date(a.time));
          this.totalItems = json_arr.length;
        }
        this.loading = false;
      });
    },
    // 获取图表数据
    getCharts() {
      this.loading = true;
      const axixArr = []
      const seriesArr = []
      const params = {
        Version: "2018-08-01",
        Granularity: "Minute",
        Zone: "Oversea",
        StartTime: moment(this.StartTIme).utc().format(),
        EndTime: moment(this.EndTIme).utc().format(),
      };
      this.axios.post(CSS_SCREEN, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message);
        } else {
          res.Response.DataInfoList.map(v => {
            axixArr.push(moment(v.Time).format('YYYY-MM-DD HH:mm:ss'))
            seriesArr.push(v.Num)
          })
          this.xAxis = axixArr
          this.series = seriesArr
        }
        this.loading = false;
      })
    }
  }
};
</script>

<style scoped lang='scss'>
.wrap {
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
}
</style>