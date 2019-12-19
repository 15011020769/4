<template>
  <div class="message-wrap">
    <div class="message-header">
      <HeaderCom title="站内信">
        <p>
          （共127封，其中124封未读，
          <span>仅查看未读消息</span>）
        </p>
      </HeaderCom>
    </div>
    <div class="message-main">
      <div class="message-fun">
        <div class="message-funLeft">
          <div class="message-btns">
            <el-button>删除</el-button>
            <el-button>标记为已读</el-button>
            <el-button>全部标记为已读</el-button>
          </div>
          <div class="message-btns btnStyle">
            <el-button
              v-for="(item,index) in btnData"
              :key="index"
              :class="btnIndex == index ? 'btn-active' : ''"
              @click="btnClick(index)"
            >{{item}}</el-button>
          </div>
        </div>
        <div class="message-funRight">
          <div class="search">
            <el-input v-model="input" placeholder="请输入内容"></el-input>
            <span>
              <i class="el-icon-search"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="meaasge-table">
        <el-table :data="tableData" style="width: 100%" height="450" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="消息内容" width="180"></el-table-column>
          <el-table-column label="接收时间" width="180"></el-table-column>
          <el-table-column label="消息类型"></el-table-column>
          <el-table-column label="消息子类型"></el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[20, 30, 40,50,100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderCom from "@/components/public/Head";
export default {
  name: "message",
  data() {
    return {
      btnIndex: 0, //按钮默认选中
      //按钮数据
      btnData: [
        "全部",
        "运维消息",
        "台富云动态",
        "产品消息",
        "安全消息",
        "其他消息",
        "财务消息"
      ],
      pagesize: 20, // 分页条数
      currpage: 1, // 当前页码
      input: "", //搜索输入的内容
      tableData: [] //表格数据
    };
  },
  components: {
    HeaderCom
  },
  created(){
     this.init()
  },
  methods: {
    // init(){
    //    let params = {
    //      searchForm:this.tableData
    //    };
    //    this.axios.post("http://tfc.dhycloud.com/adminapi/admin/taifucloud/inmail/list",params).then(res=>{
    //      console.log(res)
    //    })
    // },
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.currpage = 1;
    },
    handleCurrentChange(val) {
      this.currpage = val;
    },
    //点击按钮
    btnClick(index) {
      this.btnIndex = index;
    },
    //多选框
    handleSelectionChange(){

    }
  }
};
</script>

<style lang="scss" scoped>
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