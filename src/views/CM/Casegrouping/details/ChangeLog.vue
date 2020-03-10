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
            <el-table-column label="变更时间"></el-table-column>
            <el-table-column label="修改人"></el-table-column>
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
      <el-dialog
        title="变更后详情"
        :visible.sync="visible"
        :before-close="handleClose"
      >
        <ul>
          <li>
            <span>实例组名</span>
            <span></span>
          </li>
          <li>
            <span>实例数</span>
            <span></span>
          </li>
          <li>
            <span>修改人</span>
            <span></span>
          </li>
          <li>
            <span>修改时间</span>
            <span></span>
          </li>
          <li class="include-examples">
            <span>包含实例</span>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="ID/主机名" width="180">
              </el-table-column>
              <el-table-column prop="name" label="网络类型" width="180">
              </el-table-column>
              <el-table-column prop="address" label="IP地址"></el-table-column>
              <el-table-column prop="address" label="地域"
                >中国台北</el-table-column
              >
            </el-table>
          </li>
        </ul>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      enterList: [{ a: "" }], // 入站规则
      //分页
      total: 0, //总条数
      pageSize: 10, // 分页条数
      pageIndex: 0, // 当前页码
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
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
    LookDeatils(row) {
      this.visible = true;
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
