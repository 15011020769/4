<template>
  <div>
    <div class="topConTit">
      <span class="titFont">密钥列表</span>
      <span class="taibeiCheck">{{thisAddress}}</span>
    </div>
    <div class="mainContent">
      <div class="mainContBtn newClear">
        <div class="conRightSearch">
          <el-input class="iptSearch" placeholder="支持密钥ID、名称搜索" v-model="tableDataName"></el-input>
          <button class="el-icon-search" @click="doFilter"></button>
        </div>
      </div>
      <div class="tableCoontent">
        <div class="tableList">
          <el-table 
            ref="multipleTable"
            :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="idName" label="密钥ID/密钥名称">
              <template slot-scope="scope">
                <a href="#">{{scope.row.idName.id}}</a><br/>
                <span>{{ scope.row.idName.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="yunProduct" label="云产品"></el-table-column>
            <el-table-column prop="kmsChange" label="密钥轮换">
              <a href="#">启用轮换</a><span class="spanLine">|</span><a href="#">禁用轮换</a>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
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
export default {
  data(){
    return {
      thisAddress:'台湾台北',
      tableDataName:"",
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
      allData:[
        {
          idName:{
            id:"1",
            name:"2"
          },
          yunProduct:"云产品",
          createTime:"创建时间"
        }
      ],
    }
  },
  created() {
    this.getData();
  },
  methods:{
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取全部数据
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
    //搜索
    doFilter() {
      console.log(this.filterConrent);
      this.tableDataBegin = this.allData;
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin.forEach((val, index) => {
          if (val.idName) {
            if (val.idName.id.indexOf(this.tableDataName) == 0||val.idName.name.indexOf(this.tableDataName) == 0) {
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
  content:"";
  clear:both;
}
.topConTit{
  width:100%;
  height:50px;
  line-height:50px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
  padding:0 20px;
  span.titFont{
    font-size:16px;
    font-weight:600;
  }
  span.taibeiCheck{
    width:78px;
    height:22px;
    text-align: center;
    line-height:22px;
    color:#006eff;
    border:1px solid #006eff;
    background-color:#fff;
    margin-left:20px;
    display: inline-block;
  }
}
.mainContent{
  width:100%;
  padding:20px;
  .mainContBtn{
    margin-bottom:20px;
    .conRightSearch{
      float:right;
      .iptSearch{
        width:160px;
        border-right:0;
        border-radius: 0;
        height:30px;
        float:left;
        input.el-input__inner{
          width:160px;
          border-radius: 0;
          font-size:12px;
          height:30px;
          border-right:0;
          :focus{
            border:none;
            outline: none;
          }
        }
      }
      .el-icon-search{
        width:36px;
        border-radius: 0;
        border-left:0;
        background-color:#fff;
        height:30px;
        outline: none;
        border:1px solid #ddd;
        float:left;
      }
    }
  }
}
.mainContent .mainContBtn .conRightSearch .iptSearch input.el-input__inner:focus{
  border: 1px solid #ddd;
  border-right: 0;
  outline: none;
}
.tableCoontent{
  width:100%;
  min-height:200px;
  background-color:#fff;
  border:1px solid #ddd;
  // padding:20px;
  .tableList{
    width:100%;
    min-height: 350px;
    .spanLine{
      margin:0 5px;
      color:#bbb;
    }
    table th:nth-child(4),table td:nth-child(4){
      text-align:center;
    }
  }
  .tabListPage{
    width:100%;
    padding:12px 20px 20px;
    border-top:1px solid #ddd;
    text-align:right;
  }
}
.dialogModel{
  p{
    font-size:12px;
    color:#888;
    line-height:22px;
  }
  .el-dialog__title{
    font-weight:600;
    font-size:14px;
  }
  .el-form-item__label{
    font-size:12px;
    color:#888;
    text-align:left;
  }
  .el-input__inner{
    width:180px;
    height:30px;
    border-radius: 0;
  }
  .el-textarea__inner{
    width:330px;
    height:100px;
    resize: none;
  }
}
</style>