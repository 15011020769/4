<template>
  <div class="subscription-wrap">
    <Header title="平台事件訂閱" />
    <div class="table">
      <p class="boxLi" style="border-top:1px solid #ebeef5;border-bottom:1px solid #ebeef5">
        <i class="el-icon-arrow-down"></i>
        <span>問題：</span>
      </p>
      <el-table :data="tableData" style="width: 100%;" v-loading="loadShow">
        <el-table-column label="事件類型" width="240">
          <template slot-scope="scope">
            <div v-if="scope.row.AccidentName=='雲伺服器儲存問題'">
              <span style="margin-left: 0px;flex-wrap:nowrap">
                {{
                scope.row.AccidentName
                }}
              </span>
              <el-tooltip
                class="item"
                effect="light"
                content="雲伺服器基礎設施儲存模組; 影響：導致IO效能下降 ，數據讀寫異常"
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
                content="雲伺服器基礎設施網路模組導致; 影響：網速下降或網路連接中斷"
                placement="bottom-start"
              >
                <i class="el-icon-info" style="margin:0 5px;cursor: pointer;"></i>
              </el-tooltip>
            </div>

            <div v-if="scope.row.AccidentName=='雲伺服器運列異常'">
              <span style="margin-left: 0px;flex-wrap:nowrap">
                {{
                scope.row.AccidentName
                }}
              </span>
              <el-tooltip
                class="item"
                effect="light"
                content="雲伺服器基礎設施導致; 影響：雲伺服器高負載或宕機，服務不可用"
                placement="bottom-start"
              >
                <i class="el-icon-info" style="margin:0 5px;cursor: pointer;"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="簡訊" width="170">
          <template slot-scope="scope">
            <span v-if="scope.row.NotifyWay">
              <i
                v-show="scope.row.NotifyWay[0] ? true :false"
                class="el-icon-circle-check"
                style="color:#0abf5b"
              ></i>
            </span>

            <span v-if="!scope.row.NotifyWay">尚未訂閱</span>
          </template>
        </el-table-column> -->
        <el-table-column label="郵件" width="180">
          <template slot-scope="scope">
            <i
              v-if="scope.row.NotifyWay"
              v-show="scope.row.NotifyWay[1] ? true :false"
              class="el-icon-circle-check"
              style="color:#0abf5b"
            ></i>
            <span v-if="!scope.row.NotifyWay">尚未訂閱</span>
          </template>
        </el-table-column>
        <el-table-column label="站内信" width="180">
          <template slot-scope="scope">
            <i
              v-if="scope.row.NotifyWay"
              v-show="scope.row.NotifyWay[2] ? true :false"
              class="el-icon-circle-check"
              style="color:#0abf5b"
            ></i>
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
            <el-button type="text" class="btn subBtn" @click="ok(scope.row)">訂閱管理</el-button>
            <el-button
              type="text"
              class="btn unSubBtn"
              @click="cancel(scope.row)"
              v-if="scope.row.NotifyWay"
            >取消訂閱</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 订阅管理 -->
    <el-dialog title="訂閱管理" :visible.sync="dialogSubscribe" width="640px">
      <div class="list">
        <p style="display:flex;">
          <span>接收方式</span>
          <el-checkbox-group v-model="qudaoCheckList" @change="selectChannel">
            <span style="margin:0 0 20px 30px;">
              <el-checkbox label="1">郵件</el-checkbox>
            </span>
            <!-- <span style="margin-left:30px">
              <el-checkbox label="2">簡訊</el-checkbox>
            </span> -->
            <span style="margin-left:30px">
              <el-checkbox label="4">站内信</el-checkbox>
            </span>
          </el-checkbox-group>
        </p>
        <p class="search">
          <span>
            請選擇接收人(已選
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
          <el-table-column prop="Name" label="用戶名"></el-table-column>
          <el-table-column label="手機號">
            <template slot-scope="scope">
              <span v-if="scope.row.PhoneNum !== ''">
                {{scope.row.PhoneNum}}
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    未驗證, 可在
                    <a href>權限管理</a>頁面設置
                  </div>
                  <i class="el-icon-warning" style="color:#e54545;cursor: pointer;"></i>
                </el-tooltip>
              </span>
              <span v-else>
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    未驗證, 可在
                    <a href>權限管理</a>頁面設置
                  </div>
                  <i class="el-icon-warning" style="color:#e54545;cursor: pointer;"></i>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="郵箱">
            <template slot-scope="scope">
              <span v-if="scope.row.Email !== ''">
                {{scope.row.Email}}
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    未驗證, 可在
                    <a>權限管理</a>頁面設置
                  </div>
                  <i class="el-icon-warning" style="color:#e54545;cursor: pointer;"></i>
                </el-tooltip>
              </span>
              <span v-else>
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    未驗證, 可在
                    <a>權限管理</a>頁面設置
                  </div>
                  <i class="el-icon-warning" style="color:#e54545;cursor: pointer;"></i>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer center">
        <el-button class="subscribe" type="primary" @click="ok1">確定</el-button>
        <el-button @click="dialogSubscribe = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 取消订阅 -->
    <el-dialog title="取消訂閱" :visible.sync="dialogcancel" width="30%">
      <span>取消訂閱雲伺服器儲存問題？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancelsubscribe" type="primary" @click="cancel1">取消訂閱</el-button>
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
// const cityOptions = ["簡訊", "邮件", "站内信"];
export default {
  name: "subscription",
  data() {
    return {
      qudaoCheckList: ["1", "4"], //接收方式
      // qudaoCheckList: ["郵件", "簡訊", "站內信"], //接收方式
      loadingShow1: false, // 加载是否显示
      loadShow: false, // 加载是否显示
      triggerInput: "", //选择触发条件名搜索
      num: 0, //已选择几人
      // cities: cityOptions,
      dialogcancel: false, //取消订阅确认框
      dialogSubscribe: false, //订阅管理确认框
      tableData: [],
      userListArr: [], // 接收人列表数组
      multipleSelection: [],
      okObj: {},
      cancelObj: {},
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
    // 选中管道
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
      this.num = this.selectUserList.length;
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
                this.$nextTick(() => {//回显参数，由于数据返回有误，无法开发
                
                    this.okObj.Receivers.forEach((v, i) => {
                      arr.forEach((item, index) => {
                        if (item.GroupId == v) {
                          console.log(item);
                          this.cam.selectUserGroup = item;
                          this.$refs.multipleTable.toggleRowSelection(
                            item,
                            true
                          );
                        }
                      });
                    });

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
      //取消訂閱
    },
    cancel1() {
      this.dialogcancel = false;
      var params = {
        Version: "2018-07-24",
        Module: "monitor",
        BusinessId: this.cancelObj.BusinessId, //业务id
        AccidentId: this.cancelObj.AccidentId //事件id
      };
      this.axios.post(CANCEL_SUBSCRIPTION, params).then(res => {
        if (res.Response.RequestId) {
          this.$message({
            message: "取消訂閱成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.dialogcancel = false;
          this.getEventList();
        } else {
          let ErrTips = {
            InternalError: "內部錯誤。",
            InvalidParameter: "參數錯誤。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被佔用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
            UnsupportedOperation: "操作不支持。"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response],
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
      console.log(data);
      //订阅
      this.dialogSubscribe = true;
    },
    ok1() {
      this.dialogSubscribe = false;
      var params = {
        Version: "2018-07-24",
        Module: "monitor",
        BusinessId: this.okObj.BusinessId,
        AccidentId: this.okObj.AccidentId
      };
      this.qudaoCheckList.forEach((item, index) => {
        params["NotifyWays." + index] = item;
      });
      this.selectUserList.forEach((item, index) => {
        var data = {};
        data.username = item.Name;
        data.uin = item.Uid;
        //params.Receivers = data;
        console.log(item);

        params["Receivers." + index] = data;
      });
      //  var key, value;
      //   key = item.Name;
      //   value = item.Uid;
      //   var data = {
      //     key: value
      //   };
      //   params["Receivers." + index] = JSON.stringify(data);
      console.log(params);
      this.axios.post(SUBSCRIPTION_ADMINISTRATION, params).then(res => {
        console.log(res);
        if (res.Response.Error === undefined) {
          this.$message({
            message: "訂閱成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.dialogSubscribe = false;
          this.getEventList();
        } else {
          let ErrTips = {
            FailedOperation: "操作失敗。",
            InternalError: "内部錯誤。",
            InvalidParameter: "參數錯誤。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被佔用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
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
        Module: "monitor",
        Language: "zh-CN"
      };
      this.axios.post(SUBSCRIPTION_LIST, params).then(res => {
        console.log(res.Response, "数据");
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.Events;
          this.loadShow = false; //取消加载
        } else {
          this.loadShow = false;
          let ErrTips = {
            FailedOperation: "操作失敗。",
            InternalError: "内部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。",
            ResourceNotFound: "資源不存在。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
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
