<template>
  <div class="message-wrap" v-loading="loading">
    <div class="message-header">
      <HeaderCom title="站内信">
        <p>
          （共{{this.TotalCount}}封，其中{{this.TotalCount}}封未读，
          <span>仅查看未读消息</span>）
        </p>
      </HeaderCom>
    </div>
    <div class="message-main">
      <div class="message-fun">
        <div class="message-funLeft">
          <div class="message-btns">
            <el-button @click="delMesg">删除</el-button>
            <el-button @click="changeRead">标记为已读</el-button>
            <el-button @click="AllRead">全部标记为已读</el-button>
          </div>
          <div class="message-btns btnStyle">
            <el-button @click="searchAll">全部</el-button>
            <el-button @click="searchTitle">母云动态</el-button>
            <el-button @click="searchText">运维消息</el-button>
            <el-button @click="searchProduct">产品消息</el-button>
            <el-button @click="searchMsgAq">安全消息</el-button>
          </div>
        </div>
        <div class="message-funRight">
          <div class="search">
            <el-input v-model="inputVal" placeholder="请输入内容" @change="tableInpVal"></el-input>
            <span>
              <i class="el-icon-search" @click="tableSearch"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="meaasge-table">
        <el-table :data="tableData" style="width: 100%" height="450" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="title" label="消息内容" width="180">
              <template slot-scope="scope">
                <el-link @click="detailsMesg(scope.row)" type="primary">{{scope.row.title}}</el-link>
             </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="接收时间" width="180"></el-table-column>
          <el-table-column prop="msgTypeLabel" label="消息类型"></el-table-column>
          <el-table-column prop="channelLabel" label="消息子类型"></el-table-column>
        </el-table>
        <div class="Right-style pagstyle" style="height:70px;">
          <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;条</span>
          <el-pagination
            :page-size="pagesize"
            :pager-count="7"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="TotalCount"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 删除对话框 -->
    <el-dialog
  title="删除"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>删除后消息将无法恢复，您确定要删除吗？</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmDel">确 定</el-button>
  </span>
</el-dialog>
 <!-- 全部改为已读状态弹框 -->
 <el-dialog
  title="确认标记所有已读"
  :visible.sync="MessageDialog"
  width="30%"
  :before-close="handleCloseMsg">
  <span>确认标记所有消息为已读吗？</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="MessageDialog = false">取 消</el-button>
    <el-button type="primary" @click="updataMesg">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import HeaderCom from "@/components/public/Head";
