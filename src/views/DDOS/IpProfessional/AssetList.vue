<template>
  <div id="ipConfigFourth">
    <div class="allContent">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">高防IP专业版</h3>
        <el-select v-model="listResouse">
          <el-option label="资源列表" value="value1"></el-option>
          <el-option label="业务列表" value="value2"></el-option>
        </el-select>
        <el-button class="ReportTitBtn" type="primary">新购</el-button>
      </div>
      <div class="mainContentCenter">
        <div class="textAlignTop newClear">
          <div class="addBgColor"> 
            <el-checkbox-group v-model="comingSoon" class="checkOne">
              <el-checkbox label="即将过期" name="comingSoon"></el-checkbox>
            </el-checkbox-group>
            <span class="runningStatusText">运行状态:</span>
            <el-checkbox-group v-model="sunningStatus"  class="checkTwo">
              <el-checkbox label="运行中" name="type"></el-checkbox>
              <el-checkbox label="清洗中" name="type"></el-checkbox>
              <el-checkbox label="封堵中" name="type"></el-checkbox>
            </el-checkbox-group>
          </div>
          <el-input v-model="tableDataName" class="searchs" placeholder="请输入要查询的内容"></el-input>
          <el-button class="el-icon-search" @click="doFilter"></el-button>
        </div>
        <div class="mainContent newClear">
          <div class="mainTable">
            <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
              <el-table-column prop="canmeId" label="CNAME/ID">
                <template slot-scope="scope">
                  <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.idOrName}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="domain" label="域名"></el-table-column>
              <el-table-column prop="nowIp" label="当前IP"></el-table-column>
              <el-table-column prop="backSelf" label="自动回切"></el-table-column>
              <el-table-column prop="action" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, scope.row)"
                    type="text"
                    size="small"
                  >删除</el-button>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "first",
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
      filterConrent: "",
      allData: [
        {
          canmeId: "1",
          domain: "https",
          nowIp: "10.1.1.212",
          backSelf: "自动回切"
        }
      ],
      listResouse:"业务列表",
      sunningStatus:"",
      comingSoon:""
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    handleClick() {},
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
    // 搜索
    doFilter() {
      console.log(this.filterConrent);
      this.tableDataBegin = this.allData;
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin.forEach((val, index) => {
        if (this.filterConrent == "IP") {
          console.log(typeof val.ip);
          if (val.ip == this.tableDataName) {
            this.filterTableDataEnd.push(val);
            this.tableDataBegin = this.filterTableDataEnd;
          } else {
            this.filterTableDataEnd.push();
            this.tableDataBegin = this.filterTableDataEnd;
          }
        } else if (
          this.filterConrent == "ID" ||
          this.filterConrent == "serverBag"
        ) {
          if (val.idOrName == this.tableDataName) {
            this.filterTableDataEnd.push(val);
            this.tableDataBegin = this.filterTableDataEnd;
          } else {
            this.filterTableDataEnd.push();
            this.tableDataBegin = this.filterTableDataEnd;
          }
        }
      });
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.filterTableDataEnd.length;
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);

      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    openData() {},
    // 分页开始
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
};
</script>
<style lang="scss">
.newClear:after {
  content: "";
  display: block;
  clear: both;
}
#ipConfigFourth {
  .allContent {
    width: 100%;
    // padding: 12px 20px 0;
    .mainContentCenter{
      width:100%;
      padding:0 20px 20px;
    }
    .ReportTit{
      width: 100%;
      height: 50px;
      background-color: #fff;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      line-height: 50px;
      margin-bottom: 20px;
      .ReportTitH3{
        float:left;
        font-size:16px;
        font-weight:600;
        margin-right:20px;
      }
      .ReportTitBtn{
        float:right;
        height:32px;
        line-height: 32px;
        padding:0 20px;
        margin-top:8px;
      }
    }
    .textAlignTop{
      width:655px;
      float:right;
      text-align:right;
      .checkOne{
        float:left;
      }
      .checkTwo{
        float:left;
      }
      span.runningStatusText{
        float:left;
        margin-right:10px;
        margin-left:10px;
      }
      .searchs{
        float:left;
      }
      .el-icon-search{
        float:left;
      }
      .addBgColor{
        width:387px;
        height:36px;
        float:left;
        margin-right:10px;
        background-color:#fff;
        margin-top:2px;
        line-height:18px;
        padding-top:10px;
        .el-checkbox+.el-checkbox{
          margin-left:10px;
        }
      }
    }
  }
}
</style>