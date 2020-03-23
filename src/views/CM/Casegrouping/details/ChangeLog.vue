<template>
  <div class="security-rules">
    <div class="tab">
      <div class="tab-box">
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="enterList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="变更时间">
              <template slot-scope="scope">
                <p>{{ scope.row.CreateTime | formatDate }}</p>
              </template>
            </el-table-column>
            <el-table-column label="修改人">
              <template slot-scope="scope">
                {{ scope.row.LastEditUin }}
              </template>
            </el-table-column>
            <el-table-column label="最后修改">
              <template slot-scope="scope">
                <a href="javascript:;" @click="LookDeatils(scope.row)"
                  >查看变更后详情</a
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="tke-page">
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看变更后详情 -->
    <div class="look-details">
      <el-dialog title="变更后详情" :visible.sync="visible">
        <ul>
          <li>
            <span>实例组名</span>
            <span>{{ details.groupName }}</span>
          </li>
          <li>
            <span>实例数</span>
            <span>{{ details.instanceSum }}个</span>
          </li>
          <li>
            <span>修改人</span>
            <span>{{ details.lastEditUin }}</span>
          </li>
          <li>
            <span>修改时间</span>
            <span>{{ details.createTime | formatDate }}</span>
          </li>
          <li class="include-examples">
            <span>包含实例</span>
            <el-table
              :data="tableData"
              style="width: 100%"
              v-loading="loadShow"
            >
              <el-table-column label="ID/主机名" width="180">
                <template slot-scope="scope">
                  <p>
                    {{ scope.row.InstanceId }}
                    <!-- <a href="javascript:;">{{ scope.row.InstanceId }}</a> -->
                  </p>
                  <p>{{ scope.row.InstanceName }}</p>
                </template>
              </el-table-column>
              <el-table-column label="网络类型" width="180">
                VPC 网络
              </el-table-column>
              <el-table-column label="IP地址">
                <template slot-scope="scope">
                  <p>
                    <span
                      v-for="(item, index) in scope.row.PrivateIpAddresses"
                      :key="index"
                    >
                      {{ item }}(内网)
                    </span>
                  </p>
                  <p>
                    <span
                      v-for="(item, index) in scope.row.PublicIpAddresses"
                      :key="index"
                    >
                      {{ item }}(外网)
                    </span>
                  </p>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="地域"
                >台湾台北</el-table-column
              >
            </el-table>
          </li>
        </ul>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import {
  CM_GROUPING_CHANGELOG_LIST,
  CM_GROUPING_MANAGELIST
} from "@/constants";
export default {
  data() {
    return {
      visible: false,
      enterList: [], // 入站规则
      //分页
      total: 0, //总条数
      pageSize: 10, // 分页条数
      pageIndex: 0, // 当前页码
      tableData: [],
      details: "",
      loadShow: true
    };
  },
  props: {
    Rules: {
      type: Object,
      default: () => []
    }
  },
  components: {},
  created() {
    this.ListInit();
  },
  methods: {
    ListInit() {
      let params = {
        Version: "2018-07-24",
        Module: "monitor",
        ModuleId: 2,
        DId: this.Rules.instanceGroupId,
        Limit: this.pageSize,
        Offset: this.pageIndex
      };
      this.axios
        .post(CM_GROUPING_CHANGELOG_LIST, params)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.enterList = res.Response.List;
            this.total = res.Response.Total;
          } else {
            let ErrTips = {};
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
    LookDeatils(row) {
      this.visible = true;
      this.loadShow = true;
      this.details = JSON.parse(row.LogData).instanceGroupInfo;
      // console.log(this.details);
      var list = JSON.parse(row.LogData).list;
      let param = {
        Version: "2017-03-12",
        Limit: 100
      };
      for (let i in list) {
        param["InstanceIds." + i] = list[i].dimensions.unInstanceId;
      }
      this.axios.post(CM_GROUPING_MANAGELIST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.InstanceSet;
          this.loadShow = false;
        } else {
          let ErrTips = {
            FailedOperation: "操作失败",
            InternalError: "内部错误",
            "InternalError.Param": "Param。",
            "InternalError.PublicClusterOpNotSupport": "集群不支持当前操作。",
            InvalidParameter: "参数错误",
            ResourceNotFound: "资源不存在",
            ResourceUnavailable: "资源不可用"
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
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.ListInit();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.ListInit();
    },
    handleSelectionChange(val) {},
    handleClose() {}
  },
  filters: {
    formatDate(value) {
      let date = new Date(value * 1000);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
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
      .table {
        border-bottom: 1px solid #ddd;
        margin-bottom: 16px;
        margin-top: 10px;
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-sizing: border-box;
        ::v-deep .el-table {
          padding: 20px;
        }
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
.tke-page {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
  background: #fff;
}
.table-title {
  font-weight: 700;
  margin-bottom: 14px;
  display: inline-block;
  font-size: 14px;
  line-height: 26px;
}
.look-details {
  ::v-deep .el-dialog__body {
    padding-top: 0px;
  }
  ul {
    margin-top: 20px;
    li {
      padding-bottom: 16px;
      line-height: 25px;
      font-size: 12px;
      span {
        &:nth-of-type(1) {
          display: inline-block;
          width: 68px;
          color: #888;
        }
        &:nth-of-type(2) {
          color: #444;
        }
      }
    }
    .include-examples {
      display: flex;
      span {
        margin-top: 20px;
      }
      ::v-deep .el-table {
        border: 1px solid #ebeef5;
        border-bottom: 0px;
      }
    }
  }
}
</style>
