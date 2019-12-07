<template>
  <div class="wrap">
    <div class="top">
      <span class="title-left">用户列表</span>
    </div>
    <div class="explain">
      <p style="font-weight:bold">如何查看更多信息?</p>
      <p>访问管理对您的敏感信息进行安全升级保护，您可以点击列表中【详情】列下拉按钮【▶】查看用户的身份安全状态、已加入组以及消息订阅等更多信息。您也可以点击用户名进入用户详细信息中查看或编辑。</p>
    </div>
    <div class="operation">
      <button class="addUser" @click="addUser">新增用户</button>

      <el-select
        v-model="value"
        placeholder="请选择"
        @change="select"
        class="select"
        :disabled="inputShow"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-input placeholder="支持搜索用户名" size="small" class="inputSearch">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="tableBody">
      <el-table
        style="width: 96%; margin: 0 auto;"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="expand" label="详情" width="50">
          <template slot-scope="scope">
            <div class="form">
              <el-form label-position="left" inline class="demo-table-expand" v-model="form">
                <div class="detialsUser">
                  <el-form-item label="用户组:"></el-form-item>
                  <el-form-item label="用户名称:" class="Name">{{scope.row.Name}}</el-form-item>
                  <el-form-item label="用户类型:">{{scope.row.Remark}}</el-form-item>
                </div>
                <div class="detialsUser">
                  <el-form-item label="账号ID:">{{scope.row.Uin}}</el-form-item>
                  <el-form-item label="关联信息:"></el-form-item>
                  <el-form-item label="登录保护:">
                    <span style="color:red" class="s1">未开启保护</span>
                  </el-form-item>
                </div>

                <div class="detialsUser">
                  <el-form-item label="消息订阅:"></el-form-item>
                  <el-form-item label="操作保护:">
                    <span style="color:red">未开启保护</span>
                  </el-form-item>
                  <el-form-item label="控制台访问:">
                    <span style="color:green">启用</span>
                  </el-form-item>
                </div>

                <div class="detialsUser">
                  <el-form-item label="MFA设备:">
                    <span style="color:red">未绑定MFA设备</span>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="用户名称" prop="Name">
          <template slot-scope="scope">
            <el-link @click="detailsUser(scope.row)" type="primary">{{scope.row.Name}}</el-link>
          </template>
        </el-table-column>

        <el-table-column label="用户类型" prop="Remark"></el-table-column>

        <el-table-column label="账号ID" prop="Uin"></el-table-column>

        <el-table-column label="关联信息">
          <template slot-scope="scope">
            <i class="el-icon-mobile mobile"  @click="detailsUser(scope.row)"></i>
            <i class="el-icon-message message"  @click="detailsUser(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template scope="scope">
            <el-button type="text" @click="addRight(scope.row.Uin)">授权</el-button>
            <span>|</span>
            <el-dropdown :hide-on-click="false">
              <span class="el-dropdown-link" style="color: #3E8EF7">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button type="text" style="color:#000" @click="addRroup">添加到组</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="text" style="color:#000">订阅信息</el-button>
                </el-dropdown-item>
                <el-button type="text" style="color:#000;padding-left:20px;" @click="deleteRowData">删除</el-button>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加用户组弹框 -->
    <el-dialog :title="title" :visible.sync="authorization" width="60%" :before-close="handleClose">
      <div class="container" v-if="strategyShow">
        <div class="container-right">
          <span>策略列表</span>
          <div>
            <el-input
              v-model="searchStrategyValue"
              placeholder="搜索"
              size="small"
              class="inputSearchCl"
              @keyup.enter.native="searchStrategy"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchStrategy"></i>
            </el-input>
          </div>

          <el-table
            class="table-left"
            ref="multipleOption"
            tooltip-effect="dark"
            height="400"
            style="width: 80%; border:1px solid #ddd;"
            @row-click="selectedRow"
            @selection-change="handleSelection"
            :data="strategyData"
          >
            <el-input size="mini" style="width:20%" />
            <el-button size="mini" class="suo" icon="el-icon-search" show-overflow-tooltip></el-button>
            <el-table-column type="selection" width></el-table-column>
            <el-table-column label="策略名" prop="Description"></el-table-column>
            <el-table-column label="策略类型" prop="Type">
              <template slot-scope="scope">{{scope.row.Type == '1'?'自定义策略':'预设策略'}}</template>
            </el-table-column>
          </el-table>
        </div>

        <div class="container-left">
          <span>已选择</span>
          <el-table
            class="table-left"
            ref="multipleSelected"
            tooltip-effect="dark"
            height="400"
            style="width: 80%;border:1px solid #ddd"
            :data="userGroupSelect"
          >
            <el-table-column label="策略名" prop="Description"></el-table-column>
            <el-table-column label="策略类型" prop="Type">
              <template slot-scope="scope">{{scope.row.Type == '1'?'自定义策略':'预设策略'}}</template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip>
              &lt;!&ndash;
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index,userGroupSelect)"
                  type="text"
                  size="small"
                >移除</el-button>
              </template>&ndash;&gt;
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="container" v-if="userGroupShow">
        <div class="container-right">
          <span>用户列表</span>
          <div>
            <el-input
              v-model="searchGroupValue"
              placeholder="搜索"
              size="small"
              class="inputSearchCl"
              @keyup.enter.native="searchGroup"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchGroup"></i>
            </el-input>
          </div>

          <el-table
            v-model="searchGroupValue"
            class="table-left"
            ref="multipleOption"
            tooltip-effect="dark"
            height="400"
            style="width: 80%; border:1px solid #ddd;"
            @row-click="selectedRow"
            @selection-change="handleSelection"
            :data="userGroup"
          >
            <el-input size="mini" style="width:20%" />
            <el-button size="mini" class="suo" icon="el-icon-search" show-overflow-tooltip></el-button>
            <el-table-column type="selection" width></el-table-column>
            <el-table-column label="用户组" prop="GroupName"></el-table-column>
          </el-table>
        </div>

        <div class="container-left">
          <span>已选择</span>
          <el-table
            class="table-left"
            ref="multipleSelected"
            tooltip-effect="dark"
            height="400"
            style="width: 80%;border:1px solid #ddd"
            :data="userGroupSelect"
          >
            <el-table-column label="用户组" prop="GroupName"></el-table-column>
            <el-table-column label="操作" show-overflow-tooltip>
              &lt;!&ndash;
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index,userGroupSelect)"
                  type="text"
                  size="small"
                >移除</el-button>
              </template>&ndash;&gt;
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUserList">确 定</el-button>
        <el-button @click="authorization = false">取 消</el-button>
      </span>
    </el-dialog>
    <deleteDialog :dialogDeleteUser="flag" />
  </div>
