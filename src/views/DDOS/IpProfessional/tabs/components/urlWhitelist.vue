<template>
  <div id="urlWhitelist">
    <div class="urlWhitelist">
      <div class="urlWhitelistBtn newClear">
        <el-button class="addUrlBtn" @click="addUrlModel">添加URL</el-button>
        <el-button class="exportBtn" @click="importBtn">批量导入</el-button>
        <el-button class="importBtn" @click="exportBtn">批量导出</el-button>
        <el-button :disabled="true">删除</el-button>
        <span class="addTip">最多可以添加50条URL</span>
        <el-radio label="HTTP" v-model="radioHttp" value="1" class="httpRadio" @click="httpClick"></el-radio>
      </div>
      <div class="urlWhitelistTable">
        <div class="tableListUrl">
          <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)" @selection-change="handleSelectionChange" style="width: 100%;margin: 18px 0 20px;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="URL" label="URL" width="">
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
        <addUrlModel :isShow1='dialogModel1' @closeModel1="closeModel1" @addUrlSure="addUrlSure"/>
        <importUrl :isShow2="dialogModel2" @closeModel2="closeModel2" @importUrlSure="importUrlSure"/>
        <exportUrl :isShow3="dialogModel3" @closeModel3="closeModel3"/>
      </div>
    </div>
  </div>
</template>
<script>
import addUrlModel from './model/addUrlModel'
import importUrl from './model/importUrl'
import exportUrl from './model/exportUrl'
export default {
  props: {
    resourceId:'',//资源ID
    ccUrlWhiteList: [], //CC的Url白名单
  },
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
          URL:'11',
          protocol:'11',
          doMin:'111'
        }
      ],
      radioHttp:'http',//默认HTTP
      httpFlag: false,
      dialogModel1:false,//添加URL弹出框
      dialogModel2:false,//批量导入URl弹出框
      dialogModel3:false,//批量导出URl弹出框
    }
  },
  components:{
    addUrlModel:addUrlModel,
    importUrl:importUrl,
    exportUrl:exportUrl
  },
  created() {
    this.tableDataBegin = this.ccUrlWhiteList
  },
  methods:{
    //全选
    handleSelectionChange(val){
      console.log(val)
    },
    // 获取数据
    getData() {
      
    },
    // 1.1.获取CC的Url白名单
    describeCCUrlAllow() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        Id: this.resourceId,
        Protocol: this.httpFlag?'http':'',
        'Type.0': 'white',
      }
      this.axios.post(CC_URLALLOW, params).then(res => {
        console.log(res)
        // this.tableDataBegin = res.Response
      })
      this.httpFlag = false
    },
    // 
    httpClick() {
      this.httpFlag = true
      this.describeCCUrlAllow()
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
    //添加URL按钮
    addUrlModel(){
      this.dialogModel1=true;
    },
    //关闭添加url弹框
    closeModel1(isShow1){
      this.dialogModel1=isShow1
    },
    //添加Utl确定按钮
    addUrlSure(isShow1){
      this.dialogModel1=isShow1
    },
    //批量到入按钮
    importBtn(){
      this.dialogModel2=true;
    },
    //关闭批量导入url弹框
    closeModel2(isShow2){
      this.dialogModel2=isShow2
    },
    //确定批量导入确定按钮
    importUrlSure(isShow2){
      this.dialogModel2=isShow2
    },
    //批量到出按钮
    exportBtn(){
      this.dialogModel3=true;
    },
    //关闭批量导入url弹框
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