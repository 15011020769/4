<template>
  <div class="history-wrap">
    <div class="head">
      <Header title="告警曆史" />
      <el-tabs v-model="activeName">
        <el-tab-pane label="基礎告警" name="first">
          <div class="history-main">
            <!-- <div class="explain" style="margin-bottom:20px;">
              <p>
                當月簡訊配額已用 0 條，剩余 1000 條可用。
                <a @click="buyMessgae">購買簡訊</a>
              </p>
            </div>-->
            <div class="box">
              <div class="table-top">
                <div style="flex:1;">
                  <TimeDropDown
                    :TimeArr="TimeArr"
                    :Datecontrol="true"
                    :Graincontrol="true"
                    :Difference="'H'"
                    v-on:switchData="GetDate"
                  />
                  <!-- <XTimeX v-on:switchData="getBasicsList" :classsvalue="value"></XTimeX> -->
                </div>
                <div class="seek">
                  <el-input v-model="input" placeholder="請輸入告警物件" @input="searchName"></el-input>
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
                  <el-table-column prop="FirstOccurTime" label="發生時間" width="180" sortable>
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="'發生時間:'+ timeFormat(scope.row.FirstOccurTime)"
                        placement="bottom-start"
                      >
                        <div
                          style="border:0;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                        >{{timeFormat(scope.row.FirstOccurTime)}}</div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="告警物件" width="180">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="'告警物件:'+scope.row.ObjName"
                        placement="bottom-start"
                      >
                        <div
                          style="border:0;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                        >{{scope.row.ObjName}}</div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="告警內容" width="150">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="'告警內容:'+scope.row.Content"
                        placement="bottom-start"
                      >
                        <div
                          style="border:0;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                        >{{scope.row.Content}}</div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="持續時長" width="120">
                    <template slot-scope="scope">{{formatSeconds(scope.row.Duration)}}</template>
                  </el-table-column>
                  <el-table-column prop label="告警管道" width="130">
                    <template slot-scope="scope">
                      <p v-if="scope.row.NotifyWay.length>0">
                        <span v-if="scope.row.NotifyWay[0]=='EMAIL'">郵件</span>
                        <span v-if="scope.row.NotifyWay[1]=='EMAIL'">郵件</span>
                        <span v-if="scope.row.NotifyWay[0]=='CALL'">站内信</span>
                        <span v-if="scope.row.NotifyWay[1]=='CALL'">站内信</span>
                      </p>
                      <p v-else>-</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="告警狀態" width="100">
                    <template slot-scope="scope">
                      <span v-if="scope.row.Status==0" style="color:#e54545">未恢複</span>
                      <span v-else-if="scope.row.Status==1" style="color:#0abf5b">已恢複</span>
                      <span v-else style="color:#ccc">數據不足</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="結束時間" width="180">
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="'結束時間:'+ timeFormat(scope.row.LastOccurTime)"
                        placement="bottom-start"
                      >
                        <div
                          style="border:0;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                        >{{timeFormat(scope.row.LastOccurTime)}}</div>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="告警類型">
                    <template slot-scope="scope">
                      <span v-if="scope.row.AlarmType==0">指標</span>
                      <span v-else-if="scope.row.AlarmType==2">産品事件</span>
                      <span v-else-if="scope.row.AlarmType==3">平台事件</span>
                    </template>
                  </el-table-column>

                  <el-table-column prop label="策略類型" width="180">
                    <template slot-scope="scope">
                      <div v-if="scope.row.ViewName=='cvm_device'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="策略類型: 雲伺服器-基礎監控策略"
                          placement="bottom-start"
                        >
                          <span>雲伺服器-基礎監控策略</span>
                        </el-tooltip>
                      </div>
                      <div v-if="scope.row.ViewName=='BS'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="策略類型: 雲伺服器-儲存監控"
                          placement="bottom-start"
                        >
                          <span>雲伺服器-儲存監控</span>
                        </el-tooltip>
                      </div>
                      <div v-if="scope.row.ViewName=='cdb_detail'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="策略類型: 雲資料庫-MySQL-主機監控"
                          placement="bottom-start"
                        >
                          <span>雲資料庫-MySQL-主機監控</span>
                        </el-tooltip>
                      </div>
                      <div v-if="scope.row.ViewName=='COS'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="策略類型: 物件儲存"
                          placement="bottom-start"
                        >
                          <span>物件儲存</span>
                        </el-tooltip>
                      </div>
                      <div v-if="scope.row.ViewName=='VPN_GW'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="策略類型: 私有網絡-VPN閘道"
                          placement="bottom-start"
                        >
                          <span>私有網絡-VPN閘道</span>
                        </el-tooltip>
                      </div>
                      <div v-if="scope.row.ViewName=='EIP'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="策略類型: 私有網絡-彈性公網IP"
                          placement="bottom-start"
                        >
                          <span>私有網絡-彈性公網IP</span>
                        </el-tooltip>
                      </div>
                      <div v-if="scope.row.ViewName=='nat_tc_stat'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="策略類型: 私有網絡-NAT閘道"
                          placement="bottom-start"
                        >
                          <span>私有網絡-NAT閘道</span>
                        </el-tooltip>
                      </div>
                      <div v-if="scope.row.ViewName=='REDIS-CLUSTER'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="策略類型: 雲資料庫-Redis-社區版"
                          placement="bottom-start"
                        >
                          <span>雲資料庫-Redis-社區版</span>
                        </el-tooltip>
                      </div>
                      <div v-if="scope.row.ViewName=='vpn_tunnel'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="策略類型: 私有網絡-VPN通道"
                          placement="bottom-start"
                        >
                          <span>私有網絡-VPN通道</span>
                        </el-tooltip>
                      </div>
                      <div v-if="scope.row.ViewName=='dcline'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="策略類型: 專線接入-物理專線"
                          placement="bottom-start"
                        >
                          <span>專線接入-物理專線</span>
                        </el-tooltip>
                      </div>

                      <!-- <div v-if="scope.row.ViewName=='dcline'">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="策略類型: 專線接入-物理專線"
                          placement="bottom-start"
                        >
                          <span>專線接入-物理專線</span>
                        </el-tooltip>
                      </div>-->
                    </template>
                  </el-table-column>

                  <el-table-column prop label="策略名稱" width="100">
                    <template slot-scope="scope">
                      <a @click="setStrategy(scope.row)">{{scope.row.GroupName}}</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="所屬網路" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.Vpc=='1'">VPC網路</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="所屬專案" width="120">
                    <template slot-scope="scope">{{scope.row.ProjectName}}</template>
                  </el-table-column>
                  <el-table-column prop label="所屬實例組" width="180">
                    <template slot-scope="scope">
                      <div v-if="scope.row.InstanceGroup">
                        <span
                          v-for="(item,index) in scope.row.InstanceGroup"
                          :key="index"
                        >{{item.InstanceGroupName}}、</span>
                      </div>
                      <div v-else>-</div>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分頁 -->
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
        <el-tab-pane label="定時任務補償" name="fourth">定時任務補償</el-tab-pane>-->
      </el-tabs>
    </div>

    <!-- 購買簡訊 -->
    <buymsg :dialogVisible="dialogVisible" @cancel="cancel" @save="save" />
    <!-- 配置表格顯示參數 -->
    <Dialog :dialogVisible1="dialogVisible1" @cancel="cancel1" @save1="save1" />
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import buymsg from "../components/buymsg";
import TimeDropDown from "./components/TimeN.vue";
import Dialog from "./components/custom"; //配置表格顯示參數

