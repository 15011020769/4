<template>
  <div class="wrap">
    <div class="main" style="background:white;">
      <div class="left">
        <p class="title">
          <b style="font-size:13px;">策略列表</b>
          &nbsp;(共{{num}}{{$t('CAM.strip')}})
        </p>
        <div class="left-main border">
          <div class="seek" style="width:100%;">
            <el-input v-model="input" :placeholder="$t('CAM.strategy.inputContent')" clearable @change="_serach" style="width:100%;">
               <i slot="suffix" class="el-input__icon el-icon-search" @click="_serach"></i>
            </el-input>
          </div>
          <el-table
            ref="multipleOption"
            :data="tableData"
            style="width: 100%"
            height="420"
            @selection-change="handleSelectionChange"
            v-loadmore="debounce"
            v-loading="loading"
            :empty-text="$t('CAM.strategy.zwsj')"
          >
            <el-table-column type="selection" width="55" :selectable="checkboxT"></el-table-column>
            <el-table-column prop="PolicyName" label="策略名" width="180">
              <template  slot-scope="scope">
                <el-popover v-if="scope.row.status === 1" trigger="hover" placement="top">
                  <p>当前策略已被关联，如需解除关联请前往详情页操作</p>
                  <div slot="reference" class="name-wrapper">
                    <p>{{scope.row.PolicyName}}</p>
                  </div>
                </el-popover>
                <p v-else>{{scope.row.PolicyName}}</p>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <el-dropdown trigger="click" @command="handleCommand" size="mini">
                  <span style="color:#909399">
                    {{ tableTitle }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in optionPolicies"
                      :key="item.value"
                      :command="item"
                    >{{item.label}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="scope">
                <p>{{type[scope.row.Type]}}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="mid">
        <i class="el-icon-connection"></i>
      </div>
      <div class="right">
        <p class="title">
          <b style="font-size:13px;">{{$t('CAM.userList.choose')}}</b>
          &nbsp;({{multipleSelection.length}}{{$t('CAM.strip')}})
        </p>
        <div class="right-main border">
          <el-table :data="multipleSelection" style="width: 100%" height="450" :empty-text="$t('CAM.strategy.zwsj')">
            <el-table-column prop="PolicyName" label="策略名"></el-table-column>
            <el-table-column prop="Type" :label="$t('CAM.userList.strategyChose')">
              <template slot-scope="scope">
                <p>{{type[scope.row.Type]}}</p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userGroup.colHandle')" width="50">
            &lt;!&ndash;
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, multipleSelection)" type="text" size="small">x
              </el-button>
            </template>&ndash;&gt;
          </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let timer;
import { POLICY_LIST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "transfer",
  data() {
    return {
      commandObj: {},
      loading: true,
      num: 0,
      tableData: [],
      input: "",
      policyNum: 10,
      page: 1,
      type: {
        1: "自定義策略",
        2: "預設策略"
      },
      tableTitle: "策略類型",
      optionPolicies: [
        {
          value: "All",
          label: "全部"
        },
        {
          value: "Local",
          label: "自定義策略"
        },
        {
          value: "QCS",
          label: "預設策略"
        }
      ],
      rolePolicyType: ""
    };
  },
  props: {
    multipleSelection: Array,
    rolePolicies: {
      type: Array,
      default: []
    },
    reload: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    reload(val) {
      this._getList();
    },
    rolePolicies(val) {
      this._getList();
    }
  },
  created() {
    this._getList();
  },
  methods: {
    clear() {
      this._getList();
    },
    checkboxT(row, index) {
      if (row.status == 1) {
        return false;
      } else {
        return true;
      }
    },
    handleCommand(command) {
      this.tableTitle = command.label;
      this.rolePolicyType = command.value;
      this._getList();
    },
    _inpVal() {
      if (this.inpVal == "") {
        this._getList();
      }
    },
    //搜索
    _serach() {
      this.policyNum = 10;
      this._getList();
    },
    handleSelectionChange(val) {
      this.$emit("_multipleSelection", val);
    },
    //策略列表
    _getList() {
      this.loading = true;
      const params = {
        Version: "2019-01-16",
        Rp: 10,
        Page: 1
      };
      if (this.input != "") {
        params["Keyword"] = this.input;
      }
      if (this.rolePolicyType != "") {
        params["Scope"] = this.rolePolicyType;
      }
      this.axios.post(POLICY_LIST, params).then(res => {
        if(res.Response.Error === undefined){
          this.tableData = res.Response.List;
          this.tableData.forEach(item => {
            item.status = 0;
            this.rolePolicies.forEach(val => {
              if (val.PolicyId == item.PolicyId) {
                item.status = 1;
              }
            });
          });
          this.num = res.Response.TotalNum;
        }else{
            let ErrTips = {
               "InternalError.SystemError":'內部錯誤',
               "InvalidParameter.GroupIdError":'GroupId欄位不合法',
               "InvalidParameter.KeywordError":'Keyword欄位不合法',
               "InvalidParameter.ParamError":'非法入參',
               "InvalidParameter.ScopeError":'Scope欄位不合法',
               "InvalidParameter.ServiceTypeError":'ServiceType欄位不合法',
               "InvalidParameter.UinError":'Uin欄位不合法'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
        }
        this.loading = false;
      });
    },
    deleteRow(index, rows) {
      this.$refs.multipleOption.toggleRowSelection(rows[index], false);
      rows.splice(index, 1)
      this.$emit("_multipleSelection", rows);
    },
    listMore() {
      const params = {
        Version: "2019-01-16",
        Rp: 10,
        Page: this.page
      };
      if (this.input != "") {
        params["Keyword"] = this.input;
      }
      if (this.rolePolicyType != "") {
        params["Scope"] = this.rolePolicyType;
      }
      this.axios.post(POLICY_LIST, params).then(res => {
        if(res.Response.Error === undefined){
            res.Response.List.forEach(item => {
              this.tableData.push(item);
            });
            this.tableData.forEach(item => {
              item.status = 0;
              this.rolePolicies.forEach(val => {
                if (val.PolicyId == item.PolicyId) {
                  item.status = 1;
                }
              });
            });
        }else{
           let ErrTips = {
               "InternalError.SystemError":'內部錯誤',
               "InvalidParameter.GroupIdError":'GroupId欄位不合法',
               "InvalidParameter.KeywordError":'Keyword欄位不合法',
               "InvalidParameter.ParamError":'非法入參',
               "InvalidParameter.ScopeError":'Scope欄位不合法',
               "InvalidParameter.ServiceTypeError":'ServiceType欄位不合法',
               "InvalidParameter.UinError":'Uin欄位不合法'
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
    debounce() {
      let that = this;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        that.page++;
        that.listMore();
        timer = undefined;
      }, 1000);
    }
  }
};
</script>

<style scoped lang='scss'>
.wrap >>> .el-dropdown {
  font-size: 12px;
}
::v-deep .el-input__clear {
  position: absolute;
  right: calc(100% + 2px);
}
.wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wrap {
  .title {
    margin-bottom: 5px;
    font-size: 12px;
  }
  .main {
    display: flex;
    overflow: hidden;

    .border {
      border: 1px #f2f2f2 solid;
    }
    .left {
      flex: 1;

      .seek {
        position: relative;

        p {
          position: absolute;
          z-index: 100px;
          top: 0;
          right: 0;
          display: flex;
          align-items: center;
          height: 100%;
          cursor: pointer;

          i {
            margin-right: 10px;
          }
        }
      }
    }
    .right {
      flex: 1;
    }
    .mid {
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 20px;
      }
    }
  }
}
</style>