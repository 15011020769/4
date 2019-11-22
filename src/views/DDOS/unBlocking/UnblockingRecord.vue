<template>
  <div id="unBlockingRecord">
    <div class="contentTit">
      解封操作记录
    </div>
    <div class="mainContentBlock">
      <div class="contPartOne">
        <el-date-picker
          v-model="timeValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="contPartTwo">
        <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
          <el-table-column prop="ip" label="IP">
            <template slot-scope="scope">
              <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.ip}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="blockingTime" label="封堵时间"></el-table-column>
          <el-table-column prop="unblockTime" label="预计解封时间"></el-table-column>
          <el-table-column prop="unblockType" label="解封操作类型"></el-table-column>
        </el-table>
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
export default {
  data() {
    return {
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      tableDataBegin:[],
      allData:[
        {
          ip:"10.1.1.212",
          blockingTime:"2019-11-19 10:25:52",
          unblockTime:"2019-11-20 10:25:52",
          unblockType:"解封操作类型"
        }
      ],
      timeValue:""
    }
  },
  mounted() {
    this.getData();
  },
  methods:{
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
      //this.$axios.post('', params).then(res => {
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
    }
  }
}
</script>
<style lang="scss">
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

</style>