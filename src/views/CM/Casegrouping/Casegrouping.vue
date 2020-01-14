<template>
  <div class="group-wrap">
    <Header title="实例分组" />
    <div class="group-main">
      <div class="explain" style="margin-bottom:20px;">
        <p>
          实例分组功能提供对跨地域、跨项目组的云产品资源进行分组管理的能力，点击查看
          <a>实例分组文档</a>
        </p>
      </div>
      <div class="box">
        <div class="table-top">
          <div style="flex:1;">
            <el-button type="primary" @click="buyMessgae">新建</el-button>
            <Dialog
              :dialogVisible="dialogVisible"
              @cancel="cancel"
              @save="save"
            />
          </div>
          <div class="seek">
            <el-input v-model="input" placeholder="请输入实例组名搜索"></el-input>
            <el-button icon="el-icon-search" style="margin-left:-1px;"></el-button>
          </div>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%" height="450">
            <el-table-column prop="address" label="实例组名称"></el-table-column>
            <el-table-column prop="address" label="分组类型"></el-table-column>
            <el-table-column prop="address" label="实例数"></el-table-column>
            <el-table-column prop="address" label="绑定告警策略数"></el-table-column>
            <el-table-column prop="address" label="最后修改"></el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <a style="padding-right:10px;">复制</a>
                <a>删除</a>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
            <el-pagination
              :page-size="pagesize"
              :pager-count="7"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :total="TotalCount"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import Transfer from "./components/transfer";
import Dialog from "./components/dialog";
export default {
  name: "group",
  data() {
    return {
      dialogVisible: false, //dialog
      input: "", //搜索框的值
      tableData: [],
      //分页
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1 // 当前页码
    };
  },
  components: {
    Header,
    Transfer,
    Dialog
  },
  created() {},
  methods: {
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
    },
    //设置弹框//新建实例分组
    buyMessgae() {
      // alert("11")
      this.dialogVisible = true;
    },
    //取消设置弹框
    cancel() {
      this.dialogVisible = false;
    },
    //确定设置弹框
    save() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.group-wrap >>> .el-button,
.group-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.group-wrap >>> .el-dialog {
  width: 1000px;
  height: 700px;
  margin-top:-350px;
  top:50%;
}
.group-wrap {
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

    .pagtotal {
      font-size: 13px;
      font-weight: 400;
      color: #565656;
      line-height: 32px;
    }
  }
  a {
    color: #006eff;
    cursor: pointer;
  }
  .cursor {
    cursor: pointer;
  }
  .group-main {
    padding: 20px;
    box-sizing: border-box;

    .table {
      background: white;
    }

    .table-top {
      display: flex;
      margin-bottom: 20px;
      .seek {
        width: 240px;
        display: flex;
      }
    }

    .explain {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;

      p {
        font-size: 11px;
        line-height: 18px;
      }
    }
  }
}
</style>