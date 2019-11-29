<template>
  <div class="Cam">
    <div class="top">
      <i
        @click="backoff"
        class="el-icon-back"
        style="padding-right: 10px;
      font-size: 130%;
      color: #006eff;
      font-weight: 900;
      cursor:pointer;"
      ></i>
      <span class="title-left">添加策略</span>
    </div>
    <div class="box-ctr">
      <div class="step">
        <el-steps
          :active="active"
          direction="vertical"
          simple
          :space="200"
          style="margin-right: 70%"
          finish-status="success"
        >
          <el-step title="设置用户权限"></el-step>
          <el-step title="审阅用户权限"></el-step>
        </el-steps>
      </div>
      <div v-show="active==1">
        <template>
          <el-tabs>
            <el-tab-pane label="添加至组获得随组全选" name="first">
              <div class="explain">
                <p>将用户添加至用户组以获得随组关联策略。按照工作职能创建组并赋予用户组最小权限，将用户添加至拥有最小权限的用户组内是管理用户权限的最佳做法。</p>
              </div>
              <el-button
                class="clButton"
                type="primary"
                size="small"
                @click="dialogVisible = true"
                style="margin-left:2%"
              >快捷建组</el-button>
              <el-input
                v-model="searchValue"
                style="width:25%;margin-left:60%"
                @keyup.enter.native="toQuery"
              />
              <el-button
                class="suo"
                icon="el-icon-search"
                show-overflow-tooltip
                @click="toQuery"
                style="margin-left:10px"
              ></el-button>
              <el-table :data="tableData" style="width: 96%; margin: 0 auto;" height="300">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="组名" prop="GroupName"></el-table-column>
                <el-table-column label="备注" prop="Remark"></el-table-column>
                <el-table-column label="已关联策略" prop="Type"></el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="复用现有用户策略" name="second">
              <div class="explain">
                <p>仅复用现有用户的直接关联策略，不复用现有用户因加入用户组而获得的随组关联策略。</p>
              </div>
              <el-input style="width:25%;margin-left:60%;margin-top:10px;" />
              <el-button
                class="suo"
                icon="el-icon-search"
                show-overflow-tooltip
                style="margin-left:10px;margin-top:10px;"
              ></el-button>
              <el-table :data="tableDatas" style="width: 96%; margin: 0 auto;">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="用户"></el-table-column>
                <el-table-column label="备注"></el-table-column>
                <el-table-column label="已关联策略"></el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="从策略表中选区策略关联" name="third">
              <div class="explain">
                <p>仅复用现有用户的直接关联策略，不复用现有用户因加入用户组而获得的随组关联策略。</p>
              </div>
              <el-button class="clButton" type="primary" size="small" style="margin-left:2%">新建自定义策略</el-button>
              <el-input
                v-model="bindVlue"
                style="width:25%;margin-left:60%;margin-top:10px;"
                @keyup.enter.native="bindQuery"
              />
              <el-button
                class="suo"
                icon="el-icon-search"
                show-overflow-tooltip
                style="margin-left:10px;margin-top:10px;"
                @click="bindQuery"
              ></el-button>
              <el-table :data="bindData" style="width: 96%; margin: 0 auto;" height="300">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="策略名" prop="PolicyName"></el-table-column>
                <el-table-column label="描述" prop="Description"></el-table-column>
                <el-table-column label="引用次数" prop="Attachments"></el-table-column>
                <el-table-column label="策略类型" prop="Type">
                  <template slot-scope="scope">{{scope.row.type == '1' ? '自定义策略':'预设策略'}}</template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>

      <el-dialog title="添加组" :visible.sync="dialogVisible" width="30%">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户组名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入用户组名"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="desc" height="100%">
            <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSure">确 定</el-button>
        </span>
      </el-dialog>

      <div v-show="active==2">
        <template>
          <el-table :data="newTableData" style="width: 96%; margin: 0 auto;">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="策略名" ></el-table-column>
              <el-table-column label="描述" ></el-table-column>
          </el-table>
        </template>
      </div>
      <div>
        <el-button
          style="margin-top: 12px;"
          type="primary"
          size="medium"
          @click="prev()"
          v-if="active==1 || active==2"
        >上一步</el-button>
        <el-button
          style="margin-top: 12px;"
          type="primary"
          size="medium"
          @click="next()"
          v-if="active==0 || active==1"
        >下一步</el-button>
        <el-button
          style="margin-top: 12px;"
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
export default {
  data() {
    return {
      newTableData: [],
      bindVlue: [],
      bindData: [],
      tableDatas: [],
      searchValue: [],
      dialogVisible: false,
      input: "",
      inpsd: false,
      checked: false,
      checked1: false,
      checked2: true,
      checked3: true,
      radio: "1",
      radio2: "3",
      radio3: "5",
      active: 1,
      value1: false,
      value: "",
      tableData: [],
      ruleForm: {
        name: "",
        desc: ""
      },
      rules: {
        name: [{ required: true, message: "组名称不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    init() {
      let params = {
        Action: "ListGroups",
        Version: "2019-01-16"
      };
      if (this.searchValue != null && this.searchValue != "") {
        params["Keyword"] = this.searchValue;
      }
      let url = "cam2/ListGroups";
      this.axios.post(url, params).then(data => {
        console.log(data);
        this.tableData = data.Response.GroupInfo;
      });
    },
    toQuery() {
      this.init();
    },
    addSure() {
      let params = {
        Action: "CreateGroup",
        Version: "2019-01-16",
        GroupName: this.ruleForm.name,
        Remark: this.ruleForm.desc
      };
      let url = "cam2/CreateGroup";
      this.axios.post(url, params).then(data => {
        this.init();
      });
      this.dialogVisible = false;
    },
    bindValue() {
      let bindUser = {
        Action: "ListPolicies",
        Version: "2019-01-16"
      };
      if (this.bindVlue != null && this.bindVlue != "") {
        bindUser["Keyword"] = this.bindVlue;
      }
      let bindUrl = "cam2/ListPolicies";
      this.axios.post(bindUrl, bindUser).then(data => {
        this.bindData = data.Response.List;
      });
    },
    bindQuery() {
      this.bindValue();
    },
    prev() {
      --this.active;
      if (this.active < 0) this.active = 0;
    },
    next() {
      if (this.active++ > 3) this.active = 0;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    backoff() {
      this.$router.push({ path: "UserList" });
    }
  },
  created() {
    let params = {
      Action: "ListGroups",
      Version: "2019-01-16"
    };
    let url = "cam2/ListGroups";
    this.axios.post(url, params).then(data => {
      this.tableData = data.Response.GroupInfo;
    });

    let bindUser = {
      Action: "ListPolicies",
      Version: "2019-01-16"
    };
    let bindUrl = "cam2/ListPolicies";
    this.axios.post(bindUrl, bindUser).then(data => {
      this.bindData = data.Response.List;
    });
  }
};
</script>

<style lang="scss" scoped>
.explain {
  width: 96%;
  font-size: 12px;
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
}
.clButton {
  margin-top: 15px;
}
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    padding: 0 20px;
    background: #fff;
    .title-left {
      font-size: 18px;
      font-weight: bolder;
      margin-left: 20px;
    }
  }
  .box-ctr {
    margin: 0 auto;
    width: 96%;
    background-color: #fff;
    padding: 20px;
  }
  .step {
    height: 59px;
    margin: 0px auto 20px;
    padding: 0px 0px 80px;
  }
  .tea-alert {
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
  }
  .tea-alert,
  .tea-alert__info {
    font-size: 12px;
    line-height: inherit;
  }
  .btn {
    margin-top: 10px;
  }
  .btn p {
    display: inline-block;
    font-size: 12px;
    padding-left: 10px;
  }
  .describe p {
    height: 20px;
    font-size: 12px;
    margin: 0;
    color: #888;
  }
  .visit p {
    height: 20px;
    line-height: 6px;
    padding-left: 20px;
    font-size: 12px;
    margin: 0;
    color: #888;
  }
  .blish {
    border-bottom: 1px solid #ddd;
  }
  .hanlin {
    display: inline-block;
  }
  .wid {
    margin-left: 10px;
    width: 170px;
  }
  .wids {
    width: 120px;
    margin-right: 10px;
  }
  .visits p {
    height: 20px;
    line-height: 6px;
    padding-left: 20px;
    font-size: 12px;
    margin: 0;
    color: #888;
    margin: 10px 0 10px 0;
  }
  .el-steps--simple {
    background-color: #fff;
  }
  .el-steps--simple {
    padding: 0 8px;
  }
  .step {
    height: 45px;
    padding: 0;
  }
}
</style>  
