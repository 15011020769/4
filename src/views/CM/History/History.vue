<template>
  <div class="history-wrap">
    <div class="head">
      <Header title="告警历史" />
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础告警" name="first">
          <div class="history-main">
            <div class="explain" style="margin-bottom:20px;">
              <p>
                当月短信配额已用 0 条，剩余 1000 条可用。
                <a @click="buyMessgae">购买短信</a>
              </p>
            </div>
            <div class="box">
              <div class="table-top">
                <div style="flex:1;">
                  <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
                </div>
                <div class="seek">
                  <el-input v-model="input" placeholder="请输入告警对象"></el-input>
                  <el-button icon="el-icon-search" style="margin-left:-1px;"></el-button>
                </div>
                <div class="icons">
                  <i class="el-icon-setting"></i>
                  <i class="el-icon-download"></i>
                </div>
              </div>
              <div class="table">
                <el-table :data="tableData" style="width: 100%" height="450">
                  <el-table-column prop="address" label="发生时间"></el-table-column>
                  <el-table-column prop="address" label="告警对象"></el-table-column>
                  <el-table-column prop="address" label="告警内容"></el-table-column>
                  <el-table-column prop="address" label="持续时长"></el-table-column>
                  <el-table-column prop="address" label="告警渠道"></el-table-column>
                  <el-table-column prop="address" label="告警状态"></el-table-column>
                  <el-table-column prop="address" label="结束时间"></el-table-column>
                  <el-table-column prop="address" label="告警类型"></el-table-column>
                  <el-table-column prop="address" label="策略类型"></el-table-column>
                  <el-table-column prop="address" label="策略名称"></el-table-column>
                  <el-table-column prop="address" label="所属网络"></el-table-column>
                  <el-table-column prop="address" label="所属项目"></el-table-column>
                  <el-table-column prop="address" label="所属实例组"></el-table-column>
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
        </el-tab-pane>
        <!-- <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
      </el-tabs>
    </div>

    <!-- 购买短信 -->
    <buymsg :dialogVisible="dialogVisible" @cancel="cancel" @save="save" />
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import buymsg from "../components/buymsg";
import XTimeX from "./components/TimeN";
export default {
  name: "history",
  data() {
    return {
      activeName: "first",
      value: 1,
      dialogVisible: false, //购买短信弹出框
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
    buymsg,
    XTimeX
  },
  created() {},
  methods: {
    //获取数据
    GetDat(data) {
      console.log(data);
    },
    //购买短信
    buyMessgae() {
      this.dialogVisible = true;
    },
    //取消
    cancel() {
      this.dialogVisible = false;
    },
    //确定
    save() {
      this.dialogVisible = false;
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.history-wrap >>> .header{
  border: 0;
  margin-bottom: -8px;
}
.history-wrap >>> .el-tabs__header {
  margin: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
.history-wrap >>> .el-button,
.history-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.history-wrap {
  .head {
    background: white;
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
  .history-main {
    padding: 20px;
    box-sizing: border-box;
    background: #f2f2f2;

    .icons {
      display: flex;
      align-items: center;

      i {
        font-size: 15px;
        color: #666;
        margin-left: 5px;
        cursor: pointer;
        padding: 5px;
        box-sizing: border-box;
      }
      i:hover {
        background: #f2f2f2;
      }
    }

    .box {
      background: white;
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;
    }
    .table-top {
      display: flex;
      margin-bottom: 10px;
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