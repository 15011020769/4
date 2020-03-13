<template>
  <div class="relation-example">
    <div class="tab">
      <div class="tab-box">
        <div class="btn">
          <el-row>
            <el-button type="primary" @click="NewRelation()">新建</el-button>
          </el-row>
          <div class="search">
            <el-input
              placeholder="请输入策略名称搜索"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </div>
        <div class="table-box">
          <el-table
            ref="multipleTable"
            :data="VPSData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="策略名称"></el-table-column>
            <el-table-column label="触发条件"></el-table-column>
            <el-table-column label="告警渠道"></el-table-column>
            <el-table-column label="告警启停"></el-table-column>
            <el-table-column label="操作"> </el-table-column>
          </el-table>
          <div class="num">共 0 项</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName1: "first",
      loading: true, // 表格加载动画
      searchSelect: "", // 搜索
      searchInput: "", // 搜索
      VPSData: [], // 云主机
      VPSDataLength: 0,
      CardData: [], // 辅助弹性网卡
      CardDataLength: 0,
      MysqlData: [], // 云数据库Mysql
      MysqlDataLength: 0,
      slbData: [], // 负载均衡
      slbDataLength: 0,
      options: [
        //搜索
        {
          value: "名称",
          lable: "名称"
        },
        {
          value: "ID",
          lable: "ID"
        }
      ],
      SelectLength: [] // 选中的项
    };
  },
  components: {
    // MoveOut,
    // NewLinkages
  },
  props: {
    // Rules: {
    //   type: Object,
    //   default: () => []
    // }
  },
  created() {},
  methods: {
    // 搜索
    search(searchInput, searchSelect) {
      this.searchInput = searchInput;
      this.searchSelect = searchSelect;
      this.loading = true;
      this.VPS();
      this.ElasticCard();
      this.Mysql();
      this.LoadBalancing(); // 负载均衡
    },
    // 新建关联
    NewRelation() {
      this.newLinkagesByVal.newLinkagesState = true;
    },
    // 移出安全组
    MoveOutBtn(row) {
      this.moveOutByVal.moveOutState = true;
      if (this.activeName1 === "first") {
        this.moveOutByVal.moveOutType = 0;
      } else if (this.activeName1 === "second") {
        this.moveOutByVal.moveOutType = 1;
      } else if (this.activeName1 === "third") {
        this.moveOutByVal.moveOutType = 2;
      } else if (this.activeName1 === "fourth") {
        this.moveOutByVal.moveOutType = 3;
      }
      this.moveOutByVal.moveOutList = row;
    },
    handleClick(tab, event) {
      this.loading = true;
      this.VPS(); // 云主机
      this.ElasticCard(); // 辅助弹性网卡
      this.Mysql(); // 云数据库Mysql
      this.LoadBalancing(); // 负载均衡
    },
    handleSelectionChange(val) {
      this.SelectLength = val;
    },
    Update() {
      this.loading = true;
      if (this.activeName1 === "first") {
        this.VPS();
      } else if (this.activeName1 === "second") {
        this.ElasticCard();
      } else if (this.activeName1 === "third") {
        this.Mysql();
      } else if (this.activeName1 === "fourth") {
        this.LoadBalancing();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.relation-example {
  .tab {
    ::v-deep .el-tabs__nav-scroll {
      padding-left: 20px !important;
    }
    .tab-box {
      .btn {
        display: flex;
        justify-content: space-between;
        ::v-deep .el-button {
          padding-top: 0px;
          padding-bottom: 0px;
          border-radius: 0px;
          height: 30px;
          font-size: 12px;
        }
        ::v-deep .el-button--primary {
          border-color: #006eff;
          background: #006eff;
        }
        .search {
          ::v-deep .el-input__inner {
            border-radius: 0px;
            height: 30px;
          }
          ::v-deep .el-input-group__append {
            border-radius: 0px;
            height: 30px;
          }
        }
      }
      .table-box {
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-sizing: border-box;
        border-bottom: 1px solid #ddd;
        background: #fff;
        margin-top: 10px;
        ::v-deep .el-table {
          padding: 20px;
        }
        .num {
          padding: 10px 10px 14px 10px;
          line-height: 27px;
          color: #888;
          margin: 0 20px;
        }
        a {
          color: #006eff;
          font-size: 12px;
          &:hover {
            text-decoration: underline;
          }
        }
        p {
          margin-top: -4px;
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
      .length {
        padding: 10px 10px 14px 10px;
        & > p {
          height: 30px;
          line-height: 30px;
          color: #888;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
