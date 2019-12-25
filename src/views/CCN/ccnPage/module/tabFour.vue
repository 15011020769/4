<!--  -->
<template>
  <div class="tabFour">
    <div class="table">
      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%"
        v-loading="loadShow"
      >
        <template slot="empty">{{$t('CCN.tabs.tab1no')}}</template>
        <el-table-column prop="DestinationCidrBlock" :label="$t('CCN.tabs.tab4tr1')" width></el-table-column>
        <el-table-column prop="Enabled" :label="$t('CCN.tabs.tab4tr2') " width>
          <template slot-scope="scope">
            <div v-if="scope.row.Enabled == true" class="off_color">有效</div>
            <!-- <div v-if="scope.row.Enabled == 0" class="close_color">关闭</div> -->
            <div v-else>{{$t('CCN.total.newClose')}}newClose</div>
          </template>
        </el-table-column>
        <el-table-column prop="InstanceId" :label="$t('CCN.tabs.tab4tr3')" width>
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.InstanceId }}</el-button> -->
            <a href="../CCN/index" target="_blank">{{ scope.row.InstanceId }}</a>
            <p class="edit">{{ scope.row.InstanceName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="InstanceRegion" :label="$t('CCN.tabs.tab4tr4')">
          <template slot-scope="scope">
            <span>{{region[scope.row.InstanceRegion]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="UpdateTime" :label="$t('CCN.tabs.tab4tr5')" width></el-table-column>
        <el-table-column prop="operate" :label="$t('CCN.tabs.tab4tr6')" width>
          <template slot-scope="scope">
            <el-switch
              style="display: block;"
              v-model="scope.row.Enabled"
              active-color="#13ce66"
              inactive-color="#888"
              disabled
              @click.native="switchClick(scope.$index, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="Right-style pagstyle tabListPage">
      <span
        class="pagtotal"
      >{{$t('CCN.total.gongN')}}&nbsp;{{totalItems}}&nbsp;{{$t('CCN.total.tioaN')}}</span>
      <el-pagination
        :page-size="pageSize"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="totalItems"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { CCN_ROUTES, ENABLE_CCNROUTES, DISABLE_CCNROUTES } from "@/constants";
import { timeout } from "q";
import VueCookie from "vue-cookie";
export default {
  data() {
    return {
      ccnId: "",
      visible2: false,
      value1: true,
      tableData: [], // 列表数据
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      currpage: 1, // 当前页码
      loadShow: false,
      region: {
        "ap-taipei": "台灣台北"
      }
    };
  },
  created() {
    this.ccnId = this.$route.query.ccnId;
    this.getData();
  },
  methods: {
    getData: function() {
      this.loadShow = true;
      var params = {
        Version: "2017-03-12",
        Region: localStorage.getItem('regionv2'),
        CcnId: this.ccnId
      };
      // 查询-路由表
      this.axios.post(CCN_ROUTES, params).then(res => {
        this.tableData = res.Response.RouteSet;
        this.totalItems = res.Response.TotalCount;
        this.loadShow = false;
      });
    },
    // 启用路由 询问按钮
    switchClick: function(index, route) {
      let str = route.Enabled ? "关闭" : "启用";
      this.$confirm("是否确认" + str + "路由？", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: async action => {
          if (action == "confirm") {
            this.setRouteEnabled(route);
          }
        }
      });
    },
    // 设置路由状态
    setRouteEnabled(route) {
      var params = {
        Version: "2017-03-12",
        Region: localStorage.getItem('regionv2'),
        CcnId: this.ccnId,
        "RouteIds.0": route.RouteId
      };
      if (!route.Enabled) {
        // true启用
        this.axios.post(ENABLE_CCNROUTES, params).then(res => {
          if (res.Response.Error == undefined) {
            this.$message({
              message: "启用成功",
              type: "success",
              showClose: true,
              duration: 0
            });
          } else {
            this.$message({
              message: res.Response.Error.Message,
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      } else {
        // false 禁用
        this.axios.post(DISABLE_CCNROUTES, params).then(res => {
          if (res.Response.Error == undefined) {
            this.$message({
              message: "禁用成功",
              type: "success",
              showClose: true,
              duration: 0
            });
          } else {
            this.$message({
              message: res.Response.Error.Message,
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      }
      setTimeout(() => {
        this.getData();
      }, 1000);
    },
    // 分页开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
};
</script>
<style lang="scss">
.el-table {
  .cell {
    font-size: 12px;
    .el-button {
      font-size: 12px;
      padding: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
.tabFour {
  .table {
    margin-top: 20px;
    min-height: 450px;
    background: #fff;
    .cell {
      font-size: 12px;
    }
    .close_color {
      color: #e54545;
    }
    .off_color {
      color: #0abf5b;
    }
  }
  .newDialog {
    span {
      color: #444;
    }
    .price {
      color: #ff7800;
      font-size: 24px;
    }
  }
  .dialog-footer {
    text-align: center;
    .el-button {
      height: 30px;
      line-height: 6px;
      border-radius: 0px;
    }
  }
  .tabListPage {
    text-align: right;
    background-color: #fff;
    border-top: 1px solid #ddd;
    padding-top: 8px;
    height: 50px;
  }
}
.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;
  border-top: 1px solid #ddd;
  background-color: #fff;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
</style>