import moment from "moment"; //日期格式js
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共錯誤碼
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
      dialogVisible: false, //购买簡訊弹出框
      input: "", //搜索框的值
      tableData: [], //列表数据
      dialogVisible1: false, //设置显示参数弹框
      timeObjs: [],
      TimeArr: [
        {
          name: "今天",
          Time: "Today",
          TimeGranularity: [
            {
              value: "3600",
              label: "1小時"
            },
            {
              value: "86400",
              label: "1天"
            }
          ]
        },
        {
          name: "昨天",
          Time: "Yesterday",
          TimeGranularity: [
            {
              value: "3600",
              label: "1小時"
            },
            {
              value: "86400",
              label: "1天"
            }
          ]
        },
        {
          name: "近7天",
          Time: "Nearly_7_days",
          TimeGranularity: [
            {
              value: "3600",
              label: "1小時"
            },
            {
              value: "86400",
              label: "1天"
            }
          ]
        },
        {
          name: "近30天",
          Time: "Nearly_30_days",
          TimeGranularity: [
            {
              value: "3600",
              label: "1小時"
            },
            {
              value: "86400",
              label: "1天"
            }
          ]
        }
      ],
      //分页
      totals: 0, //总条数
      pageSize: 10, //每页10条
      pageIndex: 1, // 当前页码
      StartTime: "",
      EndTime: "",
      Period: {}
    };
  },
  components: {
    Header,
    buymsg,
    TimeDropDown,
    Dialog
  },
  created() {
    this.getBasicsList(); //获取基础告警列表
  },
  methods: {
    GetDate(val) {
      this.Period = val[0];
      this.StartTime = val[1].StartTIme;
      this.EndTime = val[1].EndTIme;
      this.loadShow = true;
      this.getBasicsList(val);
    },
    setValue() {
      this.dialogVisible1 = true;
    },
    //確定
    save1(values) {
      this.dialogVisible1 = false;
    },
    cancel1() {
      //取消彈框
      this.dialogVisible1 = false;
    },
    getObjectValues(object) {
      var values = [];
      for (var i in object) values.push(object[i].InstanceGroupName);
      return values.join(",");
    },
    formatSeconds(value) {
      //秒轉時分秒
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
      if (h !== "0") res += `${h}小時`;
      if (m !== "00") res += `${m}分鍾`;
      // res += `${s}s`;
      if (res == "") {
        return "-";
      }
      return res;
    },
    timeFormat(times) {
      //時間格式轉化
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
      //跳轉設置策略
      this.$router.push({
        path: "/strategy/createdetail",
        query: { groupId: data.GroupId, viewName: "cvm_device" }
      });
    },
    //獲取數據
    getBasicsList(val) {
      this.loadShow = true; //加載
      this.timeObjs = val;
      if (val) {
        this.value = this.timeObjs[1];
        var params = {
          Region: localStorage.getItem("regionv2"),
          Version: "2018-07-24",
          Module: "monitor",
          Limit: this.pageSize,
          Offset: this.pageIndex

          // Offset: (this.pageIndex - 1) * this.pageSize
        };
        params.ObjLike = this.input;
        params.StartTime = Date.parse(this.StartTime) / 1000; //开始时间戳
        params.EndTime = new Date(this.EndTime).getTime() / 1000; //结束时间戳
      } else {
        var params = {
          Region: localStorage.getItem("regionv2"),
          Version: "2018-07-24",
          Module: "monitor",
          Limit: this.pageSize,
          Offset: this.pageIndex

          // Offset: (this.pageIndex - 1) * this.pageSize
        };
        params.ObjLike = this.input;
      }
      // console.log(params)
      this.axios.post(BASICS_ALARM_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.Alarms;
          // console.log(this.tableData);
          this.totals = res.Response.Total;
          this.loadShow = false; //取消加載
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
      // console.log(`每頁 ${val} 條`);
      this.pageSize = val;
      this.getBasicsList(this.timeObjs);
    },
    //分頁
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

      //搜索按鈕
      if (this.input == "") {
        this.input = "";
        this.getBasicsList(this.timeObjs);
      }
      // params.ObjLike = this.input;
      this.getBasicsList(this.timeObjs);
    },
    // 導出表格
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
          "告警曆史—基礎告警告警清單.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    //購買簡訊
    buyMessgae() {
      this.dialogVisible = true;
    },
    //取消
    cancel() {
      this.dialogVisible = false;
    },
    //確定
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
