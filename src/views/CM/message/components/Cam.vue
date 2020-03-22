<template>
  <div class="qudaoContent">
    <p>选择告警接收组</p>
    <p class="receiving-objects">
      <el-select
        v-model="formInline.jieshou"
        style="width:100px;margin-top:1px;"
        @change="selectChange"
      >
        <el-option
          v-for="(item, index) in formInline.jieshouArr"
          :key="index"
          :label="item.name"
          :value="item.value"
          label-width="40px"
        ></el-option>
      </el-select>
      <el-row class="seek" style="display:flex;margin:0 10px;">
        <el-input
          v-model="triggerInput"
          style="margin-left:-1px;margin-top:1px;"
          v-if="formInline.jieshou === '0'"
          placeholder="請輸入用戶組名稱"
        ></el-input>
        <el-input
          v-model="triggerInput"
          style="margin-left:-1px;margin-top:1px;"
          v-if="formInline.jieshou === '1'"
          placeholder="請輸入用戶名稱"
        ></el-input>
        <el-button
          icon="el-icon-search"
          style="margin-left:-1px;margin-top:1px;"
          @click="searchKey"
        ></el-button>
      </el-row>
    </p>
    <div>
      <!-- 接收组table -->
      <el-table
        v-if="formInline.jieshou === '0'"
        :data="tableData2"
        v-loading="loadingShow"
        @selection-change="handleSelectionChange"
        style="width: 96%;margin-left:60px;"
        height="430"
        :default-sort="{ prop: 'changeData', order: 'descending' }"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="GroupName" label="用户组名"></el-table-column>
        <el-table-column label="用户名">
          <template slot-scope="scope">
            <span
              v-if="scope.row.UserInfo.length !== 0"
              v-for="(item,index) in scope.row.UserInfo"
              :key="index"
            >
              <span>{{item.Name}}</span>
              <span v-show="scope.row.UserInfo.length-1 !== index">、</span>
            </span>
            <span v-if="scope.row.UserInfo.length === 0">未配置接收人</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 接收人table -->
      <el-table
        v-if="formInline.jieshou === '1'"
        :data="userListArr"
        v-loading="userListLoading"
        @selection-change="handleSelectionChange2"
        style="width: 96%;margin-left:60px;"
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
    <p style="display:flex">
      <span>告警渠道&nbsp;&nbsp;</span>
      <el-checkbox-group v-model="qudaoCheckList" @change="selectChannel">
        <p style="margin:0 0 20px 30px;">
          <el-checkbox label="郵件"></el-checkbox>
        </p>
        <p style="margin-left:30px">
          <el-checkbox label="簡訊"></el-checkbox>
        </p>
      </el-checkbox-group>
    </p>
  </div>
</template>

<script>
import { USER_GROUP, GET_GROUP, LIST_SUBACCOUNTS } from "@/constants";
export default {
  data() {
    return {
      triggerInput: "", // 查询关键字
      tableData: [],
      tableData2: [], // 接收组数据
      loadingShow: true, // 接收组动画
      userListArr: [], // 接收人列表数组
      userListLoading: "true", // 接收人加载动画
      qudaoCheckList: [], //渠道选择
      formInline: {
        jieshou: "0",
        jieshouArr: [
          {
            value: "0",
            name: "用戶組名"
          },
        //   {
        //     value: "1",
        //     name: "用戶名"
        //   }
        ]
      },
      groupData: [],
      cam: {
        // 此组件向外暴露的值
        selectUserGroup: [], // 接收组 --> table表格选中
        selectUserList: [], // 接收人 --> table表格选中
        time: [], // 选中的时间
        channel: [] // 选中的渠道
      }
    };
  },
  created() {},
  mounted() {
    this.userGroup(); // 查询接收组
  },
  methods: {
    // 选中接受组还是接收人
    selectChange() {
      this.triggerInput = "";
      if (this.formInline.jieshou === "0") {
        this.userGroup(); // 查询接受组
      } else {
        this.userList(); // 查询接收人
      }
    },

    // 搜索关键字
    searchKey() {
      if (this.formInline.jieshou === "0") {
        this.userGroup(); // 查询用户组
      } else {
        this.userList(); // 查询接收人
      }
    },

    // 查询接收组
    userGroup() {
      this.loadingShow = true;
      let params = {
        Version: "2019-01-16",
        Page: 1,
        Rp: 1000
      };
      if (this.triggerInput != null && this.triggerInput != "") {
        params["Keyword"] = this.triggerInput;
      }
      this.axios
        .post(USER_GROUP, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.tableData = res.Response.GroupInfo;
            this.groupData = [];
            this.loadingShow = false;
          } else {
            let ErrTips = {};
            this.loadingShow = false;
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        })
        .then(() => {
          this.tableData.forEach(item => {
            this.userGroupDetail(item.GroupId);
          });
        });
    },

    // 查询接收组详情
    userGroupDetail(GroupId) {
      let params = {
        Version: "2019-01-16"
      };
      let groupId = GroupId;
      if (groupId != "" && groupId != null) {
        params["GroupId"] = groupId;
      }
      this.axios
        .post(GET_GROUP, params)
        .then(res => {
          this.loadingShow = false;
          if (res.Response.Error === undefined) {
            this.groupData.push(res.Response);
            if (this.groupData.length === this.tableData.length) {
              this.tableData.forEach(item => {
                this.groupData.forEach(element => {
                  if (item.GroupId === element.GroupId) {
                    item.UserInfo = element.UserInfo;
                  }
                });
              });
              this.tableData2 = this.tableData;
            }
          } else {
            let ErrTips = {
              "ResourceNotFound.UserNotExist": "用戶不存在"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 查询接收人数据
    userList() {
      this.userListLoading = true;
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
          this.userListLoading = false;
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

    // 接收组 table表格选中触发的事件
    handleSelectionChange(val) {
      this.cam.selectUserGroup = val;
      this.cam.selectUserList = [];
      this.$emit("camClick", this.cam);
    },

    // 接收人 table表格选中触发的事件
    handleSelectionChange2(val) {
      this.cam.selectUserGroup = [];
      this.cam.selectUserList = val;
      this.$emit("camClick", this.cam);
    },

    // 选中渠道
    selectChannel() {
      this.cam.channel = this.qudaoCheckList;
      this.$emit("camClick", this.cam);
    }
  }
};
</script>

<style lang="scss" scoped>
.qudaoContent >>> .el-input__inner {
  width: 200px;
}
.qudaoContent {
  width: 100%;

  .receiving-objects {
    margin-top: 30px;
    margin-left: 60px;
    a {
      line-height: 30px;
    }
  }

  > div {
    margin: 10px 0;
    padding: 10px 20px;
    line-height: 30px;

    .content {
      margin-top: 10px;
      padding: 10px;
    }
  }

  ::v-deep .el-icon-time {
    line-height: 30px;
  }
}

.qudaoContent {
  .receiving-objects {
    display: flex;
    align-items: center;
  }
}
.effective-period {
  ::v-deep .el-range-input {
    margin-top: 5px;
  }
  ::v-deep .el-range-separator {
    width: 7% !important;
  }
}
</style>
