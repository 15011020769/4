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
      <span class="title-left">添加用户组</span>
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
          <el-step title="设置用户组"></el-step>
          <el-step title="审阅用户组"></el-step>
        </el-steps>
      </div>
      <div v-show="active==1">
        <template>
          <div class="container">
            <div class="container-left">
              <span style="padding-left:5px">策略列表（共条）</span>
              <div>
                <el-input
                  v-model="searchTame"
                  placeholder="搜索"
                  clearable
                  style="width:90%;margin-top:10px"
                  @keyup.enter.native="searchTeam"
                />
                <el-button
                  class="suo"
                  icon="el-icon-search"
                  show-overflow-tooltip
                  @click="searchTeam"
                ></el-button>
              </div>

              <el-table
                class="table-left"
                ref="multipleOption"
                :data="policiesDatas"
                height="300"
                tooltip-effect="dark"
                style="width: 100%; border:1px solid #ddd;margin-top:20px;"
                @row-click="selectedRow"
                @selection-change="handleSelectionChange"
              >
                <el-input size="mini" style="width:40%" />
                <el-button size="mini" class="suo" icon="el-icon-search" show-overflow-tooltip></el-button>
                <el-table-column type="selection" prop="policyId" width></el-table-column>
                <el-table-column prop="GroupName" label="用户名" width></el-table-column>
              </el-table>
            </div>

            <div class="abs">
              <div>&nbsp;</div>
            </div>

            <div class="container-left">
              <span>已选择（共条）</span>
              <el-table
                class="table-left"
                ref="multipleSelected"
                :data="policiesSelectedData"
                tooltip-effect="dark"
                height="300"
                style="width: 100%;border:1px solid #ddd;margin-top:20px;"
              >
                <el-table-column type="selection" prop="policyId" width="55"></el-table-column>
                <el-table-column label="用户组" width="120" prop="GroupName"></el-table-column>
                <el-table-column label="操作" show-overflow-tooltip>
                  &lt;!&ndash;
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index, policiesSelectedData)"
                      type="text"
                      size="small"
                    >移除</el-button>
                  </template>&ndash;&gt;
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>
      </div>

      <div v-show="active==2">
        <template>
            <el-table :data="newTableDatas" style="width: 96%; margin: 0 auto;">
              <el-table-column label="组名称" ></el-table-column>
              <el-table-column label="操作" ></el-table-column>
          </el-table>
        </template>
      </div>

      <div>
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
export default {
  props: {
    policiesSelectedData: [
      {
        policyId: String,
        policyName: String,
        description: String,
        attachments: String,
        createMode: String,
        serviceType: String,
        addTime: String,
        type: String
      }
    ]
  },
  data() {
    return {
      newTableDatas:[],
      searchTame:[],
      policiesDatas:[],
      dialogVisible: true,
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
    searchUserTame(){
         let More = {
            Action:'ListGroups',
            Version:'2019-01-16',
          }
          if (this.searchTame != null && this.searchTame != "") {
            More["Keyword"] = this.searchTame;
          }
          let moreUrl = 'cam2/ListGroups'
          this.axios.post(moreUrl,More).then((data)=>{
            this.policiesDatas = data.Response.GroupInfo
          }).catch(error=>{
            console.log(error)
          })
    },
    searchTeam(){
       this.searchUserTame()
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
    },
    selectedRow(row, column, event) {
      // 设置选中或者取消状态
      this.$refs.multipleOption.toggleRowSelection(row);
    },
      handleSelectionChange(val) {
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      this.policiesSelectedData = val;
    },
     deleteRow(index, rows) {
      // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
      this.$refs.multipleOption.toggleRowSelection(rows[index], false);
    },
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

    let More = {
      Action:'ListGroups',
      Version:'2019-01-16',
    }
    let moreUrl = 'cam2/ListGroups'
    this.axios.post(moreUrl,More).then((data)=>{
      this.policiesDatas = data.Response.GroupInfo
    }).catch(error=>{
      console.log(error)
    })
  }
};
</script>

<style lang="scss" scoped>
  .container {
    width: 96%;
    height: 270px;
    min-height: 360px;
    margin: 10px auto 0;
    background: #fff;
    padding: 20px;
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
    .abs {
      display: inline-block;
      width: 100px;
      height: 300px;
      text-align: center;
    }
    .container-left {
      position: relative;
      width: 44%;
      display: inline-block;
    }
    .ifier {
      position: absolute;
      font-size: 130%;
      right: 2%;
      top: 8%;
    }
  }
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
