<template>
  <div class="history-wrap">
    <div class="head">
      <Header title="告警历史" />
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础告警" name="first">
          <div class="history-main">
            <!-- <div class="explain" style="margin-bottom:20px;">
              <p>
                当月短信配额已用 0 条，剩余 1000 条可用。
                <a @click="buyMessgae">购买短信</a>
              </p>
            </div> -->
            <div class="box">
              <div class="table-top">
                <div style="flex:1;">
                  <XTimeX v-on:switchData="getBasicsList" :classsvalue="value"></XTimeX>
                </div>
                <div class="seek">
                  <el-input v-model="input" placeholder="请输入告警对象" @input="searchName"></el-input>
                  <el-button icon="el-icon-search" style="margin-left:-1px;" @click="searchBtn"></el-button>
                </div>
                <div class="icons">
                  <!-- <i class="el-icon-setting" @click="setValue"></i> -->
                  <i class="el-icon-download" @click="exportExcel"></i>
                </div>
              </div>
              <div class="table">
                <el-table
                  :data="tableData"
                  style="width: 100%"
                  height="450"
                  v-loading="loadShow"
                  id="exportTable"
                  :default-sort="{prop: 'FirstOccurTime', order: 'descending'}"
                >
                  <el-table-column prop="FirstOccurTime" label="发生时间" width="180" sortable>
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="'发生时间:'+ timeFormat(scope.row.FirstOccurTime)"
                        placement="bottom-start"
                      >
                        <div
                          style="border:0;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                        >{{timeFormat(scope.row.FirstOccurTime)}}</div>
                      </el-tooltip>
                    </template>
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
                  <el-table-column prop label="告警内容" width="150">
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
                  <el-table-column prop label="持续时长" width="120">
                    <template slot-scope="scope">{{formatSeconds(scope.row.Duration)}}</template>
                  </el-table-column>
                  <el-table-column prop label="告警渠道" width="130">
                    <template slot-scope="scope">邮件、短信</template>
                  </el-table-column>
                  <el-table-column prop label="告警状态" width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.Status==0" style="color:#e54545">未恢复</span>
                      <span v-else-if="scope.row.Status==1" style="color:#0abf5b">已恢复</span>
                      <span v-else style="color:#ccc">数据不足</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="结束时间" width="180">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="'结束时间:'+ timeFormat(scope.row.LastOccurTime)"
                        placement="bottom-start"
                      >
                        <div
                          style="border:0;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                        >{{timeFormat(scope.row.LastOccurTime)}}</div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="告警类型">
                    <template slot-scope="scope" v-if="scope.row.AlarmType==0">指标</template>
                    <template slot-scope="scope" v-else-if="scope.row.AlarmType==2">产品事件</template>
                    <template slot-scope="scope" v-else-if="scope.row.AlarmType==3">平台事件</template>
                  </el-table-column>
                  <el-table-column prop label="策略类型" width="180">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="策略类型: 云服务器-基础监控策略"
                        placement="bottom-start"
                      >
                        <span v-if="scope.row.ViewName=='cvm_device'">云服务器-基础监控策略</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>

                  <el-table-column prop label="策略名称" width="100">
                    <template slot-scope="scope">
                      <a @click="setStrategy(scope.row)">{{scope.row.GroupName}}</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="所属网络" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.Vpc=='1'">VPC网络</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="所属项目" width="120">
                    <template slot-scope="scope">{{scope.row.ProjectName}}</template>
                  </el-table-column>
                  <el-table-column prop label="所属实例组" width="180">
                    <template slot-scope="scope">
                      <div v-if="scope.row.instanceGroup">
                        <span
                          v-for="(item,index) in scope.row.instanceGroup"
                          :key="index"
                        >{{item.InstanceGroupName}}</span>
                      </div>
                      <div v-else>-</div>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="tke-page">
                  <div class="block">
                    <el-pagination
                      @size-change="handleSizeChange"
                      :pager-count="7"
                      @current-change="handleCurrentChange"
                      :current-page="pageIndex"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next"
                      :total="totals"
                    ></el-pagination>
                  </div>
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
    <!-- 配置表格显示参数 -->
    <Dialog :dialogVisible1="dialogVisible1" @cancel="cancel1" @save1="save1" />
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import buymsg from "../components/buymsg";
import XTimeX from "./components/TimeN";
import Dialog from "./components/custom"; //配置表格显示参数

