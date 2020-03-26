<template>
  <div class="qudaoContent">
    <p>選擇告警接收組</p>
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
          placeholder="請輸入用護組名稱"
        ></el-input>
        <el-button
          icon="el-icon-search"
          style="margin-left:-1px;margin-top:1px;"
          @click="searchKey"
        ></el-button>
      </el-row>
    </p>
    <div>
      <!-- 接收組table -->
      <el-table
        v-if="formInline.jieshou === '0'"
        :data="tableData2"
        v-loading="loadingShow"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        style="width: 96%;margin-left:60px;"
        height="430"
        :default-sort="{ prop: 'changeData', order: 'descending' }"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="GroupName" label="用戶組名"></el-table-column>
        <el-table-column label="用戶名">
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
    </div>
    <p style="display:flex">
      <span>告警渠道&nbsp;&nbsp;</span>
      <el-checkbox-group v-model="qudaoCheckList" @change="selectChannel">
        <p style="margin:0 0 20px 30px;">
          <el-checkbox label="郵件"></el-checkbox>
        </p>
        <p style="margin-left:30px">
          <el-checkbox label="間訊"></el-checkbox>
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
      triggerInput: "", // 查詢關鍵字
      tableData: [],
      tableData2: [], // 接收組數據
      loadingShow: true, // 接收組動畫
      userListArr: [], // 接收人列表數組
      userListLoading: "true", // 接收人加載動畫
      qudaoCheckList: [], //渠道選擇
      formInline: {
        jieshou: "0",
        jieshouArr: [
          {
            value: "0",
            name: "用護組名"
          }
        ]
      },
      groupData: [],
      cam: {
        // 此組件向外暴露的值
        selectUserGroup: [], // 接收組 --> table表格選中
        selectUserList: [], // 接收人 --> table表格選中
        time: [], // 選中的時間
        channel: [] // 選中的渠道
      }
    };
  },
  created() {
    this.userGroup(); // 查詢用戶組
    var data = this.$route.query;
    if (data.NotifyWay) {
      data.NotifyWay.forEach((v, i) => {
        if (v == "EMAIL") {
          v = "郵件";
        } else if (v == "SMS") {
          v = "間訊";
        }
        this.qudaoCheckList.push(v);
      });
    }
  },
  mounted() {
    // this.userGroup(); // 查詢接收組
  },

  methods: {
    // 選中接受組還是接收人
    selectChange() {
      this.triggerInput = "";
      if (this.formInline.jieshou === "0") {
        this.userGroup(); // 查詢接受組
      } else {
        this.userList(); // 查詢接收人
      }
    },
    // 搜索關鍵字
    searchKey() {
      if (this.formInline.jieshou === "0") {
        this.userGroup(); // 查詢用戶組
      } else {
        this.userList(); // 查詢接收人
      }
    },
    // 查詢接收組
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
          } else {
            let ErrTips = {};
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
    // 查詢接收組詳情
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
              this.$nextTick(()=>{
                  if (this.tableData2.length > 0) {
                this.$route.query.ReceiverGroupIds.forEach((v, i) => {
                  this.tableData2.forEach((item, index) => {
                    if (item.GroupId == v) {
                      console.log(item);
                      this.cam.selectUserGroup = item;
                      this.$refs.multipleTable.toggleRowSelection(item, true);
                    }
                  });
                });
              }
              })

              this.loadingShow = false;
            }
          } else {
            let ErrTips = {
              "ResourceNotFound.UserNotExist": "用護不存在"
            };
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
        .catch(error => {
          console.log(error);
        });
    },
    // 接收組 table表格選中觸發的事件
    handleSelectionChange(val) {
      this.cam.selectUserGroup = val;
      this.$emit("camClick", this.cam);
    },
    // 選中渠道
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
