<template>
  <div class="Cam">
    <div class="container">
      <div class="container-left">
        <p style="margin-bottom:20px">{{$t('CAM.userList.choosepolicy')}}（共{{totalNum}}{{$t('CAM.strip')}}）</p>
        <!-- <el-input size="mini" custom-class="dialogStyle" v-model="search" style="width:100%"
          @keyup.enter.native="toQuery" />
        <i class="el-icon-search ifier" @click="toQuery"></i>-->
        <el-input
          clearable
          size="mini"
          custom-class="dialogStyle"
          v-model="search"
          style="width:100%"
          @keyup.enter.native="toQuery"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="toQuery"></i>
        </el-input>
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
          :empty-text="$t('CAM.strategy.zwsj')"
          v-infinite-scroll="load"
        >
          <el-table-column type="selection" prop="PolicyId" width="29"></el-table-column>
          <el-table-column
            prop="PolicyName"
            :label="$t('CAM.userList.strategyNames')"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>{{scope.row.PolicyName}}</p>
              <p>{{scope.row.Description}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="Type" :label="$t('CAM.userList.clType')" width="100">
            <template slot-scope="scope">
              <p v-show="scope.row.Type == 1">{{$t('CAM.userList.strategySelf')}}</p>
              <p v-show="scope.row.Type == 2">{{$t('CAM.userList.ysStrategy')}}</p>
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
        <span style="margin-bottom:20px">{{$t('CAM.userList.choose')}}</span>
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
            prop="PolicyName"
            :label="$t('CAM.userList.strategyNames')"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>{{scope.row.PolicyName}}</p>
              <p>{{scope.row.Description}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="Type" :label="$t('CAM.userList.clType')" width="100">
            <template slot-scope="scope">
              <p v-show="scope.row.Type == 1">{{$t('CAM.userList.strategySelf')}}</p>
              <p v-show="scope.row.Type == 2">{{$t('CAM.userList.ysStrategy')}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('CAM.userGroup.colHandle')" width="50">
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
import { ErrorTips } from "@/components/ErrorTips";
import { POLICY_LIST } from "@/constants";
export default {
  props: {
    // policiesSelectedData: () => []
    // policiesSelectedData: Array
  },
  data() {
    return {
      tableHeight: 300,
      policiesData: [],
      policiesSelectedData: [],
      totalNum: "",
      search: "",
      rp: 20,
      page: 1
    };
  },
  mounted() {
    // this.init();
    this.tableHeight =
      window.innerHeight - this.$refs.multipleOption.$el.offsetTop - 50;
  },
  methods: {
    load() {
      if (this.totalNum && this.page * this.rp > this.totalNum) return
      let params = {
        Version: "2019-01-16",
        // ,
        Rp: this.rp,
        Page: this.page,
        // scope:'All'
      };
      if (this.search != null && this.search != "") {
        params["Keyword"] = this.search;
      }
      this.axios
        .post(POLICY_LIST, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.totalNum = res.Response.TotalNum;
            this.policiesData = this.policiesData.concat(res.Response.List);
            this.page += 1
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
        })
        .catch(error => {
          console.log(error);
        });
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
    toQuery() {
      this.init();
    },
    getDaata() {
      return this.policiesSelectedData;
    }
  }
};
</script>
<style lang="scss" scoped>
.Cam >>> .el-input__clear {
  position: absolute;
  right: calc(100% + 2px);
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

    .ifier {
      position: absolute;
      font-size: 130%;
      right: 2%;
      top: 6%;
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

    .container-left {
      display: flex;
      flex-direction: column;
      width: 45%;
      height: 600px;
      justify-content: center;
      padding: 15px;
      box-sizing: border-box;
    }
    .container-right {
      display: flex;
      width: 45%;
      height: 600px;
      flex-direction: column;
      justify-content: center;
      padding: 15px;
      box-sizing: border-box;
    }
  }
}
</style>
