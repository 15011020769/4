<template>
  <div>
    <div class="title_top">
      <h1>{{ $t('CLA.total.gzj') }}</h1>
    </div>
    <div class="tea-content__body">
      <div class="explain">
        <p>
          <span>{{ $t('CLA.total.ts1') }}</span>
        </p>
        <p>
          <span>{{ $t('CLA.total.ts2') }}</span>
        </p>
        <p>
          <span>{{ $t('CLA.total.ts3') }}</span>
        </p>
      </div>
      <div class="btn">
        <el-button :plain="true" v-if="!isDisabled" @click="Create()">{{ $t('CLA.total.cj') }}</el-button>
        <div class="over" v-if="isDisabled">
          <el-button class="btn-dis" disabled>{{ $t('CLA.total.cj') }}</el-button>
          <p>{{ $t('CLA.total.zccj') }}</p>
        </div>
      </div>
      <div class="tables">
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <template slot="empty">{{ $t('CLA.total.zwgzj') }}</template>
          <el-table-column prop="name" :label="$t('CLA.total.mc')">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text">{{scope.row.AuditName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="isMultiRegionAudit" :label="$t('CLA.total.qbqy')">
            <template slot-scope="scope">
              <div>{{ $t('CLA.total.s') }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="CosBucketName" :label="$t('CLA.total.coscct')"></el-table-column>
          <el-table-column prop="LogFilePrefix" :label="$t('CLA.total.rzwjqz')"></el-table-column>
          <el-table-column prop="AuditStatus" :label="$t('CLA.total.zt')">
            <template slot-scope="scope">
              <div v-if="scope.row.AuditStatus == 0" class="close_color">{{ $t('CLA.total.gb') }}</div>
              <div v-if="scope.row.AuditStatus == 1" class="off_color">{{ $t('CLA.total.kq') }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips";
import { GZJ_LIST, GZJ_NUM } from "@/constants";
export default {
  data() {
    return {
      value1: "",
      input3: "",
      isDisabled: true, // 创建按钮
      visible: false,
      tableData: [], // 列表数据
      loading: true
    };
  },
  created() {
    this.getData();
    this.listNum();
  },
  methods: {
    //查询用户可创建跟踪集数量
    listNum() {
      const params = {
        Version: "2019-03-19",
        Region: "ap-guangzhou"
      };
      this.axios.post(GZJ_NUM, params).then(res => {
        if (res.Response.Error === undefined) {
          if (res.Response.AuditAmount < 1) {
            this.isDisabled = true;
          } else {
            this.isDisabled = false;
          }
        } else {
          let ErrTips = {
            "InternalError.InquireAuditCreditError":
              "查询可创建跟踪集的数量错误，请联系开发人员"
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
    //获取列表数据
    getData() {
      let params = {
        Version: "2019-03-19",
        Region: "ap-guangzhou"
      };
      this.axios.post(GZJ_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.AuditSummarys;
          this.loading = false;
        } else {
          let ErrTips = {
            "InternalError.ListAuditsError":
              "查询跟踪集概要内部错误，请联系开发人员"
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
    // 创建
    Create() {
      this.$router.push({
        path: "/NewAudit"
      });
    },
    // 详情页跳转
    handleClick(rows) {
      this.$router.push({
        path: "/DetailAudit",
        query: {
          AuditName: rows.AuditName
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.title_top {
  height: 50px;
  background: #fff;

  h1 {
    padding-left: 20px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 700;
  }
}

.tea-content__body {
  padding: 20px;

  .explain {
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;

    p {
      line-height: 20px;
    }
  }
}

.btn {
  .over {
    position: relative;
    width: 66px;
    height: 30px;
    overflow: hidden;

    & > p {
      width: 144px;
      position: absolute;
      left: 30px;
      color: #fff;
      background: rgb(29, 29, 29);
      padding: 5px 10px;
      border-radius: 5px;
      z-index: 100;
      font-size: 12px;
    }
  }

  :hover {
    overflow: visible;
  }

  .el-button {
    height: 30px;
    background-color: #006eff;
    color: #fff;
    border: 1px solid #006eff;
    line-height: 0px;
    border-radius: 0px;
    font-size: 12px !important;
  }

  .el-button.is-plain:hover {
    background-color: #0063e5;
    color: #fff;
    border: 1px solid #0063e5;
  }

  .btn-dis {
    border-color: #ddd;
    background-color: #fff;
    color: #bbb;
    cursor: not-allowed;
  }
}

.tables {
  margin-top: 10px;

  .el-table {
    font-size: 12px;
  }

  .el-table th > .cell {
    font-size: 12px;
  }

  .el-table .cell {
    height: 23px;
  }

  .el-button--text {
    height: 23px;
    line-height: 0px;
    font-size: 12px;
  }

  .el-table td:nth-of-type(2) {
    color: #006eff;
  }

  .close_color {
    color: #e54545;
  }

  .off_color {
    color: #0abf5b;
  }
}
</style>
