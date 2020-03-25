<template>
  <div class="product-wrap">
    <Header title="監控配置">
      <el-select v-model="values" placeholder="請選擇">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
        </el-option>
      </el-select>
    </Header>
    <div class="product-main">
      <div class="explain" style="margin-bottom:20px;">
        <p>
          新版自定義監控以灰度上線，目前處于內側階段，如需使用可<a href="">申請內側體驗</a>
        </p>
        <p>
          若在使用過程中遇到任何問題，您可以通過加入自定義監控交流QQ群（793979710），我們將竭誠爲您服務!
        </p>
      </div>
      <div class="box">
        <div class="table_top">
          <div class="type_data">
            <el-button  type="primary"  @click="newbtn" style="line-height:30px;">+新增配置項</el-button>
          </div>

          <div class="icons">
            <div class="writeput">
                <el-input v-model="input" placeholder="請輸入實例組名搜索"></el-input>
                <el-button icon="el-icon-search" style="margin-left:-1px;"></el-button>
            </div>
                <i class="el-icon-setting" @click="setup"></i>
          </div>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%" height="450">
            <el-table-column prop="namespace" label="命名空間"></el-table-column>
            <el-table-column prop="index" label="指標"></el-table-column>
            <el-table-column prop="dimension" label="維度" ></el-table-column>
            <el-table-column prop="method" label="統計方式" ></el-table-column>
            <el-table-column prop="operation" label="操作"> <a @click="montior">監控</a> <a @click="administration">管理</a> <a @click="delet">刪除</a> </el-table-column>
          </el-table>

          <!-- 分頁 -->
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
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
    </div>
      <Dialog :dialogVisible="dialogVisible" @cancel="cancel" @save="save"/>
  </div>
</template>

<script>


import Header from "@/components/public/Head";
import TimeDropDown from '@/components/public/TimeDropDown';
import Dialog from "./custom/custom";
import SEARCH from "@/components/public/SEARCH";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共錯誤碼
import { DESCRIBE_NAME_SPACE } from "@/constants";
export default {
  name: "product",
  data() {
    return {
      activeName: "first",
      value: 1,
      dialogVisible: false, //新增配置彈框
      input: "", //搜索框的值
      tableData: [
        {
          namespace:"test1",
          index:"qq",
          dimension:"1,2,3",
          method:"已配置",
        },
      ],
      //分頁
      TotalCount: 0, //總條數
      pagesize: 10, // 分頁條數
      currpage: 1, // 當前頁碼
      //city選擇
      options:[],
      values:"",
    };
  },
  components: {
    Header,
    Dialog
  },
  mounted () {
    this.getDescribeNamespace()
  },
  methods: {
    //獲取數據
    GetDat(data) {
      console.log(data);
    },
    // 命名空間
    getDescribeNamespace () {
      const params = {
        Region: localStorage.getItem("regionv2"),
        Version: "2018-07-24",
        Action: "CreateNamespace",
        Timestamp: new Date(),
        Nonce: this.StartTime,
        SecretId: this.EndTime,
        Signature: ''
      };

      this.axios.post(DESCRIBE_NAME_SPACE,{Version: "2018-07-24"}).then(res => {
        console.log(res)
        // if (res.Response.Error === undefined) {
        // } else {
        //   this.loadShow = false;
        //   let ErrTips = {};
        //   let ErrOr = Object.assign(ErrorTips, ErrTips);
        //   this.$message({
        //     message: ErrOr[res.Response.Error.Code],
        //     type: "error",
        //     showClose: true,
        //     duration: 0
        //   });
        // }
      });
    },
     //分頁
    handleCurrentChange(val) {
      this.currpage = val;
    },
    //新增配置項
    newbtn(){
      this.$router.push({
        path:"/configuration/create",//      新增配置項
      })
      // console.log("點擊")
    },
    //取消
    cancel(){
      this.dialogVisible = false;
    },
    //確定
    save(){
      this.dialogVisible = false;
    },
    //icon自定義按鈕
    setup(){
      this.dialogVisible = true;
    },
    //監控
    montior(){
      this.$router.push( {
        path:"/configuration/montior",//     監控頁面
      },
      )
    },
    //管理
    administration(){
      this.$router.push( {
        path:"/configuration/administration",//     管理頁面
      },
      )
    },
    //刪除
    delet(){
      console.log('刪除')
    },

  },
};
</script>

<style lang="scss" scoped>
.product-wrap > header {
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 17px 20px;
  position: relative;
  p:first-child {
    font-size: 16px;
    font-weight: 600;
    a {
      color: #000;
    }
  }
}
.product-wrap >>> .el-select{
    margin-left:20px;
    border:0px;
}
.product-wrap >>> .el-button,
.product-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.product-main {
  padding: 20px;
}
.box {
  width: 100%;
  .table_top{
    width:100%;
    margin:15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icons {
      display: flex;
      align-items: center;
      >i{
        font-size: 16px;
      }
      .writeput{
          width: 240px;
          display: flex;
          margin-right:20px;
      }
    }
  }
  .table {
    width: 100%;
    background: white;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.32);
    a{
      display: inline-block;
      margin:0 5px;
    }
    a:hover{
    cursor: pointer;
    }
  }
}
.explain {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #c07400;
  border:1px solid  #ffd18b;
  background: #fff4e3;
  p {
    font-size: 11px;
    line-height: 18px;
  }
}
.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
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
</style>
