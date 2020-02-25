<template>
  <div class="message-wrap">
    <div class="message-header">
      <HeaderCom title="站内信">
      </HeaderCom>
    </div>
    <div class="message-main">
      <div class="message-fun">
        <div class="message-funLeft">
          <div class="message-btns">
            <el-button @click="delMesg">{{$t('MGC.sc')}}</el-button>
            <el-button @click="changeRead">{{$t('MGC.bjyd')}}</el-button>
            <el-button @click="AllRead">{{$t('MGC.qbbjyd')}}</el-button>
          </div>
          <div class="message-btns btnStyle">
            <el-button @click="getDataListByType('')" style="border: 1px #c5ddfd solid;
            color: #3e8ef7;background-color:#ecf4fe;" v-if="focus">全部</el-button>
            <el-button @click="getDataListByType('')" v-else>全部</el-button>
            <el-button @click="getDataListByType('運維訊息')">{{$t('MGC.ywxx')}}</el-button>
            <el-button @click="getDataListByType('台富雲動態')">{{$t('MGC.tfygn')}}</el-button>
            <el-button @click="getDataListByType('產品訊息')">{{$t('MGC.cpxx')}}</el-button>
            <el-button @click="getDataListByType('安全訊息')">安全訊息</el-button>
            <el-button @click="getDataListByType('其他訊息')">其他訊息</el-button>
            <el-button @click="getDataListByType('財務訊息')">{{$t('MGC.cwxx')}}</el-button>
          </div>
        </div>
        <!-- <div class="message-funRight">
          <div class="search">
            <el-input v-model="inputVal" placeholder="请输入内容" @change="tableInpVal"></el-input>
            <span>
              <i class="el-icon-search" @click="tableSearch"></i>
            </span>
          </div>
        </div> -->
      </div>
      <div class="meaasge-table"  v-loading="loading">
        <el-table :data="tableData" style="width: 100%" height="450" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="title" label="訊息内容">
             <template slot-scope="scope">
                <el-link @click="detailsMesg(scope.row)" :class="scope.row.status === '1' ? 'classGray' : 'classblue'" type="primary">{{scope.row.title}}</el-link>
              </template>
          </el-table-column>
          <el-table-column prop="sendTime" :label="$t('MGC.jssj')" ></el-table-column>
          <el-table-column prop="msgTypeName" :label="$t('MGC.xxlx')" ></el-table-column>
          <el-table-column :label="$t('MGC.xxzlx')">
            其他
          </el-table-column>
        </el-table>
        <span class="choose-num">{{'已選擇'+this.getData.length+'條'}}</span>
        <div class="Right-style pagstyle" style="height:70px;">
          <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t('MGC.tiao')}}</span>
          <el-select v-model="pagevalue" placeholder="请選擇" size="mini" class="pageselect" @change='pagechange'>
            <el-option
              v-for="item in pageoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
  :title="$t('MGC.sc')"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>{{$t('MGC.scqd')}}</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmDel">{{$t('MGC.qd')}}</el-button>
  </span>
</el-dialog>
 <!-- 全部改为已读状态弹框 -->
 <el-dialog
  :title="$t('MGC.qrbjyd')"
  :visible.sync="MessageDialog"
  width="30%"
  :before-close="handleCloseMsg">
  <span>{{$t('MGC.qrbjsyxxyd')}}</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="MessageDialog = false">取 消</el-button>
    <el-button type="primary" @click="updataMesg">{{$t('MGC.qd')}}</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import {INMAIL_LIST,UNREAD_DATA,UPDATAID_DATA,DELETE_DATA,UPDATALL_DATA} from  '@/constants/MGC.js';
