<template>
  <div>
    <div class="basicProtTit">
      <span>DDoS基础防护</span>
      <el-select v-model="codeOrigin" placeholder="" class="codeOrigin">
        <el-option label="云服务器专区" value="codeOrigin1"></el-option>
      </el-select>
      <el-select v-model="taibei" placeholder=""  class="codeOrigin">
        <el-option label="中国台北" value="taibei"></el-option>
      </el-select>
    </div>
    <div class="basicProtCon">
      <div class="basicProtConSearch">
        <el-input placeholder="请输入主机名/主机IP搜索" class="searchIpt" v-model="tableDataName"/><el-button @click="doFilter" class="el-icon-search"></el-button>
      </div>
      <div>
        <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
          <el-table-column prop="hostName" label="主机名"></el-table-column>
          <el-table-column prop="hostIp" label="绑定IP"></el-table-column>
          <el-table-column prop="hostType" label="主机类型"></el-table-column>
          <el-table-column prop="safeStstus" label="安全状态"></el-table-column>
          <el-table-column prop="hostAction" label="操作" width="180">
            <template slot-scope="">
              <el-button
                type="text"
                size="small"
              >操作</el-button>
              <!-- <el-dialog
                :title="'您确定要删除'+scope.row.funName+'吗？'"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
              >
                <span>删除函数将永久删除函数代码及已绑定的触发器。是否确定删除此函数？</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="sureDelete()">确 定</el-button>
                </span>
              </el-dialog> -->
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
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      codeOrigin:"云服务器专区",
      taibei:"中国台北",
      tableDataBegin: [],
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      filterConrent:"",
      allData:[{
        hostName:"1",
        hostIp:"2",
        hostType:"3",
        safeStstus:"4"
      }],
      dialogVisible:false,
    }
  },
  created() {
    this.getData();
  },
  methods:{
    getData() {
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      console.log(arr[1]);
      let params = {
        // Action: "ListFunctions",
        Version: "2018-04-16",
        Region: arr[1]
      };
      //this.$axios.post('scf/ListFunctions', params).then(res => {
      //console.log(res.data);
      //this.tableDataBegin = res.data.dataTable;
      //this.allData = this.tableDataBegin;
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
        if (val.hostName) {
          if (val.hostName.indexOf(this.tableDataName) == 0||val.hostIp.indexOf(this.tableDataName) == 0) {
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
}
</script>
<style lang="scss">
.newClear:after{
  display: block;
  clear: both;
  content: "";
}
.basicProtTit{
  width:100%;
  height:52px;
  line-height:52px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
  padding:0 20px;
  span{
    font-size:16px;
    font-weight:600;
    margin-right:38px;
  }
  .codeOrigin{
    margin-right:38px;
    border:0;
    input{
      border:0;
    }
  }
}
.basicProtCon{
  width:100%;
  padding:20px;
  .basicProtConSearch{
    text-align:right;
    margin-bottom:20px;
    .searchIpt{
      width:300px;
    }
  }
}
.tabListPage{
  text-align:right
}
</style>