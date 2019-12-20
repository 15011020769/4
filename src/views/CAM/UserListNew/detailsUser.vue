<template>
  <div class="wrap">
    <div class="head">
      <Headcom :title="$t('CAM.userList.userDetil')" :backShow="true" @_back="back" />
    </div>
    <div class="details">
      <div class="details-left" v-loading="infoLoad">
        <div class="leftHead" style="display:flex">
          <p style="flex:1">{{userData.Name}}</p>
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
              <span>{{userData.Remark}}</span>
            </p>
            <p>
              <span class="spns">{{$t('CAM.userList.userWay')}}</span>
              <span>{{ConsoleLogin[userData.ConsoleLogin]}}</span>
            </p>
          </div>
          <div class="bodyRight" style="flex:1">
            <p>
              <span class="spns">{{$t('CAM.userList.userPhone')}}</span>
              <span>{{userData.PhoneNum}}</span>
            </p>
            <p>
              <span class="spns">{{$t('CAM.userList.userEmail')}}</span>
              <span>{{userData.Email}}</span>
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
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column :label="$t('CAM.userList.strategyNames')" prop="PolicyName">
              <template slot-scope="scope">
                <el-link @click="handleClicks(scope.row)" type="primary">{{scope.row.PolicyName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userList.AssociationTypes')" prop="CreateMode"></el-table-column>
            <el-table-column :label="$t('CAM.userList.strategyChose')" prop="Type">
              <template slot-scope="scope">{{scope.row.Type == '1'?'自定义策略':'预设策略'}}</template>
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
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column :label="$t('CAM.userList.GroupName')" prop="GroupName">
              <template slot-scope="scope">
                <el-link @click="Interface(scope.row)" type="primary">{{scope.row.GroupName}}</el-link>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userList.RelatedPolicies')" prop="GroupId"></el-table-column>
            <el-table-column :label="$t('CAM.userList.userRemark')" prop="Remark"></el-table-column>
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
    <el-dialog title="删除用户" :visible.sync="delDialog" width="30%" :before-close="handleClose">
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
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
          :label="$t('CAM.userList.userName')"
          prop="Name"
          style="width:75%;text-align:center"
        >
          <el-input v-model="ruleForm.Name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('CAM.userList.userRemark')"
          prop="Remark"
          style="width:75%;text-align:center"
        >
          <el-input v-model="ruleForm.Remark"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('CAM.userList.userPhone')"
          prop="PhoneNum"
          style="width:75%;text-align:center"
        >
          <el-input v-model="ruleForm.PhoneNum" @change="tel"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('CAM.userList.userEmail')"
          prop="Email"
          style="width:75%;text-align:center"
        >
          <el-input v-model="ruleForm.Email" @change="email"></el-input>
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
  DEL_USERTOGROUP
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
      TotalCount: 0,
      pagesize: 10,
      currpage: 1,
      TotalCounts: 0,
      pagesizes: 10,
      currpages: 1,
      infoLoad: true,
      ConsoleLogin: {
        1: "可以登录控制台",
        2: "无法登录控制台"
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
    //对手机号进行判断
    tel: function() {
      var phone = /^1[345789]\d{9}$/;
      if (this.ruleForm.PhoneNum != "") {
        if (!phone.test(this.ruleForm.PhoneNum)) {
          this.$message({
            type: "error",
            message: "请输入正确的手机号!"
          });
        }
      }
    },
    //对邮箱进行判断
    email: function() {
      var email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (this.ruleForm.Email != "") {
        if (!email.test(this.ruleForm.Email)) {
          this.$message({
            type: "error",
            message: "请输入正确的邮箱!"
          });
        }
      }
    },

    //编辑用户
    sureUpdata() {
      var phone = /^1[345789]\d{9}$/;
      var email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (this.ruleForm.PhoneNum != "" && this.ruleForm.Email != "") {
        if (
          !phone.test(this.ruleForm.PhoneNum) ||
          !email.test(this.ruleForm.Email)
        ) {
          this.$message.error("编辑失败,手机号或邮箱输入有误！");
          this.updataUser = true;
        } else {
          let params = {
            Version: "2019-01-16",
            Name: this.ruleForm.Name,
            Remark: this.ruleForm.Remark,
            PhoneNum: this.ruleForm.PhoneNum,
            Email: this.ruleForm.Email
          };
          this.axios.post(UPDATA_USER, params).then(res => {
            this.init();
          });
          this.$message("编辑成功");
          this.updataUser = false;
        }
      } else {
        let params = {
          Version: "2019-01-16",
          Name: this.ruleForm.Name,
          Remark: this.ruleForm.Remark,
          PhoneNum: this.ruleForm.PhoneNum,
          Email: this.ruleForm.Email
        };
        this.axios.post(UPDATA_USER, params).then(res => {
          this.init();
        });
        this.$message("编辑成功");
        this.updataUser = false;
      }
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
          this.$router.push("/UserListNew");
        })
        .then(() => {
          let delparams = {
            QcloudUin: this.delUin,
            SubAccountname: this.deleteName
          };
          this.axios
            .post(
              "http://tfc.dhycloud.com/adminapi/admin/taifucloud/account-sub/manage/delete",
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
        this.userData = res.Response;
        this.infoLoad = false;
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
          if (res != "") {
            console.log(res);
            this.loading = false;
            this.StrategyData = res.Response.List.slice(
              (this.currpages - 1) * this.pagesizes,
              this.currpages * this.pagesizes
            );
            this.TotalCounts = res.Response.List.length;
            this.totalNum = "权限(" + res.Response.List.length + ")";
          } else {
            this.loading = false;
            this.$message({
              type: "info",
              message: "无响应数据！"
            });
          }
        });
      });
    },
    handleCurrentChanges(val) {
      this.currpages = val;
      this.ploicyData();
    },
    //初始化用户列表
    userLists() {
      let userList = {
        Version: "2019-01-16"
      };
      this.axios.post(USER_LIST, userList).then(data => {});
    },
    //获取每一个子用户下的用户组
    groupListData() {
      this.loading = true;
      let params = {
        Version: "2019-01-16",
        Name: this.$route.query.detailsData
      };
      this.axios.post(QUERY_USER, params).then(res => {
        this.userData = res.Response;
        let groupParams = {
          Version: "2019-01-16",
          Uid: this.userData.Uid
        };
        this.axios.post(RELATE_USER, groupParams).then(res => {
          this.TotalCount = res.Response.GroupInfo.length;
          this.groupData = res.Response.GroupInfo.slice(
            (this.currpage - 1) * this.pagesize,
            this.currpage * this.pagesize
          );
          this.groupNum = "组(" + res.Response.GroupInfo.length + ")";
          this.loading = false;
        });
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
            this.ploicyData();
            this.$message("批量解除成功");
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
          console.log(data);
          this.ploicyData();
          this.$message("解除成功");
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
      if (this.groupTitle == "移出组") {
        var groupId = [];
        this.valArr.forEach(item => {
          groupId.unshift(item.GroupId);
        });
        groupId.forEach(item => {
          this.delGroup(item);
        });
        this.GroupLoading = false;
      }
      if (this.groupTitle == "确认移出") {
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
        this.groupListData();
        this.$message('移出成功')
      });
    },
    //当前一行移出组
    removeGroup(val) {
      console.log(val.GroupId);
      this.GroupId = val.GroupId;
      this.GroupLoading = true;
      this.groupTitle = "确认移出";
    },
    //批量移出组
    removeMoreGroup() {
      this.GroupLoading = true;
      this.groupTitle = "移出组";
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
          Uin: this.userData.Uin
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
      console.log(val);
      this.valArr = val;
      if (val != "") {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleClose(done) {
      this.StrategyLoading = false;
      this.delDialog = false;
      this.updataUser = false;
    },
    bindMesg() {
      this.$message({
        type: "info",
        message: "内测中..."
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