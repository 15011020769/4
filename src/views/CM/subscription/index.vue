<template>
  <div class="subscription-wrap">
    <Header title="平台事件訂閱" />
    <div class="table">
      <p class="boxLi" style="border-top:1px solid #ebeef5;border-bottom:1px solid #ebeef5">
        <i class="el-icon-arrow-down"></i>
        <span>问题：</span>
      </p>
      <el-table :data="tableData" style="width: 100%;" v-loading="loadShow">
        <el-table-column label="事件类型" width="240">
          <template slot-scope="scope">
            <div v-if="scope.row.AccidentName=='雲伺服器存儲問題'">
              <span style="margin-left: 0px;flex-wrap:nowrap">
                {{
                scope.row.AccidentName
                }}
              </span>
              <el-tooltip
                class="item"
                effect="light"
                content="云服务器基础设施存储模块; 影响：导致IO性能下降 ，数据读写异常"
                placement="bottom-start"
              >
                <i class="el-icon-info" style="margin:0 5px;cursor: pointer;"></i>
              </el-tooltip>
            </div>

            <div v-if="scope.row.AccidentName=='雲伺服器網絡連接問題'">
              <span style="margin-left: 0px;flex-wrap:nowrap">
                {{
                scope.row.AccidentName
                }}
              </span>
              <el-tooltip
                class="item"
                effect="light"
                content="云服务器基础设施网络模块导致; 影响：网速下降或网络连接中断"
                placement="bottom-start"
              >
                <i class="el-icon-info" style="margin:0 5px;cursor: pointer;"></i>
              </el-tooltip>
            </div>

            <div v-if="scope.row.AccidentName=='雲伺服器運行異常'">
              <span style="margin-left: 0px;flex-wrap:nowrap">
                {{
                scope.row.AccidentName
                }}
              </span>
              <el-tooltip
                class="item"
                effect="light"
                content="云服务器基础设施导致; 影响：云服务器高负载或宕机，服务不可用"
                placement="bottom-start"
              >
                <i class="el-icon-info" style="margin:0 5px;cursor: pointer;"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="短信" width="170">
          <template slot-scope="scope">
            <i
              v-if="scope.row.type == 0 ? false : true"
              class="el-icon-circle-check"
              style="color:#0abf5b"
            ></i>
            <i v-else class="el-icon-circle-close" style="color:#e1504a"></i>
          </template>
        </el-table-column>
        <el-table-column label="邮件" width="180">
          <template slot-scope="scope">
            <i
              v-if="scope.row.email == 0 ? false : true"
              class="el-icon-circle-check"
              style="color:#0abf5b"
            ></i>
            <i v-else class="el-icon-circle-close" style="color:#e1504a"></i>
          </template>
        </el-table-column>
        <el-table-column label="站内信" width="180">
          <template slot-scope="scope">
            <i
              v-if="scope.row.zhanneixin == 0 ? false : true"
              class="el-icon-circle-check"
              style="color:#0abf5b"
            ></i>
            <i v-else class="el-icon-circle-close" style="color:#e1504a"></i>
          </template>
        </el-table-column>
        <el-table-column prop="receive" label="接收人">
          <template slot-scope="scope">
            <div style="width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
              <span v-for="(v,i) in scope.row.Receivers" :key="i">{{v.Username}},</span>
            </div>

            <p v-if="scope.row.Receivers.length==0">-</p>
            <p v-else>共{{scope.row.Receivers.length}}人</p>
          </template>
        </el-table-column>
        <el-table-column label>
          <template slot-scope="scope">
            <el-button type="text" class="btn subBtn" @click="ok(scope.row)">订阅管理</el-button>
            <el-button
              type="text"
              class="btn unSubBtn"
              @click="cancel(scope.row)"
              v-show="hide"
            >取消订阅</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 订阅管理 -->
    <el-dialog title="订阅管理" :visible.sync="dialogSubscribe" width="640px">
      <div class="list">
        <p style="display:flex;">
          <span>接收方式</span>
          <el-checkbox-group v-model="qudaoCheckList" @change="selectChannel">
            <span style="margin:0 0 20px 30px;">
              <el-checkbox label="郵件"></el-checkbox>
            </span>
            <span style="margin-left:30px">
              <el-checkbox label="簡訊"></el-checkbox>
            </span>
            <span style="margin-left:30px">
              <el-checkbox label="站內信"></el-checkbox>
            </span>
          </el-checkbox-group>

          <!-- <el-checkbox
            v-for="city in cities"
            :label="city"
            :key="city"
            style="margin:0 10px;"
          >{{ city }}</el-checkbox>-->
        </p>
        <p class="search">
          <span>
            请选择接收人(已选
            <b>{{ num }}</b>人)
          </span>
          <el-row class="seek" style="display:flex;">
            <el-input v-model="triggerInput" placeholder="搜索"></el-input>
            <el-button icon="el-icon-search" style="margin-left:-1px;" @click="searchKey"></el-button>
          </el-row>
        </p>

        <el-table
          :data="userListArr"
          tooltip-effect="dark"
          v-loading="loadingShow1"
          @selection-change="handleSelectionChange2"
          style="width: 100%;"
          height="430"
          :default-sort="{ prop: 'changeData', order: 'descending' }"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="Name" label="用户名"></el-table-column>
          <el-table-column label="手机号">
            <template slot-scope="scope">
              <span v-if="scope.row.PhoneNum !== ''">{{scope.row.PhoneNum}}</span>
              <span v-else>未设置手机号</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱">
            <template slot-scope="scope">
              <span v-if="scope.row.Email !== ''">{{scope.row.Email}}</span>
              <span v-else>未设置邮箱</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer center">
        <el-button class="subscribe" type="primary" @click="ok1">确定</el-button>
        <el-button @click="dialogSubscribe = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 取消订阅 -->
    <el-dialog title="取消订阅" :visible.sync="dialogcancel" width="30%">
      <span>取消订阅云服务器存储问题？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancelsubscribe" type="primary" @click="cancel1">取消订阅</el-button>
        <el-button @click="dialogcancel = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import {
  SUBSCRIPTION_LIST,
  SUBSCRIPTION_ADMINISTRATION,
  CANCEL_SUBSCRIPTION
} from "@/constants/CM-lxx.js"; /////////
import { LIST_SUBACCOUNTS } from "@/constants";

