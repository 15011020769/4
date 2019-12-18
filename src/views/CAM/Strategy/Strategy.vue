<template>
  <div class="Cam">
    <div class="top">
      <div class="top-left">
        <span class="top-text">{{$t('CAM.Role.strategy')}}</span>
        <el-select
          size="mini"
          v-model="policyScope"
          :placeholder="$t('CAM.Role.allRol')"
          @change="changePolicyScope"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            size="mini"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="strage-wrap">
      <div class="contant">
        <p class="contant_top">{{$t('CAM.Role.rolTitle')}}</p>
        <div class="table_opare">
          <div>
            <!-- <el-button plain size="small" @click="handleDelete()">{{$t('CAM.userList.userDel')}}</el-button> -->
          </div>

          <el-input
            style="width:30%"
            :placeholder="$t('CAM.Role.searchRole')"
            size="small"
            v-model="searchValue"
            @change="toQuery"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="toQuery"></i>
          </el-input>
        </div>
        <div class="table">
          <el-table
            :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
            height="450"
            style="width: 100%"
            :row-style="{height:0}"
            :cell-style="{padding:'5px 10px'}"
            @selection-change="handleSelectionChange"
            v-loading="loading"
          >
            <el-table-column type="selection" width="60" v-if="this.policyScope!='QCS'"></el-table-column>
            <el-table-column
              prop="PolicyName"
              :label="$t('CAM.userList.strategyNames')"
              width="150"
            >
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                >{{scope.row.PolicyName}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="Description" label="描述"></el-table-column>
            <el-table-column prop="ServiceType" label="服务类型" width="150"></el-table-column>
            <el-table-column prop="operate" label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick_user(scope.row)"
                  type="text"
                  size="small"
                >{{$t('CAM.strategy.straGroup')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="Right-style pagstyle" style="height:70px;display:flex;align-items:center;">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CAM.strip")}}</span>
            <el-pagination
              :page-size="pagesize"
              :pager-count="7"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :total="TotalCount"
            >1</el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 关联用户/用户组 模态窗 -->
    <el-dialog title :visible.sync="dialogVisible" width="72%">
      <h3 style="color:#000;margin-bottom:20px;">{{$t('CAM.strategy.straGroup')}}</h3>
      <div class="dialog_div">
        <transfer v-if="transferFlag" ref="userTransfer" :PolicyId="policyId"></transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="attachPolicy">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import transfer from "./component/transfer";
import { POLICY_LIST, DELETE_POLICY } from "@/constants";
export default {
  components: {
    transfer
  },
  data() {
    return {
      options: [
        {
          value: "All",
          label: "全部策略"
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
      policyScope: "All",
      searchValue: "",
      tableData: [], //策略列表数据
      selectedData: [], //选择要删除的
      table_options: [
        {
          value: "选项1",
          label: "全部服务"
        },
        {
          value: "选项2",
          label: "智能物联网关"
        },
        {
          value: "选项3",
          label: "API网关"
        }
      ],
      table_value: "",
      tableTitle: "服务类型",
      dialogVisible: false,
      policyId: "", // 策略Id
      transferFlag: false, //模态框强制刷新flag
      pageSize: 10,
      choiceNum: 0,
      total: 0,
      currentPage: 1,
      TotalCount: 0,
      pagesize: 10,
      currpage: 1,
      loading: true
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 初始化策略列表数据（默认全部策略）
    getData() {
      this.loading = true;
      var params = {
        Version: "2019-01-16",
        Rp: this.pageSize,
        Page: this.currentPage,
        Scope: this.policyScope
        // Keyword: ''
      };
      if (this.searchValue != "") {
        params["Keyword"] = this.searchValue;
      }
      this.axios.post(POLICY_LIST, params).then(res => {
        console.log(res)
        this.tableData = res.Response.List;
        this.TotalCount = res.Response.TotalNum;
        this.loading = false;
      });
    },
    changePolicyScope() {
      this.getData();
    },
    // 跳转到详情页面
    handleClick(policy) {
      this.$router.push({
        path: "/StrategyDetail",
        query: {
          policy: policy.PolicyId
        }
      });
    },
    // 关联用户/用户组（展现模态框）
    handleClick_user(policy) {
      this.policyId = policy.PolicyId;
      this.transferFlag = false;
      this.$nextTick(() => {
        this.transferFlag = true;
      });
      this.dialogVisible = true;
    },
    // 穿梭框：value右侧框值、direction操作、movedKeys移动值
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
      this.transfer_data_right = value;
    },
    // 关联用户/用户组
    attachPolicy() {
      this.$refs.userTransfer.attachPolicy();
      this.dialogVisible = false;
    },
    // table标题栏选择项
    handleCommand(command) {
      this.tableTitle = command;
    },
    // 选择策略
    handleSelectionChange(data) {
      this.selectedData = data;
      this.choiceNum = data.length;
    },
    // 批量删除策略
    handleDelete() {
      let val = this.selectedData;
      let params = {
        Version: "2019-01-16"
      };
      if (val) {
        val.forEach(function(item, index) {
          let str = "PolicyId." + index;
          params[str] = item.PolicyId;
        });
      }
      this.axios.post(DELETE_POLICY, params).then(res => {
        console.log(res);
      });
      this.selectedData.splice(0, this.selectedData.length);
      this.getData();
    },
    toQuery() {
      this.currentPage = 1;
      this.getData();
    },
    // page操作
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    }
  }
};
</script>
<style lang="scss" scoped>
.Right-style {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  background: white;
}
.pagstyle {
  padding: 5px;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.Cam {
  height: 100%;
  .top {
    color: #000;
    height: 50px;
    line-height: 50px;
    margin-bottom: 20px;
    padding: 0 20px;
    background: #fff;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .top-left {
      font-size: 16px;
      font-weight: 700;
      .top-text {
        margin-right: 15px;
      }
    }
    .top-right {
      line-height: 30px;
      cursor: pointer;
      .right-text {
        margin-right: 10px;
      }
    }
  }
  .strage-wrap {
    .contant {
      max-width: 96%;
      margin: 0 auto;
      .contant_top {
        font-size: 12px;
        line-height: inherit;
        padding: 10px 30px 10px 20px;
        vertical-align: middle;
        color: #003b80;
        border: 1px solid #97c7ff;
        border-radius: 2px;
        background: #e5f0ff;
        position: relative;
        box-sizing: border-box;
        max-width: 100%;
        margin-bottom: 20px;
      }
      .table_opare {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .dialog_div {
        text-align: center;
      }
    }
  }
  .el-input__inner {
    width: 200px;
  }
  .el-input__icon {
    cursor: pointer;
  }
}
</style>
