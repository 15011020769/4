<template>
  <div class="subscription-wrap">
    <Header title="平臺事件訂閱" />
    <div class="table">
      <p class="boxLi">
        <i class="el-icon-arrow-down"></i>
        <span>问题：</span>
      </p>
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column label="事件类型" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 0px;flex-wrap:nowrap">{{ scope.row.type }}</span>
            <i class="el-icon-info" style="margin:0 5px;"></i>
          </template>
        </el-table-column>
        <el-table-column label="短信" width="180">
          <template slot-scope="scope">
            <i
              v-if="scope.row.type==0?false:true"
              class="el-icon-circle-check"
              style="color:#0abf5b"
            ></i>
            <i v-else class="el-icon-circle-close" style="color:#e1504a"></i>
          </template>
        </el-table-column>
        <el-table-column label="邮件" width="180">
          <template slot-scope="scope">
            <i
              v-if="scope.row.email==0?false:true"
              class="el-icon-circle-check"
              style="color:#0abf5b"
            ></i>
            <i v-else class="el-icon-circle-close" style="color:#e1504a"></i>
          </template>
        </el-table-column>
        <el-table-column label="站内信" width="180">
          <template slot-scope="scope">
            <i
              v-if="scope.row.zhanneixin==0?false:true"
              class="el-icon-circle-check"
              style="color:#0abf5b"
            ></i>
            <i v-else class="el-icon-circle-close" style="color:#e1504a"></i>
          </template>
        </el-table-column>
        <el-table-column prop="receive" label="接收人"></el-table-column>
        <!-- <el-table-column prop="receive" label="接收人">
          <template slot-scope="scope">
             开发商，共{{receive}}人
          </template>
        </el-table-column>-->
        <el-table-column label>
          <template :slot-scope="$scope.row">
            <el-button type="text" class="btn subBtn">订阅管理</el-button>
            <el-button type="text" class="btn unSubBtn">取消订阅</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Header from "@/components/public/Head";

export default {
  name: "subscription",
  data() {
    return {
      tableData: [
        {
          type: "云服务器存储问题",
          info: 0,
          email: 0,
          zhanneixin: 0,
          receive: "开发商，共1人"
        },
        {
          type: "云服务器网络连接问题",
          info: 1,
          email: 1,
          zhanneixin: 1,
          receive: "开发商，共1人"
        },
        {
          type: "云服务器运行异常",
          info: 0,
          email: 1,
          zhanneixin: 0,
          receive: "开发商，共1人"
        }
      ]
    };
  },
  components: {
    Header
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.subscription-wrap >>> .el-button,
.subscription-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.subscription-wrap >>> .el-table__body {
  margin-top: 55px;
}
.subscription-wrap >>> .btn > span:hover {
  border-bottom: 1px solid #006eff;
}
.subscription-wrap >>> div.cell:nth-child(0) {
  padding-left: 65px;
}
.subscription-wrap >>> .el-table__header-wrapper,
.subscription-wrap >>> .el-table__body div.cell {
  padding-left: 66px;
}
.subscription-wrap >>> .table i {
  font-size: 16px;
}
.table {
  padding: 20px;
  position: relative;
  .boxLi:hover {
    background: rgb(245, 245, 245);
  }
  .boxLi {
    background: rgb(255, 255, 255);
    padding: 20px;
    position: absolute;
    width: 97%;
    top: 66px;
    border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
    z-index: 100;
    vertical-align: middle;

    i {
      color: #2184d6;
    }
    span {
      margin: 0 10px;
    }
  }
}
</style>
