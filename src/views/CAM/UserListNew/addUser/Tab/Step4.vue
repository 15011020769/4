<template>
  <div class="edit-wrap">
    <div class="explain">
      <p>{{$t('CAM.userList.heckYourSelf')}}</p>
    </div>
    <div class="edit-main" v-loading="loading">
      <div class="edit-box">
        <h3>{{$t('CAM.userList.userMessage')}}</h3>
        <table width="100%" boder="1" cellspacing="0" cellpadding="1">
          <thead>
            <tr>
              <td width="280">
                {{$t('CAM.userList.userName')}}
                <span style="color:#e54545;">*</span>
              </td>
              <td width="170">{{$t('CAM.userList.userRemark')}}</td>
              <td width="200">{{$t('CAM.userList.userPhone')}}</td>
              <td width="200">{{$t('CAM.userList.userEmail')}}</td>
              <td>操作</td>
            </tr>
          </thead>
          <tbody>
            <tr v-show="!userInp" class="userInp">
              <td>{{userData.Name}}</td>
              <td>{{userData.Remark ? userData.Remark : '-'}}</td>
              <td>{{userData.PhoneNum ? userData.PhoneNum : '-'}}</td>
              <td>{{userData.Email ? userData.Email : '-'}}</td>
              <td class="edit" @click="_edit">{{$t('CAM.userList.updataUser')}}</td>
            </tr>
            <tr v-show="userInp">
              <td>{{userData.Name}}</td>
              <td>
                <el-input v-model="form.Remark"></el-input>
              </td>
              <td class="reg">
                <el-input v-model="form.PhoneNum" @change="telInp"></el-input>
                <span class="red" v-show="phoneReg">手机号输入有误</span>
              </td>
              <td class="reg">
                <el-input v-model="form.Email" @change="emailInp"></el-input>
                <span class="red" v-show="emailReg">邮箱输入有误</span>
              </td>
              <td class="edit">
                <span @click="_userConfirm">{{$t('CAM.userList.suerAdd')}}</span>
                <!-- <span style="margin-left:5px;" @click="_userCancel">{{$t('CAM.userList.handClose')}}</span> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="edit-box">
        <h3>{{$t('CAM.userList.askMesg')}}</h3>
        <el-form ref="form" label-width="100px">
          <el-form-item :label="$t('CAM.userList.askWay')" required>
            <p v-show="userData.ConsoleLogin == 1">{{$t('CAM.userList.consoleAsk')}}</p>
            <p v-show="userData.ConsoleLogin == 0">{{$t('CAM.userList.noWayAsk')}}</p>
          </el-form-item>
          <el-form-item :label="$t('CAM.userList.passType')">
            <p v-if="!pwdRadio">{{$t('CAM.userList.generation')}}</p>
            <p v-if="pwdRadio">{{$t('CAM.userList.Custom')}}</p>
          </el-form-item>
          <el-form-item :label="$t('CAM.userList.resetPassword')">
            <p v-if="pwdType.length != 0">是</p>
            <p v-if="pwdType.length == 0">否</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="edit-box">
        <h3>{{$t('CAM.userList.policyMesg')}}</h3>
        <el-table
          :data="policyData"
          style="width: 100%"
          v-if="activeName == 'first' || activeName == 'second'"
          v-loading="tableloading"
          max-height="520"
        >
          <el-table-column prop="PolicyName" :label="$t('CAM.userList.strategyNames')" width="220"></el-table-column>
          <el-table-column :label="$t('CAM.userList.policyMS')">
            <template slot-scope="scope">
              <p class="omit">{{scope.row.Remark}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <p
                style="color:#006eff;cursor: pointer;"
                @click="_del(scope.row)"
              >{{$t('CAM.userList.Remove')}}</p>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="userList"
          style="width: 100%"
          v-if="activeName == 'third'"
          v-loading="tableloading"
          max-height="520"
        >
          <el-table-column prop="GroupName" label="用戶組名稱"></el-table-column>
          <el-table-column :label="$t('CAM.userList.userCz')" width="250">
            <template slot-scope="scope">
              <p
                style="color:#006eff;cursor: pointer;"
                @click="_del(scope.row)"
              >{{$t('CAM.userList.Remove')}}</p>
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
      </div>
    </div>
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips";
import {
  QUERY_USER,
  QUERY_POLICY,
  REMOVEBIND_USER,
  RELATE_USER,
  DEL_USERTOGROUP,
  UPDATA_USER
} from "@/constants";
export default {
  name: "edit",
  data() {
    return {
      phoneReg: false,
      emailReg: false,
      loading: true, //加载
      tableloading: true, //表格加载
      //表单
      form: {},
      num: 0,
      userList: [],
      policyData: [], //策略列表
      userData: {}, //用户信息
      userInp: false, //用户信息input
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1 // 当前页码
    };
  },
  methods: {
    //手机号验证
    telInp() {
      var reg = /^1[3456789]\d{9}$/;
      if (this.form.PhoneNum != "") {
        if (!reg.test(this.form.PhoneNum)) {
          this.phoneReg = true;
        } else {
          this.phoneReg = false;
        }
      } else {
        this.phoneReg = false;
      }
    },
    //邮箱验证
    emailInp() {
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (this.form.Email != "") {
        if (!reg.test(this.form.Email)) {
          this.emailReg = true;
        } else {
          this.emailReg = false;
        }
      } else {
        this.emailReg = false;
      }
    },
    //用户组列表
    _groupList() {
      this.tableloading = true;
      const params = {
        Version: "2019-01-16",
        Uid: this.userData.Uid,
        Page: this.currpage,
        Rp: this.pagesize
      };
      this.axios.post(RELATE_USER, params).then(res => {
        if(res.Response.Error === undefined){
          this.userList = res.Response.GroupInfo;
          this.num = res.Response.TotalNum;
          this.TotalCount = res.Response.TotalNum;
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
        this.tableloading = false;
      });
    },
    //用户组解除绑定
    _userDel(val) {
      const params = {
        Version: "2019-01-16",
        "Info.0.Uid": this.userData.Uid,
        "Info.0.GroupId": val.GroupId
      };
      this.axios.post(DEL_USERTOGROUP, params).then(res => {
        if (res.Response.RequestId) {
          this.$message("解除成功");
        } else {
          this.$message.error(Response.Error.Message);
        }
        this._getUser();
      });
    },
    //策略解除绑定
    _del(val) {
      this.$confirm("此操作将解除绑定, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.activeName == "first" || this.activeName == "second") {
            this._remove(val);
          } else if (this.activeName == "third") {
            this._userDel(val);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //策略解除绑定
    _remove(val) {
      const params = {
        Version: "2019-01-16",
        DetachUin: this.userData.Uin,
        PolicyId: val.PolicyId
      };
      this.axios.post(REMOVEBIND_USER, params).then(res => {
        if(res.Response.Error === undefined){
            if (res.Response.RequestId) {
              this.$message("解除成功");
            } else {
              this.$message.error(Response.Error.Message);
            }
            this._getUser();
        }else{
            let ErrTips = {
               "InternalError.SystemError":'内部错误',
               "InvalidParameter.AttachmentFull":'principal字段的授权对象关联策略数已达到上限',
               "InvalidParameter.ParamError":'非法入参',
               "InvalidParameter.PolicyIdError":'输入参数PolicyId不合法',
               "InvalidParameter.PolicyIdNotExist":'策略ID不存在',
               "InvalidParameter.UserNotExist":'principal字段的授权对象不存在',
               "ResourceNotFound.PolicyIdNotFound":'PolicyId指定的资源不存在',
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
    //策略列表
    _tactics() {
      this.tableloading = true;
      const params = {
        Version: "2019-01-16",
        TargetUin: this.userData.Uin,
        Page: this.currpage,
        Rp: this.pagesize
      };
      this.axios.post(QUERY_POLICY, params).then(res => {
        if(res.Response.Error === undefined){
            this.num = res.Response.TotalNum;
            this.TotalCount = res.Response.TotalNum;
            this.policyData = res.Response.List;    
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
        
        this.tableloading = false;
      });
    },
    //获取用户信息
    _getUser() {
      const params = {
        Version: "2019-01-16",
        Name: this.name
      };
      this.axios
        .post(QUERY_USER, params)
        .then(res => {
          this.userData = res.Response;
          this.form = res.Response;
          this.loading = false;
        })
        .then(() => {
          if (this.activeName == "first" || this.activeName == "second") {
            this._tactics();
          } else if (this.activeName == "third") {
            this._groupList();
          }
        });
    },
    //用户信息编辑
    _edit() {
      this.userInp = !this.userInp;
    },
    //用户信息取消
    // _userCancel() {
    //   this.userInp = !this.userInp;
    // },
    //用户信息确定
    _userConfirm() {
      const params = {
        Version: "2019-01-16",
        Name: this.name,
        Remark: this.form.Remark,
        PhoneNum: this.form.PhoneNum,
        Email: this.form.Email
      };
      if (this.phoneReg) {
        this.$message.error("请输入正确的手机号");
      } else if (this.emailReg) {
        this.$message.error("请输入正确的邮箱");
      } else {
        this.axios
          .post(UPDATA_USER, params)
          .then(res => {
            if(res.Response.Error === undefined){
                if (res.Response.RequestId) {
                  this.$message("编辑成功");
                  this.userInp = !this.userInp;
                } else {
                  this.$message.error("编辑失败");
                }
            }else{
                let ErrTips = {
                   "InvalidParameter.PasswordViolatedRules":'密码不符合用户安全设置',
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
           })
          .then(() => {
            this._getUser();
          });
      }
    },
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.currpage = 1;
      if (this.activeName == "first") {
        this._tactics();
      } else if (this.activeName == "third") {
        this._groupList();
      }
    },
    handleCurrentChange(val) {
      this.currpage = val;
      if (this.activeName == "first") {
        this._tactics();
      } else if (this.activeName == "third") {
        this._groupList();
      }
    }
  },
  created() {
    this._getUser();
  },
  props: {
    name: String,
    activeName: String,
    pwdType: Array,
    pwdRadio: Boolean
  }
};
</script>

<style scoped lang='scss'>
.pagstyle {
  padding: 20px;

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.edit-wrap {
  width: 100%;
  height: 100%;
  .edit-main >>> .el-form-item {
    margin-bottom: 0;
  }
  .edit-main >>> .el-form-item__content {
    p {
      font-size: 12px;
    }
  }
  .edit-main {
    box-sizing: border-box;
    .reg {
      position: relative;
      span {
        position: absolute;
        bottom: -12px;
        left: 10px;
      }
      .red {
        color: red;
      }
      .green {
        color: green;
      }
    }

    .omit {
      // width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .page-box {
      padding: 15px 0;
      box-sizing: border-box;
      color: #666;
    }

    .edit {
      color: #006eff;
      cursor: pointer;
    }

    h3 {
      font-size: 14px;
      line-height: 14px;
      margin: 15px 0;
    }
    .edit-box {
      padding-bottom: 15px;
      box-sizing: border-box;
    }
    table {
      border: 1px #f2f2f2 solid;
      thead {
        td {
          font-weight: bold;
          color: #888;
          padding: 10px;
          box-sizing: border-box;
        }
      }
      tbody {
        td {
          padding: 10px;
          box-sizing: border-box;
        }
        .userInp {
          td {
            padding: 16px 10px;
          }
        }
      }
      td {
        font-size: 12px;
        border: 0.5px #f2f2f2 solid;
        border-right: 0;
        border-left: 0;
        padding: 0 10px;
        box-sizing: border-box;
      }
    }
  }
  .explain {
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    p {
      line-height: 20px;
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
</style>