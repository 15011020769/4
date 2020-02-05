<template>
  <div class="wrap">
    <div class="head">
      <Headcom :title="$t('CAM.userList.userDetil')" :backShow="true" @_back="back" />
    </div>
    <div class="details">
      <div class="details-left" v-loading="infoLoad">
        <div class="leftHead" style="display:flex">
          <p style="flex:1; overflow: hidden; text-overflow: ellipsis">{{userData.Name}}</p>
          <p style="width:30px;">
            <el-link
              @click="editGroup"
              class="edit"
              type="primary"
            >{{$t('CAM.userList.updataUser')}}</el-link>
          </p>
        </div>
        <div class="leftBody">
          <div class="bodyLeft" style="flex:1;">
            <p>
              <span class="spns">{{$t('CAM.userList.userId')}}</span>
              <span>{{userData.Uin}}</span>
            </p>
            <p>
              <span class="spns">{{$t('CAM.userList.userRemark')}}</span>
              <span>{{userData.Remark ? userData.Remark : '-'}}</span>
            </p>
            <p>
              <span class="spns">{{$t('CAM.userList.userWay')}}</span>
              <span>{{ConsoleLogin[userData.ConsoleLogin]}}</span>
            </p>
          </div>
          <div class="bodyRight" style="flex:1">
            <p>
              <span class="spns">{{$t('CAM.userList.userPhone')}}</span>
              <span>{{userData.PhoneNum ? userData.PhoneNum : '-'}}</span>
            </p>
            <p>
              <span class="spns">{{$t('CAM.userList.userEmail')}}</span>
              <span>{{userData.Email ? userData.Email : '-'}}</span>
            </p>
            <p>
              <span class="spns">{{$t('CAM.userList.userWeChat')}}</span>
              <span>-</span>
            </p>
          </div>
        </div>
      </div>
      <div class="details-right">
        <div class="rightHead">
          <p>{{$t('CAM.userList.fastToDo')}}</p>
        </div>
        <div class="rightBody">
          <el-button size="small" @click="bindMesg">{{$t('CAM.userList.userdep')}}</el-button>
          <el-button size="small" class="delete" @click="deleteUser">{{$t('CAM.userList.userDel')}}</el-button>
        </div>
      </div>
    </div>
    <div class="tableTab" style="width:100%;">
      <el-tabs v-model="activeName" @tab-click="handleClick" v-loading="loading" class="tabs">
        <el-tab-pane :label="totalNum" name="first">
          <div class="explain">
            <p>{{$t('CAM.userList.strategyTitles')}}</p>
          </div>
          <el-button
            class="buttonCla"
            type="primary"
            size="small"
            @click="gotoPolicy"
          >{{$t('CAM.userList.RelatedPolicies')}}</el-button>
          <el-button
            class="buttonCla"
            type="primary"
            size="small"
            :disabled="disabled"
            @click="delMoreStrateg"
          >{{$t('CAM.userList.RemoveStrategy')}}</el-button>
          <el-table
            ref="multipleTable"
            :data="StrategyData"
            style="width: 100%;"
            height="300"
            @selection-change="Select"
            :empty-text="$t('CAM.strategy.zwsj')"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column :label="$t('CAM.userList.strategyNames')" prop="PolicyName">
              <template slot-scope="scope">
                <el-link @click="handleClicks(scope.row)" type="primary">{{scope.row.PolicyName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userList.cjly')" prop="CreateMode">
              <template slot-scope="scope">{{CreateMode[scope.row.CreateMode]}}</template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userList.strategyChose')" prop="Type">
              <template slot-scope="scope">{{scope.row.Type == '1'?'自定義策略':'預設策略'}}</template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userList.AssociationTime')" prop="AddTime"></el-table-column>
            <el-table-column fixed="right" :label="$t('CAM.userList.userCz')">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="deleteStrage(scope.row.PolicyId)"
                >{{$t('CAM.userList.Remove')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCounts}}&nbsp;{{$t("CAM.strip")}}</span>
            <el-pagination
              :page-size="pagesizes"
              :pager-count="7"
              layout="prev, pager, next"
              @current-change="handleCurrentChanges"
              :total="TotalCounts"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="groupNum" name="second">
          <el-button
            class="buttonCla"
            type="primary"
            size="small"
            @click="addGroupUser"
          >{{$t('CAM.userList.userAddGroup')}}</el-button>
          <el-button
            class="buttonCla"
            type="primary"
            size="small"
            :disabled="disabled"
            @click="removeMoreGroup"
          >{{$t('CAM.userList.RemoveGroups')}}</el-button>
          <el-table
            ref="multipleTable"
            :data="groupData"
            style="width: 100%;"
            height="300"
            @selection-change="Select"
            :empty-text="$t('CAM.strategy.zwsj')"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column :label="$t('CAM.userList.GroupName')" prop="GroupName"></el-table-column>
            <el-table-column :label="$t('CAM.userList.RelatedPolicies')" width="300">
              <template slot-scope="scope">
                <div class="omit" v-show="scope.row.policy.length!=0">
                  <p v-for="(item,index) in scope.row.policy" :key="index">
                    <font v-show="index <= 1" @click="goTo(item.PolicyId)">{{item.PolicyName}}</font>
                    <font v-show="index == 0 && scope.row.policy.length>=2" style="color:black;">,</font>
                  </p>
                  <p v-show="scope.row.policy.length>2">
                    <span style="color:black;" v-show="scope.row.policy.length>2">以及</span>
                    <span @click="goToPolicyList">其他({{scope.row.policy.length-2}}){{$t('CAM.Role.item')}}</span>
                  </p>
                </div>
                <div v-show="scope.row.policy.length==0">-</div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userList.userRemark')" prop="Remark">
              <template slot-scope="scope">
                <div v-show="scope.row.Remark">{{scope.row.Remark}}</div>
                <div v-show="!scope.row.Remark">-</div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('CAM.userList.userCz')">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="removeGroup(scope.row)"
                >{{$t('CAM.userList.RemoveGroups')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CAM.strip")}}</span>
            <el-pagination
              :page-size="pagesize"
              :pager-count="7"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :total="TotalCount"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="安全" name="third">{{$t('CAM.userList.RoleManagement')}}</el-tab-pane>
        <el-tab-pane label="API密钥" name="fourth">{{$t('CAM.userList.compensation')}}</el-tab-pane>
        <el-tab-pane label="小程序" name="fifth">{{$t('CAM.userList.program')}}</el-tab-pane>-->
      </el-tabs>
    </div>
    <!-- 策略 -->
    <el-dialog
      :title="StrategyTitle"
      :visible.sync="StrategyLoading"
      width="30%"
      :before-close="handleClose"
    >
      <span v-if="showStrategyMore">{{$t('CAM.userList.StrategyExplain')}}</span>
      <span v-if="showStrategyRow">{{$t('CAM.userList.StrategyExplains')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="StrategyLoading = false">{{$t('CAM.userList.handClose')}}</el-button>
        <el-button type="primary" @click="moveStrategy">{{$t('CAM.userList.suerAdd')}}</el-button>
      </span>
    </el-dialog>
    <!-- 用户 -->
    <el-dialog
      :title="groupTitle"
      :visible.sync="GroupLoading"
      width="30%"
      :before-close="handleClose"
    >
      <span>{{$t('CAM.userList.delRowUser')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="GroupLoading = false">{{$t('CAM.userList.handClose')}}</el-button>
        <el-button type="primary" @click="removeGroupUser">{{$t('CAM.userList.suerAdd')}}</el-button>
      </span>
    </el-dialog>

    <!-- 删除用户 -->
    <el-dialog :title="$t('CAM.userList.scyh')" :visible.sync="delDialog" width="30%" :before-close="handleClose">
      <span>{{$t('CAM.userList.delUserTitle')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">{{$t('CAM.userList.handClose')}}</el-button>
        <el-button type="primary" @click="userDelete">{{$t('CAM.userList.suerAdd')}}</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog
      :title="$t('CAM.userList.upDataUsers')"
      :visible.sync="updataUser"
      width="35%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
        style="padding:0 10px;box-sizing:boder-box;"
      >
        <el-form-item :label="$t('CAM.userList.userName')" prop="Name">
          <el-input v-model="ruleForm.Name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('CAM.userList.userRemark')" prop="Remark">
          <el-input v-model="ruleForm.Remark"></el-input>
        </el-form-item>
        <el-form-item :label="$t('CAM.userList.userPhone')" prop="PhoneNum" class="reg">
          <el-input v-model="ruleForm.PhoneNum" @change="tel"></el-input>
          <span v-show="telReg">{{$t('CAM.userList.qsrzqdsjh')}}</span>
        </el-form-item>
        <el-form-item :label="$t('CAM.userList.userEmail')" prop="Email" class="reg">
          <el-input v-model="ruleForm.Email" @change="email"></el-input>
          <span v-show="emailReg">{{$t('CAM.userList.qsrzqdyx')}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updataUser = false">{{$t('CAM.userList.handClose')}}</el-button>
        <el-button type="primary" @click="sureUpdata">{{$t('CAM.userList.suerAdd')}}</el-button>
      </span>
    </el-dialog>
    <!-- <Subscribe :subscribe="flag" @suerClose="suerClose" @confirm="confirm" /> -->
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import Headcom from "./components/Head"; //头部组件引入
import {
  QUERY_USER,
  QUERY_POLICY,
  RELATE_USER,
  REMOVEBIND_USER,
  REMOVEGROUP_USER,
  DELETE_USER,
  USER_LIST,
  UPDATA_USER,
  DEL_USERTOGROUP,
  GROUP_POLICY
} from "@/constants";
// import Subscribe from './components/subscribeNew'
import { parse } from "path";
export default {
  components: {
    Headcom //头部组件
    // Subscribe
  },
  data() {
    return {
      CreateMode: {
        1: "控制台創建",
        2: "通過策略語法創建"
      },
      emailReg: false,
      telReg: false,
      TotalCount: 0,
      pagesize: 10,
      currpage: 1,
      TotalCounts: 0,
      pagesizes: 10,
      currpages: 1,
      infoLoad: true,
      ConsoleLogin: {
        1: "可以登入控制台",
        2: "無法登入控制台"
      },
      userData: [], //获取用户详情数据
      activeName: "first",
      StrategyData: [], //存放授权数据
      StrategNum: "", //权限数量
      groupData: [], //存放用户组数据
      disabled: true, //按钮禁用状态
      StrategyLoading: false, //移出策略弹框
      StrategyTitle: "", //弹出框title
      showStrategyRow: false, //对批量与单条解除数据进行判断
      showStrategyMore: false, //对批量与单条解除数据进行判断
      valArr: [], //存放多选框选中数据
      GroupLoading: false, //用户组弹框
      groupTitle: "", //用户组弹出框title
      GroupId: "",
      delDialog: false,
      updataUser: false,
      totalNum: "", //策略列表条数
      groupNum: "", //用户组列表条数
      // flag:false,
      loading: true,
      ruleForm: {
        Name: "",
        Remark: "",
        PhoneNum: "",
        Email: ""
      }
    };
  },
  methods: {
    //跳转到策略列表
    goToPolicyList() {
      this.$router.push({
        path: "/Strategy"
      });
    },
    //跳转到策略详情
    goTo(val) {
      this.$router.push({
        path: "/StrategyDetail",
        query: {
          policy: val
        }
      });
    },
    //对手机号进行判断
    tel: function() {
      var phone = /^1[345789]\d{9}$/;
      if (this.ruleForm.PhoneNum != "") {
        if (!phone.test(this.ruleForm.PhoneNum)) {
          this.telReg = true;
        } else {
          this.telReg = false;
        }
      } else {
        this.telReg = false;
      }
    },
    //对邮箱进行判断
    email: function() {
      var email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (this.ruleForm.Email != "") {
        if (!email.test(this.ruleForm.Email)) {
          this.emailReg = true;
        } else {
          this.emailReg = false;
        }
      } else {
        this.emailReg = false;
      }
    },

    //编辑用户
    sureUpdata() {
      if (this.telReg) {
        this.$message({
          showClose: true,
          message: "手機號輸入有誤",
          duration: 0,
          type: "error"
        });
      } else if (this.emailReg) {
        this.$message({
          showClose: true,
          message: "郵箱輸入有誤",
          duration: 0,
          type: "error"
        });
      } else {
        this.edit();
      }
    },
    edit() {
      let params = {
        Version: "2019-01-16",
        Name: this.ruleForm.Name,
        Remark: this.ruleForm.Remark,
        PhoneNum: this.ruleForm.PhoneNum,
        Email: this.ruleForm.Email
      };
      this.axios.post(UPDATA_USER, params).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
            showClose: true,
            message: "編輯成功",
            type: "success",
            duration: 0
          });
          this.updataUser = false;
          this.init();
        } else {
          let ErrTips = {
            "InvalidParameter.PasswordViolatedRules": "密碼不符合用戶安全設置",
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
    handleClicks(policy) {
      this.$router.push({
        path: "/StrategyDetail",
        query: {
          policy: policy.PolicyId
        }
      });
    },
    editGroup() {
      this.ruleForm.Name = this.userData.Name;
      this.ruleForm.Remark = this.userData.Remark;
      this.ruleForm.PhoneNum = this.userData.PhoneNum;
      this.ruleForm.Email = this.userData.Email;
      this.updataUser = true;
    },
    //删除子用户
    userDelete() {
      let params = {
        Version: "2019-01-16",
        Name: this.userData.Name
      };
      this.axios
        .post(DELETE_USER, params)
        .then(data => {
          if (data.Response.Error === undefined) {
            this.$router.push("/UserListNew");
          } else {
            let ErrTips = {
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
        .then(() => {
          let delparams = {
            QcloudUin: this.delUin,
            SubAccountname: this.deleteName
          };
          this.axios
            .post(
              `${process.env.VUE_APP_adminUrl}taifucloud/account-sub/manage/delete`,
              delparams
            )
            .then(res => {
              console.log(res);
            });
        });
      this.ploicyData(); //获取策略数据
      this.groupListData();
      this.delDialog = false;
    },
    deleteUser() {
      this.delDialog = true;
    },
    //获取用户详情数据
    init() {
      this.infoLoad = true;
      let params = {
        Version: "2019-01-16",
        Name: this.$route.query.detailsData
      };
      this.axios.post(QUERY_USER, params).then(res => {
        if (res.Response.Error === undefined) {
          this.userData = res.Response;
          this.infoLoad = false;
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
    },
    //获取每一个用户下的权限
    ploicyData() {
      this.loading = true;
      let params = {
        Version: "2019-01-16",
        Name: this.$route.query.detailsData
      };
      this.axios.post(QUERY_USER, params).then(res => {
        this.userData = res.Response;
        let ploicyParams = {
          Version: "2019-01-16",
          TargetUin: this.userData.Uin
        };
        this.axios.post(QUERY_POLICY, ploicyParams).then(res => {
          if (res.Response.Error === undefined) {
            if (res != "") {
              this.loading = false;
              this.StrategyData = res.Response.List.slice(
                (this.currpages - 1) * this.pagesizes,
                this.currpages * this.pagesizes
              );
              this.TotalCounts = res.Response.List.length;
              this.totalNum = "許可權(" + res.Response.List.length + ")";
            } else {
              this.loading = false;
              this.$message({
                type: "info",
                message: "無響應數據！",
                duration: 0,
                showClose: true
              });
            }
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
        });
      });
    },
    handleCurrentChanges(val) {
      this.currpages = val;
      this.ploicyData();
    },
    //获取每一个子用户下的用户组
    groupListData() {
      this.loading = true;
      let params = {
        Version: "2019-01-16",
        Name: this.$route.query.detailsData
      };
      this.axios.post(QUERY_USER, params).then(res => {
        if (res.Response.Error === undefined) {
          this.userData = res.Response;
          let groupParams = {
            Version: "2019-01-16",
            Uid: this.userData.Uid
          };
          this.axios.post(RELATE_USER, groupParams).then(res => {
            if (res.Response.Error === undefined) {
              this.TotalCount = res.Response.GroupInfo.length;
              this.groupData = res.Response.GroupInfo.slice(
                (this.currpage - 1) * this.pagesize,
                this.currpage * this.pagesize
              );
              this.groupNum = "組(" + res.Response.GroupInfo.length + ")";
              if (this.groupData.length != 0) {
                this.groupData.forEach(item => {
                  item.policy = [];
                  const params = {
                    Version: "2019-01-16",
                    TargetGroupId: item.GroupId
                  };
                  this.axios.post(GROUP_POLICY, params).then(res => {
                    if (res.Response.Error === undefined) {
                      res.Response.List.forEach(val => {
                        const obj = {
                          PolicyName: val.PolicyName,
                          PolicyId: val.PolicyId
                        };
                        item.policy.push(obj);
                        this.loading = false;
                      });
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
                      this.loading = false;
                    }
                  });
                  this.loading = false;
                });
              } else {
                this.loading = false;
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
              this.loading = false;
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
          this.loading = false;
        }
      });
    },
    handleCurrentChange(val) {
      this.currpage = val;
      this.groupListData();
    },
    //确定解除策略
    moveStrategy() {
      if (this.StrategyTitle == "批量解除策略") {
        var removeIndex = [];
        this.valArr.forEach(item => {
          removeIndex.unshift(item.PolicyId);
        });
        removeIndex.forEach(item => {
          let params = {
            Version: "2019-01-16",
            PolicyId: item,
            DetachUin: this.userData.Uin
          };
          this.axios.post(REMOVEBIND_USER, params).then(data => {
            if (data.Response.Error === undefined) {
              this.ploicyData();
              this.$message({
                showClose: true,
                message: "批量解除成功",
                type: "success",
                duration: 0,
                showClose: true
              });
            } else {
              let ErrTips = {
                "InternalError.SystemError": "內部錯誤",
                "InvalidParameter.AttachmentFull":
                  "principal欄位的授權對象關聯策略數已達到上限",
                "InvalidParameter.ParamError": "非法入參",
                "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法",
                "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
                "InvalidParameter.UserNotExist":
                  "principal欄位的授權對象不存在",
                "ResourceNotFound.PolicyIdNotFound": "PolicyId指定的資源不存在",
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
          });
        });
        this.StrategyLoading = false;
      }
      if (this.StrategyTitle == "解除策略") {
        let params = {
          Version: "2019-01-16",
          PolicyId: this.PolicyId,
          DetachUin: this.userData.Uin
        };
        this.axios.post(REMOVEBIND_USER, params).then(data => {
          if (data.Response.Error === undefined) {
            this.ploicyData();
            this.$message({
              showClose: true,
              message: "解除成功",
              type: "success",
              duration: 0,
              showClose: true
            });
          } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.AttachmentFull":
                "principal欄位的授權對象關聯策略數已達到上限",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法",
              "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
              "InvalidParameter.UserNotExist": "principal欄位的授權對象不存在",
              "ResourceNotFound.PolicyIdNotFound": "PolicyId指定的資源不存在",
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
        });
        this.StrategyLoading = false;
      }
    },
    //解除当前行策略
    deleteStrage(PolicyId) {
      this.PolicyId = PolicyId;
      this.StrategyLoading = true;
      this.StrategyTitle = "解除策略";
      this.showStrategyMore = false;
      this.showStrategyRow = true;
    },
    //批量解除按钮
    delMoreStrateg() {
      this.StrategyLoading = true;
      this.StrategyTitle = "批量解除策略";
      this.showStrategyMore = true;
      this.showStrategyRow = false;
    },
    //将用户移出用户组
    removeGroupUser() {
      if (this.groupTitle == "移出組") {
        var groupId = [];
        this.valArr.forEach(item => {
          groupId.unshift(item.GroupId);
        });
        groupId.forEach(item => {
          this.delGroup(item);
        });
        this.GroupLoading = false;
      }
      if (this.groupTitle == "確認移出") {
        this.delGroup(this.GroupId);
        this.GroupLoading = false;
      }
    },
    delGroup(val) {
      let params = {
        Version: "2019-01-16",
        "Info.0.Uid": this.userData.Uid,
        "Info.0.GroupId": val
      };
      this.axios.post(DEL_USERTOGROUP, params).then(data => {
        if (data.Response.Error === undefined) {
          this.$message({
            showClose: true,
            message: "移出成功",
            type: "success",
            duration: 0,
            showClose: true
          });
          this.groupListData();
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: "移除失敗" + ErrOr[data.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
          this.groupListData();
        }
      });
    },
    //当前一行移出组
    removeGroup(val) {
      this.GroupId = val.GroupId;
      this.GroupLoading = true;
      this.groupTitle = "確認移出";
    },
    //批量移出组
    removeMoreGroup() {
      this.GroupLoading = true;
      this.groupTitle = "移出組";
    },
    //用户组详情
    Interface(groupId) {
      this.$router.push({
        name: "Interfacedetails",
        query: {
          GroupId: groupId
        }
      });
    },
    //跳转到添加策略到用户页面
    gotoPolicy() {
      this.$router.push({
        path: "/addPolicyToUser",
        query: {
          Uin: this.userData.Uin,
          Uid: this.userData.Uid
        }
      });
    },
    //跳转加入到用户组页面
    addGroupUser(data) {
      this.$router.push({
        path: "/addGroup",
        query: {
          Uid: this.userData.Uid
        }
      });
    },
    //多选框
    Select(val) {
      // this.disabled = false;
      this.valArr = val;
      if (val != "") {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    handleClick(tab, event) {},
    handleClose(done) {
      this.StrategyLoading = false;
      this.delDialog = false;
      this.updataUser = false;
    },
    bindMesg() {
      this.$message({
        showClose: true,
        message: "內測中...",
        type: "info",
        duration: 0,
        showClose: true
      });
    },
    back() {
      this.$router.go(-1);
    }
  },
  created() {
    this.init(); //获取当前用户的详情
    this.ploicyData(); //获取策略数据
    this.groupListData(); //获取用户组数据
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-form-item__label {
  text-align: left;
}
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  border-radius: 0;
  height: 30px !important;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px;
}
.reg {
  position: relative;

  span {
    position: absolute;
    bottom: -30px;
    color: red;
    left: 0;
  }
}

.omit {
  color: #006eff;
  cursor: pointer;
  width: 220px;
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
}

.Right-style {
  display: flex;
  justify-content: flex-end;
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

.tabs {
  background: white;
  padding: 0 20px;
  margin-top: -20px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
}

.spns {
  color: #666;
  display: inline-block;
  width: 70px;
}

.details {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 25px;
  box-sizing: border-box;

  .omit {
    color: #006eff;
    cursor: pointer;
    width: 220px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .details-left {
    width: 75%;
    background: white;
    padding: 10px 10px 20px 10px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    left: 0;

    .leftHead {
      width: 100%;
      background: white;
      padding: 10px 10px 10px 10px;
      box-sizing: border-box;
    }

    .leftBody {
      flex: 1;
      display: flex;
      background: white;

      .bodyLeft {
        padding: 10px;
        box-sizing: border-box;

        p {
          padding: 0 0 25px 0;
          box-sizing: border-box;
        }
      }

      .bodyRight {
        padding: 10px;
        box-sizing: border-box;
        border-left: 1px solid #ccc;

        p {
          padding: 0 0 25px 0;
          box-sizing: border-box;
        }
      }
    }
  }

  .details-right {
    flex: 1;
    background: skyblue;
    margin-left: 46px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);

    .rightHead {
      width: 100%;
      background: white;
      padding: 10px 10px 0px 10px;

      p {
        font-weight: bold;
        padding: 10px 10px 10px 10px;
        box-sizing: border-box;
      }
    }

    .rightBody {
      flex: 1;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;

      .delete {
        margin-left: -1px;
        margin-top: 15px;
      }
    }
  }
}

.tableTab {
  padding: 25px;
  box-sizing: border-box;
  margin: 0 auto;

  .buttonCla {
    height: 35px;
    min-width: 24px;
    padding: 0 20px;
    background-color: #006eff;
    color: #fff;
    border: 1px solid #006eff;
    text-align: center;
    margin-bottom: 10px;
  }
}

.explain {
  width: 100%;
  margin: 0 auto;
  font-size: 12px;
  padding: 10px 30px 10px 20px;
  color: #003b80;
  border: 1px solid #97c7ff;
  background: #e5f0ff;
  box-sizing: border-box;
  margin-bottom: 20px;

  p {
    line-height: 20px;
  }
}
</style>
