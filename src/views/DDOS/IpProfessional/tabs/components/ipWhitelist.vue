<template>
  <div id="urlWhitelist">
    <div class="urlWhitelist">
      <div class="urlWhitelistBtn newClear">
        <el-button class="addUrlBtn" @click="addIpWhiteModel">添加IP</el-button>
        <el-button class="exportBtn" @click="importBtn">批量导入</el-button>
        <el-button class="importBtn" @click="exportBtn">批量导出</el-button>
        <el-button :disabled="true">删除</el-button>
        <span class="addTip">最多可以添加50条IP</span>
        <el-radio label="HTTP" v-model="radioHttp" value="1" class="httpRadio"></el-radio>
      </div>
      <div class="urlWhitelistTable">
        <div class="tableListUrl">
          <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)" @selection-change="handleSelectionChange" style="width: 100%;margin: 18px 0 20px;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="IP" label="IP" width="">
            </el-table-column>
            <el-table-column prop="protocol" label="协议">
            </el-table-column>
            <el-table-column prop="doMin" label="域名">
            </el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <!-- <el-button type="text" size="small">查看</el-button>
                <el-button type="text" size="small" @click="handelEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button @click.native.prevent="deleteRow(scope.$index, tableDataBegin)" type="text" size="small" style="color: red;">移除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tabListPage">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalItems">
          </el-pagination>
        </div>
        <addIpWhiteModel :isShow1='dialogModel1' @closeModel1="closeModel1" @addIpWhiteSure="addIpWhiteSure"/>
        <importIpWhite :isShow2="dialogModel2" @closeModel2="closeModel2" @importIpWhiteSure="importIpWhiteSure"/>
        <exportIpWhite :isShow3="dialogModel3" @closeModel3="closeModel3"/>
      </div>
    </div>
  </div>
</template>
<script>
import addIpWhiteModel from './model/addIpWhiteModel'
import importIpWhite from './model/importIpWhite'
import exportIpWhite from './model/exportIpWhite'
export default {
  data(){
    return{
      tableDataBegin: [],//表格数据
      tableDataEnd: [],//定义一个数组
      currentPage: 1,//当前页
      pageSize: 10,//每页长度
      totalItems: 0,//总数
      filterTableDataEnd: [],//过滤后的数组
      flag: false,
      allData:[
        {
          IP:'11',
          protocol:'11',
          doMin:'111'
        }
      ],
      radioHttp:'HTTP',//默认HTTP
      dialogModel1:false,//添加IP弹出框
      dialogModel2:false,//批量导入IP弹出框
      dialogModel3:false,//批量导出IP弹出框
    }
  },
  components:{
    addIpWhiteModel:addIpWhiteModel,
    importIpWhite:importIpWhite,
    exportIpWhite:exportIpWhite
  },
  methods:{
    //全选
    handleSelectionChange(val){
      console.log(val)
    },
    // 获取数据
    getData() {
      //this.axios.get('', {}).then((res) => {
        // console.log(res.data.tableData);
        //this.tableDataBegin = res.data.tableData;
        this.allData = this.tableDataBegin;
        console.log(this.tableDataBegin)
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tableDataBegin.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin;
        }
      // })
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
        this.currentChangePage(this.tableDataEnd)
      } else {
        this.currentChangePage(this.filterTableDataEnd)
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
    //添加IP按钮
    addIpWhiteModel(){
      this.dialogModel1=true;
    },
    //关闭添加IP弹框
    closeModel1(isShow1){
      this.dialogModel1=isShow1
    },
    //添加IP确定按钮
    addIpWhiteSure(isShow1){
      this.dialogModel1=isShow1
    },
    //批量到入按钮
    importBtn(){
      this.dialogModel2=true;
    },
    //关闭批量导入IP弹框
    closeModel2(isShow2){
      this.dialogModel2=isShow2
    },
    //确定批量导入确定按钮
    importIpWhiteSure(isShow2){
      this.dialogModel2=isShow2
    },
    //批量到出按钮
    exportBtn(){
      this.dialogModel3=true;
    },
    //关闭批量导入IP弹框
    closeModel3(isShow3){
      this.dialogModel3=isShow3
    },
  }
}
</script>
<style lang="scss">
#urlWhitelist{
  .urlWhitelist{
    margin-top: 10px;
    margin-bottom:10px;
  }
  .urlWhitelistBtn{
    button{
      height:30px;
      border-radius: 0;
      padding:0 20px;
    }
    .addUrlBtn{
      background-color:#006eff;
      color:#fff;
    }
    .addTip{
      color:#8f9297;
      font-size:14px;
      margin-left:25px;
    }
    .httpRadio{
      float:right;
    }
  }
  .urlWhitelistTable{
    margin-top:10px;
    min-height:500px;
    background-color:#fff;
    .tableListUrl{
      min-height:450px;
    }
    .tabListPage{
      height:50px;
      padding-top:8px;
      border-top:1px solid #ddd;
    }
  }
  .httpCheck{
    span:nth-child(1).checkSpan1{
      float:left;
      font-size:12px;
      color:#999;
      width:40px;
    }
    span:nth-child(2).checkSpan2{
      float:left;
      width:calc(100% - 40px);
    }
  }
  .blueTip{
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    margin:16px 0;
  }
  .addUrlBox{
    h3{
      font-size:16px;
      font-weight:100;
      margin:10px 0 16px;
    }
    .tableUrl{
      height:200px;
      overflow: auto;
      table{
        overflow: auto;
        width:100%;
        .bodyCon{
          margin-bottom:12px;
          .inputChange{
            width:85%;
            height:20px!important;
            input{
              width:100%;
              height:20px!important;
            }
          }
        }
      }
    }
    .addNewRowUrl{
      display:inline-block;
      height:30px;
      line-height:30px;
      color:#fff;
      background-color:#006eff;
      width:76px;
      text-align:center;
    }
  }
  .el-dialog__header{
    font-size:14px;
    font-weight:600;
    .el-dialog__title{
      font-size:14px;
      font-weight:600;
    }
  }
  .el-dialog__footer{
    text-align:center;
  }
}
</style>