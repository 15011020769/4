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
                  <XTimeX v-on:switchData="getBasicsList" :classsvalue="value"></XTimeX>
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
                <el-table
                  :data="tableData"
                  style="width: 100%"
                  height="750"
                  :default-sort="{prop: 'FirstOccurTime', order: 'descending'}"
                >
                  <el-table-column prop="FirstOccurTime" label="发生时间" width="180" sortable>
                    <template slot-scope="scope">{{timeFormat(scope.row.FirstOccurTime)}}</template>
                  </el-table-column>

                  <el-table-column prop label="告警对象" width="180">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="'告警对象:'+scope.row.ObjName"
                        placement="bottom-start"
                      >
                        <div
                          style="border:0;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                        >{{scope.row.ObjName}}</div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="address" label="告警内容"></el-table-column> -->
                  <el-table-column prop label="告警内容" width="180">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="'告警内容:'+scope.row.Content"
                        placement="bottom-start"
                      >
                        <div
                          style="border:0;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                        >{{scope.row.Content}}</div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="持续时长"></el-table-column>
                  <el-table-column prop="address" label="告警渠道"></el-table-column>
                  <el-table-column prop="address" label="告警状态"></el-table-column>
                  <el-table-column prop label="结束时间" width="180">
                    <template slot-scope="scope">{{timeFormat(scope.row.LastOccurTime)}}</template>
                  </el-table-column>
                  <el-table-column prop="address" label="告警类型"></el-table-column>
                  <el-table-column prop="address" label="策略类型"></el-table-column>
                  <!-- <el-table-column prop="address" label="策略名称"></el-table-column>
                   -->
                   <!-- ProjectName -->
                    <el-table-column prop label="策略名称" width="180">
                    <template slot-scope="scope">
                      <a @click="setStrategy(scope.row)">
                        {{scope.row.ProjectName}}
                      </a>
                      
                      </template>
                  </el-table-column>

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
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>-->
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

import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { BASICS_ALARM_LIST } from "@/constants/CM-lxx.js";
export default {
  name: "history",
  data() {
    return {
      loadShow: true, // 加载是否显示
      activeName: "first",
      value: 1,
      dialogVisible: false, //购买短信弹出框
      input: "", //搜索框的值
      tableData: [], //列表数据
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
  created() {
    this.getBasicsList(); //获取基础告警列表
  },
  methods: {
    timeFormat(times) {
      if (times == "-") {
        return "-";
      }
      var d = new Date(times);
      var n = d.getFullYear();
      var y = d.getMonth() + 1;
      var r = d.getDate();
      var h = d.getHours(); //12
      var m = d.getMinutes(); //12
      var s = d.getSeconds();
      h < 10 ? (h = "0" + h) : h;
      m < 10 ? (m = "0" + m) : m;
      s < 10 ? (s = "0" + s) : s;
      return n + "/" + y + "/" + r + " " + h + ":" + m + ":" + s;
    },
    setStrategy(data){
      //跳转设置策略
      console.log("跳转设置策略开发中")
    },
    //获取数据
    getBasicsList() {
      this.loadShow = true; //加载
      const params = {
        Region: localStorage.getItem("regionv2"),
        Version: "2018-07-24",
        Module: "monitor"
      };
      console.log(params);
      this.axios.post(BASICS_ALARM_LIST, params).then(res => {
        console.log(res.Response.Alarms, "数据");

        if (res.Response.Error === undefined) {
          this.tableData = res.Response.Alarms;
          this.loadShow = false; //取消加载
          this.showNameSpaceModal = false;
        } else {
          this.loadShow = false;
          let ErrTips = {};
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
.history-wrap >>> .header {
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
      height: 880px;
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