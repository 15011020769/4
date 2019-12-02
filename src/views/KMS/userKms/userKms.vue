<template>
  <div>
    <div class="topConTit">
      <span class="titFont">密钥列表</span>
      <span class="taibeiCheck">{{thisAddress}}</span>
    </div>
    <div class="mainContent">
      <div class="mainContBtn newClear">
        <div class="conLeftBtn">
          <el-button @click="dialogVisible = true">新建</el-button>
          <el-button :disabled="isHaveDisable">启用密钥</el-button>
          <!-- <el-button :disabled="false" v-if="!isHaveDisable">启用密钥</el-button> -->
          <el-button :disabled="isHaveEnable">禁用密钥</el-button>
          <!-- <el-button :disabled="false" v-if="!isHaveEnable">禁用密钥</el-button> -->
        </div>
        <el-dialog class="dialogModel" title="新建密钥" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
          <el-form :model="createForm" label-width="100px">
            <el-form-item label="密钥名称">
              <el-input v-model="createForm.name"></el-input>
              <p>最长可输入60个字符，不可为空，请使用字母、数字及字符“_”和“-”，首字符必须为字母或者数字，且不能用 KMS- 开头。</p>
            </el-form-item>
            <el-form-item label="描述信息">
              <el-input v-model="createForm.discription" type="textarea" />
              <p>最长可输入1024个字符</p>
            </el-form-item>
            <el-form-item label="密钥材料来源">
              <el-radio-group v-model="createForm.resource">
                <el-radio label="KMS"></el-radio>
                <el-radio label="外部"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureNewCreate">确 定</el-button>
          </span>
        </el-dialog>
        <div class="conRightSearch">
          <el-input class="iptSearch" placeholder="支持密钥ID、名称搜索" v-model="tableDataName"></el-input>
          <button class="el-icon-search" @click="doFilter"></button>
        </div>
      </div>
      <div class="tableCoontent">
        <div class="tableList">
          <el-table ref="multipleTable" :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)" tooltip-effect="dark" style="width: 100%" 
          @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" @click="checkedIsTrue"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="KeyId" label="密钥ID/密钥名称">
              <template slot-scope="scope">
                <a href="#" @click="todoDetails(scope.row)">{{scope.row.KeyId}}</a><br />
                <span>{{ scope.row.Alias}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="KeyState" label="状态">
              <template slot-scope="scope"> 
                <span :style="scope.row.KeyState=='Disabled'||scope.row.KeyState=='PendingDelete'||scope.row.KeyState=='PendingImport'?'color:#ff9d00':'color:#000'">{{filterState(scope.row.KeyState)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{timestampToTime(scope.row.CreateTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Origin" label="密钥来源">
              <template slot-scope="scope"> 
                <span>{{filterKey(scope.row.Origin)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="kmsChange" label="密钥轮换">
              <template slot-scope="scope">
                <a href="#" class="aColorGree" :style="scope.row.KeyState=='PendingDelete'||scope.row.KeyState=='PendingImport'||changeStatus!=='启用轮换'?'pointer-events:none':'color:#006eff'" 
                @click="startChange(scope.row,$event)">启用轮换</a>
                <span class="spanLine">|</span>
                <a href="#" class="aColorGree" :style="scope.row.KeyState=='PendingDelete'||scope.row.KeyState=='PendingImport'||changeStatus=='启用轮换'?'pointer-events:none':'color:#006eff'" 
                @click="startChange(scope.row,$event)">禁用轮换</a>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" class="action">
              <template slot-scope="scope">
                <a href="#" class="aColorGree" :style="scope.row.KeyState=='Enabled'||scope.row.KeyState=='PendingDelete'||scope.row.KeyState=='PendingImport'?'pointer-events:none':'color:#006eff'"
                @click="startKms(scope.row,$event)">启用密钥</a>
                <span class="spanLine">|</span>
                <a href="#" class="aColorGree" :style="scope.row.KeyState=='Disabled'||scope.row.KeyState=='PendingDelete'||scope.row.KeyState=='PendingImport'?'pointer-events:none':'color:#006eff'"
                @click="startKms(scope.row,$event)">禁用密钥</a><br />
                <a href="#" class="aColorGree" :style="scope.row.KeyState=='PendingDelete'?'pointer-events:none':'color:#006eff'"
                @click="openDelete(scope.row,$event)">计划删除</a>
                <span class="spanLine">|</span>
                <a href="#" class="aColorGree" :style="scope.row.KeyState=='PendingDelete'?'color:#006eff':'pointer-events:none'"
                @click="openDelete(scope.row,$event)">取消删除</a>
              </template>
            </el-table-column>
          </el-table>
          <stopChange 
          :isShow="dialogModelChange" 
          :content="doalogModelBox"
           @parentByClick="childrenShow" 
           @startSure="startSure"
           @stopSure="stopSure"/>
           <startKms 
          :isShow="dialogModelKms" 
          :content="doalogModelBox1"
           @parentByClick="childrenShow1"
           @startKmsSure="startKmsSure"
           @stopKmsSure="stopKmsSure"/>
           <openDelete 
          :isShow="dialogModelDelete" 
          :content="doalogModelBox2"
           @parentByClick="childrenShow2"
           @openDeleteSure="openDeleteSure"
           @closeDeleteSure="closeDeleteSure"/>
        </div>
        <el-dialog
          class="dialogModel"
          title="计划删除密钥"
          :visible.sync="dialogModelOpenDelete"
          width="30%"
          :before-close="handleCloseOpenDelete">
          <p class="deleteOpen">请先对密钥进行禁用操作！</p>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogModelOpenDelete = false">取 消</el-button>
            <el-button type="primary" @click="dialogModelOpenDelete = false">确 定</el-button>
          </span>
        </el-dialog>
        <div class="tabListPage">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalItems"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import stopChange from './stopChange'
import startKms from './startKms'
import openDelete from './openDelete'
export default {
  data() {
    return {
      thisAddress: '中国台北',
      tableDataName: "",
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
      dialogVisible: false,//新建模态框
      allData: [
        {
          KeyId:"1235468165",
          Alias:"222",
          KeyState:"已启用",
          CreateTime:"5696523658",
          Origin:"外部"
        }
      ],
      createForm: {
        name: "",
        discription: "",
        resource: ""
      },//
      isHaveDisable:true,// 启用密钥 是否有已禁用
      isHaveEnable:true,// 禁用密钥 是否有已启用
      changeStatus:'启用轮换',//轮换状态默认为启用轮换
      doalogModelBox:[],//启用轮换内容框
      doalogModelBox1:[],//启用密钥内容框
      doalogModelBox2:[],//计划删除框
      dialogModelChange:false,//是否启用轮换弹框
      dialogModelKms:false,//是否启用密钥弹框
      dialogModelDelete:false,//是否计划删除
      dialogModelOpenDelete:false,//计划删除如果是已启用时候的弹框
    }
  },
  components:{
    stopChange:stopChange,
    startKms:startKms,
    openDelete:openDelete
  },
  filters: {
     
  },
  created() {
    this.getData();
  },
  methods: {
    //判断是否有已禁用，已启用
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // this.multipleSelection.map(item => {
      //   console.log(item)
      //   if(item.KeyState == "Enabled"){
      //      this.isHaveEnable=false;
      //   }else if(item.KeyState == "Disabled"){
      //     this.isHaveDisable=false;
      //   }
      // })
    },
    ////判断是否选中checkbox
    checkedIsTrue(e){
      console.log(e)
    },
    handerChange(){
      console.log(111)
    },
    //获取主密钥列表
    getData() {
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',

      };
      // this.$axios.post('kms2/ListKeys', params).then(res => {

      // });
      //获取主密钥列表详情
      this.$axios.post('kms2/ListKeyDetail', params).then(res => {
            var DataList = res.Response.KeyMetadatas
            this.tableDataBegin = DataList;
            this.allData = DataList
            // 将数据的长度赋值给totalItems
            this.totalItems = this.tableDataBegin.length;
            if (this.totalItems > this.pageSize) {
              for (let index = 0; index < this.pageSize; index++) {
                this.tableDataEnd.push(this.tableDataBegin[index]);
              }
            } else {
              this.tableDataEnd = this.tableDataBegin;
            }
            
         });
    },
    //搜索
    doFilter() {
      console.log(this.filterConrent);
      this.tableDataBegin = this.allData;
      //this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin.forEach((val, index) => {
        if (val.KeyId) {
          if (val.KeyId.indexOf(this.tableDataName) == 0 || val.Alias.indexOf(this.tableDataName) == 0) {
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
    },
    handleClose() {
      this.dialogVisible = false;
    },
    //计划删除如果是已启用时候的弹框关闭按钮
    handleCloseOpenDelete(){
      this.dialogModelOpenDelete=false;
    },
    //新建确定按钮
    sureNewCreate() {
      let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',
        Alias: this.createForm.name
      };
      this.$axios.post('kms2/CreateKey', params).then(res => {
        // console.log(res.Response);
        this.getData()
        this.dialogVisible = false
      });
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() + ':';
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    //状态处理
    filterState(state){
       if (state == 'Enabled') {
          state = '已启用'
        } else if (state == 'PendingImport') {
          state = '待导入'
        } else if (state == 'Disabled') {
          state = '已禁用'
        }
        return state;
    },
    //状态处理
    filterKey(state){
       if (state == 'EXTERNAL') {
          state = '外部'
        } else if (state == 'TENCENT_KMS') {
          state = 'KMS'
        } 
        return state;
    },
    //跳转详情页
    todoDetails(projeatRow){
      console.log(projeatRow)
      let params={
        Alias:projeatRow.Alias,
        CreateTime:this.timestampToTime(projeatRow.CreateTime),
        KeyId:projeatRow.KeyId,
        KeyState:this.filterState(projeatRow.KeyState),
        Origin:this.filterKey(projeatRow.Origin),
        address:this.thisAddress
      }
      sessionStorage.setItem("projectId", JSON.stringify(params));
      this.$router.push({
        name:"userKmsDetails"
      })
    },
    //启用轮换
    startChange(scopeRow,e){
      this.dialogModelChange=true;
      let params=[scopeRow.Alias,scopeRow.KeyId,e.target.innerHTML]
      this.doalogModelBox=params;
    },
    //是否启动密钥服务
    startKms(scopeRow,e){
      this.dialogModelKms=true;
      let params=[scopeRow.Alias,scopeRow.KeyId,e.target.innerHTML]
      this.doalogModelBox1=params;
    },
    //是否计划删除
    openDelete(scopeRow,e){
      console.log(scopeRow)
      if(scopeRow.KeyState=="Enabled"){
        this.dialogModelOpenDelete=true;
      }else{
        this.dialogModelDelete=true;
        let params=[scopeRow.Alias,scopeRow.KeyState,e.target.innerHTML]
        this.doalogModelBox2=params;
      }
    },
    //轮换弹框消失
    childrenShow(trueOrFalse){
      this.dialogModelChange=trueOrFalse
    },
    //启动轮换确定按钮
    startSure(sureShow){
      this.dialogModelChange=sureShow
    },
    //禁用轮换确定按钮
    stopSure(sureShow){
      console.log("禁用")
      this.dialogModelChange=sureShow
    },
    //轮换弹框消失
    childrenShow1(trueOrFalse){
      this.dialogModelKms=trueOrFalse
    },
    //启用密钥确定按钮
    startKmsSure(sureShow){
      this.dialogModelKms=sureShow
    },
    //禁用密钥确定按钮
    stopKmsSure(sureShow){
      this.dialogModelKms=sureShow
    },
    //计划删除弹框消失
    childrenShow2(trueOrFalse){
      this.dialogModelDelete=trueOrFalse
    },
    //计划删除确定按钮
    openDeleteSure(deleteShow){
      this.dialogModelDelete=deleteShow
    },
    //取消删除确定按钮
    closeDeleteSure(deleteShow){
      this.dialogModelDelete=deleteShow
    }
  }
}
</script>
<style lang="scss">
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.topConTit {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  span.titFont {
    font-size: 16px;
    font-weight: 600;
  }
  span.taibeiCheck {
    width: 78px;
    height: 22px;
    text-align: center;
    line-height: 22px;
    color: #006eff;
    border: 1px solid #006eff;
    background-color: #fff;
    margin-left: 20px;
    display: inline-block;
  }
}
.mainContent {
  width: 100%;
  padding: 20px;
  .mainContBtn {
    margin-bottom: 20px;
    .conLeftBtn {
      float: left;
      button {
        height: 30px;
        border-radius: 0;
        line-height: 30px;
        padding: 0 20px;
        border: 1px solid #ddd;
      }
      button:nth-child(1) {
        background-color: #006eff;
        color: #fff;
        border: 1px solid #006eff;
      }
    }
    .conRightSearch {
      float: right;
      .iptSearch {
        width: 160px;
        border-right: 0;
        border-radius: 0;
        height: 30px;
        float: left;
        input.el-input__inner {
          width: 160px;
          border-radius: 0;
          font-size: 12px;
          height: 30px;
          border-right: 0;
          :focus {
            border: none;
            outline: none;
          }
        }
      }
      .el-icon-search {
        width: 36px;
        border-radius: 0;
        border-left: 0;
        background-color: #fff;
        height: 30px;
        outline: none;
        border: 1px solid #ddd;
        float: left;
      }
    }
  }
}
.mainContent
  .mainContBtn
  .conRightSearch
  .iptSearch
  input.el-input__inner:focus {
  border: 1px solid #ddd;
  border-right: 0;
  outline: none;
}
.tableCoontent {
  width: 100%;
  min-height: 200px;
  background-color: #fff;
  border: 1px solid #ddd;
  // padding:20px;
  .tableList {
    width: 100%;
    min-height: 350px;
    .spanLine{
      margin:0 5px;
      color:#bbb;
    }
    table th:nth-child(7),
    table td:nth-child(7),
    table th:nth-child(6),
    table td:nth-child(6) {
      text-align: center;
    }
  }
  .tabListPage {
    width: 100%;
    padding: 12px 20px 20px;
    border-top: 1px solid #ddd;
    text-align: right;
  }
}
.dialogModel {
  p {
    font-size: 12px;
    color: #888;
    line-height: 22px;
  }
  p.deleteOpen{
    font-size:14px;
    font-weight:600;
    color:#000;
  }
  .el-dialog__title {
    font-weight: 600;
    font-size: 14px;
  }
  .el-form-item__label {
    font-size: 12px;
    color: #888;
    text-align: left;
  }
  .el-input__inner {
    width: 180px;
    height: 30px;
    border-radius: 0;
  }
  .el-textarea__inner {
    width: 80%;
    height: 100px;
    resize: none;
  }
}
.aColorGree{
  color:#999;
}
</style>