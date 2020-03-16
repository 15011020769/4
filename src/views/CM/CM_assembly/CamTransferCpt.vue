<template>
<div class="main" style="background:white;">
  <div class="left">
    <div class="left-main border">
      <div class="seek" style="">
        <el-select v-model="projectSelectedOption">
          <el-option
            v-for="item in projectOptions"
            :key="item.projectId"
            :label="item.projectName"
            :value="item.projectId"
          >
          </el-option>
        </el-select>
        <el-select v-model="searchItem" placeholder="请选择">
          <el-option
            v-for="item in searchItemOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          v-model="searchInput"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click=""
          ></el-button>
        </el-input>
      </div>
      <el-table
        :data="tableData"
        height="420"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loadmore="loadMore"
        class="table-left"
      >
        <el-table-column
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column :label="headConfig.title1" width="120">
          <template slot-scope="scope">
            <p>
              <a href="javascript:;">{{ scope.row.InstanceId }}</a>
            </p>
            <p>{{ scope.row.InstanceName }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="headConfig.title2" width="120"
          >VPC 网络</el-table-column
        >
        <el-table-column :label="headConfig.title3" width="120">
          <template slot-scope="scope">
            <p>{{ scope.row.PrivateIpAddresses[0] }}(内网)</p>
            <p class="out">
              {{ scope.row.PublicIpAddresses[0] }}(外网)
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="mid">
    <i class="el-icon-connection"></i>
  </div>
  <div class="right">
    <div class="right-main border">
      <el-table
        :data="multipleSelection"
        style=""
        height="450"
        class="table-left"
      >
        <el-table-column :label="headConfig.title1" width="120">
          <template slot-scope="scope">
            <p>
              <a href="javascript:;">{{ scope.row.InstanceId }}</a>
            </p>
            <p>{{ scope.row.InstanceName }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="headConfig.title2" width="100"
          >VPC 网络</el-table-column
        >
        <el-table-column :label="headConfig.title3" width="170">
          <template slot-scope="scope">
            <div class="resses">
              <div>
                <p>{{ scope.row.PrivateIpAddresses[0] }}(内网)</p>
                <p class="out">
                  {{ scope.row.PublicIpAddresses[0] }}(外网)
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <div class="resses">
              <i
                class="el-icon-error ml5"
                @click="DeleteList(scope.row)"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</div>
</template>
<script>
import {
  TKE_EXIST_NODES,
  ALL_PROJECT,
  CM_GROUPING_NEWLY_BUILD
} from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: 'CamTransferCpt',
  data() {
    return {
      projectSelectedOption: 0, //選擇了一個項目
      projectOptions: [
        {
          projectId: 0,
          projectName: "默认项目"
        }
      ], //項目資源列表
      searchItem: '', //搜索项值
      multipleSelection: [],
      searchItemOptions: [], //搜索项数组
      searchInput: '', //搜索内容
      loadSign: true,
      tableData: [],
      searchItemOptions: [],
      headConfig: {
        title1: '',
        title2: '',
        title3: ''
      }
    }
  },
  props: ['productListData'],
  watch: {
    productListData() {
      console.log(this.productListData)
      this.tableData = this.productListData.Date;
      this.searchItemOptions = this.productListData.SearchConfig;
      this.headConfig = this.productListData.HeadConfig;
    }
  },
  mounted() {
    this.getProjectList();
  },
  methods: {
    /* async getListData() {
      let param = {
        Version: "2017-03-12",
        Region: "ap-taipei",
        Limit: 100
      };
      param["Filters.0.Name"] = "project-id";
      param["Filters.0.Values.0"] = this.projectSelectedOption;
      if (this.searchItem == 1 && this.searchInput != "") {
        param["Filters.1.Name"] = "instance-id";
        param["Filters.1.Values.0"] = this.searchInput;
      } else if (this.searchItem == 2 && this.searchInput != "") {
        param["Filters.1.Name"] = "private-ip-address";
        param["Filters.1.Values.0"] = this.searchInput;
      } else if (this.searchItem == 3 && this.searchInput != "") {
        param["Filters.1.Name"] = "instance-name";
        param["Filters.1.Values.0"] = this.searchInput;
      }
      if (this.searchItem == "") {
        if (this.searchInput != "") {
          if (this.searchInput.slice(0, 4) === "ins-") {
            this.searchItem = "1";
            param["Filters.1.Name"] = "instance-id";
            param["Filters.1.Values.0"] = this.searchInput;
          } else {
            this.searchItem = "3";
            param["Filters.1.Name"] = "instance-name";
            param["Filters.1.Values.0"] = this.searchInput;
          }
        }
      }
      await this.axios.post(TKE_EXIST_NODES, param).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.InstanceSet;
          console.log(this.tableData)
        } else {
          let ErrTips = {
            InternalServerError: "操作内部错误。",
            InvalidFilter: "无效的过滤器。",
            "InvalidFilterValue.LimitExceeded": "Filter参数值数量超过限制。",
            "InvalidHostId.Malformed":
              "无效CDH ID。指定的CDH ID格式错误。例如ID长度错误host-1122。",
            "InvalidInstanceId.Malformed":
              "无效实例ID。指定的实例ID格式错误。例如实例ID长度错误ins-1122。",
            InvalidParameter: "无效参数。参数不合要求或者参数不被支持等。",
            InvalidParameterValue:
              "无效参数值。参数值格式错误或者参数值不被支持等。",
            "InvalidParameterValue.LimitExceeded": "参数值数量超过限制。",
            "InvalidZone.MismatchRegion": "指定的zone不存在。"
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
    }, */
    // 项目
    getProjectList() {
      this.axios.get(ALL_PROJECT).then(res => {
        if (res.codeDesc === "Success") {
          var arr = res.data;
          for (var i in arr) {
            this.projectOptions.push(arr[i]);
          }
        } else {
          let ErrTips = {
            InternalError: "内部错误",
            UnauthorizedOperation: "未授权操作"
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
    loadMore() {
      if (this.loadSign) {
        this.loadSign = false;
        this.pageIndex++;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    DeleteList(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
      for (var i in this.multipleSelection) {
        if (row.InstanceId === this.multipleSelection[i].InstanceId) {
          this.multipleSelection.splice(this.multipleSelection[i], 1);
        }
      }
    }
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const selectWrap = el.querySelector(".el-table__body-wrapper");
        selectWrap.addEventListener("scroll", function() {
          let sign = 100;
          const scrollDistance =
            this.scrollHeight - this.scrollTop - this.clientHeight;
          if (scrollDistance <= sign) {
            binding.value();
          }
        });
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
    display: flex;
    overflow: hidden;

    .border {
      border: 1px #f2f2f2 solid;
    }
    .left {
      // flex: 1;

      .seek {
        display: flex;
        ::v-deep .el-select {
          width: 100px;
          font-size: 12px;
        }
        ::v-deep .el-input-group {
          width: 60%;
        }
        ::v-deep .el-input__inner {
          border-radius: 0;
          height: 30px;
          font-size: 12px;
          padding: 0px 10px;
        }
        ::v-deep .el-input-group__append {
          border-radius: 0;
        }
      }
    }
    .right {
      border: 1px #f2f2f2 solid;
      border-bottom: 0px;
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
</style>