</template>
<script>
import { USER_LIST, USER_GROUP, POLICY_LIST, POLICY_USER } from "@/constants";
import deleteDialog from "./deleteUser/index";
export default {
  components: {
    deleteDialog
  },
  data() {
    return {
      flag: false, //删除弹框组件
      form: {}, //点击详情,form获取详情数据
      tableData: [], //用户列表数组
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
      Uin:'',//点击授权获取当前行的uin
      options: [
        {
          value: 0,
          label: "添加用户"
        },
        {
          value: 1,
          label: "删除"
        }
      ],
      value: "" //更多操作多选值
    };
  },
  methods: {
    //初始化用户列表数据
    init() {
      let userList = {
        Version: "2019-01-16"
      };
      this.axios.post(USER_LIST, userList).then(data => {
        this.tableData = data.Response.Data;
        console.log(data);
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
        this.strategyData = res.Response.List;
        console.log(res);
      });
    },
    //点击搜索策略数据
    searchStrategy() {
      this.strategy();
    },
    //初始化用户组数据
    userGroups() {
      let params = {
        Version: "2019-01-16"
      };
      if (this.searchGroupValue != null && this.searchGroupValue != "") {
        params["Keyword"] = this.searchGroupValue;
      }
      this.axios.post(USER_GROUP, params).then(res => {
        this.userGroup = res.Response.GroupInfo;
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
    detailsUser(val){
      console.log(val)
        this.$router.push({
          path:"/detailsUser",
          query:{
            detailsData:val.Name
          }
        })
    },
    //input弹框选择数据
    select() {
      if (this.value == 0) {
        this.authorization = true;
        this.userGroupShow = true;
        this.strategyShow = false;
        this.userGroups();
      }
      if (this.value == 1) {
        this.flag = true;
      }
    },
    //点击删除弹框显示
    deleteRowData() {
      this.flag = true;
    },
    //选框
    handleSelectionChange(val) {
      console.log(val);
      this.inputShow = false;
    },
    //点击添加到组事件
    addRroup() {
      this.title = "添加到组";
      this.authorization = true;
      this.userGroupShow = true;
      this.strategyShow = false;
      this.userGroups(); //调用初始化用户组数据
    },
    //点击授权
    addRight(uin) {
      this.Uin = uin;
      this.title = "关联策略";
      this.authorization = true;
      this.userGroupShow = false;
      this.strategyShow = true;
      this.strategy(); //调动初始化策略数据
    },
    //策略与用户组数据弹框确定按钮
    addUserList(){
      // userGroupSelect
      if(this.title == '关联策略'){
         var addPloicyId = [];
         this.userGroupSelect.forEach(item => {
           addPloicyId.push(item);
         });
         addPloicyId.forEach(item => {
           let params = {
              Version: "2019-01-16",
              PolicyId: item.PolicyId,
              AttachUin: this.Uin
           }
           this.axios.post(POLICY_USER,params).then(data => {
             console.log(data)
           })
        });
         this.authorization = false; 
      }
      if(this.title == '添加到组'){
         console.log('22')
      }
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
    }
  },
  created() {
    this.init(); //获取用户列表数据
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  background-color: #f2f2f2 !important;
  .top {
    width: 100%;
    height: 45px;
    background-color: #fff;
    margin-bottom: 20px;
    .title-left {
      font-size: 14px;
      font-weight: bolder;
      padding-left: 20px;
      line-height: 45px;
    }
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
      height: 35px;
      min-width: 24px;
      padding: 0 20px;
      background-color: #006eff;
      color: #fff;
      border: 1px solid #006eff;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      outline: 0;
      box-sizing: border-box;
      text-decoration: none;
      margin-left: 35px;
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
    margin-left: 85px;
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
</style>