export default {
  name: "message",
  data() {
    return {
      loading:false,
      dialogVisible:false,//删除弹框
      MessageDialog:false,//消息弹框
      TotalCount:0,//分页
      pagesize:10,//分页条数
      currpage:1,//当前页码
      btnIndex: 0, //按钮默认选中
      //按钮数据
      btnData: [
        "全部",
        "运维消息",
        "台富雲动态",
        "产品消息",
        "安全消息",
        "其他消息",
        "财务消息"
      ],
      inputVal: "", //搜索输入的内容
      tableData: [], //表格数据
      getData:[],//获取选中时的数据
      json:[], //搜索数据
      tableAll:[]
    };
  },
  components: {
    HeaderCom
  },
  created(){
     this.init()
  },
  methods: {
   //初始化数据
    init(){
      this.loading = true;
       let params = {
        //  searchForm:this.tableData,
         limit:this.pagesize,
         page:this.currpage
       };
       this.axios.post(`${process.env.VUE_APP_adminUrl}`+"/taifucloud/inmail/list",params).then(res => {
           console.log(res)
           this.tableData = res.data.list
           this.tableAll = res.data.list
           this.json = res.data.list
           this.TotalCount = res.data.totalCount
           this.loading = false
       })
    },
    //批量删除弹框点击确定删除
    confirmDel(){
        var delIndex = [];
        this.getData.forEach(item => {
           delIndex.unshift(item)
        })
        delIndex.forEach(item => {
          let params = [item.id]
           this.axios.delete(`${process.env.VUE_APP_adminUrl}`+"/taifucloud/inmail/delete",{data: params}).then(res=>{
             this.$message('删除成功')
             console.log(res)
             this.init()
           })
        })
        this.dialogVisible = false;
    },
    //搜索input框
    tableInpVal(val){
    if(this.inputVal == ""){
         this.tableData = this.json
         this.TotalCount = this.json.length
       }
    },
    //搜索按钮
    tableSearch(){
      var arr = [];
      this.tableData.forEach(item => {
         if(item.title.includes(this.inputVal)){
              arr.push(item)
         }
      })
      this.tableData = arr
      this.TotalCount = arr.length
      console.log(this.tableData)
    },
    //批量删除消息弹框
    delMesg(){
      if(this.getData.length != 0){
          this.dialogVisible = true
      }else{
         this.$message("请选择数据")
      }
    },
     //多选已读
    changeRead(){
      if(this.getData.length != 0){
         var updata = []
         this.getData.forEach(item => {
            updata.push(item)
         })
         updata.forEach(item => {
            let params = [item.qcloudUin]
            this.axios.put(`${process.env.VUE_APP_adminUrl}`+"/taifucloud/inmail/status/modify",params).then(res=>{
             this.init()
             this.$message('标记成功')
             console.log(res)
            })
         })
     }else{
         this.$message("请选择数据")
      }
    },
    //全部标记为已读显示弹框
    AllRead(){
     this.MessageDialog = true
    },
    //确定全部标记为已读
    updataMesg(){
         this.tableData.forEach(item => {
         console.log(item.qcloudUin)
         let params = [item.qcloudUin]
        this.axios.put(`${process.env.VUE_APP_adminUrl}`+"/taifucloud/inmail/status/modify",params).then(res=>{
            this.init()
            this.$message('标记成功')
            console.log(res)
         })
       })
       this.MessageDialog = false
    },
    //跳转详情
    detailsMesg(val){
     this.$router.push({
        path: "/mesgdetils",
        query: {
          detailsData: val.id
        }
      });
    },
     //对关键字进行搜索
     searchAll(){
        this.init()
     },
    searchTitle(){
       var arr = [];
      this.tableAll.forEach(item => {
         if(item.msgTypeLabel == "母雲動態"){
              arr.push(item)
         }
      })
      this.tableData = arr
      this.TotalCount = arr.length
    },
    searchText(){
      var arr = [];
      this.tableAll.forEach(item => {
         if(item.msgTypeLabel =='運維消息'){
              arr.push(item)
         }
      })
      this.tableData = arr
      this.TotalCount = arr.length
    },
    searchProduct(){
      var arr = [];
      this.tableAll.forEach(item => {
         if(item.msgTypeLabel =='產品消息'){
              arr.push(item)
         }
      })
      this.tableData = arr
      this.TotalCount = arr.length
    },
    searchMsgAq(){
      var arr = [];
      this.tableAll.forEach(item => {
         if(item.msgTypeLabel =='安全消息'){
              arr.push(item)
         }
      })
      this.tableData = arr
      this.TotalCount = arr.length
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
      this.init()
    },
    //点击按钮
    btnClick(index) {
      this.btnIndex = index;
    },
    //多选框
    handleSelectionChange(val){
       this.getData = val;
    },
    //删除弹框x
    handleClose(){
      this.dialogVisible = false;
    },
    //改变未读状态弹框
    handleCloseMsg(){
       this.MessageDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
 .Right-style {
    display: flex;
    justify-content: flex-end;
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
.message-wrap >>> .el-button,
.message-wrap >>> .el-input__inner {
  height: 30px;
  padding-top: 0;
  font-size: 12px;
  line-height: 30px;
  border-radius: 0;
}
.message-wrap {
  .message-header {
    p {
      font-size: 12px;
      font-weight: normal;
      margin: 1px 0 -1px 10px;

      span {
        color: #006eff;
        cursor: pointer;
        line-height: 12px;
      }
      span:hover {
        border-bottom: 1px #006eff solid;
      }
    }
  }
  .message-main {
    padding: 20px;
    box-sizing: border-box;

    .message-fun {
      display: flex;
      height: 65px;

      .message-funLeft {
        flex: 1;
        display: flex;
        flex-direction: column;

        .message-btns {
          flex: 1;
        }
        .btnStyle {
          margin-top: 5px;
        }
        .btnStyle >>> .el-button {
          margin-left: -1px;
        }
        .btnStyle >>> .el-button:nth-child(1) {
          margin-left: 0;
        }
        .btn-active {
          border: 1px #006eff solid;
          color: #006eff;
          position: relative;
          z-index: 100;
        }
      }
      .message-funRight {
        width: 200px;
        display: flex;
        align-items: center;
        .search {
          position: relative;
          width: 100%;

          span {
            height: 30px;
            width: 30px;
            align-items: center;
            justify-content: center;
            display: flex;
            position: absolute;
            top: 0;
            right: 0;
            cursor: pointer;

            i {
              font-size: 14px;
              font-weight: bold;
            }
          }
        }
      }
    }

    .meaasge-table {
      margin-top: 15px;
      background: white;
      .page {
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 20px;
        box-sizing: border-box;
      }
    }
  }
}
</style>