<template>
  <div class="Cam wrap">
    <div class="top">
      <span class="title-left">{{$t('CAM.userGroup.title')}}</span>
    </div>
    <div class="cam_button">
      <el-row class="cam-lt">
        <el-button type="primary" size="small" @click="NewUser">{{$t('CAM.userGroup.addBtn')}}</el-button>
        <el-button
          size="small"
          type="primary"
          :disabled="btnVisible"
          @click="addUsersToGroup"
        >{{$t('CAM.userGroup.createBtn')}}</el-button>
      </el-row>
      <div class="head-container">
        <el-input
          size="small"
          v-model="searchValue"
          clearable
          :placeholder="$t('CAM.userGroup.placeholder')"
          style="width: 300px;"
          @change="toQuery"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="toQuery"></i>
        </el-input>

        <el-dialog
          :title="$t('CAM.userGroup.fields')"
          :visible.sync="gear"
          width="45%"
          :before-close="handleCloseGear"
        >
          <div class="app-cam-alert">
            <div class="app-cam-alert__info">{{$t('CAM.userGroup.chooseMesg')}}</div>
          </div>
          <el-form ref="form" :model="form">
            <el-form-item>
              <el-checkbox-group v-model="form.type">
                <p>
                  <el-checkbox disabled :label="$t('CAM.userGroup.colNmae')" name="type"></el-checkbox>
                </p>
                <p>
                  <el-checkbox :label="$t('CAM.userGroup.colRemark')" name="type"></el-checkbox>
                </p>
                <p>
                  <el-checkbox :label="$t('CAM.userGroup.colCreTime')" name="type"></el-checkbox>
                </p>
                <p>
                  <el-checkbox disabled :label="$t('CAM.userGroup.colHandle')" name="type"></el-checkbox>
                </p>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button
              size="small"
              type="primary"
              @click="gear = false"
            >{{$t('CAM.userGroup.delConfirmBtn')}}</el-button>
            <el-button size="small" @click="gear = false">{{$t('CAM.userGroup.delCancelBtn')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <!-- 表格 -->
    <div class="cam-box" style="height:520px;padding:0;margin-bottom:20px;">
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;"
        height="450"
        @selection-change="handleSelectionChange"
        :empty-text="$t('CAM.strategy.zwsj')"
      >
        <el-table-column prop="GroupId" type="selection" width="29"></el-table-column>
        <el-table-column
          prop="GroupName"
          :label="$t('CAM.userGroup.colNmae')"
          show-overflow-tooltip
          width="240"
        >
          &lt;!&ndash;
          <template slot-scope="scope">
            <p
              @click="Interface(scope.row.GroupId)"
              class="omit"
              type="text"
            >{{scope.row.GroupName}}</p>
          </template>&ndash;&gt;
        </el-table-column>
        <el-table-column prop="Remark" :label="$t('CAM.userGroup.colRemark')" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.Remark ? scope.row.Remark : '-'}}</template>
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          :label="$t('CAM.userGroup.colCreTime')"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column :label="$t('CAM.userGroup.colHandle')" show-overflow-tooltip>
          &lt;!&ndash;
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="addUserGroup(scope.row.GroupId)"
            >{{$t('CAM.userGroup.createBtn')}}</el-button>
            <el-button
              size="mini"
              type="text"
              @click="delUserGroup(scope.row.GroupId)"
            >{{$t('CAM.userGroup.delBtn')}}</el-button>
          </template>&ndash;&gt;
        </el-table-column>
      </el-table>
      <div
        class="Right-style pagstyle"
        style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px"
      >
        <div style="flex:1;display:flex;justify-content: flex-end;">
          <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CAM.strip")}}</span>
          <el-pagination
            :page-size="pagesize"
            :pager-count="7"
            layout="prev, sizes, pager, next"
            :page-sizes="[10, 20, 30, 40, 50]"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :total="TotalCount"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- dialog 用户组弹出框  start -->
    <el-dialog
      :title="$t('CAM.userGroup.createBtn')"
      :visible.sync="dialogVisible"
      width="75%"
      :before-close="handleClose"
      custom-class="dialogStyle"
    >
      <div class="container">
        <div class="container-left">
          <p>{{$t('CAM.userGroup.selection')}}（共{{userData.length}}{{$t('CAM.strip')}}）</p>
          <el-input size="small" clearable v-model="inpVal" style="width:100%" @change="toQueryUser">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="toQueryUser"></i>
          </el-input>
          <el-table
            class="table-left"
            ref="multipleOption"
            :data="userData"
            size="small"
            :height="tableHeight"
            tooltip-effect="dark"
            style="width: 100%"
            @row-click="selectedRow"
            @selection-change="handleSelectionChangeUser"
            v-loading="loading1"
            :empty-text="$t('CAM.strategy.zwsj')"
          >
            <el-table-column type="selection" prop="Uin" width="28" :selectable="checkboxT"></el-table-column>
            <el-table-column prop="Name" :label="$t('CAM.userGroup.user')" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('CAM.userList.userChose')" width="100">
              <template slot-scope="scope">
                <p>{{$t('CAM.userGroup.childUser')}}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="direction">
          <div class="direction-icon">
            <i class="iconfont">&#xe603;</i>
          </div>
        </div>
        <div class="container-right">
          <span>{{$t('CAM.userGroup.Star')}}（{{selNum}}）</span>
          <el-table
            class="table-left"
            ref="multipleSelected"
            :data="userSelData"
            tooltip-effect="dark"
            size="small"
            :height="tableHeight"
            style="width: 100%"
            :empty-text="$t('CAM.strategy.zwsj')"
          >
            <el-table-column prop="Name" :label="$t('CAM.userGroup.user')" show-overflow-tooltip></el-table-column>
            <el-table-column :label="$t('CAM.userList.userChose')" width="100">
              <template slot-scope="scope">
                <p>{{$t('CAM.userList.userChose')}}</p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userGroup.colHandle')" width="50">
              &lt;!&ndash;
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, userSelData)"
                  type="text"
                  size="small"
                >x</el-button>
              </template>&ndash;&gt;
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addUser">{{$t('CAM.userList.suerAdd')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  USER_GROUP,
  USER_LIST,
  GROUP_USERS,
  DELE_GROUP,
  ADD_GROUPTOLIST
} from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  data() {
    return {
      inpVal: "",
      tableHeight: 300,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      searchValue: "",
      gear: false,
      loading1: true,
      userData: [],
      userAllData: [],
      userSelData: [],
      selectData: [],
      dialogVisible: false,
      tableData: [],
      search: "",
      totalNum: 0,
      // 分页
      Page: 1,
      size: 10,
      total: 0,
      selTotal: 0,
      selNum: 0,
      btnVisible: true,
      selectedGroupId: 0,
      loading: true,
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      isAddUsersToGroup: false, // 是否添加到多个组
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    checkboxT(row, index) {
      if (row.status == 1) {
        return false;
      } else {
        return true;
      }
    },
    // page操作
    handleCurrentChange(val) {
      this.currpage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.init()
    },
    _inpVal() {
      if (this.inpVal == "") {
        this.userData = this.json;
        this.currpage = 1;
        this.init();
      }
    },
    // 初始化方法。
    init() {
      this.loading = true;
      this.selTotal = 0;
      let params = {
        Version: "2019-01-16",
        Page: this.currpage,
        Rp: this.pagesize
      };
      if (this.searchValue != null && this.searchValue != "") {
        params["Keyword"] = this.searchValue;
      }
      this.axios
        .post(USER_GROUP, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.tableData = res.Response.GroupInfo;
            this.total = res.Response.TotalNum;
            this.TotalCount = res.Response.TotalNum;
            this.loading = false;
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
            this.loading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    async addUsersToGroup() {
      this.isAddUsersToGroup = true
      this.loading1 = true
      this.dialogVisible = true
      const params = {
        Version: "2019-01-16"
      }
      let userData = []
      let res = []
      // 获取用户组管理用户
      let owneruserData = []
      res = await this.axios.post(USER_LIST, params)
      if (res.Response.Error !== undefined) {
        let ErrTips = {};
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        })
        return
      }
      userData = res.Response.Data
      this.userAllData = userData
      this.userAllData1 = userData
      res = await Promise.all(this.selectData.map(item => {
        const params = {
          Version: "2019-01-16",
          GroupId: item.GroupId,
        };
        return this.axios.post(GROUP_USERS, params)
      }))
      res.forEach(resp => {
        if (resp.Response.Error !== undefined) {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          owneruserData = [...owneruserData, ...resp.Response.UserInfo]
          userData.forEach(item => {
            resp.Response.UserInfo.forEach(user => {
              if (item.Uid === user.Uid) {
                item.status = 1
              } else if (item.status !== 1) {
                item.status = 0
              }
            })
          })
        }
      })
      if (owneruserData) {
        for (var i = 0; i < owneruserData.length; i++) {
          let ownerObj = owneruserData[i];
          for (var j = 0; j < this.userAllData.length; j++) {
            let allObj = this.userAllData[j];
            if (allObj.Uin === ownerObj.Uin) {
              this.userAllData.splice(j, 1);
            }
          }
        }
        this.userData = this.userAllData;
        this.json = this.userData;
      } else {
        this.userData = this.userAllData;
        this.json = this.userData;
      }
      this.loading1 = false
    },
    // 打开添加用户页面
    addUserGroup(rowId) {
      this.loading1 = true;
      if (rowId != undefined && rowId != "") {
        this.selectedGroupId = rowId;
      }
      let params = {
        Version: "2019-01-16"
      };
      this.axios
        .post(USER_LIST, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.userData = [];
            this.userAllData1 = res.Response.Data;
            const param = {
              Version: "2019-01-16",
              GroupId: rowId
            };
            this.axios.post(GROUP_USERS, param).then(res => {
              if (res.Response.Error === undefined) {
                this.userAllData1.forEach(item => {
                  item.status = 0;
                  res.Response.UserInfo.forEach(val => {
                    if (val.Uid == item.Uid) {
                      item.status = 1;
                    }
                  });
                });
                this.userAllData = this.userAllData1;
                this.totalNum = this.userData.length;
                // this.userData = this.userAllData1;
                this.getUsers();
                // 获取数据成功，打开dialog。
                this.dialogVisible = true;
                this.loading1 = false;
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
            });
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
        .catch(error => {
          console.log(error);
        });
    },
    // 用户组所属子用户查询
    getUsers() {
      let _this = this;
      // 获取用户组管理用户
      let owneruserData = [];
      let paramsGroup = {
        GroupId: this.selectedGroupId,
        Version: "2019-01-16"
      };
      this.axios
        .post(GROUP_USERS, paramsGroup)
        .then(resGroup => {
          if (resGroup.Response.Error === undefined) {
            // 不直接将子用户信息赋予用户组选择框中,是避免页面出现 过滤后的子用户信息刷新覆盖初始信息
            owneruserData = resGroup.Response.UserInfo;
            // 用户组拥有子用户，系统将拥有子用户从用户组添加框中去掉，避免重复选择
            if (owneruserData != "") {
              for (var i = 0; i < owneruserData.length; i++) {
                let ownerObj = owneruserData[i];
                for (var j = 0; j < _this.userAllData.length; j++) {
                  let allObj = _this.userAllData[j];
                  if (allObj.Uin === ownerObj.Uin) {
                    _this.userAllData.splice(j, 1);
                  }
                }
              }
              _this.userData = _this.userAllData;
              _this.json = _this.userData;
            } else {
              _this.userData = _this.userAllData;
              _this.json = _this.userData;
            }
          } else {
            let ErrTips = {
              "ResourceNotFound.GroupNotExist": "用戶組不存在"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[resGroup.Response.Error.Code],
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
    // 删除用户组
    delUserGroup(groupId) {
      this.$confirm(
        this.$t("CAM.userGroup.delHint"),
        this.$t("CAM.userGroup.delTitle"),
        {
          confirmButtonText: this.$t("CAM.userGroup.delConfirmBtn"),
          cancelButtonText: this.$t("CAM.userGroup.delCancelBtn"),
          type: "warning"
        }
      )
        .then(() => {
          let params = {
            Version: "2019-01-16",
            GroupId: groupId
          };
          this.axios.post(DELE_GROUP, params).then(data => {
            if (data.Response.Error === undefined) {
              this.$message({
                type: "success",
                message: "刪除成功",
                duration: 0,
                showClose: true
              });
              this.init();
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
          });
        })
        .catch(() => {
          // this.$message({ type: 'info', message: '已取消删除' })
        });
    },
    // 用户组添加用户
    addUser() {
      let GroupId = this.selectedGroupId;
      let value = this.userSelData;
      if (value != "") {
        let promises = []
        if (this.isAddUsersToGroup) {
          promises = this.selectData.map(item => {
            const params = {
              Version: "2019-01-16",
            }
            for (var i = 0; i < value.length; i++) {
              params["Info." + i + ".Uid"] = value[i].Uid;
              params["Info." + i + ".GroupId"] = item.GroupId;
            }
            return this.axios.post(ADD_GROUPTOLIST, params)
          })
        } else {
          let params = {
            Version: "2019-01-16"
          };
          for (var i = 0; i < value.length; i++) {
            params["Info." + i + ".Uid"] = value[i].Uid;
            params["Info." + i + ".GroupId"] = GroupId;
          }
          promises = [this.axios.post(ADD_GROUPTOLIST, params)]
        }
        
        let msg
        Promise.all(promises).then(res => {
          res.forEach(data => {
            if (data.Response.Error === undefined) {
              if (msg) msg.close()
              msg = this.$message({
                message: this.$t("CAM.userGroup.successInfo"),
                type: "success",
                duration: 0,
                showClose: true
              });
              this.init();
            } else {
              let ErrTips = {
                "InvalidParameter.GroupNotExist": "用戶組不存在",
                "InvalidParameter.GroupUserFull":
                  "用戶組中的子用戶數量達到上限",
                "InvalidParameter.UserGroupFull":
                  "子用戶加入的用戶組數量達到上限",
                "ResourceNotFound.UserNotExist": "用戶不存在"
              };
              let ErrOr = Object.assign(ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[data.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          })
        })
      this.handleClose()
      }
    },
    NewUser() {
      this.$router.push({
        name: "NewUserGroup"
      });
    },
    pageChange(e) {
      this.page = e;
      this.init();
    },
    sizeChange(e) {
      this.size = e;
      this.init();
    },
    // 首页表格选择状态处理
    handleSelectionChange(val) {
      this.selectData = val
      if (val != "") {
        this.btnVisible = false;
        this.selectedGroupId = val[0].GroupId;
        this.selTotal = val.length;
      } else {
        this.btnVisible = true;
      }
    },
    // 关闭弹出框
    handleClose() {
      this.isAddUsersToGroup = false
      this.dialogVisible = false;
    },
    // 自定义弹出框
    handleCloseGear() {
      this.gear = false;
    },
    // 子用户选择方法
    handleSelectionChangeUser(val) {
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      this.userSelData = val;
      this.selNum = this.userSelData.length;
    },
    // 子用户移除
    selectedRow(row, column, event) {
      // 设置选中或者取消状态
      this.$refs.multipleOption.toggleRowSelection(row);
    },
    // 子用户单行移除
    deleteRow(index, rows) {
      // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
      this.$refs.multipleOption.toggleRowSelection(rows[index], false);
    },
    // 用户组查询方法
    toQuery() {
      this.currpage = 1;
      this.init();
    },
    // 子用户穿梭框查询
     toQueryUser() {
       if(this.inpVal != null && this.inpVal != "") {
          var arr = [];
          this.userAllData.forEach(item => {
            if (item.Name.includes(this.inpVal)) {
              arr.push(item);
            }
          });
          this.userData = arr;
       } else {
          this.userData = this.userAllData;
       }
    },
    //用户组详情
    Interface(groupId) {
      this.$router.push({
        name: "Interfacedetails",
        query: {
          GroupId: groupId
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  border-radius: 0;
  height: 30px !important;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px;
}
.pagstyle {
  padding: 20px;
  height: 70px;
  display: flex;
  align-items: center;

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.Cam {
  .omit {
    color: #006eff;
    cursor: pointer;
    width: 220px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .top {
    height: 50px;
    line-height: 50px;
    margin-bottom: 20px;
    padding: 0 20px;
    background: #fff;

    .title-left {
      font-size: 16px;
      font-weight: bolder;
    }

    .title-right {
      float: right;

      span:hover {
        color: #006eff;
        border-bottom: 1px solid #006eff;
      }
    }
  }

  .content {
    padding: 20px;

    .operation {
      margin-bottom: 10px;
    }

    .search {
      overflow: hidden;
      padding: 10px 0;

      .search-left {
        float: left;

        .searchBox {
          display: inline-block;
        }
      }

      .search-right {
        float: right;
        margin-top: 10px;

        :hover {
          cursor: pointer;
        }

        i {
          padding: 0 3px;
        }
      }
    }

    .cam-pag {
      padding: 10px 0;
      display: flex;
      justify-content: flex-end;
    }
  }

  .direction {
    display: table-cell;
    width: 38px;
    text-align: center;
    vertical-align: middle;
  }

  .direction-icon {
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
    background-repeat: no-repeat;
    background-position: inherit;
    font-size: 0;
  }

  .container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container-left {
    display: flex;
    flex-direction: column;
    width: 45%;
    height: 600px;
    justify-content: center;
  }
  .container-right {
    display: flex;
    width: 45%;
    height: 600px;
    flex-direction: column;
    justify-content: center;
  }

  .cam_button {
    width: 96%;
    height: 40px;
    margin: 10px auto;
  }

  .cam-lt {
    float: left;
  }

  .head-container {
    float: right;
  }

  .cam_button {
    position: relative;
  }

  .cam-box {
    width: 96%;
    padding: 20px;
    background-color: #fff;
    margin: 0 auto;
  }

  .block {
    text-align: right;
    padding-top: 10px;
  }

  .btn-fr {
    float: right;
  }

  .pad {
    padding: 0 20px 0 20px;
  }

  .bor-box {
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    //max-width: 1360px;
    margin-left: auto;
  }

  .bor-box p {
    line-height: 1.5;
    margin-bottom: 8px;
  }

  .bor-box .num-item {
    text-indent: -10px;
    padding-left: 18px;
    margin-bottom: 0;
  }

  .ifier {
    cursor: pointer;
    font-size: 140%;
    color: #888;
    position: absolute;
    right: 3%;
    top: 18%;
  }

  .gear {
    cursor: pointer;
    font-size: 140%;
    color: #888;
    padding-left: 6px;
  }

  .fier {
    cursor: pointer;
    font-size: 140%;
    color: #888;
    position: absolute;
    right: 3%;
    top: 7%;
  }

  .app-cam-alert {
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
  }

  .dialogStyle > .el-dialog__body {
    padding: 10px 20px 20px;
  }
}
</style>
