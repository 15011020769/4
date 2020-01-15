<template>
  <div class="wrap">
    <div class="head">
      <Headcom :title="$t('CAM.userList.addUsertoStrag')" :backShow="true" @_back="back" />
    </div>
    <div class="policyToUser">
      <div class="step">
        <el-steps :active="active" direction="vertical" simple :space="200">
          <el-step :title="$t('CAM.userList.permissions')"></el-step>
          <el-step :title="$t('CAM.userList.review')"></el-step>
        </el-steps>
      </div>
      <div v-show="active==1" class="table">
        <Step3
          :totalNum="totalNum"
          :tableData="tableData"
          :userData="userData"
          :userNum="userNums"
          :userDatas="userDatas"
          @handleSelectionChange="handleSelectionChange"
          @acitiveName="_acitiveName"
          @loadMore="_loadMore"
          @_policySearch="_policySearch"
          @_policyInp="_policyInp"
          @_userSearch="_userSearch"
          @_userInp="_userInp"
          @_userRadio="_userRadio"
        />
      </div>
      <div v-show="active==2">
        <el-table
          :data="multipleSelection"
          style="width: 96%; margin: 0 auto;"
          v-show="activeName != 'third'"
        >
          <el-table-column :label="$t('CAM.userList.strategyNames')" prop="PolicyName"></el-table-column>
          <el-table-column :label="$t('CAM.userList.descs')" prop="Description"></el-table-column>
        </el-table>
        <el-table
          :data="multipleSelection"
          style="width: 96%; margin: 0 auto;"
          v-show="activeName == 'third'"
        >
          <el-table-column :label="$t('CAM.userList.GroupName')" prop="GroupName"></el-table-column>
          <el-table-column :label="$t('CAM.userList.userRemark')" prop="Remark"></el-table-column>
        </el-table>
      </div>
      <div class="button">
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="prev()"
          v-if="active==2"
        >{{$t('CAM.userList.prev')}}</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="next()"
          v-if="active==0 || active==1"
        >{{$t('CAM.userList.next')}}</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="complete()"
          v-if="active==2"
        >{{$t('CAM.userList.complete')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ADD_USER,
  POLICY_LIST,
  USER_GROUP,
  POLICY_USER,
  QUERY_USER,
  ADD_USERTOGROUP,
  USER_LIST,
  QUERY_POLICY,
  GROUP_POLICY,
  RELATE_USER
} from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import Headcom from "../components/Head";
import Step3 from "../addUser/Tab/Step3";
export default {
  components: {
    Headcom, //头部组件
    Step3
  },
  data() {
    return {
      active: 1,
      totalNum: 0,
      tableData: [],
      userData: [],
      userNums: 0,
      userDatas: [],
      multipleSelection: [],
      activeName: "first",
      emptyData: [],
      arrDataPush: [],
      policyNum: 10,
      userNum: 0,
      policyPage: 1,
      policyArr: [],
      groupArr: []
    };
  },
  methods: {
    commonPolicy() {
      const params = {
        Version: "2019-01-16",
        TargetUin: this.$route.query.Uin
      };
      this.axios.post(QUERY_POLICY, params).then(res => {
        if(res.Response.Error === undefined){
          this.policyArr = res.Response.List;
          this._getList();
        }else{
          let ErrTips = {
                 "InternalError.SystemError":'内部错误',
                 "InvalidParameter.ParamError":'非法入参'
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
      const param = {
        Version: "2019-01-16",
        Uid: this.$route.query.Uid
      };
      this.axios.post(RELATE_USER, param).then(res => {
        if(res.Response.Error === undefined){
          this.groupArr = res.Response.GroupInfo;
          this._userList();
        }else{
              let ErrTips = {
                 "ResourceNotFound.UserNotExist":'用户不存在'
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
    //用户组列表
    _userList(val) {
      const params = {
        Version: "2019-01-16",
        Rp: this.userNum
      };
      if (val) {
        params["Keyword"] = val;
      }
      this.axios.post(USER_GROUP, params).then(res => {
        this.userData = res.Response.GroupInfo;
        this.userNums = res.Response.TotalNum;
        this.userData.forEach(item => {
          item.status = 0;
          this.groupArr.forEach(val => {
            if (val.GroupId == item.GroupId) {
              item.status = 1;
            }
          });
        });
        var data = this.userData;
        data.forEach(item => {
          const params = {
            Version: "2019-01-16",
            TargetGroupId: item.GroupId
          };
          this.axios.post(GROUP_POLICY, params).then(res => {
            if (res.Response.Error === undefined) {
              item.policy = res.Response.List;
            } else {
              let ErrTips = {
                "nternalError.SystemError": "内部错误",
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
        });
      });
    },
    //初始化用户列表数据
    init() {
      let userList = {
        Version: "2019-01-16"
      };
      this.axios.post(USER_LIST, userList).then(data => {
        var json = data.Response.Data;
        json.forEach(item => {
          const params = {
            Version: "2019-01-16",
            TargetUin: item.Uin
          };
          this.axios.post(QUERY_POLICY, params).then(res => {
            if (res.Response.Error === undefined) {
              item.policy = res.Response.List;
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
        });
        this.userDatas = json;
      });
    },
    //策略列表
    _getList(val, bool) {
      const params = {
        Version: "2019-01-16",
        Rp: 10,
        Page: this.policyPage
      };
      if (val) {
        params["Keyword"] = val;
      }
      this.axios.post(POLICY_LIST, params).then(res => {
        // console.log(res);
        if (res.Response.Error === undefined) {
          if (!bool) {
            this.tableData = res.Response.List;
            this.tableData.forEach(item => {
              item.status = 0;
              this.policyArr.forEach(val => {
                if (val.PolicyId == item.PolicyId) {
                  item.status = 1;
                }
              });
            });
          } else {
            res.Response.List.forEach(item => {
              this.tableData.push(item);
            });
          }
          this.totalNum = res.Response.TotalNum;
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
    _userRadio(val) {
      const params = {
        Version: "2019-01-16",
        Name: val
        // Name: this.ruleForm.Name
      };
      this.axios
        .post(QUERY_USER, params)
        .then(res => {
          this.userUin = res.Response.Uin;
        })
        //获取关联的策略
        .then(data => {
          const params = {
            Version: "2019-01-16",
            TargetUin: this.userUin
          };
          this.axios.post(QUERY_POLICY, params).then(res => {
            if (res.Response.Error === undefined) {
              this.multipleSelection = res.Response.List;
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
        });
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //tab标签名称
    _acitiveName(val) {
      this.activeName = val;
    },
    //步骤三表格懒加载
    _loadMore(val) {
      if (val == "first") {
        this.policyPage++;
        // this.policyNum = this.policyNum + 10;
        this._getList(this.policyVal, 1);
      } else if (val == "third") {
        this.userPage++;
        this.userNum = this.userNum + 10;
        this._userList(this.userVal);
      }
    },
    //策略列表搜索
    _policySearch(val) {
      this.policyVal = val;
      this._getList(val);
    },
    _policyInp(val) {
      if (val == "") {
        this._getList();
      }
    },
    //用户列表搜索
    _userSearch(val) {
      this.userVal = val;
      this._userList(val);
    },
    _userInp(val) {
      if (val == "") {
        this._userList();
      }
    },
    //绑定用户组
    _userGroup(id) {
      const params = {
        Version: "2019-01-16",
        "Info.0.Uid": this.$route.query.Uin,
        "Info.0.GroupId": id
      };
      this.axios.post(ADD_USERTOGROUP, params).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res);
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
    },
    _policy(id) {
      const params = {
        Version: "2019-01-16",
        PolicyId: id,
        AttachUin: this.$route.query.Uin
      };
      this.axios.post(POLICY_USER, params).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res);
        } else {
          let ErrTips = {
            "FailedOperation.PolicyFull": "用户策略数超过上限",
            "InternalError.SystemError": "内部错误",
            "InvalidParameter.AttachmentFull":
              "principal字段的授权对象关联策略数已达到上限",
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
    },
    prev() {
      --this.active;
      if (this.active < 0) this.active = 0;
    },
    next() {
      if (this.active++ > 3) this.active = 0;
    },
    complete() {
      this.multipleSelection.forEach(item => {
        //从策略列表中选取策略关联
        if (this.activeName == "first") {
          this._policy(item.PolicyId);
        }
        //复用现有用户策略
        if (this.activeName == "second") {
          this._policy(item.PolicyId);
        }
        //添加至组获得随机权限
        if (this.activeName == "third") {
          this._userGroup(item.GroupId);
        }
      });
      this.$router.go(-1);
    },
    back() {
      this.$router.go(-1);
    }
  },
  created() {
    this.commonPolicy();
    this.init();
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
.policyToUser {
  width: 85%;
  background: white;
  margin: 0 auto;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  .step {
    width: 100%;
  }
  .table {
    flex: 1;
  }
  .button {
    width: 100%;
  }
}
.step >>> .el-steps {
  background: white;
  padding-bottom: 25px;
}
</style>