import moment from "moment"; //日期格式js
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { BASICS_ALARM_LIST } from "@/constants/CM-lxx.js";
import XLSX from "xlsx";
import FileSaver from "file-saver";
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
      dialogVisible1: false, //设置显示参数弹框
      timeObjs: [],
      //分页
      totals: 0, //总条数
      pageSize: 10, //每页10条
      pageIndex: 1 // 当前页码
    };
  },
  components: {
    Header,
    buymsg,
    XTimeX,
    Dialog
  },
  created() {
    this.getBasicsList(); //获取基础告警列表
  },
  methods: {
    setValue() {
      this.dialogVisible1 = true;
    },
    //确定
    save1(values) {
      this.dialogVisible1 = false;
    },
    cancel1() {
      //取消弹框
      this.dialogVisible1 = false;
    },
    getObjectValues(object) {
      var values = [];
      for (var i in object) values.push(object[i].InstanceGroupName);
      return values.join(",");
    },
    formatSeconds(value) {
      //秒转时分秒
      let result = parseInt(value);
      let h =
        Math.floor(result / 3600) < 10
          ? "" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      let m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      let s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);

      let res = "";
      if (h !== "0") res += `${h}小时`;
      if (m !== "00") res += `${m}分钟`;
      // res += `${s}s`;
      if (res == "") {
        return "-";
      }
      return res;
    },
    timeFormat(times) {
      //时间格式转化
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
    setStrategy(data) {
      //跳转设置策略
      this.$router.push({ path: "/strategy/create:" + data.Id });
    },
    //获取数据
    getBasicsList(val) {
      this.loadShow = true; //加载
      this.timeObjs = val;
      if (this.timeObjs) {
        this.value = this.timeObjs[1];
        var params = {
          Region: localStorage.getItem("regionv2"),
          Version: "2018-07-24",
          Module: "monitor",
          Limit: this.pageSize,
          Offset: (this.pageIndex - 1) * this.pageSize
        };
        params.ObjLike = this.input;
        params.StartTime = Date.parse(this.timeObjs[0].StartTIme) / 1000; //开始时间戳
        params.EndTime = Date.parse(this.timeObjs[0].EndTIme) / 1000; //结束时间戳
      } else {
        var params = {
          Region: localStorage.getItem("regionv2"),
          Version: "2018-07-24",
          Module: "monitor",
          Limit: this.pageSize,
          Offset: (this.pageIndex - 1) * this.pageSize
        };
        params.ObjLike = this.input;
      }
      this.axios.post(BASICS_ALARM_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.Alarms;
          this.totals = res.Response.Total;
          this.loadShow = false; //取消加载
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
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getBasicsList(this.timeObjs);
    },
    //分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.getBasicsList(this.timeObjs);
      this.pageIndex += 1;
    },
    searchName() {
      this.pageIndex = 1;
      //搜索框
      if (this.input == "") {
        this.input = "";
        this.getBasicsList(this.timeObjs);
      }
      this.getBasicsList(this.timeObjs);
    },
    searchBtn() {
      this.pageIndex = 1;

      //搜索按钮
      if (this.input == "") {
        this.input = "";
        this.getBasicsList(this.timeObjs);
      }
      // params.ObjLike = this.input;
      this.getBasicsList(this.timeObjs);
    },
    // 导出表格
    exportExcel() {
      console.log("exportExcel...");
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          "告警历史—基础告警告警列表.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
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
.tke-page {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
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
      height: 580px;
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