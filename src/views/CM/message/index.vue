<template>
  <div class="message-wrap">
    <Header title="自定義消息" />
    <!-- <Search></Search> -->
    <div class="overview-main">
      <div class="explain">
        <p>
          当月短信配额已用0条，剩余1000条可用。
          <a>购买短信</a>
        </p>
      </div>
    </div>
    <div class="table">
      <div class="addBtn"> 
        <el-row>
         <el-button type="primary" @click="addMessage">新增消息策略</el-button>
        </el-row>
        <el-row class="seek">
          <el-input v-model="triggerInput" placeholder="请输入策略ID、策略名称搜索"></el-input>
          <el-button icon="el-icon-search" style="margin-left:-1px;"></el-button>
          <i
            class="el-icon-setting"
            style="line-height:30px;padding:0 20px;cursor: pointer;"
            @click="buyMessgae"
          ></i>
        </el-row>
      </div>

      <el-table
        :data="tableData"
        style="width: 100%"
        height="450"
        :default-sort="{prop: 'changeData', order: 'descending'}"
      >
        <el-table-column prop="groupName" label="ID/策略名"></el-table-column>
        <el-table-column prop="chufa" label="近24小时触发告警"></el-table-column>
        <el-table-column prop="type" label="消息接收组"></el-table-column>
        <el-table-column prop="address" label="告警渠道"></el-table-column>
        <el-table-column label="操作">
          <!-- <template slot-scope="scope"> -->
          <template :slot-scope="$scope.row">
            <el-button type="text" class="cloneBtn">复制</el-button>
            <el-button type="text" class="deleteBtn">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="Right-style pagstyle" style="background: #fff;">
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
    <!-- 点击设置 -->
    <Dialog :dialogVisible="dialogVisible" @cancel="cancel" @save="save" />
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import Dialog from "./components/dialog";

export default {
  name: "message",
  data() {
    return {
      tableData: [
        {
          address: "邮件",
          grounpId: 3290043,
          groupName: "啊啊啊",
          isOpen: true,
          chufa: "0",
          object: "東崋雲计算有限公司",
          type: "1",
          YS: "3/3",
          yiqiying: 3,
          shilishu: 3,
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:52:55",
          qudao: "",
          zanting: true
        },
        {
          address: "邮件",
          grounpId: 3290043,
          groupName: "啊啊啊",
          isOpen: true,
          chufa: "0",
          object: "東崋雲计算有限公司",
          type: "1",
          YS: "0/0",
          yiqiying: 3,
          shilishu: 3,
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:21:32",
          qudao: "",
          zanting: true
        },
        {
          address: "邮件",
          grounpId: 3290043,
          groupName: "啊啊啊",
          isOpen: true,
          chufa: "0",
          object: "東崋雲计算有限公司",
          type: "1",
          YS: "15/15",
          yiqiying: 3,
          shilishu: 3,
          lastEditUin: 100011921910,
          changeData: "2019/12/31 7:16:46",
          qudao: "",
          zanting: true
        },
        {
          address: "邮件",
          grounpId: 3290043,
          groupName: "啊啊啊",
          isOpen: true,
          chufa: "0",
          object: "東崋雲计算有限公司",
          type: "1",
          YS: "3/3",
          yiqiying: 3,
          shilishu: 3,
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:52:55",
          qudao: "",
          zanting: true
        },
        {
          address: "邮件",
          grounpId: 3290043,
          groupName: "啊啊啊",
          isOpen: true,
          chufa: "0",
          object: "東崋雲计算有限公司",
          type: "1",
          YS: "0/0",
          yiqiying: 3,
          shilishu: 3,
          lastEditUin: 100011921910,
          changeData: "2019/12/31 13:21:32",
          qudao: "",
          zanting: true
        },
        {
          address: "邮件",
          grounpId: 3290043,
          groupName: "啊啊啊",
          isOpen: true,
          chufa: "0",
          object: "東崋雲计算有限公司",
          type: "1",
          YS: "15/15",
          yiqiying: 3,
          shilishu: 3,
          lastEditUin: 100011921910,
          changeData: "2019/12/31 7:16:46",
          qudao: "",
          zanting: true
        }
      ], //表格数据
      //分页
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      operationFlag: -1, //按钮禁用开关
      searchName: "",
      dialogVisible: false, //设置弹出框
      triggerInput: "" //搜索
      //分页
    };
  },
  components: {
    Header,
    Dialog
    // Search  //搜索框组件
  },
  methods: {
    //新增消息策略
    addMessage() {
      alert("/message/create")
        this.$router.push({path:"/message/create"});
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
    },
    //设置弹框
    buyMessgae() {
      // alert("11")
      this.dialogVisible = true;
    },
    //取消设置弹框
    cancel() {
      this.dialogVisible = false;
    },
    //确定设置弹框
    save() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.message-wrap >>> .el-button,
.message-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.seek {
  display: flex;
  width: 248px;
}
a {
  color: #006eff;
  cursor: pointer;
}
a:hover {
  border-bottom: 1px solid #006eff;
}
.cursor {
  cursor: pointer;
}
.Template-wrap >>> .cloneBtn > span:hover {
  border-bottom: 1px solid #006eff;
}
.Template-wrap >>> .deleteBtn > span {
  color: #666;
}
.table {
  padding: 0 20px 20px 20px;
  .addBtn {
    width: 100%;
    height: 45px;
    padding-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .iconBtn {
      font-size: 16px;
      color: #888;
      display: flex;
      align-items: center;
      > i {
        margin: 0 10px;
        font-weight: 600;
      }
      i:hover {
        cursor: pointer;
      }
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
}

.message-wrap {
  a {
    color: #006eff;
    cursor: pointer;
  }
  a:hover {
    border-bottom: 1px solid #006eff;
  }
  .overview-main {
    padding: 20px;
    box-sizing: border-box;

    .progress {
      padding: 10px 0;
      box-sizing: border-box;

      p {
        margin-bottom: 10px;
        font-weight: bold;

        span {
          float: right;
        }
      }
    }

    .main-box {
      display: flex;
    }

    .left {
      flex: 1;
      margin-right: 20px;
    }
    .right {
      width: 30%;
    }
    .head {
      display: flex;
      align-items: center;

      h3 {
        margin-right: 20px;
      }
    }
    .box {
      border: 1px solid #ddd;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-top: 20px;
    }

    .explain {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;

      p {
        font-size: 11px;
        line-height: 18px;
      }
    }
  }
}
</style>