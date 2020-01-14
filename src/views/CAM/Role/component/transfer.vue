<template>
  <div class="wrap">
    <div class="main" style="background:white;">
      <div class="left">
        <p class="title">
          <b style="font-size:13px;">策略列表</b>
          &nbsp;(共{{num}}条)
        </p>
        <div class="left-main border">
          <div class="seek" style="width:100%;">
            <el-input v-model="input" placeholder="请输入内容" @change="_inpVal" style="width:100%;"></el-input>
            <p>
              <i class="el-icon-search" @click="_serach"></i>
            </p>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%"
            height="420"
            @selection-change="handleSelectionChange"
            v-loadmore="debounce"
            v-loading="loading"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="PolicyName" label="策略名" width="180"></el-table-column>
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
          <b style="font-size:13px;">已选择</b>
          &nbsp;({{multipleSelection.length}}条)
        </p>
        <div class="right-main border">
          <el-table :data="multipleSelection" style="width: 100%" height="450">
            <el-table-column prop="PolicyName" label="策略名"></el-table-column>
            <el-table-column prop="Type" label="策略类型">
              <template slot-scope="scope">
                <p>{{type[scope.row.Type]}}</p>
              </template>
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
      loading: true,
      num: 0,
      tableData: [],
      input: "",
      policyNum: 10,
      page: 1,
      type: {
        1: "自定义策略",
        2: "预设策略"
      },
      tableTitle: "策略类型",
      optionPolicies: [
        {
          value: "All",
          label: "全部"
        },
        {
          value: "Local",
          label: "自定义策略"
        },
        {
          value: "QCS",
          label: "预设策略"
        }
      ],
      rolePolicyType: ""
    };
  },
  props: {
    multipleSelection: Array
  },
  created() {
    this._getList();
  },
  methods: {
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
        if(res.Response.Error == undefined){
          this.tableData = res.Response.List;
          this.num = res.Response.TotalNum;
        }else{
           let ErrTips = {
              "InternalError.SystemError":'内部错误',
              "InvalidParameter.GroupIdError":'GroupId字段不合法',
              "InvalidParameter.KeywordError":'Keyword字段不合法',
              "InvalidParameter.ParamError":'非法入参',
              "InvalidParameter.ScopeError":'Scope字段不合法',
              "InvalidParameter.ServiceTypeError":'ServiceType字段不合法',
              "InvalidParameter.UinError":'Uin字段不合法'
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
        if(res.Response.Error == undefined){
          res.Response.List.forEach(item => {
            this.tableData.push(item);
          });
        }else{
           let ErrTips = {
              "InternalError.SystemError":'内部错误',
              "InvalidParameter.GroupIdError":'GroupId字段不合法',
              "InvalidParameter.KeywordError":'Keyword字段不合法',
              "InvalidParameter.ParamError":'非法入参',
              "InvalidParameter.ScopeError":'Scope字段不合法',
              "InvalidParameter.ServiceTypeError":'ServiceType字段不合法',
              "InvalidParameter.UinError":'Uin字段不合法'
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