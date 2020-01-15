<template>
  <div class="wrap">
    <div class="top">
      <span class="title-left" style="font-size:16px;">{{$t('CAM.userList.listTitle')}}</span>
    </div>
    <div class="explain">
      <p style="font-weight:bold">{{$t('CAM.userList.listText')}}</p>
      <p>{{$t('CAM.userList.listContext')}}</p>
    </div>
    <div class="operation" style="width:96%;margin: 0 auto;margin-bottom:20px;">
      <!-- <button class="addUser" @click="addUser">新增用户</button> -->
      <el-button type="primary" class="addUser" @click="addUser" style="margin-left:0;">
        {{$t('CAM.userList.listAdduser')}}</el-button>
      <el-button type="primary" class="addUser" @click="deleteMoreUsers">{{$t('CAM.userList.listdeleteuser')}}
      </el-button>

      <el-input :placeholder="$t('CAM.userList.searchUser')" size="small" class="inputSearch" v-model="inpVal"
        @change="userInpSearch" style="margin-right:0;width:300px;">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="userSearch"></i>
      </el-input>
    </div>
    <div class="tableBody">
      <div class="wrapTwo">
        <el-table height="450" :data="tableData1" @selection-change="selectDataChange" v-loading="loading"
          @expand-change="rowChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="expand" :label="$t('CAM.userList.userDetils')" width="50">
            <template slot-scope="scope">
              <div class="user-details" v-loading='loadrowC'>
                <div class="top">
                  <dl>
                    <dd>用户组</dd>
                    <dt>
                      <p v-show="scope.row.group.length == 0">-</p>
                      <p v-show="scope.row.group.length != 0">
                        <a v-for="(item,index) in scope.row.group" :key="index" v-show="index < 2">
                          <span @click="goToGroup(item)">{{item.GroupName}}</span>
                          <span style="color:black;" v-show="index < 1">,</span>
                        </a>
                        <span>
                          以及
                          <a @click="goTo">另外({{scope.row.group.length-2}})个</a>
                        </span>
                      </p>
                    </dt>
                  </dl>
                  <dl>
                    <dd>消息订阅</dd>
                    <dt>-</dt>
                  </dl>
                  <dl>
                    <dd>备注</dd>
                    <dt>{{scope.row.Remark ? scope.row.Remark : '-'}}</dt>
                  </dl>
                  <dl>
                    <dd>控制台访问</dd>
                    <dt :class="scope.row.ConsoleLogin == 1 ? 'green' : 'red'">
                      {{scope.row.ConsoleLogin == 1 ? '启用' : '禁用'}}</dt>
                  </dl>
                </div>
                <div class="bottom">
                  <a @click="detailsUser(scope.row)">查看用户详情></a>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="$t('CAM.userList.userName')" prop="Name">
            <template slot-scope="scope">
              <el-link @click="detailsUser(scope.row)" type="primary">{{scope.row.Name}}</el-link>
            </template>
          </el-table-column>

          <el-table-column :label="$t('CAM.userList.userChose')" prop="Remark">
            <template slot-scope="scope">子用户</template>
          </el-table-column>

          <el-table-column :label="$t('CAM.userList.userId')" prop="Uin"></el-table-column>

          <el-table-column :label="$t('CAM.userList.userText')">
            <template slot-scope="scope">
              <span v-show="scope.row.PhoneNum == '' && scope.row.Email ==''">-</span>
              <i class="el-icon-mobile mobile pointer" @click="detailsUser(scope.row)" v-show="scope.row.PhoneNum"></i>
              <i class="el-icon-message message pointer" @click="detailsUser(scope.row)" v-show="scope.row.Email"></i>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template scope="scope">
              <el-button type="text" @click="addRight(scope.row)">{{$t('CAM.userList.userStrage')}}</el-button>
              <span>|</span>
              <el-dropdown :hide-on-click="false">
                <span class="el-dropdown-link" style="color: #3E8EF7">
                  {{$t('CAM.userList.userMore')}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button type="text" style="color:#000" @click="addRroup(scope.row.Uid)">
                      {{$t('CAM.userList.userAddGroup')}}</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text" style="color:#000" @click="bindMesg">{{$t('CAM.userList.userdep')}}
                    </el-button>
                  </el-dropdown-item>
                  <el-button type="text" style="color:#000;padding-left:20px;" @click="delUserRow(scope.row)">
                    {{$t('CAM.userList.userDel')}}</el-button>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div class="Right-style pagstyle" style="height:70px;">
          <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CAM.strip")}}</span>
          <el-pagination :page-size="pagesize" :pager-count="7" layout="prev, pager, next"
            @current-change="handleCurrentChange" :total="TotalCount"></el-pagination>
        </div>
      </div>
    </div>

    <!-- 添加用户组弹框 -->
    <el-dialog :title="title" :visible.sync="authorization" width="60%" :before-close="handleClose" ref="tab1">
      <div class="container" v-show="strategyShow">
        <transfer ref="transfer" :multipleSelection="multipleSelection" @_multipleSelection="_multipleSelection"
          :rolePolicies="rolePolicies" :reload="reload" />
      </div>

      <div class="container" v-show="userGroupShow">
        <div class="container-right">
          <span>{{$t('CAM.userList.listTitle')}}</span>
          <div>
            <el-input v-model="searchGroupValue" :placeholder="$t('CAM.userList.search')" size="small"
              class="inputSearchCl" @keyup.enter.native="searchGroup">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchGroup"></i>
            </el-input>
          </div>

          <el-table v-model="searchGroupValue" ref="multipleOption" tooltip-effect="dark" height="400"
            style="width: 80%; border:1px solid #ddd;" @row-click="selectedRow" @selection-change="handleSelection"
            :data="userGroup" v-loading="groupLoading">
            <el-input size="mini" style="width:20%" />
            <el-button size="mini" class="suo" icon="el-icon-search" show-overflow-tooltip></el-button>
            <el-table-column type="selection" :selectable="checkboxT"></el-table-column>
            <el-table-column :label="$t('CAM.userList.userGroup')" prop="GroupName"></el-table-column>
          </el-table>
        </div>

        <div class="container-left">
          <span>{{$t('CAM.userList.choose')}}</span>
          <el-table ref="multipleSelected" tooltip-effect="dark" height="400" style="width: 80%;border:1px solid #ddd"
            :data="userGroupSelect">
            <el-table-column :label="$t('CAM.userList.userGroup')" prop="GroupName"></el-table-column>
            <el-table-column :label="$t('CAM.userList.userCz')" show-overflow-tooltip>
              &lt;!&ndash;
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index,userGroupSelect)" type="text" size="small">
                  {{$t('CAM.userList.userRemove')}}</el-button>
              </template>&ndash;&gt;
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUserList">{{$t('CAM.userList.suerAdd')}}</el-button>
        <el-button @click="authorization = false">{{$t('CAM.userList.handClose')}}</el-button>
      </span>
    </el-dialog>
    <!-- <deleteDialog :dialogDeleteUser="flag" @suerClose="suerClose" @confirm="confirm" /> -->
    <el-dialog title="删除用户" :visible.sync="dialogDeleteUser" width="70%" :before-close="deleteRowHandl">
      <p>{{$t('CAM.userList.removeText')}}</p>
      <div class="explainDelet">
        <p>{{$t('CAM.userList.removeContext')}}</p>
      </div>
      <div>
        <template>
          <el-table style="width: 100%" :data="delNewData">
            <el-table-column :label="$t('CAM.userList.userName')" prop="Name"></el-table-column>
            <el-table-column prop="Uid" :label="$t('CAM.userList.userId')"></el-table-column>
            <!-- <el-table-column :label="$t('CAM.userList.myId')"></el-table-column>
            <el-table-column :label="$t('CAM.userList.createTime')"></el-table-column>
            <el-table-column :label="$t('CAM.userList.userZt')"></el-table-column>
            <el-table-column :label="$t('CAM.userList.userCz')"></el-table-column>-->
          </el-table>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteUser = false">{{$t('CAM.userList.handClose')}}</el-button>
        <el-button type="primary" @click="suerDelUser">{{$t('CAM.userList.suerAdd')}}</el-button>
      </span>
    </el-dialog>
    <!-- 批量删除 -->
    <el-dialog :title="$t('CAM.userList.removeMore')" :visible.sync="dialogVisible" width="30%"
      :before-close="handleCloses">
      <span>{{$t('CAM.userList.suerRemove')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('CAM.userList.handClose')}}</el-button>
        <el-button type="primary" @click="removeDeleteUser">{{$t('CAM.userList.suerAdd')}}</el-button>
      </span>
    </el-dialog>

    <!-- <Subscribe :subscribe="flag" @suerClose="suerClose"  @confirm="confirm" /> -->
  </div>
