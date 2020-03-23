<template>
  <div class="message-wrap">
    <Header title="自定義消息" />
    <!-- <Search></Search> -->
    <p>.</p>
    <!-- <div class="overview-main">
      <div class="explain">
        <p>
          当月短信配额已用0条，剩余1000条可用。
          <a>购买短信</a>
        </p>
      </div>
    </div> -->
    <div class="table">
      <div class="addBtn">
        <el-row>
          <el-button type="primary" @click="addMessage">新增消息策略</el-button>
        </el-row>
        <el-row class="seek">
          <!-- <el-input v-model="triggerInput" placeholder="请输入策略ID、策略名称搜索" @input="searchList"></el-input>
          <el-button icon="el-icon-search" style="margin-left:-1px;" @click="searchBtn"></el-button>-->
          <!-- 设置框---初步完成---uat功能暂无 -->
          <!-- <i
            class="el-icon-setting"
            style="line-height:30px;padding:0 20px;cursor: pointer;"
            @click="buyMessgae"
          ></i>-->
        </el-row>
      </div>

      <el-table
        :data="tableData"
        style="width: 100%"
        height="450"
        v-loading="loadShow"
        :default-sort="{ prop: 'changeData', order: 'descending' }"
      >
        <el-table-column prop="groupName" label="ID/策略名">
          <template slot-scope="scope">
            <p>
              <b>{{scope.row.PolicyID}}</b>
            </p>
            <p>{{scope.row.PolicyName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="chufa" label="近24小时触发告警">
          <template slot-scope="scope">
            {{scope.row.AlarmCount}}
            <!-- <a @click="alarmDialog">{{scope.row.AlarmCount}}</a> -->
          </template>
        </el-table-column>
        <el-table-column prop="type" label="消息接收组">
          <template slot-scope="scope">
            {{scope.row.ReceiverGroupIds.length}}
            <!-- <a @click="receiverGroup(scope.row)">{{scope.row.ReceiverGroupIds.length}}</a> -->
          </template>
        </el-table-column>
        <el-table-column prop="address" label="告警渠道">
          <template slot-scope="scope">
            <p v-if="scope.row.NotifyWay">
              <span v-for="(v,i) in scope.row.NotifyWay" :key="i">
                <b v-if="v=='EMAIL'">邮件、</b>
                <b v-if="v=='SMS'">短信、</b>
                <b v-if="v=='CALL'">站内信、</b>
              </span>
            </p>
            <p v-if="scope.row.NotifyWay.length==0">-</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" class="cloneBtn" @click="Edit(scope.row)">编辑</el-button>
            <el-button type="text" class="deleteBtn" @click="Delete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            :pager-count="7"
            @current-change="handleCurrentChange"
            :current-page="currpage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="TotalCount"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 点击设置 -->
    <Dialog :dialogVisible="dialogVisible" @cancel="cancel" @save="save" />

    <!-- 近24小时触发告警 -->
    <el-dialog
      title="告警记录详情"
      :visible.sync="deleteDialogVisible2"
      width="900px"
      style="height:100%"
      custom-class="tke-dialog"
    >
      <div style="height:440px">
        <div style="display:flex;align-items:center;margin-bottom:20px">
          <div style="flex:1;">
            <XTimeX v-on:switchData="getAlarmList" :classsvalue="valueT"></XTimeX>
          </div>
          <div class="seek">
            <el-input v-model="input" placeholder="请输入消息内容关键字或监控组件主机IP" @input="searchZIID"></el-input>
            <el-button icon="el-icon-search" style="margin-left:-1px;" @click="searchZIIDBtn"></el-button>
          </div>
        </div>
        <div style="margin-bottom:20px">
          <span>
            <b>策略名ID：</b>
            <!-- {{PolicyID}} -->
          </span>
          <span>
            <b>策略名：</b>
            <!-- {{PolicyName}} -->
          </span>
        </div>
        <div>
          <el-table :data="lists" style="width: 100%" height="330">
            <el-table-column prop label="发生时间">
              <template slot-scope="scope">111</template>
            </el-table-column>
            <el-table-column prop label="消息内容">
              <template slot-scope="scope">22222</template>
            </el-table-column>
            <el-table-column prop label="消息来源">
              <template slot-scope="scope">3333</template>
            </el-table-column>
          </el-table>
          <span>共 {{nums}} 项</span>
        </div>
      </div>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog
      title="确定删除所选策略？"
      :visible.sync="deleteDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <p>删除后,相关接收人将不能接收到对应的告警内容</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DeleteList">确定删除</el-button>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 接收组 -->
    <el-dialog
      title="消息接收组详情"
      :visible.sync="deleteDialogVisible1"
      width="500px"
      custom-class="tke-dialog"
    >
      <div>
        <p>策略名：{{groups.PolicyName}}</p>
        <div>
          接收组：
          <el-table :data="lists" style="width: 490px" height="100">
            <el-table-column prop="index" label="序号">
              <template slot-scope="scope">111</template>
            </el-table-column>
            <el-table-column prop="chufa" label="接收人">
              <template slot-scope="scope">22222</template>
            </el-table-column>
            <el-table-column prop="type" label="接收组">
              <template slot-scope="scope">3333</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ok">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import Dialog from "./components/dialog";
import XTimeX from "./components/TimeN";

import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import {
  CUSTON_MESSAGE_LIST,
  DETELE_CUSTON_MESSAGE,
  RECEIVING_GROUP_DETAILE
} from "@/constants/CM-lxx.js";

export default {
  name: "message",
  data() {
    return {
      input: "", //近24小时告警搜索值
      nums: 0,
      tableData: [], //表格数据
      //分页
      loadShow: true, // 加载是否显示
      TotalCount: 0, //总条数
      pageSize: 10, // 分页条数
      currpage: 1, // 当前页码
      deteleId:"",//要删除的id
      operationFlag: -1, //按钮禁用开关
      searchName: "",
      valueT: "",
      dialogVisible: false, //设置弹出框
      triggerInput: "", //搜索
      deleteDialogVisible: false,
      deleteDialogVisible1: false,
      deleteDialogVisible2: false,
      groups: {},
      lists: []
    };
  },
  components: {
    Header,
    Dialog,
    XTimeX
    // Search  //搜索框组件
  },
  created() {
    this.getCustomMessage();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCustomMessage(this.timeObjs);
    },
    searchZIIDBtn() {
      //搜索24小时告警列表按钮
    },
    searchZIID() {
      //搜索24小时告警列表
    },
    //获取数据
    getCustomMessage() {
      this.loadShow = true; //加载
      var params = {
        Region: localStorage.getItem("regionv2"),
        Version: "2018-07-24",
        Module: "monitor",
        Limit: this.pageSize,
        Offset: (this.currpage - 1) * this.pageSize
      };
      // params.Filter       //筛选数据
      this.axios.post(CUSTON_MESSAGE_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.PolicyList;
          this.TotalCount = res.Response.Total;
          this.loadShow = false; //取消加载
        } else {
          this.loadShow = false;
          let ErrTips = {
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
            InvalidParameter: "参数错误。",
            LimitExceeded: "超过配额限制。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持。"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    receiverGroup(val) {
      //接收组
      // this.groups = val;
      // this.groups.ReceiverGroupIds.forEach((item, index) => {
      //   var params = {
      //     Version: "2018-07-24",
      //     GroupId: item
      //   };
      //   this.axios.post(RECEIVING_GROUP_DETAILE, params).then(res => {
      //     console.log(res);
      //     this.lists.push();
      //     if (res.codeDesc === "Success") {
      //       // this.deleteDialogVisible1 = false;
      //     } else {
      //       let ErrTips = {};
      //       let ErrOr = Object.assign(ErrorTips, ErrTips);
      //       this.$message({
      //         message: ErrOr[res.Response.Error.Code],
      //         type: "error",
      //         showClose: true,
      //         duration: 0
      //       });
      //     }
      //   });
      // });

      this.deleteDialogVisible1 = true;
    },
    ok() {
      // 确定接收组
    },
    alarmDialog() {
      //触发告警
      this.deleteDialogVisible2 = true;
    },
    getAlarmList() {},
    // 删除
    Delete(row) {
      this.deteleId=row.PolicyID;
      this.deleteDialogVisible = true;
    },
    DeleteList() {
      //删除
      this.loadShow = true;
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        PolicyID: this.deteleId
      };
      this.axios.post(DETELE_CUSTON_MESSAGE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.getCustomMessage();
           this.$message({
            message: "删除成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.deleteDialogVisible = false;
        } else {
          let ErrTips = {
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
            InvalidParameter: "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持"
          };
          this.loadShow = false;
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    searchList() {
      //搜索框
      if (this.triggerInput == "") {
        this.getCustomMessage();
      }
    },
    searchBtn() {
      //搜索按钮
      if (this.triggerInput == "") {
        this.getCustomMessage();
      }
      // params.ObjLike = this.input;
      this.getCustomMessage();
    },
    //新增消息策略
    addMessage() {
      // alert("/message/create")messageCreate
      this.$router.push({ name: "messageCreate" });
    },
    //分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.getCustomMessage(this.timeObjs);
      this.pageIndex += 1;
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
    },
    // 编辑
    Edit(data) {
      // if(data.NotifyWay==""){
      //    delete data.NotifyWay;
      // }
      this.$router.push({
        name: "messageEdit",
        query:data
      });
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
.tke-page {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
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
