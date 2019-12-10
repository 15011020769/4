<template>
  <div class="wrap">
    <div class="head">
      <Headcom title="添加策略列表" :backShow="true" @_back="back" />
    </div>
    <div class="policyToUser">
      <div class="step">
        <el-steps
          :active="active"
          direction="vertical"
          simple
          :space="200"
          style="margin-right: 50%"
          finish-status="success"
        >
          <el-step title="设置用权限"></el-step>
          <el-step title="审阅用户权限"></el-step>
        </el-steps>
      </div>
      <div v-show="active==1" class="table">
        <Step3
          :totalNum="totalNum"
          :tableData="tableData"
          :userData="userData"
          :userNum="userNum"
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
        <el-table :data="arrDataPush[0]" style="width: 96%; margin: 0 auto;">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="策略名" prop="PolicyName"></el-table-column>
          <el-table-column label="描述" prop="Description"></el-table-column>
        </el-table>
      </div>
      <div class="button">
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="prev()"
          v-if="active==1 || active==2"
        >上一步</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="next()"
          v-if="active==0 || active==1"
        >下一步</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="complete()"
          v-if="active==2"
        >完成</el-button>
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
  GROUP_POLICY
} from "@/constants";
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
      userNum: 0,
      userDatas: [],
      multipleSelection: [],
      activeName: "first",
      emptyData:[],
      arrDataPush:[]
    };
  },
  methods: {
    //用户组列表
    _userList(val) {
      const params = {
        Version: "2019-01-16",
        Rp: this.userNums
      };
      if (val) {
        params["Keyword"] = val;
      }
      this.axios.post(USER_GROUP, params).then(res => {
        this.userData = res.Response.GroupInfo;
        this.userNum = res.Response.TotalNum;
        var data = this.userData;
        data.forEach(item => {
          const params = {
            Version: "2019-01-16",
            TargetGroupId: item.GroupId
          };
          this.axios.post(GROUP_POLICY, params).then(res => {
            item.policy = res.Response.List;
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
            item.policy = res.Response.List;
          });
        });
        this.userDatas = json;
      });
    },
    //策略列表
    _getList(val) {
      const params = {
        Version: "2019-01-16",
        Rp: this.policyNum
      };
      if (val) {
        params["Keyword"] = val;
      }
      this.axios.post(POLICY_LIST, params).then(res => {
        this.tableData = res.Response.List;
        this.totalNum = res.Response.TotalNum;
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
            this.multipleSelection = res.Response.List;
          });
        });
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let arrData = [];
      arrData.push(val);
      this.arrDataPush = arrData;
    },
    //tab标签名称
    _acitiveName(val) {
      console.log(val)
      this.activeName = val;
    },
    //步骤三表格懒加载
    _loadMore(val) {
      if (val == "first") {
        this.policyPage++;
        this.policyNum = this.policyNum + 10;
        this._getList(this.policyVal);
      } else if (val == "third") {
        this.userPage++;
        this.userNums = this.userNums + 10;
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
        console.log(res)
      });
    },
    _policy(id) {
      const params = {
        Version: "2019-01-16",
        PolicyId: id,
        AttachUin: this.$route.query.Uin
      };
      this.axios.post(POLICY_USER, params).then(res => {
        console.log(res);
        if (res.Response.RequestId) {
          this.active = 3;
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
    complete(){
        this.multipleSelection.forEach(item => {
        //从策略列表中选取策略关联
        if (this.activeName == "first") {
          this._policy(item.PolicyId);
        }
        //复用现有用户策略
        else if (this.activeName == "second") {
          console.log(2)
          this._policy(item.PolicyId);
        }
        //添加至组获得随机权限
        else if (this.activeName == "third") {
          this._userGroup(item.GroupId);
          console.log(3)
        }
      });
      this.$router.go(-1)
    },
    back(){
      this.$router.go(-1)
    }
  },
  created() {
    this._getList();
    this._userList();
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.policyToUser {
  width: 85%;
  background: white;
  margin: 0 auto;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  .step{
    width: 100%;
  }
  .table{
    flex: 1;
  }
  .button{
    width: 100%;
  }
}
.step >>> .el-steps {
  background: white;
  padding-bottom: 25px;
}
</style>