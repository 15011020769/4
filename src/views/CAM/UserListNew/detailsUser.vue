<template>
  <div class="wrap">
    <div class="head">
      <Headcom title="用户详情" :backShow="true" />
    </div>
    <div class="details">
      <div class="details-left">
        <div class="leftHead" style="display:flex">
          <p style="flex:1">{{userData.Name}}</p>
          <p style="width:30px;">修改</p>
        </div>
        <div class="leftBody">
          <div class="bodyLeft" style="flex:1;">
            <p>
              <span style="color:#666">账号ID</span>
              <span style="padding-left:30px;">{{userData.Uin}}</span>
            </p>
            <p>
              <span style="color:#666">备注</span>
              <span style="padding-left:30px;">{{userData.Remark}}</span>
            </p>
            <p>
              <span style="color:#666">访问方式</span>
              <span style="padding-left:30px;">{{userData.ConsoleLogin}}</span>
            </p>
          </div>
          <div class="bodyRight" style="flex:1">
            <p>
              <span style="color:#666">手机</span>
              <span style="padding-left:30px;">{{userData.PhoneNum}}</span>
            </p>
            <p>
              <span style="color:#666">邮箱</span>
              <span style="padding-left:30px;">{{userData.Email}}</span>
            </p>
            <p>
              <span style="color:#666">微信</span>
              <span style="padding-left:30px;">-</span>
            </p>
            <p>
              <span style="color:#666">是否允许微信接收通知</span>
              <span style="padding-left:30px;">否</span>
            </p>
          </div>
        </div>
      </div>
      <div class="details-right">
        <div class="rightHead">
          <p>快捷操作</p>
        </div>
        <div class="rightBody">
          <el-button size="small">订阅消息</el-button>
          <el-button size="small" class="delete">删除用户</el-button>
        </div>
      </div>
    </div>
    <div class="tableTab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="权限(0)" name="first">
          <div class="explain">
            <p>关联策略以获取策略包含的操作权限。解除策略将失去策略包含的操作权限。特别的，解除随组关联类型的策略是通过将用户从关联该策略的用户组中移出。</p>
          </div>
          <el-button class="buttonCla" type="primary" size="small" @click="gotoPolicy">关联策略</el-button>
          <el-button
            class="buttonCla"
            type="primary"
            size="small"
            :disabled="disabled"
            @click="delMoreStrateg"
          >解除策略</el-button>
          <el-table
            ref="multipleTable"
            :data="StrategyData"
            style="width: 100%;"
            @selection-change="Select"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="策略名" prop="PolicyName"></el-table-column>
            <el-table-column label="关联类型" prop="CreateMode"></el-table-column>
            <el-table-column label="策略类型" prop="Type">
              <template slot-scope="scope">{{scope.row.Type == '1'?'自定义策略':'预设策略'}}</template>
            </el-table-column>
            <el-table-column label="关联时间" prop="AddTime"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="deleteStrage(scope.row.PolicyId)">解除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="组(0)" name="second">
          <el-button class="buttonCla" type="primary" size="small" @click="addGroupUser">加入到组</el-button>
          <el-button
            class="buttonCla"
            type="primary"
            size="small"
            :disabled="disabled"
            @click="removeMoreGroup"
          >移出组</el-button>
          <el-table
            ref="multipleTable"
            :data="groupData"
            style="width: 100%;"
            @selection-change="Select"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="组名称" prop="GroupName"></el-table-column>
            <el-table-column label="关联策略" prop="GroupId"></el-table-column>
            <el-table-column label="备注" prop="Remark"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template>
                <el-button type="text" size="small" @click="removeGroup(item.GroupId)">移出组</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="安全" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="API密钥" name="fourth">定时任务补偿</el-tab-pane>
        <el-tab-pane label="小程序" name="fifth">程序</el-tab-pane>
      </el-tabs>
    </div>
    <!-- 策略 -->
    <el-dialog
      :title="StrategyTitle"
      :visible.sync="StrategyLoading"
      width="30%"
      :before-close="handleClose"
    >
      <span v-if="showStrategyMore">解除策略将失去策略包含的操作权限。特别的，解除随组关联类型的策略是通过将用户从关联该策略的用户组中移出。</span>
      <span v-if="showStrategyRow">是否确定将该用户移出用户组来解除此随组关联策略？移出用户组后该用户将无法获得该策略所描述的相关权限。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="StrategyLoading = false">取 消</el-button>
        <el-button type="primary" @click="moveStrategy">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户 -->
    <el-dialog
      :title="groupTitle"
      :visible.sync="GroupLoading"
      width="30%"
      :before-close="handleClose"
    >
      <span>移出后将无法接收到该组的短信、邮件通知</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="GroupLoading = false">取 消</el-button>
        <el-button type="primary" @click="removeGroupUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Headcom from "./components/Head"; //头部组件引入
import {
  QUERY_USER,
  QUERY_POLICY,
  RELATE_USER,
  REMOVEBIND_USER,
  REMOVEGROUP_USER
} from "@/constants";
export default {
  components: {
    Headcom //头部组件
  },
  data() {
    return {
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
      groupTitle: "" //用户组弹出框title
    };
  },
  methods: {
    //获取用户详情数据
    init() {
      let params = {
        Version: "2019-01-16",
        Name: this.$route.query.detailsData
      };
      this.axios.post(QUERY_USER, params).then(res => {
        this.userData = res.Response;
      });
    },
    //获取每一个用户下的权限
    ploicyData() {
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
          this.StrategyData = res.Response.List;
        });
      });
    },
    //获取每一个子用户下的用户组
    groupListData() {
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
          this.groupData = res.Response.GroupInfo;
        });
      });
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
          console.log(data)
          this.ploicyData();
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
          let params = {
            Version: "2019-01-16",
            GroupId: item
          };
          this.axios.post(REMOVEGROUP_USER, params).then(data => {
            this.groupListData();
          });
        });
        this.GroupLoading = false;
      }
      if (this.groupTitle == "确认移出") {
        var removeGroupRow = [];
        this.groupData.forEach(item => {
          removeGroupRow.unshift(item.GroupId);
        });
        removeGroupRow.forEach(item => {
          let params = {
            Version: "2019-01-16",
            GroupId: item
          };
          this.axios.post(REMOVEGROUP_USER, params).then(data => {
            console.log(data);
          });
        });
        this.GroupLoading = false;
      }
    },
    //当前一行移出组
    removeGroup(val) {
      console.log(val);
      this.GroupLoading = true;
      this.groupTitle = "确认移出";
    },
    //批量移出组
    removeMoreGroup() {
      this.GroupLoading = true;
      this.groupTitle = "移出组";
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
      this.disabled = false;
      this.valArr = val;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleClose(done) {
      this.StrategyLoading = false;
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
.details {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px;
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
    width: 15%;
    background: skyblue;
    margin-left: 45px;
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
  width: 88%;
  background: white;
  padding: 25px;
  box-sizing: border-box;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-left: 100px;
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