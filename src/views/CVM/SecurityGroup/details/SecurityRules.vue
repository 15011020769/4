<template>
  <div class="security-rules">
    <div class="tab">
      <el-tabs v-model="activeName">
        <el-tab-pane label="入站规则" name="first">
          <div class="tab-box">
            <div class="btn">
              <div>
                <el-row>
                  <el-button type="primary" @click="addRules()">添加规则</el-button>
                  <el-button disabled v-if="multipleSelection.length===0">删除</el-button>
                  <el-button
                    v-if="multipleSelection.length !==0"
                    @click="Deleles(multipleSelection)"
                  >删除</el-button>
                  <!-- <el-button>一键通放</el-button> -->
                </el-row>
                <a href="javascript:;">
                  教我设置
                  <i class="iconfont">&#xe614;</i>
                </a>
              </div>
              <a href="javascript:;">
                <i class="iconfont">&#xe647;</i>
              </a>
            </div>
            <div class="table">
              <el-table
                ref="multipleTable"
                :data="enterList"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="来源" prop="CidrBlock"></el-table-column>
                <el-table-column prop="name" label="协议端口">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.Protocol === 'tcp'"
                    >{{scope.row.Protocol.toUpperCase()}}:{{scope.row.Port}}</span>
                    <span v-if="scope.row.Protocol === 'icmp'">{{scope.row.Protocol.toUpperCase()}}</span>
                    <span v-if="scope.row.Protocol === 'ALL'">ALL</span>
                  </template>
                </el-table-column>
                <el-table-column label="策略">
                  <template slot-scope="scope">
                    <span class="cl">{{scope.row.Action==="ACCEPT"?"允许":"拒绝"}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="备注">
                  <template
                    slot-scope="scope"
                  >{{scope.row.PolicyDescription === ""?"-":scope.row.PolicyDescription}}</template>
                </el-table-column>
                <el-table-column prop="address" label="操作">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="Editor(scope.row)">编辑</a>
                    <a href="javascript:;" @click="Deleles(scope.row)">删除</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="出站规则" name="second">
          <div class="tab-box">
            <div class="btn">
              <div>
                <el-row>
                  <el-button type="primary" @click="addRules()">添加规则</el-button>
                  <el-button disabled v-if="multipleSelection1.length===0">删除</el-button>
                  <el-button
                    v-if="multipleSelection1.length !==0"
                    @click="Deleles(multipleSelection1)"
                  >删除</el-button>
                  <!-- <el-button>一键通放</el-button> -->
                </el-row>
                <a href="javascript:;">
                  教我设置
                  <i class="iconfont">&#xe614;</i>
                </a>
              </div>
              <a href="javascript:;">
                <i class="iconfont">&#xe647;</i>
              </a>
            </div>
            <div class="table">
              <el-table
                ref="multipleTable1"
                :data="leaveList"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange1"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column label="目标" prop="CidrBlock"></el-table-column>
                <el-table-column prop="name" label="协议端口">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.Protocol === 'tcp'"
                    >{{scope.row.Protocol.toUpperCase()}}:{{scope.row.Port}}</span>
                    <span v-if="scope.row.Protocol === 'icmp'">{{scope.row.Protocol.toUpperCase()}}</span>
                    <span v-if="scope.row.Protocol === ''">ALL</span>
                  </template>
                </el-table-column>
                <el-table-column label="策略">
                  <template slot-scope="scope">
                    <span class="cl">{{scope.row.Action==="ACCEPT"?"允许":"拒绝"}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="备注">
                  <template
                    slot-scope="scope"
                  >{{scope.row.PolicyDescription === ""?"-":scope.row.PolicyDescription}}</template>
                </el-table-column>
                <el-table-column prop="address" label="操作">
                  <template slot-scope="scope">
                    <a href="javascript:;" @click="Editor(scope.row)">编辑</a>
                    <a href="javascript:;" @click="Deleles(scope.row)">删除</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <rules-new
      :rulesNewShow="rulesNewByVal"
      v-if="rulesNewByVal.rulesNewState"
      v-on:close="rulesNewByVal.rulesNewState = false"
      @rulesList="rulesList"
    ></rules-new>
    <rules-delete
      :rulesDeleteShow="rulesDeleteByVal"
      v-if="rulesDeleteByVal.rulesDeleteState"
      v-on:close="rulesDeleteByVal.rulesDeleteState = false"
      @rulesList="rulesList"
    ></rules-delete>
    <rules-editor
      :rulesEditorShow="rulesEditorByVal"
      v-if="rulesEditorByVal.rulesEditorState"
      v-on:close="rulesEditorByVal.rulesEditorState = false"
      @rulesList="rulesList"
    ></rules-editor>
  </div>
</template>
<script>
import RulesNew from "./modal/rules/rulesNew"; // 添加规则
import RulesDelete from "./modal/rules/rulesDelete"; // 删除
import RulesEditor from "./modal/rules/rulesEditor"; // 编辑
export default {
  data() {
    return {
      activeName: "first",
      multipleSelection: [],
      multipleSelection1: [],
      enterList: [], // 入站规则
      leaveList: [], // 出站规则
      rulesNewByVal: {
        rulesNewState: false,
        SecurityGroupId: this.Rules.SecurityGroupId,
        RulesType: ""
      },
      rulesDeleteByVal: {
        // 删除
        rulesDeleteState: false,
        DeleteList: [],
        RulesType: "",
        DeleteRulesId: this.Rules.SecurityGroupId
      },
      rulesEditorByVal: {
        // 编辑
        rulesEditorState: false,
        EditorList: [],
        RulesType: "",
        EditorRulesId: this.Rules.SecurityGroupId
      }
    };
  },
  props: {
    Rules: {
      type: Object,
      default: () => []
    }
  },
  components: {
    RulesNew,
    RulesDelete,
    RulesEditor
  },
  created() {
    this.rulesList();
  },
  methods: {
    rulesList() {
      let parms = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        SecurityGroupId: this.Rules.SecurityGroupId
      };
      this.axios
        .post("vpc2/DescribeSecurityGroupPolicies", parms)
        .then(data => {
          this.enterList = data.Response.SecurityGroupPolicySet.Ingress; // 入站规则
          this.leaveList = data.Response.SecurityGroupPolicySet.Egress; // 出站规则
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 添加规则
    addRules() {
      this.rulesNewByVal.rulesNewState = true;
      if (this.activeName === "first") {
        this.rulesNewByVal.RulesType = 0;
      } else if (this.activeName === "second") {
        this.rulesNewByVal.RulesType = 1;
      }
    },
    // 删除
    Deleles(row) {
      this.rulesDeleteByVal.rulesDeleteState = true;
      if (this.activeName === "first") {
        this.rulesDeleteByVal.RulesType = 0;
      } else if (this.activeName === "second") {
        this.rulesDeleteByVal.RulesType = 1;
      }
      this.rulesDeleteByVal.DeleteList = row;
    },
    // 编辑
    Editor(row) {
      this.rulesEditorByVal.rulesEditorState = true;
      if (this.activeName === "first") {
        this.rulesEditorByVal.RulesType = 0;
      } else if (this.activeName === "second") {
        this.rulesEditorByVal.RulesType = 1;
      }
      this.rulesEditorByVal.EditorList = row;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionChange1(val) {
      this.multipleSelection1 = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.security-rules {
  .tab {
    ::v-deep .el-tabs__nav-scroll {
      padding-left: 20px !important;
    }
    ::v-deep .el-tabs__content {
      padding: 20px;
    }
    .tab-box {
      .btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 30px;
          & > a {
            font-size: 14px;
            font-weight: 700;
            color: #006eff;
            & > i {
              font-size: 12px;
              font-weight: 900;
            }
          }
        }
        & > a {
          & > i {
            font-size: 12px;
            color: #888;
          }
        }
        ::v-deep .el-row {
          margin-right: 30px;
        }
        ::v-deep .el-button {
          border-radius: 0px;
          height: 30px;
          padding-top: 0;
          font-size: 12px;
          padding-bottom: 0;
        }
        ::v-deep .el-button--primary {
          border-color: #006eff;
          background: #006eff;
        }
      }
      .table {
        min-height: 350px;
        border-bottom: 1px solid #ddd;
        margin-bottom: 16px;
        margin-top: 10px;
        .cl {
          color: #0abf5b;
        }
        a {
          margin-right: 10px;
          color: #006eff;
          &:hover {
            text-decoration: underline;
          }
        }
        ::v-deep .el-table th {
          padding: 0px;
          height: 40px;
        }
        ::v-deep .el-table th > .cell {
          font-size: 12px;
          font-weight: 700;
          color: #888;
        }
        ::v-deep .el-table__empty-text {
          font-size: 14px;
          color: #444;
        }
        ::v-deep .el-table td {
          border-color: #e5e5e5;
        }
        ::v-deep .el-table .cell {
          font-size: 12px;
          color: #444;
        }
        ::v-deep .el-table th.is-leaf {
          border-color: #e5e5e5;
        }
      }
    }
  }
}
</style>