import Header from "@/components/public/Head";
const cityOptions = ["短信", "邮件", "站内信"];
export default {
  name: "subscription",
  data() {
    return {
      qudaoCheckList:[],//接收方式
      loadingShow1: false, // 加载是否显示
      loadShow: false, // 加载是否显示
      triggerInput: "", //选择触发条件名搜索
      num: 0, //已选择几人
      cities: cityOptions,
      dialogcancel: false, //取消订阅确认框
      dialogSubscribe: false, //订阅管理确认框
      tableData: [],
      userListArr: [], // 接收人列表数组
      multipleSelection: [],
      okObj: {},
      cancelObj: {},
      hide: true,
      selectUserList: []
    };
  },
  components: {
    Header
  },
  created() {
    this.getEventList();
  },
  methods: {
     // 选中渠道
    selectChannel() {
      // var data = this.$route.params;
      // if (data.NotifyWay) {
      //   data.NotifyWay.forEach((v, i) => {
      //     if (v == "EMAIL") {
      //       v = "郵件";
      //     } else if (v == "SMS") {
      //       v = "簡訊";
      //     }
      //     this.qudaoCheckList.push(v);
      //   });
      // }
      // this.cam.channel = this.qudaoCheckList;
      // console.log(this.cam.channel)
      // this.$emit("camClick", this.cam);
    },
    // 搜索关键字
    searchKey() {
      if (this.triggerInput == "") {
        this.userList(); // 查询接收人
      }
      this.userList(); // 查询接收人
    },
    // 接收人 table表格选中触发的事件
    handleSelectionChange2(val) {
      this.selectUserList = val;
      console.log(this.selectUserList);
      // this.$emit("camClick", this.cam);
    },
    // 查询接收人数据
    userList() {
      this.loadingShow1 = true;
      let userList = {
        Type: "SubAccount",
        Version: "2019-01-16",
        Offset: 0,
        Limit: 1000
      };
      if (this.triggerInput != null && this.triggerInput != "") {
        userList["Keyword"] = this.triggerInput;
      }
      this.axios
        .post(LIST_SUBACCOUNTS, userList)
        .then(data => {
          this.loadingShow1 = false;
          // 如果返回的data是String类型的，说明接口返回信息有误
          if (typeof data !== "string") {
            if (data.Response.Error === undefined) {
              if (data != "") {
                var arr = data.Response.UserInfo;
                //获取用户关联的用户组
                arr.forEach((item, index) => {
                  item.group = [];
                  item.index = index;
                  item.subscription = undefined;
                });
                this.userListArr = arr;
              } else {
                this.$message({
                  type: "info",
                  message: "無響應數據！",
                  showClose: true,
                  duration: 0
                });
              }
            } else {
              let ErrTips = {};
              this.loadingShow1 = false;
              let ErrOr = Object.assign(ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[data.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancel(data) {
      this.cancelObj = data;
      this.dialogcancel = true;
      //取消订阅
    },
    cancel1() {
      var params = {
        Version: "2018-07-24",
        Module: "monitor",
        BusinessId: this.cancelObj.BusinessId, //业务id
        AccidentId: this.cancelObj.AccidentId //事件id
      };
      console.log(this.cancelObj);
      this.axios.post(CANCEL_SUBSCRIPTION, params).then(res => {
        console.log(res);
        if (res.codeDesc === "Success") {
          this.$message({
            message: "取消订阅成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.dialogcancel = false;
        } else {
          let ErrTips = {
            InternalError: "内部错误。",
            InvalidParameter: "参数错误。",
            LimitExceeded: "超过配额限制。",
            MissingParameter: "缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            UnauthorizedOperation: "未授权操作。",
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
    ok(data) {
      this.userList();
      this.okObj = data;
      //订阅
      this.dialogSubscribe = true;
    },
    ok1() {
      var params = {
        Version: "2018-07-24"
        // GroupId: item
      };
      this.axios.post(SUBSCRIPTION_ADMINISTRATION, params).then(res => {
        console.log(res);
        this.lists.push();
        if (res.codeDesc === "Success") {
          this.$message({
            message: "订阅成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.dialogSubscribe = false;
        } else {
          let ErrTips = {
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
            InvalidParameter: "参数错误。",
            MissingParameter: "缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            ResourcesSoldOut: "资源售罄。",
            UnauthorizedOperation: "未授权操作。",
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
    getEventList() {
      this.loadShow = true; //加载
      var params = {
        Version: "2018-07-24",
        Module: "monitor"
      };
      this.axios.post(SUBSCRIPTION_LIST, params).then(res => {
        console.log(res.Response, "数据");
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.Events;
          this.loadShow = false; //取消加载
        } else {
          this.loadShow = false;
          let ErrTips = {
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            MissingParameter: "缺少参数错误。",
            ResourceNotFound: "资源不存在。",
            UnauthorizedOperation: "未授权操作。",
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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
    // cancelSubscribe() {
    //   //取消订阅
    // },
    // subscribe() {
    //   //订阅
    // }
  }
};
</script>

<style lang="scss" scoped>
.subscription-wrap >>> .el-button,
.subscription-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.subscription-wrap >>> .el-table__body {
  margin-top: 55px;
}
.subscription-wrap >>> .list .el-table__body {
  margin-top: 0;
}
.subscription-wrap >>> .btn > span:hover {
  border-bottom: 1px solid #006eff;
}
.subscription-wrap >>> div.cell:nth-child(0) {
  padding-left: 65px;
}
.subscription-wrap >>> .el-table__header-wrapper {
  padding-left: 66px;
}
.subscription-wrap >>> .el-table__body div.cell {
  padding-left: 74px;
}
.subscription-wrap >>> .list div.cell {
  padding: 10px;
}
.subscription-wrap >>> .list .el-table__header-wrapper {
  padding: 0;
}
.subscription-wrap >>> .table i {
  font-size: 16px;
}
.subscription-wrap >>> .el-dialog__body {
  padding: 10px 20px;
  color: #606266;
  line-height: 24px;
  font-size: 14px;
}
.subscription-wrap >>> .center {
  text-align: center;
}
.dialog-footer {
  text-align: center;
  .cancelsubscribe {
    border-color: #ff9700;
    background-color: #ff9700;
  }
}
.subscription-wrap >>> .receiver {
  width: 100%;
  .cell {
    padding: 0px;
  }
  .el-table__header-wrapper {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-table__body {
    margin: 0px;
  }
  .el-table__header-wrapper,
  .el-table__body div.cell {
    padding: 0;
    margin: 0;
  }
}

.table {
  padding: 20px;
  position: relative;
  .boxLi:hover {
    background: rgb(245, 245, 245);
  }
  .boxLi {
    background: rgb(255, 255, 255);
    padding: 20px;
    position: absolute;
    width: 97%;
    top: 66px;
    // border-bottom: 1px solid #eee;
    // border-top: 1px solid #eee;
    z-index: 100;
    vertical-align: middle;

    i {
      color: #2184d6;
    }
    span {
      margin: 0 10px;
    }
  }
}
.list {
  ::v-deep .el-table {
    border: 1px solid #ebeef5;
    margin-left: 1px;
    margin-top: 10px;
  }
  ::v-deep .el-table__body {
    width: 98%;
  }
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    ::v-deep .el-input__inner {
      border-radius: 0;
      height: 30px;
    }
    ::v-deep .el-button {
      padding: 0 20px;
      border-radius: 0;
      height: 30px;
    }
  }
}
</style>
