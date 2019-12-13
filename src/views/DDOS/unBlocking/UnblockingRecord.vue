<template>
  <div id="unBlockingRecord">
    <div class="contentTit">
      解封操作记录
    </div>
    <div class="mainContentBlock">
      <div class="contPartOne">
        <el-date-picker class="dateUnBlock"
          v-model="dateChoice1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="contPartTwo">
        <div class="tableContentUn">
          <el-table :data="IpUnBlockList.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column prop="ip" label="IP">
              <template slot-scope="scope">
                <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.ip}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="blockingTime" label="封堵时间">
              <template slot-scope="scope">
                {{scope.row.BlockTime}}
              </template>
            </el-table-column>
            <el-table-column prop="unblockTime" label="预计解封时间">
              <template slot-scope="scope">
                {{scope.row.UnBlockTime}}
              </template>
            </el-table-column>
            <el-table-column prop="unblockType" label="解封操作类型">
              <template slot-scope="scope">
                {{scope.row.ActionType}}
              </template>
            </el-table-column>
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
    </div>
  </div>
</template>
<script>

import { IPUNBlOCKLIST_LIST } from "@/constants";
export default {
  data(){
    return{
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,

      timeValue:{},
      // 日期区间：默认获取当前时间和前90天时间
      EndTime: this.getDateString(new Date()),
      BeginTime: this.getDateString(new Date(new Date().getTime() - 24*60*60*1000*90)),
       // 日期选择
      dateChoice1: {},
      dateChoice2: {},
      IpUnBlockList:[],
    }
  },
   watch: {
    'dateChoice1': function (value) {
      console.log(this.getDateString(value[0]))
      this.BeginTime = this.getDateString(value[0])
      this.EndTime = this.getDateString(value[1])
      this. describeIpUnBlockList()
    },
   },
   created(){
    this.describeIpUnBlockList();//获取IP解封记录接口
  },
  methods:{
    // 获取IP解封记录
    describeIpUnBlockList() {
      let params = {
        Version: '2018-07-09',
        BeginTime:this.BeginTime,
        EndTime:this.EndTime,
      }
      this.axios.post(IPUNBlOCKLIST_LIST, params).then(res => {
        console.log(params)
        console.log(res)
        this.IpUnBlockList=res.Response.List 
         // 将数据的长度赋值给totalItems
        this.totalItems = res.Response.Total
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.IpUnBlockList;
        }
      })
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

    // 时间格式化'yyyy-MM-dd hh:mm:ss'
    getDateString(date) {
      return date.toLocaleString('zh',{hour12:false, year: 'numeric',  month: '2-digit',  day: '2-digit',  hour: '2-digit',  minute: '2-digit',  second: '2-digit'}).replace(/\//g,'-');
    },
   },
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:"";
  clear:both;
  display:block;
}
.contentTit{
  width:100%;
  height:50px;
  padding:0 20px;
  line-height: 50px;
  border-bottom:1px solid #ddd;
  font-size:16px;
  font-weight:600;
  background-color:#fff;
}
#unBlockingRecord{
  .mainContentBlock{
    width:100%;
    padding:20px;
    .contPartOne{
      width:100%;
      padding: 0 20px 20px 0;
      .dateUnBlock{
        width:340px;
        height:30px;
        border-radius: 0;
        line-height:30px;
        input{
          font-size:12px;
        }
        ::v-deep .el-range-separator{
          line-height: 22px;
          width: 10%;
        }
        ::v-deep .el-range__icon{
          line-height: 26px;
        }
      }
    }
    .contPartTwo{
      width:100%;
      padding:20px;
      background-color:#fff;
      border:1px solid #ddd;
      box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
      min-height:200px;
    }
  }
}
.tableContentUn{
  border-bottom: 1px solid #ddd;
  min-height:450px;
}
.tabListPage{
  height:50px;
  padding-top:16px;
  text-align:right;
}
</style>