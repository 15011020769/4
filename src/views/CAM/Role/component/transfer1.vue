<template>
  <div class="Cam">
    <div class="container">
      <div class="container-left">
        <p>策略</p>
        <el-input
          size="mini"
          v-model="strategyValue"
          style="width:100%;margin-top:10px;"
          @keyup.enter.native="tableloadmore"
          clearable
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="tableloadmore"></i>
        </el-input>
        <!-- <el-input size="mini" v-model="strategyValue" style="width:100%" @keyup.enter.native="tableloadmore"/>
        <i size="mini" class="el-icon-search fier" show-overflow-tooltip @click="tableloadmore" ></i>-->
        <el-table
          class="table-left"
          ref="multipleOption"
          :data="policiesData"
          size="small"
          :height="tableHeight"
          tooltip-effect="dark"
          style="width: 100%"
          @row-click="selectedRow"
          @selection-change="handleSelectionChange"
          v-tableloadmore="tableloadmore"
          v-loadmore="debounce"
          :empty-text="$t('CAM.strategy.zwsj')"
        >
          <el-table-column type="selection" prop="policyId" width="29"></el-table-column>
          <el-table-column
            prop="Description"
            :label="$t('CAM.Role.strategyName')"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>{{scope.row.PolicyName}}</p>
              <p>{{scope.row.Description}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="Type" :label="$t('CAM.Role.strategyType')" width="130">
            <template slot="header" slot-scope="scope">
              <el-dropdown trigger="click" @command="handleCommand" size="mini">
                <span style="color:#909399">
                  {{ tableTitle }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in table_options"
                    :key="item.value"
                    :command="item"
                  >{{item.label}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <p v-show="scope.row.Type == 1">{{$t('CAM.Role.customPolicy')}}</p>
              <p v-show="scope.row.Type == 2">{{$t('CAM.Role.defaultPolicy')}}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="direction">
        <div class="direction-icon">
          <i class="iconfont">&#xe603;</i>
        </div>
      </div>
      <div class="container-right">
        <span>{{$t('CAM.Role.selectedStar')}}</span>
        <el-table
          class="table-left"
          ref="multipleSelected"
          :data="policiesSelectedData"
          tooltip-effect="dark"
          size="small"
          :height="tableHeight"
          style="width: 100%"
          :empty-text="$t('CAM.strategy.zwsj')"
        >
          <el-table-column
            prop="Description"
            :label="$t('CAM.Role.policyName')"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>{{scope.row.PolicyName}}</p>
              <p>{{scope.row.Description}}</p>
            </template>
          </el-table-column>

          <el-table-column prop="Type" :label="$t('CAM.Role.strategyType')" width="100">
            <template slot-scope="scope">
              <p v-show="scope.row.Type == 1">{{$t('CAM.Role.customPolicy')}}</p>
              <p v-show="scope.row.Type == 2">{{$t('CAM.Role.defaultPolicy')}}</p>
            </template>
          </el-table-column>
          <el-table-column width="50">
            &lt;!&ndash;
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, policiesSelectedData)"
                type="text"
                size="small"
              >x</el-button>
            </template>&ndash;&gt;
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { POLICY_LIST, ATTACH_ROLE } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  props: {
    roleId: String
  },
  directives: {
    tableloadmore: {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(".el-table__body-wrapper");
        SELECTWRAP_DOM.addEventListener("scroll", function() {
          /*
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          let sign = 80; // 定义默认的向上滚于乡下滚的边界
          const CONDITION =
            this.scrollHeight - this.scrollTop === this.clientHeight &&
            this.scrollTop > sign; // 注意: && this.scrollTop

          if (this.scrollTop > sign) {
            sign = this.scrollTop;
          }
          if (this.scrollTop < sign) {
            sign = this.scrollTop;
          }

          if (!CONDITION) {
            binding.value();
          }
        });
      }
    }
  },
  data() {
    return {
      tableHeight: 300,
      policiesData: [],
      policiesSelectedData: [],
      strategyValue: "",
      totalNum: "",
      search: "",
      table_options: [
        {
          value: "All",
          label: "全部策略"
        },
        {
          value: "QCS",
          label: "預設策略"
        },
        {
          value: "Local",
          label: "自定義策略"
        }
      ],
      rp: 20,
      page: 1,
      tableTitle: "策略類型"
    };
  },

  mounted() {
    var command = "All"; // 默认查询所有策略
    this.tableloadmore(command);
    this.tableHeight =
      window.innerHeight - this.$refs.multipleOption.$el.offsetTop - 50;
  },
  methods: {
    //表格滚动到底部
    debounce(){
      console.log('ok')
    },
    // 获取策略方法
    tableloadmore(command) {
      let params = {
        Version: "2019-01-16"
      };
      if (this.strategyValue != undefined && this.strategyValue != "") {
        params["Keyword"] = this.strategyValue;
      }
      // .value写此处，防止非策略类型切换传递其他值导致查询功能查询异常；这个查询方式使用的地方比较多，其他地方调用会传递与查询无关的参数值。
      if (command.value != undefined && command.value != "") {
        params["Scope"] = command.value;
      }
      this.axios
        .post(POLICY_LIST, params)
        .then(res => {
          if(res.Response.Error == undefined){
              this.policiesData = res.Response.List;
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
        })
        .catch(error => {});
    },
    // 策略类型切换
    handleCommand(command) {
      this.handoverFlag = true;
      this.tableTitle = command.label;
      if (command.value != undefined || command.value != "") {
        this.tableloadmore(command);
      }
    },
    handleSelectionChange(val) {
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      this.policiesSelectedData = val;
    },
    selectedRow(row, column, event) {
      // 设置选中或者取消状态
      this.$refs.multipleOption.toggleRowSelection(row);
    },
    deleteRow(index, rows) {
      // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
      this.$refs.multipleOption.toggleRowSelection(rows[index], false);
    },
    getData() {
      return this.policiesSelectedData;
    },
    attachRolePolicies() {
      let _this = this;
      // 根据获取的角色ID创建角色策略
      if (
        this.roleId != undefined &&
        this.roleId != "" &&
        this.policiesSelectedData != ""
      ) {
        for (let i = 0; i < _this.policiesSelectedData.length; i++) {
          let obj = _this.policiesSelectedData[i];
          let params = {
            Action: "AttachRolePolicy",
            Version: "2019-01-16",
            PolicyId: obj.PolicyId,
            AttachRoleId: _this.roleId
          };
          _this.AttachRolePolicy(params);
        }
      }
    },
    // 绑定权限策略到角色
    AttachRolePolicy(params) {
      this.$axios.post(ATTACH_ROLE, params).then(res => {
        if(res.Response.Error == undefined){
           console.log(res)
        }else{
            let ErrTips = {
             "InternalError.SystemError":'內部錯誤',
             "InvalidParameter.AttachmentFull":'principal欄位的授權對象關聯策略數已達到上限',
             "InvalidParameter.ParamError":'非法入參',
             "InvalidParameter.PolicyIdNotExist":'策略ID不存在',
             "InvalidParameter.RoleNotExist":'角色不存在'
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
    }
  }
};
</script>
<style lang="scss" scoped>
.Cam >>> .el-input__clear {
  position: absolute;
  right: 26px;
}
.Cam {
  .container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
    .direction {
      display: table-cell;
      width: 38px;
      text-align: center;
      vertical-align: middle;
    }
    .direction-icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: middle;
      background-repeat: no-repeat;
      background-position: inherit;
      font-size: 0;
    }
    .el-input--mini .el-input__inner {
      position: relative;
    }
    .fier {
      cursor: pointer;
      font-size: 130%;
      color: #888;
      position: absolute;
      right: 2%;
      top: 8%;
    }
    .container-left {
      display: flex;
      flex-direction: column;
      width: 45%;
      height: 600px;
      justify-content: center;
    }
    .container-right {
      display: flex;
      width: 45%;
      height: 600px;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>