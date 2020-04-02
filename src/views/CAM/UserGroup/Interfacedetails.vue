<template>
  <div class="Cam wrap">
    <Headcom :title="groupData.GroupName" :backShow="true" @_back="backoff" />
    <!-- 内容 -->
    <div class="Interface">
      <!-- 用户组详情上半部分页面 start -->
      <div class="Interface-top" v-loading="loading1">
        <div class="upper-side">
          <h3 class="information">{{$t('CAM.userGroup.groupTest')}}</h3>
          <el-link @click="editGroup" class="edit" type="primary">{{$t('CAM.userList.updataUser')}}</el-link>
        </div>
        <!-- 用户组详情页面 start -->
        <div v-show="flag==true">
          <el-form ref="form" :model="groupData" label-width="100px">
            <el-form-item :label="$t('CAM.userGroup.colNmae')" required>
              <span>{{groupData.GroupName}}</span>
            </el-form-item>
            <el-form-item :label="$t('CAM.userGroup.colRemark')">
              <span>{{groupData.Remark ? groupData.Remark : '-'}}</span>
            </el-form-item>
            <el-form-item :label="$t('CAM.userGroup.colCreTime')" required>
              <span>{{groupData.CreateTime}}</span>
            </el-form-item>
          </el-form>
        </div>
        <!-- 用户组详情页面 end -->
        <!-- 用户组编辑页面 start -->
        <div v-show="flag==false">
          <el-form ref="form" :model="groupData" label-width="100px">
            <el-form-item :label="$t('CAM.userGroup.colNmae')" required>
              <el-input size="small" v-model="groupData.GroupName">{{$t('CAM.userGroup.testApi')}}</el-input>
              <i class="el-icon-circle-check mark"></i>
            </el-form-item>
            <el-form-item :label="$t('CAM.userGroup.colRemark')">
              <el-input size="small" v-model="groupData.Remark"></el-input>
              <i class="el-icon-circle-check mark"></i>
            </el-form-item>
            <el-form-item label>
              <el-button size="small" type="primary" @click="saveGroup">保存</el-button>
              <el-button size="small" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 用户组编辑页面 end -->
      </div>
      <!-- 用户组详情上半部分页面 end -->
      <!-- 用户组详情下半部分页面 start -->
      <div class="tabswitch" v-loading="loading">
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="policiesLable" name="first">
              <div class="app-cam-alert">
                <div class="app-cam-alert__info">{{$t('CAM.userGroup.polictTitle')}}</div>
              </div>
              <el-button
                type="primary"
                @click="openPolicies"
                size="small"
              >{{$t('CAM.userGroup.getPolicy')}}</el-button>
              <div>
                <el-table :data="policiesData" style="width: 100%;" height="300" :empty-text="$t('CAM.strategy.zwsj')">
                  <el-table-column
                    :label="$t('CAM.userList.strategyNames')"
                    show-overflow-tooltip
                    width="400"
                  >
                    <template slot-scope="scope">
                      <!-- <p>{{scope.row.PolicyName}}</p> -->
                      <el-button
                        @click="policyDetail(scope.row)"
                        size="mini"
                        type="text"
                      >{{scope.row.PolicyName}}</el-button>
                      <p class="omit">{{scope.row.Remark}}</p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('CAM.userList.AssociationTime')"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span>{{ scope.row.AddTime }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('CAM.userGroup.colHandle')" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-link type="primary" @click="delPolicy(scope.row.PolicyId)">解除</el-link>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div
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
              <!-- 关联策略弹出框 start -->
              <el-dialog
                :title="$t('CAM.userList.RelatedPolicies')"
                custom-class="dialogStyle"
                :visible.sync="dialogVisible"
                width="75%"
                :before-close="handleClosePolicies"
              >
                <transfer
                  :groupId="groupId"
                  ref="policiesRef"
                />
                <div slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    @click="addPoliciesToGroup"
                  >{{$t('CAM.userList.suerAdd')}}</el-button>
                  <el-button @click="dialogVisible = false">取 消</el-button>
                </div>
              </el-dialog>
              <!-- 关联策略弹出框 end -->
            </el-tab-pane>
            <!-- tab 用户组用户信息页面 start -->
            <el-tab-pane :label="userLabel" name="second">
              <div class="addbtn">
                <el-button @click="openUser" size="small" type="primary">添加</el-button>
                <el-button size="small" type="primary" :disabled="btnVisible" @click="delAll">移出用戶</el-button>
              </div>
              <div>
                <el-table
                  ref="multipleTable"
                  :data="owneruserData"
                  tooltip-effect="dark"
                  height="300"
                  style="width: 100%;"
                  @selection-change="handleSelectionChangeUsers"
                  :empty-text="$t('CAM.strategy.zwsj')"
                >
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column :label="$t('CAM.userGroup.colNmae')" prop="Name">
                    <template slot-scope="scope">
                      <el-button
                        @click="userDetails(scope.row)"
                        size="mini"
                        type="text"
                      >{{scope.row.Name}}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="CreateTime" :label="$t('CAM.userList.createTime')">
                    <template slot-scope="scope">{{ scope.row.CreateTime }}</template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    :label="$t('CAM.userList.userRemark')"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">{{ scope.row.remarks }}</template>
                  </el-table-column>
                  <el-table-column label="操作">
                    &lt;!&ndash;
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="deleteRow(scope.row.Uid)"
                        type="text"
                        size="small"
                      >{{$t('CAM.userGroup.removeGrop')}}</el-button>
                    </template>&ndash;&gt;
                  </el-table-column>
                </el-table>
              </div>
              <div
                style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px"
              >
                <div style="flex:1;display:flex;justify-content: flex-end;">
                  <span class="pagtotal">共&nbsp;{{TotalCounts}}&nbsp;{{$t("CAM.strip")}}</span>
                  <el-pagination
                    :page-size="pagesizes"
                    :pager-count="7"
                    layout="prev, sizes, pager, next"
                    :page-sizes="[10, 20, 30, 40, 50]"
                    @current-change="handleCurrentChangeUser"
                    @size-change="handleSizeChangeUser"
                    :total="TotalCounts"
                  ></el-pagination>
                </div>
              </div>
              <!-- dialog 用户组弹出框  start -->
              <el-dialog
                title="添加用戶"
                :visible.sync="dialogUser"
                width="950px"
                :before-close="handleCloseUser"
                custom-class="dialogStyle"
              >
                <transfer1 :groupIds="[groupId]" ref="transfer" :visible.sync="dialogUser" />
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogUser = false">取 消</el-button>
                  <el-button type="primary" @click="addUserToGroup">{{$t('CAM.userList.suerAdd')}}</el-button>
                </div>
              </el-dialog>
              <!-- dialog 用户组弹出框 end -->
            </el-tab-pane>
            <!-- tab 用户组用户信息页面 end -->
          </el-tabs>
        </template>
      </div>
      <!-- 用户组详情下半部分页面 end -->
    </div>
    <el-dialog
      title="移出組"
      :visible.sync="GroupLoading"
      width="30%"
    >
      <span>{{$t('CAM.userList.delRowUser')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="GroupLoading = false">{{$t('CAM.userList.handClose')}}</el-button>
        <el-button type="primary" @click="removeGroupUser">{{$t('CAM.userList.suerAdd')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import transfer from "../Role/component/transfer2";
import transfer1 from "./transfer";
import Headcom from "@/components/public/Head"; //头部组件引入
import {
  GET_GROUP,
  DEL_USERTOGROUP,
  UPDATA_GROUP,
  GROUP_USERS,
  USER_LIST,
  GROUP_POLICY,
  ADD_GROUPTOLIST,
  POLICY_LIST,
  DETACH_POLICY,
  ATTACH_GROUP,
  ATTACH_GROUP_POLICIES
} from "@/constants";
export default {
  data() {
    return {
      GroupLoading: false,
      rolePolicies: [],
      title: "",
      loading: true,
      loading1: true,
      multipleSelection: [],
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      TotalCounts: 10,
      pagesizes: 10,
      currpages: 1,
      tableHeight: 300,
      flag: true,
      activeName: "first",
      dialog: false,
      dialogUser: false,
      dialogVisible: false,
      groupId: "",
      groupData: {},
      owneruserData: [],
      userRemSelData: [],
      btnVisible: true,
      userLabel: "",
      policiesLable: "",
      pagePolicies: 1,
      rpPolicies: 10,
      totalPolicies: 0,
      totalNumPolicies: 0,
      totalNumUser: 0,
      selNum: 0,
      userData: [],
      userSelData: [],
      pageUser: 1,
      rpUser: 10,
      totalUser: 0,
      policiesSelectedData: [],
      policiesData: [],
      policiesAllData: [],
      searchUser: "",
      searchPolicies: ""
    };
  },
  components: {
    transfer,
    transfer1,
    Headcom
  },
  mounted() {
    this.groupId = this.$route.query.GroupId;
    this.init();
    // this.tableHeight = window.innerHeight - this.$refs.multipleOptionPolicies.$el.offsetTop - 50;
  },
  methods: {
    delPolicy(id) {
      this.$confirm("是否確定為該用戶組解除此策略？解除後該用戶組內用戶將無法獲得該策略所描述的相關許可權。", "解除策略", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.deletePolicies(id);
      });
    },
    search() {
      if (this.searchUser == "") {
        this.userData = this.userAllData;
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.selectGroupPolicies();
    },
    handleCurrentChange(val) {
      this.currpage = val;
      this.selectGroupPolicies();
    },
    // 初始化时，获取用户组信息
    init() {
      this.selectGroupPolicies();
      this.selectGroup();
    },
    // 查询用户组详情
    selectGroup() {
      this.loading1 = true;
      let params = {
        Version: "2019-01-16"
      };
      let groupId = this.$route.query.GroupId;
      if (groupId != "" && groupId != null) {
        params["GroupId"] = groupId;
      }
      this.axios
        .post(GET_GROUP, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            // .slice((currpages - 1) * pagesizes, currpages * pagesizes)
            this.groupData = res.Response;
            this.owneruserData = res.Response.UserInfo.slice(
              (this.currpages - 1) * this.pagesizes,
              this.currpages * this.pagesizes
            );
            this.TotalCounts = res.Response.UserInfo.length;
            this.userLabel = "用戶（" + res.Response.UserInfo.length + "）";
            this.title = this.groupData.GroupName;
            this.loading1 = false;
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
    delAll() {
      this.GroupLoading = true
    },
    removeGroupUser() {
      this.deleteUser(this.userRemSelData.map(user => user.Uid))
    },
    // 删除用户
    deleteUser(uids) {
      let params = {
        Version: "2019-01-16"
      };
      const groupId = this.$route.query.GroupId
      uids.forEach((uid, i) => {
        params[`Info.${i}.Uid`] = uid
        params[`Info.${i}.GroupId`] = groupId
      })
      this.axios
        .post(DEL_USERTOGROUP, params)
        .then(data => {
          if (data.Response.Error === undefined) {
            this.$message({
              message: '移出成功',
              type: 'success',
              showClose: true,
              duration: 0
            });
            this.GroupLoading = false
            this.selectGroup(); // 重新加载页面
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
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 编辑用户组
    editGroup() {
      this.flag = !this.flag;
      if (this.flag == true) {
      } else if (this.flag == false) {
      }
    },
    //取消编辑
    cancel() {
      setTimeout(() => {
        this.flag = !this.flag;
      }, 500);
      this.selectGroup();
    },
    // 更新用户组
    saveGroup() {
      if (this.groupData.GroupName == "") {
        this.$message({
          showClose: true,
          message: "用戶組名稱不能為空",
          duration: 0
        });
      } else {
        if (this.groupData.GroupName.length > 30) {
          this.$message({
          showClose: true,
          message: "用戶組名稱長度不能超過30",
          duration: 0
        });
          return
        }
        let groupId = parseInt(this.$route.query.GroupId);
        let params = {
          Version: "2019-01-16",
          GroupId: groupId
        };
        if (this.groupData.GroupName != "") {
          params["GroupName"] = this.groupData.GroupName;
        }
        if (this.groupData.Remark != "") {
          params["Remark"] = this.groupData.Remark;
        }
        this.axios
          .post(UPDATA_GROUP, params)
          .then(res => {
            if (res.Response.Error === undefined) {
              this.$message({
                showClose: true,
                message: "編輯成功",
                type: "success",
                duration: 0
              });
              this.init();
            } else {
              let ErrTips = {
                "InvalidParameter.GroupNameInUse": "用戶組名稱重複",
                "ResourceNotFound.GroupNotExist": "用戶組不存在"
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
        this.flag = !this.flag;
      }
    },
    // 获取用户组所属子用户信息
    getUsers() {
      this.loading = true;
      let groupId = parseInt(this.$route.query.GroupId);
      let paramsGroup = {
        GroupId: groupId,
        Page: this.pageUser,
        Rp: this.rpUser,
        Version: "2019-01-16"
      };
      this.axios
        .post(GROUP_USERS, paramsGroup)
        .then(resGroup => {
          if (resGroup.Response.Error === undefined) {
            this.owneruserData = resGroup.Response.UserInfo.slice(
              (this.currpages - 1) * this.pagesizes,
              this.currpages * this.pagesizes
            );
            this.totalUser = resGroup.Response.TotalNum;
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
          this.loading = false;
          // this.userLabel = '用户（'+this.owneruserData.length+'）'
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 打开用户组列表穿梭框
    openUser() {
      this.dialogUser = true;
    },
    // 添加用户到用户组
    addUserToGroup() {
      const user = this.$refs.transfer.selectedUsersWithoutGroup
      if (user.length === 0) {
        return void this.$message({
                message: '請選擇用戶',
                type: "error",
                showClose: true,
                duration: 0
              });
      }
      let groupId = parseInt(this.$route.query.GroupId);

        let params = {
          Version: "2019-01-16"
        };
        user.forEach((user, i) => {
          params[`Info.${i}.Uid`] = user.Uid
          params[`Info.${i}.GroupId`] = groupId
        })
        this.axios
          .post(ADD_GROUPTOLIST, params)
          .then(data => {
            if (data.Response.Error === undefined) {
              this.$message({
                showClose: true,
                message: "添加成功",
                duration: 0,
                type: "success"
              });
              this.dialogUser = false
              this.init()
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
          .catch(error => {
            console.log(error);
          });
    },
    toQueryUser() {
      console.log(this.userAllData)
      if (this.searchUser == "") {
        this.userData = this.userAllData;
      } else {
        var arr = [];
        this.userData.forEach(item => {
          if (item.Name.includes(this.searchUser)) {
            arr.push(item);
          }
        });
        this.userData = arr;
      }
    },
    // 从用户组移除子用户信息，单条移除
    deleteRow(uid) {
      this.$confirm("移出后，该用户将无法接收到该组的站內信通知", "移出用戶", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.deleteUser([uid]);
      });
    },
    // 子用户多选事件，移除多条用户组子用户使用
    handleSelectionChangeUsers(val) {
      //汇总选中的数据。
      if (val != "") {
        this.btnVisible = false;
        this.userRemSelData = val;
      } else {
        this.btnVisible = true;
      }
    },
    selectedRow(row, column, event) {
      // 设置选中或者取消状态
      this.$refs.multipleOptionUser.toggleRowSelection(row);
    },
    handleSelectionChangeUser(val) {
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      this.userSelData = val;
      this.selNum = this.userSelData.length;
    },
    // 用户组子用户分页
    handleCurrentChangeUser(e) {
      this.pageUser = e;
      this.getUsers();
    },
    // 用户组子用户分页
    handleSizeChangeUser(e) {
      this.rpUser = e;
      this.getUsers();
    },
    userDetails(val) {
      this.$router.push({
        path: "/detailsUser",
        query: {
          detailsData: val.Name,
          uid: val.Uid
        }
      });
    },
    // 查询用户关联策略信息
    selectGroupPolicies() {
      this.loading = true;
      let groupId = parseInt(this.$route.query.GroupId);
      let params = {
        Version: "2019-01-16",
        Page: this.currpage,
        Rp: this.pagesize,
        TargetGroupId: groupId
      };
      this.axios
        .post(GROUP_POLICY, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.policiesData = res.Response.List;
            this.rolePolicies = this.policiesData;
            this.policiesLable = "許可權（" + res.Response.TotalNum + "）";
            this.TotalCount = res.Response.TotalNum;
          } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.ParamError": "非法入參"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 查询所有策略信息
    selectAllPolicies() {
      let params = {
        // Rp: this.rpPolicies,
        // Page: this.pagePolicies,
        Version: "2019-01-16"
        // scope:'All'
      };
      if (this.searchPolicies != null && this.searchPolicies != "") {
        params["Keyword"] = this.searchPolicies;
      }
      this.axios
        .post(POLICY_LIST, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.totalNumPolicies = res.Response.TotalNum;
            this.policiesAllData = res.Response.List;
          } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.GroupIdError": "GroupId欄位不合法",
              "InvalidParameter.KeywordError": "Keyword欄位不合法",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.ScopeError": "Scope欄位不合法",
              "InvalidParameter.ServiceTypeError": "ServiceType欄位不合法",
              "InvalidParameter.UinError": "Uin欄位不合法"
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
    // 移除策略信息
    deletePolicies(policyId) {
      let groupId = parseInt(this.$route.query.GroupId);
      let params = {
        Version: "2019-01-16",
        PolicyId: policyId,
        DetachGroupId: groupId
      };
      this.axios
        .post(DETACH_POLICY, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.selectGroupPolicies();
            this.$message({
              showClose: true,
              message: "移除成功",
              duration: 0,
              type: "success"
            });
          } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法",
              "nvalidParameter.PolicyIdNotExist": "策略ID不存在",
              "InvalidParameter.UserNotExist": "principal欄位的授權物件不存在",
              "ResourceNotFound.GroupNotExist": "用戶組不存在",
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
    // 打开策略信息穿梭框
    openPolicies() {
      this.dialogVisible = true;
      // this.selectAllPolicies();
    },
    handleSelectionChangePolicies(val) {
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      this.policiesSelectedData = val;
    },
    selectedRowPolicies(row, column, event) {
      // 设置选中或者取消状态
      this.$refs.multipleOptionPolicies.toggleRowSelection(row);
    },
    deleteRowPolicies(index, rows) {
      // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
      this.$refs.multipleOptionPolicies.toggleRowSelection(rows[index], false);
    },
    deleteRows(index, rows) {
      this.$refs.multipleOptionUser.toggleRowSelection(rows[index], false);
    },
    // 添加策略信息到用户组
    addPoliciesToGroup() {
      const policies = this.$refs.policiesRef.selectedStrategiesWithoutGroup
      if (policies.length == 0) {
        this.$message({
          showClose: true,
          message: "請選中數據",
          duration: 0
        });
      } else {
        const param = {
          Version: '2019-01-16',
          GroupId: this.groupId,
        }
        policies.forEach((s, i) => {
          param[`PolicyId.${i}`] = s.PolicyId
        })
        this.axios.post(ATTACH_GROUP_POLICIES, param)
          .then(res => {
            if (res.Response.Error) {
              this.$message({
                showClose: true,
                message: "關聯失敗",
                duration: 0,
                type: "error"
              });
            } else {
              this.$message({
                showClose: true,
                message: "關聯成功",
                duration: 0,
                type: "success"
              });
              this.loading = true;
              this.selectGroupPolicies();
            }
          })
          .then(() => {
            this.dialogVisible = false;
          })
      }
    },
    // 添加策略信息
    addPolicies(val) {
      let policiesParams = {
        Action: "AttachGroupPolicy",
        AttachGroupId: this.$route.query.GroupId,
        PolicyId: val,
        Version: "2019-01-16"
      };
      this.axios.post(ATTACH_GROUP, policiesParams).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
            showClose: true,
            message: "添加成功",
            duration: 0,
            type: "success"
          });
        } else {
          let ErrTips = {
            "FailedOperation.PolicyFull": "用戶策略數超過上限",
            "InternalError.SystemError": "內部錯誤",
            "InvalidParameter.AttachmentFull":
              "principal欄位的授權物件關聯策略數已達到上限",
            "InvalidParameter.ParamError": "非法入參",
            "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法",
            "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
            "InvalidParameter.UserNotExist": "principal欄位的授權物件不存在",
            "ResourceNotFound.GroupNotExist": "用戶組不存在",
            "ResourceNotFound.PolicyIdNotFound": "PolicyId指定的資源不存在",
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
      });
    },
    // 跳转到策略详情页面
    policyDetail(policy) {
      this.$router.push({
        path: "/StrategyDetail",
        query: {
          policy: policy.PolicyId
        }
      });
    },
    backoff() {
      this.$router.go(-1)
    },
    handleClick(tab, event) {
      if (tab.name === "first") {
        this.pagePolicies = 1;
        this.selectGroupPolicies();
      }
      if (tab.name === "second") {
        this.pageUser;
        this.getUsers();
      }
    },
    handleClosePolicies() {
      this.dialogVisible = false;
    },
    handleCloseUser() {
      this.dialogUser = false;
    },
    // 用户组策略分页
    handleCurrentChangePolicies(e) {
      this.pagePolicies = e;
      this.selectGroupPolicies();
    },
    // 用户组策略分页
    handleSizeChangePolicies(e) {
      this.rpPolicies = e;
      this.selectGroupPolicies();
    }
  }
};
</script>
<style lang="scss" scoped>
.omit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 390px;
}
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  border-radius: 0;
  height: 30px !important;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px;
}
::v-deep .el-input__clear {
  position: absolute;
  right: calc(100% + 2px);
}
.Interface >>> .el-form-item__label {
  text-align: left;
}
.Interface >>> .el-loading-mask {
  background: white !important;
}
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
    background: #fff;
    .title-left {
      font-size: 14px;
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
  .Interface {
    background-color: #f2f2f2;
    padding: 20px;
  }
  .Interface-top {
    font-size: 12px;
    width: 100%;
    padding: 20px;

    margin: 0 auto;
    background: #fff;
    margin-bottom: 20px;
  }
  .upper-side {
    height: 30px;
  }

  .upper-side .information {
    float: left;
  }

  .upper-side .edit {
    float: right;
  }

  .el-form-item {
    margin: 0;
  }

  .el-form-item__label {
    text-align: left;
  }

  .tabswitch {
    font-size: 12px;
    width: 100%;
    padding: 20px;
    margin: 0 auto;
    background: #fff;
  }

  .app-cam-alert,
  .app-cam-alert__info {
    font-size: 12px;
    line-height: inherit;
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
  .btn {
    display: flex;
    width: 100%;
    align-items: center;
    height: 50px;
  }
  .container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    p.title,
    p.explain {
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }

    p.explain {
      font-size: 12px;
      color: #ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
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
  }

  .block {
    text-align: right;
    margin-top: 10px;
  }

  .addbtn {
    margin-bottom: 10px;
  }

  .el-form-item__label {
    text-align: left;
  }

  .el-input__inner {
    position: relative;
  }

  .el-input {
    width: 20%;
  }

  .mark {
    color: #0abf5b;
    margin-left: 10px;
  }

  // .fier {
  //   cursor: pointer;
  //   font-size: 130%;
  //   color: #888;
  //   position: absolute;
  //   right: 2%;
  //   top: 8%;
  // }

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

  .dialogStyle > .el-dialog__body {
    padding: 10px 20px 20px;
  }
}
</style>