</template>
<script>
  import {
    USER_LIST,
    USER_GROUP,
    POLICY_LIST,
    POLICY_USER,
    ADD_USERTOGROUP,
    DELETE_USER,
    RELATE_USER,
    QUERY_POLICY
  } from "@/constants";
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import Subscribe from "./components/subscribeNew";
  import transfer from "../Role/component/transfer";
  export default {
    components: {
      Subscribe,
      transfer
    },
    data() {
      return {
        loadrowC: true,
        groupLoading: true,
        userArr: [],
        reload: false,
        rolePolicies: [],
        multipleSelection: [],
        dialogVisible: false,
        json: [],
        inpVal: "", //搜索
        flag: false, //删除弹框组件
        form: {}, //点击详情,form获取详情数据
        tableData: [], //用户列表数组
        tableData1: [],
        inputShow: true, //select框禁用值
        authorization: false, //添加用户弹框
        title: "", //判断是添加策略还是添加到用户组
        userGroup: [], //存放用户组数据
        userGroupSelect: [], //存放右边表格的数据
        strategyShow: false, //判断策略表格显示隐藏
        userGroupShow: false, //判断用户表格显示隐藏
        strategyData: [], //存放策略数据
        searchStrategyValue: "", //搜素策略中的数据
        searchGroupValue: "", //搜索用户组中的数据
        Uin: "", //点击授权获取当前行的uin
        Uid: "",
        deletDatas: [],
        dialogDeleteUser: false,
        delNewData: [],
        deleteName: "",
        deleteRowName: "",
        selectData: [],
        deleteMoreUser: [],
        selectCheckData: [],
        delUin: "",
        loading: true,
        TotalCount: 0, //总条数
        pagesize: 10, // 分页条数
        currpage: 1, // 当前页码
        value: "" //更多操作多选值
      };
    },
    methods: {
      rowChange(row) {
        this.loadrowC = true
        this.tableData.forEach(element => {
          if (row.Uid === element.Uid) {
            const params = {
              Version: "2019-01-16",
              Uid: row.Uid
            };
            this.axios.post(RELATE_USER, params).then(res => {
              if (res.Response.Error === undefined) {
                element.group = res.Response.GroupInfo;
              } else {
                let ErrTips = {
                  "ResourceNotFound.UserNotExist": "用户不存在"
                };
                let ErrOr = Object.assign(ErrorTips, ErrTips);
                this.$message({
                  message: ErrOr[res.Response.Error.Code],
                  type: "error",
                  showClose: true,
                  duration: 0
                });
              }
              this.loadrowC = false
            });
          }
        });
      },
      goToGroup(item) {
        var groupId = item.GroupId;
        this.$router.push({
          name: "Interfacedetails",
          query: {
            GroupId: groupId
          }
        });
      },
      checkboxT(row, index) {
        if (row.status == 1) {
          return false;
        } else {
          return true;
        }
      },
      goTo() {
        this.$router.push("/UserGroup");
      },
      _multipleSelection(val) {
        this.multipleSelection = val;
      },
      deleteMoreUsers() {
        if (this.selectData.length != 0) {
          this.dialogVisible = true;
        } else {
          this.$message({
            showClose: true,
            message: "请选中数据",
            duration: 0
          });
        }
      },
      removeDeleteUser() {
        var checkIndex = [];
        this.selectData.forEach(item => {
          checkIndex.unshift(item);
        });
        checkIndex.forEach(item => {
          let params = {
            Version: "2019-01-16",
            Name: item.Name
          };
          this.axios.post(DELETE_USER, params).then(res => {
            if (res.Response.Error == undefined) {
              this.init();
            } else {
              let ErrTips = {
                InternalError: "内部错误",
                InvalidParameter: "参数错误",
                "InvalidParameterValue.InstanceNotExist": "实例不存在",
                "InvalidParameterValue.RepetitionValue": "已存在相同参数",
                "InvalidParameterValue.SubnetIdInvalid": "无效的子网id",
                "InvalidParameterValue.SubnetNotBelongToZone": "子网不属于zone",
                "InvalidParameterValue.VpcIdInvalid": "无效的 Vpc Id",
                "InvalidParameterValue.WrongAction": "Action参数取值错误",
                "InvalidParameterValue.ZoneNotSupport": "zone不支持",
                ResourceUnavailable: "资源不可用",
                UnauthorizedOperation: "未授权操作",
                "UnsupportedOperation.BatchDelInstanceLimit": "批量删除实例限制",
                "UnsupportedOperation.OssReject": "Oss拒绝该操作"
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
        });
        this.dialogVisible = false;
      },
      //选框
      selectDataChange(value) {
        this.selectData = value;
        this.inputShow = false;
      },
      suerDelUser() {
        let params = {
          Version: "2019-01-16",
          Name: this.deleteRowName
        };
        this.axios
          .post(DELETE_USER, params)
          .then(res => {
            if (res.Response.Error === undefined) {
              this.init();
            } else {
              let ErrTips = {
                InternalError: "内部错误",
                InvalidParameter: "参数错误",
                "InvalidParameterValue.InstanceNotExist": "实例不存在",
                "InvalidParameterValue.RepetitionValue": "已存在相同参数",
                "InvalidParameterValue.SubnetIdInvalid": "无效的子网id",
                "InvalidParameterValue.SubnetNotBelongToZone": "子网不属于zone",
                "InvalidParameterValue.VpcIdInvalid": "无效的 Vpc Id",
                "InvalidParameterValue.WrongAction": "Action参数取值错误",
                "InvalidParameterValue.ZoneNotSupport": "zone不支持",
                ResourceUnavailable: "资源不可用",
                UnauthorizedOperation: "未授权操作",
                "UnsupportedOperation.BatchDelInstanceLimit": "批量删除实例限制",
                "UnsupportedOperation.OssReject": "Oss拒绝该操作"
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
          .then(() => {
            let delparams = {
              QcloudUin: this.delUin,
              SubAccountname: this.deleteRowName
            };
            this.axios
              .post(
                `${process.env.VUE_APP_adminUrl}taifucloud/account-sub/manage/delete`,
                delparams
              )
              .then(res => {
                console.log(res);
              });
          })
          .catch(error => {
            this.$message({
              type: "error",
              message: "删除失败",
              showClose: true,
              duration: 0
            });
          });
        this.dialogDeleteUser = false;
      },
      delUserRow(val) {
        this.delUin = val.Uin;
        this.deleteRowName = val.Name;
        this.dialogDeleteUser = true;
        let newdelData = [];
        newdelData.push(val);
        this.delNewData = newdelData;
      },
      //搜索
      userSearch() {
        this.loading = true;
        var arr = [];
        this.tableData.forEach(item => {
          if (item.Name.includes(this.inpVal)) {
            arr.push(item);
          }
        });
        this.tableData1 = arr;
        this.TotalCount = arr.length;
        this.loading = false;
      },
      userInpSearch() {
        if (this.inpVal == "") {
          this.tableData1 = this.json;
          this.TotalCount = this.json.length;
        }
      },
      //分页
      handleSizeChange(val) {
        this.pagesize = val;
        this.currpage = 1;
        // this.init();
        this.tableData1 = this.tableData.slice(
          (this.currpage - 1) * this.pagesize,
          this.currpage * this.pagesize
        );
      },
      handleCurrentChange(val) {
        this.currpage = val;
        // this.init();
        this.delRowShow = true;
        this.deleteName = val.Name;
        this.tableData1 = this.tableData.slice(
          (this.currpage - 1) * this.pagesize,
          this.currpage * this.pagesize
        );
      },
      //初始化用户列表数据
      init() {
        this.loading = true;
        let userList = {
          Version: "2019-01-16"
        };
        this.axios
          .post(USER_LIST, userList)
          .then(data => {
            if (data.Response.Error === undefined) {
              if (data != "") {
                this.loading = false;
                var arr = data.Response.Data;
                //获取用户关联的用户组
                arr.forEach((item, index) => {
                  item.group = [];
                  item.index = index;
                });
                this.tableData = arr;
                this.tableData.reverse();
                this.json = arr;
                this.tableData1 = this.tableData.slice(
                  (this.currpage - 1) * this.pagesize,
                  this.currpage * this.pagesize
                );
                this.TotalCount = this.json.length;
              } else {
                this.loading = false;
                this.$message({
                  type: "info",
                  message: "无响应数据！",
                  showClose: true,
                  duration: 0
                });
              }
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
      //初始化策略数据
      strategy() {
        let params = {
          Version: "2019-01-16"
        };
        if (this.searchStrategyValue != null && this.searchStrategyValue != "") {
          params["Keyword"] = this.searchStrategyValue;
        }
        this.axios.post(POLICY_LIST, params).then(res => {
          if (res.Response.Error === undefined) {
            if (res != "") {
              this.loading = false;
              this.strategyData = res.Response.List;
              this.TotalCount = this.strategyData.length;
            } else {
              this.loading = false;
              this.$message({
                type: "info",
                message: "无响应数据！",
                showClose: true,
                duration: 0
              });
            }
          } else {
            let ErrTips = {
              "InternalError.SystemError": "内部错误",
              "InvalidParameter.GroupIdError": "GroupId字段不合法",
              "InvalidParameter.KeywordError": "Keyword字段不合法",
              "InvalidParameter.ParamError": "非法入参",
              "InvalidParameter.ScopeError": "Scope字段不合法",
              "InvalidParameter.ServiceTypeError": "ServiceType字段不合法",
              "InvalidParameter.UinError": "Uin字段不合法"
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
      //点击搜索策略数据
      searchStrategy() {
        this.strategy();
      },
      //初始化用户组数据
      userGroups() {
        this.userGroup = [];
        this.selectData = [];
        this.groupLoading = true;
        let params = {
          Version: "2019-01-16"
        };
        if (this.searchGroupValue != null && this.searchGroupValue != "") {
          params["Keyword"] = this.searchGroupValue;
        }
        this.axios
          .post(USER_GROUP, params)
          .then(res => {
            if (res.Response.Error === undefined) {
              this.loading = false;
              this.userArr = res.Response.GroupInfo;
            } else {
              this.loading = false;
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
            const params = {
              Version: "2019-01-16",
              Uid: this.Uid
            };
            this.axios.post(RELATE_USER, params).then(res => {
              if (res.Response.Error === undefined) {
                this.userArr.forEach(item => {
                  item.status = 0;
                  res.Response.GroupInfo.forEach(val => {
                    if (val.GroupId == item.GroupId) {
                      item.status = 1;
                    }
                  });
                });
              } else {
                let ErrTips = {
                  "ResourceNotFound.UserNotExist": "用户不存在"
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
            var _this = this;
            setTimeout(() => {
              _this.userGroup = _this.userArr;
              _this.groupLoading = false;
            }, 1500);
          });
      },
      //搜索用户组数据
      searchGroup() {
        this.userGroups();
      },
      //添加用户路由跳转
      addUser() {
        this.$router.push("/adduserNew");
      },
      //点击跳转到详情页
      detailsUser(val) {
        this.$router.push({
          path: "/detailsUser",
          query: {
            detailsData: val.Name
          }
        });
      },
      //点击删除弹框显示
      deleteRowData(data) {
        this.flag = true;
        let deletData = [];
        deletData.push(data);
        this.deletDatas = deletData;
      },

      //点击添加到组事件 更多
      addRroup(uid) {
        this.Uid = uid;
        this.title = "添加到组";
        this.authorization = true;
        this.userGroupShow = true;
        this.strategyShow = false;
        this.userGroups(); //调用初始化用户组数据
      },
      //点击授权
      addRight(val) {
        const params = {
          Version: "2019-01-16",
          TargetUin: val.Uin
        };
        this.axios.post(QUERY_POLICY, params).then(res => {
          if (res.Response.Error === undefined) {
            this.rolePolicies = res.Response.List;
            this.reload = !this.reload;
          } else {
            let ErrTips = {
              "InternalError.SystemError": "内部错误",
              "InvalidParameter.ParamError": "非法入参"
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
        this.Uin = val.Uin;
        this.title = "关联策略";
        this.authorization = true;
        this.userGroupShow = false;
        this.strategyShow = true;
        this.multipleSelection = [];
        if (this.$refs.transfer) {
          this.$refs.transfer._getList();
        }
        this.strategy(); //调动初始化策略数据
      },
      //策略与用户组数据弹框确定按钮
      addUserList() {
        // userGroupSelect
        if (this.title == "关联策略") {
          var addPloicyId = [];
          this.multipleSelection.forEach(item => {
            addPloicyId.push(item);
          });
          addPloicyId.forEach(item => {
            let params = {
              Version: "2019-01-16",
              PolicyId: item.PolicyId,
              AttachUin: this.Uin
            };
            this.axios.post(POLICY_USER, params).then(data => {
              if (data.Response.Error === undefined) {
                this.init();
                this.$message({
                  message: "授权成功",
                  showClose: true,
                  duration: 0
                });
              } else {
                let ErrTips = {
                  "FailedOperation.PolicyFull": "用户策略数超过上限",
                  "InternalError.SystemError": "内部错误",
                  "InvalidParameter.AttachmentFull": "principal字段的授权对象关联策略数已达到上限",
                  "InvalidParameter.ParamError": "非法入参",
                  "InvalidParameter.PolicyIdError": "输入参数PolicyId不合法",
                  "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
                  "InvalidParameter.UserNotExist": "principal字段的授权对象不存在",
                  "ResourceNotFound.PolicyIdNotFound": "PolicyId指定的资源不存在",
                  "ResourceNotFound.UserNotExist": "用户不存在"
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
          });
          this.authorization = false;
        }
        if (this.title == "添加到组") {
          var addGroupId = [];
          this.userGroupSelect.forEach(item => {
            addGroupId.push(item);
          });
          addGroupId.forEach(item => {
            let params = {
              Version: "2019-01-16",
              "Info.0.Uid": this.Uid,
              "Info.0.GroupId": item.GroupId
            };
            this.axios.post(ADD_USERTOGROUP, params).then(res => {
              if (res.Response.Error === undefined) {
                this.$message({
                  showClose: true,
                  message: "添加成功",
                  duration: 0,
                  type: "success"
                });
                this.init();
              } else {
                let ErrTips = {
                  "InvalidParameter.GroupNotExist": "用户组不存在",
                  "InvalidParameter.GroupUserFull": "用户组中的子用户数量达到上限",
                  "InvalidParameter.UserGroupFull": "子用户加入的用户组数量达到上限",
                  "ResourceNotFound.UserNotExist": "用户不存在"
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
          });
          this.authorization = false;
        }
      },
      deleteRowHandl() {
        this.dialogDeleteUser = false;
      },
      //点击弹框中的×号隐藏弹框
      handleClose() {
        this.authorization = false;
      },
      selectedRow(row, column, event) {
        // 设置选中或者取消状态
        this.$refs.multipleOption.toggleRowSelection(row);
      },
      deleteRow(index, rows) {
        // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
        this.$refs.multipleOption.toggleRowSelection(rows[index], false);
      },
      handleSelection(val) {
        // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
        this.userGroupSelect = val;
      },
      bindMesg() {
        this.$message({
          type: "info",
          message: "内测中...",
          duration: 0,
          showClose: true
        });
      },
      handleCloses() {
        this.dialogVisible = false;
      }
    },
    created() {
      this.init(); //获取用户列表数据
    }
  };

</script>
<style lang="scss" scoped>
  .wrap>>>.el-button,
  .wrap>>>.el-input__inner {
    border-radius: 0;
    height: 30px !important;
    line-height: 30px;
    padding-top: 0;
    font-size: 12px;
  }

  .wrap>>>.el-dropdown {
    cursor: pointer;
  }

  .wrap>>>.el-table__expanded-cell {
    background: rgb(250, 250, 250);
  }

  .wrap>>>.el-table__expanded-cell:hover {
    background: rgb(250, 250, 250);
  }

  .pointer {
    cursor: pointer;
  }

  .wrap {
    width: 100%;
    background-color: #f2f2f2 !important;

    .user-details {
      display: flex;
      padding: 0 25px;
      box-sizing: border-box;
      flex-direction: column;

      .red {
        color: darkred;
      }

      .green {
        color: green;
      }

      .top {
        background: transparent;
        margin: 0;
        padding: 0;
        margin-bottom: 15px;
      }

      a {
        color: #006eff;
        cursor: pointer;
      }

      dl {
        width: 50%;
        flex: none;
        display: flex;
        float: left;
        margin: 6px 0;

        dd {
          width: 70px;
          color: #888;
        }
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

    .top {
      width: 100%;
      height: 50px;
      background-color: #fff;
      margin-bottom: 20px;

      .title-left {
        font-size: 14px;
        font-weight: bolder;
        padding-left: 20px;
        line-height: 50px;
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

    .page-box {
      padding: 20px;
      padding-right: 30px;
      box-sizing: border-box;
    }

    .explain {
      width: 96%;
      margin: 0 auto;
      font-size: 12px;
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      position: relative;
      box-sizing: border-box;
      margin-bottom: 20px;

      p {
        line-height: 20px;
      }
    }

    .operation {
      width: 100%;
      margin-bottom: 20px;

      .addUser {
        height: 32px;
        min-width: 24px;
        padding: 0 20px;
        color: #fff;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        outline: 0;
        box-sizing: border-box;
        text-decoration: none;
        margin-left: 33px;
      }

      .select {
        height: 10px;
        border-radius: none;
        margin-left: 10px;
        color: black;
      }

      .inputSearch {
        width: 15%;
        float: right;
        margin-right: 35px;
      }
    }

    .tableBody {
      width: 100%;
      margin-bottom: 20px;

      .wrapTwo {
        width: 96%;
        margin: 0 auto;
        height: 520px;
        background: white;
      }

      .detialsUser {
        width: 20%;
        float: left;
        display: flex;
        flex-direction: column;
        margin-left: 25px;
      }
    }
  }

  .container {
    display: flex;

    .container-right {
      width: 70%;
      flex-direction: column;
      justify-content: center;
      margin-left: 100px;

      .inputSearchCl {
        width: 80%;
      }
    }

    .container-left {
      width: 70%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-direction: column;
    }
  }

  .explainDelet {
    width: 100%;
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-top: 15px;
    color: #c07400;
    border-color: #ffd18b;
    background-color: #fff4e3;
  }

</style>