import HeaderCom from "@/components/public/Head";
import VueCookie from 'vue-cookie'
export default {
  name: "message",
  data() {
    return {
      focus:true,
      loading:true,
      dialogVisible:false,//删除弹框
      MessageDialog:false,//訊息弹框
      btnIndex: 0, //按钮默认选中
      //按钮数据
      btnData: [
        "全部",
        "運維訊息",
        "台富雲動態",
        "產品訊息",
        "安全訊息",
        "其他訊息",
        "財務訊息"
      ],
      inputVal: "", //搜索输入的内容
      tableData: [], //表格数据
      getData:[],//获取选中时的数据
      json:[], //搜索数据
      tableAll:[],
       //分页
      TotalCount: 0,
      pagesize: 10,//分页条数
      currpage: 1,//当前页面
      dataType:'',
      pageoptions:[{
          value: 10,
          label: '10條/頁'
        }, {
          value: 20,
          label: '20條/頁'
        }, {
          value: 30,
          label: '30條/頁'
        }, {
          value: 40,
          label: '40條/頁'
        }, {
          value: 50,
          label: '50條/頁'
        }],//分页
        pagevalue:10//分页
    };
  },
  components: {
    HeaderCom
  },
  created(){
     this.init();
     this.getCount()
  },
  methods: {
   //初始化数据
    init(){
       this.loading = true
       let uin = "100011921910"
       let Page = this.currpage //当前页码
       let Rp = this.pagesize  //条数
       let typeUrl = ""
       if(this.dataType!=undefined&&this.dataType!=""){
         typeUrl = '&type='+this.dataType
       }
      //  let uin = VueCookie.get('uuid')
       this.axios.get(`${process.env.VUE_APP_adminUrl + INMAIL_LIST}`+'?uin='+uin+'&page='+Page+'&limit='+Rp+typeUrl).then(res=>{
        if(res != ''){
            console.log(res)
            this.tableData = res.page.list;
            this.TotalCount = res.page.totalCount
            this.json = res.page.list;
            this.tableAll = res.page.list;
            this.loading=false
        }else{
             this.loading = false;
              this.$message({
                type: "info",
                message: "無響應數據！"
            });
        }
      })
    },
    //分页
    pagechange(){
    this.pagesize=this.pagevalue;
    console.log(123)
    this.init()
    },
    //获取未读数据
    getCount(){
       let uin = "100011921910"
       this.axios.get(`${process.env.VUE_APP_adminUrl + UNREAD_DATA}`+'?uin='+uin).then(res=>{
          console.log(res)
       })
    },
    //批量删除弹框点击确定删除
    confirmDel(){
        var delIndex = [];
        this.getData.forEach(item => {
           delIndex.push(item.id)
        })
        let id = delIndex.join(',')
        this.axios.get(`${process.env.VUE_APP_adminUrl + DELETE_DATA}`+'?ids='+id).then(res=>{
            console.log(res)
            this.init()
        })
        this.dialogVisible = false;
    },
    //搜索input框
    tableInpVal(val){
    if(this.inputVal == ""){
         this.tableData = this.json
         this.TotalCount = this.json.length
         this.currpage = 1;
       }
    },
    //批量删除訊息弹框
    delMesg(){
      if(this.getData.length != 0){
          this.dialogVisible = true
      }else{
         this.$message("請選擇數據")
      }
    },
     //多选已读
    changeRead(){
      if(this.getData.length != 0){
         var updata = []
         this.getData.forEach(item => {
            updata.push(item.id)
         })
         let id = updata.join(',')
         this.axios.get(`${process.env.VUE_APP_adminUrl + UPDATAID_DATA}`+'?ids='+id).then(res=>{
          console.log(res)
          this.init()
        })
     }else{
         this.$message("請選擇數據")
      }
    },
    //全部标记为已读显示弹框
    AllRead(){
     this.MessageDialog = true
    },
    //确定全部标记为已读
    updataMesg(){
      this.tableData.forEach(item => {
          let uin = item.uin
          this.axios.get(`${process.env.VUE_APP_adminUrl + UPDATALL_DATA}`+'?uin='+uin).then(res=>{
            console.log(res)
            this.init()
          })
      })
       this.MessageDialog = false
    },
    //获取不同类型的数据
    getDataListByType(val){
      this.dataType = val
      this.focus=false
      this.init()
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

  .classGray{
    color: gray;
    cursor: pointer;
  }
  .classblue{
    color:blue;
    cursor: pointer;
  }
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
    .pageselect{
      margin-left:20px;
      width:100px;
      margin-top:2px;
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
      height: 65px;
      .message-funLeft {
        flex: 1;
        .message-btns {
          flex: 1;
          float:left
        }
        .btnStyle {
          margin-left: 5px;
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
.choose-num{
    display:block;
    float:left;
    margin:27px 20px;
    font-size:14px;
  }
</style>