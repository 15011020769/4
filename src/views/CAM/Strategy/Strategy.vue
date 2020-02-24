<template>
  <div class="Cam wrap">
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
            style="width:300px;"
            :placeholder="$t('CAM.Role.searchRole')"
            size="small"
            v-model="searchValue"
            @change="toQuery"
            clearable
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="toQuery"></i>
          </el-input>
        </div>
        <div class="table">
          <el-table
            :data="tableData"
            height="450"
            style="width: 100%"
            :row-style="{height:0}"
            :cell-style="{padding:'5px 10px'}"
            v-loading="loading"
            :empty-text="$t('CAM.strategy.zwsj')"
          >
            <el-table-column width="65">
              <template slot="header" slot-scope="scope">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                  @change="handleCheckAllChange"></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.Type === 2" content="预选策略无法选中删除" placement="top-start">
                  <el-checkbox disabled />
                </el-tooltip>
                <el-checkbox v-model="scope.row.checked" @change="handleCheckOneChange" v-else />
              </template>
            </el-table-column>
            <el-table-column
              prop="PolicyName"
              :label="$t('CAM.userList.strategyNames')"
              width="200"
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
            <el-table-column prop="ServiceType" :label="$t('CAM.strategy.fwlx')" width="150"></el-table-column>
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
              layout="prev, sizes, pager, next"
              :page-sizes="[10, 20, 30, 40, 50]"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :total="TotalCount"
            >1</el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 关联用户/用户组 模态窗 -->
    <el-dialog title :visible.sync="dialogVisible" width="72%" :before-close="beforeClose">
      <h3 style="color:#000;margin-bottom:20px;">{{$t('CAM.strategy.straGroup')}}</h3>
      <div class="dialog_div">
          <!-- v-if="transferFlag" -->
        <transfer
          ref="userTransfer"
          :PolicyId="policyId"
        ></transfer>
          <!-- :userArr="userArr"
          :groupArr="groupArr" -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible=false">取 消</el-button>
        <el-button size="mini" type="primary" @click="attachPolicy">{{$t('CAM.userList.suerAdd')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import transfer from "./component/transfer";
import { POLICY_LIST, DELETE_POLICY, LIST_ENPOLICY } from "@/constants";
export default {
  components: {
    transfer
  },
  data() {
    return {
      isIndeterminate: false,
      checkAll: false,
      options: [
        {
          value: "All",
          label: "全部策略"
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
      policyScope: "All",
      searchValue: "",
      tableData: [], //策略列表数据
      selectedData: [], //选择要删除的
      table_options: [
        {
          value: "選項1",
          label: "全部服務"
        },
        {
          value: "選項2",
          label: "智能物聯網關"
        },
        {
          value: "選項3",
          label: "API網關"
        }
      ],
      table_value: "",
      tableTitle: "服務類型",
      dialogVisible: false,
      policyId: "0", // 策略Id
      transferFlag: false, //模态框强制刷新flag
      pageSize: 10,
      choiceNum: 0,
      total: 0,
      currentPage: 1,
      TotalCount: 0,
      pagesize: 10,
      currpage: 1,
      loading: true,
      // userArr: [],
      // groupArr: [],
      // entitiesForPolicyPage: 1,
      // entitiesForPolicyRp: 200,
      // entitiesForPolicy: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleCheckAllChange (val) {
      console.log(val)
      this.isIndeterminate = false
      this.tableData.forEach(item => {
          item.checked = val
      })
    },
    handleCheckOneChange (val) {
      console.info('check one change is ', val)
      let totalCount = this.tableData.length
      let someStatusCount = 0
      this.tableData.forEach(item => {
          if (item.checked === val) {
              someStatusCount++
          }
      })
      this.checkAll = totalCount === someStatusCount ? val : !val
      this.isIndeterminate = someStatusCount > 0 && someStatusCount < totalCount
    },
    selectable(row) {
      if (row.Type === 2) return false
      return true
    },
    // 初始化策略列表数据（默认全部策略）
    getData() {
      this.isIndeterminate = false,
      this.checkAll = false,
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
        if (res.Response.Error === undefined) {
          res.Response.List.forEach(item => item.checked = false)
          this.tableData = res.Response.List;
          this.TotalCount = res.Response.TotalNum;
        } else {
          let ErrTips = {
            "InternalError.SystemError": "內部錯誤",
            "InvalidParameter.GroupIdError": "GroupId欄位不合法",
            "InvalidParameter.KeywordError": "Keyword欄位不合法",
            "InvalidParameter.ParamError": "非法入參",
            "InvalidParameter.ScopeError": "Scope欄位不合法",
            "InvalidParameter.ServiceTypeError": "ServiceType欄位不合法",
            "InvalidParameter.UinError": "Uin欄位不合法"
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
      console.log(policy)
      this.transferFlag = false;
      this.$nextTick(() => {
      this.policyId = policy.PolicyId;
        this.transferFlag = true;
      });
      // this.getAttachPolicys(policy.PolicyId);
      this.dialogVisible = true;
    },
    beforeClose(done) {
      // this.userArr = [];
      // this.groupArr = [];
      done()
    },
    // // 获取策略关联的实体列表
    // getAttachPolicys(val) {
    //   const params = {
    //     Version: "2019-01-16",
    //     PolicyId: val,
    //     Page: this.entitiesForPolicyPage,
    //     Rp: this.entitiesForPolicyRp,
    //   };
    //   var userArr = [];
    //   var groupArr = [];
    //   this.axios.post(LIST_ENPOLICY, params).then(res => {
    //     if (res.Response.Error === undefined) {
    //       if (res.Response.List) {
    //         this.entitiesForPolicy = this.entitiesForPolicy.concat(res.Response.List)
    //         if (this.entitiesForPolicy.length != res.Response.TotalNum) {
    //           this.entitiesForPolicyPage += 1
    //           this.getAttachPolicys(val)
    //         } else {
    //           this.entitiesForPolicy.forEach(item => {
    //             if (item.RelatedType == 1) {
    //               userArr.push(item);
    //             } else {
    //               groupArr.push(item);
    //             }
    //           })
    //             this.userArr = this.userArr.concat(userArr);
    //             this.groupArr = this.userArr.concat(groupArr);
    //         }
    //       }
    //     } else {
    //       let ErrTips = {
    //         "ResourceNotFound.UserNotExist": "用戶不存在"
    //       };
    //       let ErrOr = Object.assign(ErrorTips, ErrTips);
    //       this.$message({
    //         message: ErrOr[res.Response.Error.Code],
    //         type: "error",
    //         showClose: true,
    //         duration: 0
    //       });
    //     }
    //   });
    // },
    // 穿梭框：value右侧框值、direction操作、movedKeys移动值
    handleChange(value, direction, movedKeys) {
      this.transfer_data_right = value;
    },
    // 关联用户/用户组
    attachPolicy() {
      this.$refs.userTransfer.attachPolicy();
      this.getData();
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
        if (res.Response.Error === undefined) {
          console.log(res);
        } else {
          let ErrTips = {
            "InternalError.SystemError": "內部錯誤",
            "InvalidParameter.ParamError": "非法入參",
            "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法",
            "ResourceNotFound.NotFound": "資源不存在",
            "ResourceNotFound.PolicyIdNotFound": "PolicyId指定的資源不存在"
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
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getData();
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  border-radius: 0;
  height: 30px !important;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px;
}
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
::v-deep .el-input__clear {
  position: absolute;
  right: 20px;
}
</style>
