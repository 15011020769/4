<template>
  <div>
    <div class="overviewTit">{{ $t("DDOS.Protective.ProtectiveName") }}</div>
    <div class="allConMain">
      <div class="allConMainOne">
        <div class="allConMainOneTit">
          {{ $t("DDOS.Protective.Protectiveoverview") }}
        </div>
        <div class="allConMainOneCon">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="allConMainOneLeft">
                <h3>{{ $t("DDOS.Protective.Protectivesecurity") }}</h3>
                <el-row class="allConMainOneRow">
                  <el-col :span="8" class="LeftConOne LeftConRow">
                    <p>{{ $t("DDOS.Protective.ProtectiveAttack") }}</p>
                    <p>{{ attackData[1].Value }}</p>
                  </el-col>
                  <el-col :span="8" class="LeftConTwo LeftConRow">
                    <p>{{ $t("DDOS.Protective.ProtectiveSeal") }}</p>
                    <p>{{ attackData[2].Value }}</p>
                  </el-col>
                  <el-col :span="8" class="LeftConThree LeftConRow">
                    <p>{{ $t("DDOS.Protective.Protectivepeak") }}</p>
                    <p>
                      {{ attackData[3].Value }}
                      <span>Mbps</span>
                    </p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="allConMainOneLeft">
                <h3>{{ $t("DDOS.Protective.CurrentState") }}</h3>
                <el-row class="allConMainOneRow">
                  <el-col :span="12" class="LeftConOne LeftConRow">
                    <p>{{ $t("DDOS.Protective.Protectivewash") }}</p>
                    <!-- 移除高仿包相关数据 -->
                    <!-- <p>{{(+packDataIP[1].Value) + (+packDataBgp[1].Value)}}</p> -->
                    <p>{{ +packDataIP[1].Value }}</p>
                  </el-col>
                  <el-col :span="12" class="LeftConOne LeftConRow">
                    <p>{{ $t("DDOS.Protective.blockIng") }}</p>
                    <!-- 移除高仿包相关数据 -->
                    <!-- <p>{{(+packDataIP[2].Value) + (+packDataBgp[2].Value)}}</p> -->
                    <p>{{ +packDataIP[2].Value }}</p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="allConMainTwo allConMainOne">
        <div class="allConMainTwoTit allConMainOneTit">
          {{ $t("DDOS.Protective.myProduct") }}
        </div>
        <div class="allConMainOneCon allConMainTwoCon">
          <el-row :gutter="20">
            <el-col :span="12">
              <!-- 【安全-DDoS防护-防护概览】台富云不售卖高防包，在防护概览页中高防包和共享包相关的功能可以取消】 -->
              <!-- <div class="allConMainOneLeft allConMainTwoLeft">
                <el-row class="productRow">
                  <el-col :span="12" class="productRow1">
                    {{ $t("DDOS.Protective.ProtectiveExclusive") }}
                    <span>{{ packDataBgp[0].Value }}</span>
                  </el-col>
                  <el-col :span="12" class="productRow2">
                    <p>
                      <span></span>
                      <span>{{ $t("DDOS.Protective.Protectivewash") }}</span>
                      <span>{{ packDataBgp[1].Value }}</span>
                    </p>
                    <p>
                      <span></span>
                      <span>{{ $t("DDOS.Protective.blockIng") }}</span>
                      <span>{{ packDataBgp[2].Value }}</span>
                    </p>
                    <p>
                      <span></span>
                      <span>{{ $t("DDOS.Protective.aboutExpire") }}</span>
                      <span>{{ packDataBgp[4].Value }}</span>
                    </p>
                    <p>
                      <span></span>
                      <span>{{ $t("DDOS.Protective.Expiring") }}</span>
                      <span>{{ packDataBgp[3].Value }}</span>
                    </p>
                  </el-col>
                </el-row>
              </div> -->
            </el-col>
            <el-col :span="12">
              <div
                class="allConMainOneRight allConMainTwoRight allConMainTwoLeft"
              >
                <el-row class="productRow">
                  <el-col :span="12" class="productRow1">
                    {{ $t("DDOS.Protective.professionalEdition") }}
                    <span>{{ packDataIP[0].Value }}</span>
                  </el-col>
                  <el-col :span="12" class="productRow2">
                    <p>
                      <span></span>
                      <span>{{ $t("DDOS.Protective.Protectivewash") }}</span>
                      <span>{{ packDataIP[1].Value }}</span>
                    </p>
                    <p>
                      <span></span>
                      <span>{{ $t("DDOS.Protective.blockIng") }}</span>
                      <span>{{ packDataIP[2].Value }}</span>
                    </p>
                    <p>
                      <span></span>
                      <span>{{ $t("DDOS.Protective.aboutExpire") }}</span>
                      <span>{{ packDataIP[4].Value }}</span>
                    </p>
                    <p>
                      <span></span>
                      <span>{{ $t("DDOS.Protective.Expiring") }}</span>
                      <span>{{ packDataIP[3].Value }}</span>
                    </p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="allConMainThree">
        <div class="allConMainThreeTit">
          <div>{{ $t("DDOS.Protective.AttackLog") }}</div>
          <div class="rightCon">
            <a href="#" class="downloadTable" @click="exportExcel">
              {{ $t("DDOS.Protective.DownTable") }}
            </a>
            <el-input
              class="rightIptSearch"
              v-model="searchInputID"
              :placeholder="$t('DDOS.Protective.pleaSearchVal')"
            />
            <el-button
              @click="doFilter"
              class="searcHBthn el-icon-search"
            ></el-button>
          </div>
        </div>
        <div class="allConMainThreeCon">
          <div class="chartShowTit">
            <el-button-group>
              <!-- <el-button
                @click="btnClick('bgp')"
                :class="{'addColor':type=='bgp'}"
              >{{$t('DDOS.Protective.ProtectiveExclusive')}}</el-button> -->
              <!-- <el-button
                @click="btnClick('bgp-multip')"
                :class="{'addColor':type=='bgp-multip'}"
              >{{$t('DDOS.Protective.shareExclusive')}}</el-button> -->
              <el-button
                @click="btnClick('net')"
                :class="{ addColor: type == 'net' }"
                >{{ $t("DDOS.Protective.professionalEdition") }}</el-button
              >
            </el-button-group>
          </div>
          <div class="tableOverView">
            <el-table
              id="exportTable"
              :data="
                tableDataBegin.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )
              "
              height="450"
              v-loading="loading"
              empty-text="暫無數據"
            >
              <el-table-column
                prop="StartTime"
                :label="$t('DDOS.Protective.AgainstTime')"
              >
                <template slot-scope="scope">
                  {{ scope.row.StartTime }}
                  <!-- <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.funName}}</a> -->
                </template>
              </el-table-column>
              <el-table-column
                prop="durationTime"
                :label="$t('DDOS.Protective.durationTime')"
              >
                <template slot-scope="scope">
                  {{durationDate(scope.row.EndTime,scope.row.StartTime)}}
                  <!-- {{ scope.row.EndTime - scope.row.StartTime }} -->
                </template>
              </el-table-column>
              <el-table-column prop :label="$t('DDOS.Protective.productName')">
                <template slot-scope="scope">{{ $t("DDOS.Protective.professionalEdition") }}</template>
              </el-table-column>
              <el-table-column
                prop="ResourceName"
                :label="$t('DDOS.Protective.AssetName')"
              >
                <template slot-scope="scope">
                 <el-button type="text" @click="jump(scope.row)"> {{ scope.row.ResourceName }}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop
                :label="$t('DDOS.Protective.AssetType')"
                v-if="type == 'net' ? false : true"
              >
                <template slot-scope="scope">-</template>
              </el-table-column>
              <el-table-column prop="Vip" label="IP">
                <template slot-scope="scope">{{ scope.row.Vip }}</template>
              </el-table-column>
              <el-table-column
                prop="AttackType"
                :label="$t('DDOS.Protective.AgainstType')"
                width="70px"
              >
                <template slot-scope="scope">
                  {{ scope.row.AttackType }}
                </template>
              </el-table-column>
              <el-table-column
                prop="Mbps"
                :label="$t('DDOS.Protective.AgainstBandwidth')"
              >
                <template slot-scope="scope">{{ scope.row.Mbps }}Mbps</template>
              </el-table-column>
              <el-table-column
                prop="Pps"
                :label="$t('DDOS.Protective.AgainstMaximum')"
              >
                <template slot-scope="scope">{{ scope.row.Pps }}pps</template>
              </el-table-column>
              <el-table-column
                prop
                :label="$t('DDOS.Protective.TriggerBanned')"
                width="180"
              >
                <template slot-scope="scope">
                  <!-- <el-button type="text" size="small">
                    {{ $t("DDOS.Protective.TriggerBanned") }}
                  </el-button> -->
                  <span v-if="scope.row.BlockFlag == 0">否</span>
                  <span v-else-if="scope.row.BlockFlag == 1">是</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="Right-style pagstyle">
            <span class="pagtotal">
              共&nbsp;{{ totalItems }}&nbsp;{{ $t("DDOS.UnsealCode.tiao") }}
            </span>
            <el-pagination
              :page-size="pageSize"
              :pager-count="7"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :total="totalItems"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { DDOS_SECINDEX, DDOS_PACKINDEX, DDOS_EV_LIST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  data() {
    return {
      loading: true,
      // 安全统计-本月
      attackData: [
        { Key: "AttackIpCount", Value: 0, desc: "受攻擊的IP數" },
        { Key: "AttackCount", Value: 0, desc: "攻擊次數" },
        { Key: "BlockCount", Value: 0, desc: "封堵次數" },
        { Key: "MaxMbps", Value: 0, desc: "攻擊峰值Mbps" },
        { Key: "IpNum", Value: 0, desc: "統計的IP數據" }
      ],
      // 获取产品总览
      // packParams: ["bgp", "net"],
      packParams: ['net'],
      business: 'net', // 产品代号: bgpip表示高防IP；bgp表示独享包；bgp-multip表示共享包；net表示高防IP专业版
      packDataIP: [
        // 高防IP专业版 net
        { Key: "TotalPackCount", Value: 0 },
        { Key: "AttackPackCount", Value: 0 },
        { Key: "BlockPackCount", Value: 0 },
        { Key: "ExpiredPackCount", Value: 0 },
        { Key: "ExpireingPackCount", Value: 0 },
        { Key: "IsolatePackCount", Value: 0 }
      ],
      // <!-- 移除高仿包相关数据 -->
      // packDataBgp: [
      //   // bgp
      //   { Key: "TotalPackCount", Value: 0 },
      //   { Key: "AttackPackCount", Value: 70 },
      //   { Key: "BlockPackCount", Value: 0 },
      //   { Key: "ExpiredPackCount", Value: 0 },
      //   { Key: "ExpireingPackCount", Value: 0 },
      //   { Key: "IsolatePackCount", Value: 60 }
      // ],
      // 日期区间：30天
      endTime: this.getDateString(new Date()),
      startTime: this.getDateString(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30)
      ),
      // 攻击事件列表
      tableDataBegin: [],
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      // 攻击事件列表：bgp表示独享包；bgp-multip表示共享包；net表示高防IP专业版
      // type: "bgp",
      type: "net",
      // 下载名称
      downloadName: "DDoS 高防IP專業版攻擊記錄",
      // 查询输入字段（资源实例id）
      searchInputID: "",

      tableDataEnd: [],
      filterTableDataEnd: [],
      flag: false,
      dialogVisible: false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.describeSecIndex();
      for (let i in this.packParams) {
        this.business = this.packParams[i];
        console.log(this.business)
        switch (
          this.business // [bgpip表示高防IP；bgp表示独享包；bgp-multip表示共享包；net表示高防IP专业版]
        ) {
          case 'net':
            this.describePackIndex(this.packDataIP);
            break;
          // case "bgp":
          //   this.describePackIndex(this.packDataBgp);
          //   break;
        }
      }
      this.describeDDoSEvList();
    },
    // 1.1.获取安全统计-本月
    describeSecIndex() {
      let params = {
        Version: "2018-07-09"
      };
      this.axios.post(DDOS_SECINDEX, params).then(res => {
        if (res.Response.Error === undefined) {
          for (let i in this.attackData) {
            for (let j in res.Response.Data) {
              if (this.attackData[i].Key == res.Response.Data[j].Key) {
                this.attackData[i].Value = res.Response.Data[j].Value;
                break;
              }
            }
          }
        } else {
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
    // 1.2.获取产品总览
    describePackIndex(packData) {
      let params = {
        Version: "2018-07-09",
        Business: this.business
      };
      this.axios.post(DDOS_PACKINDEX, params).then(res => {
        if (res.Response.Error === undefined) {
          for (let i in packData) {
            for (let j in res.Response.Data) {
              if (packData[i].Key == res.Response.Data[j].Key) {
                packData[i].Value = res.Response.Data[j].Value;
                break;
              }
            }
          }
        } else {
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
    // 1.3.获取DDoS攻击事件列表
    describeDDoSEvList() {
      this.loading = true;
      let params = {
        Version: "2018-07-09",
        Business: this.type, // [bgp表示独享包；bgp-multip表示共享包；net表示高防IP专业版]
        StartTime: this.startTime,
        EndTime: this.endTime,
        Id: this.searchInputID
      };
      this.axios.post(DDOS_EV_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.tableDataBegin = res.Response.Data;
          this.totalItems = this.tableDataBegin.length;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
        this.loading = false;
      });
    },
    // 时间格式化'yyyy-MM-dd hh:mm:ss'
    getDateString(date) {
      let o = {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
      };
      for (const i in o) {
        o[i] = (o[i] + "").length == 1 ? "0" + o[i] : o[i];
      }
      return o.y + "-" + o.M + "-" + o.d + " " + o.h + ":" + o.m + ":" + o.s;
    },
    // 下面tab切换表格
    btnClick(param) {
      this.type = param;
      // 移除高仿包相关数据
      // if (param == "bgp") {
      //   this.downloadName = "獨享包攻擊記錄";
      // } else
      // if (param == "bgp-multip") {
      //   this.downloadName = "共享包攻擊記錄";
      // } else
      if (param === 'net') {
        this.downloadName = 'DDoS 高防IP專業版攻擊記錄'
      }
      this.describeDDoSEvList();
    },
    // 搜索
    doFilter() {
      this.describeDDoSEvList();
      // 重新定义当前页
      this.currentPage = 1;
    },

    // 分页开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // 需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, // 组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
    exportExcel() {
      /* generate workbook object from table */
      var xlsxParam = { raw: true }
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"),xlsxParam);
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          this.downloadName + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    // 获取持续时间
    durationDate (endTime, StartTime) {
      let durationTime = ''
      let stime = new Date(StartTime).getTime()
      let etime = new Date(endTime).getTime()
      let dateDiff = etime - stime
      let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天数
      if (dayDiff > 0) {
        durationTime += dayDiff + '天'
      }
      let leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000)) // 计算出小时数
      if (hours > 0) {
        durationTime += hours + '小時'
      }
      // 计算相差分钟数
      let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000)) // 计算相差分钟数
      if (minutes > 0) {
        durationTime += minutes + '分鐘'
      }
      // 计算相差秒数
      let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000)
      let leave4 = leave3 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      let minseconds = Math.round(leave4 / 1000)
      if (minseconds > 0) {
        durationTime += minseconds + '秒'
      }
      return durationTime
    },
    jump (scopeRow) {
      console.log(scopeRow)
      sessionStorage.setItem("IpPro", JSON.stringify(scopeRow))
      this.$router.push({
        path: '/IpProfessional'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
.newClear:after {
  display: block;
  clear: both;
  content: "";
}
.overviewTit {
  height: 50px;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  font-weight: 600;
  padding: 0 20px;
  line-height: 50px;
}
.allConMain {
  width: 100%;
  padding: 20px;
  .allConMainOne {
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
    width: 100%;
    .allConMainOneTit {
      width: 100%;
      height: 40px;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      line-height: 40px;
      padding: 0 12px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
      margin-top: 20px;
    }
    .allConMainOneLeft,
    .allConMainOneRight {
      height: 146px;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    }
    .allConMainOneLeft {
      h3 {
        font-size: 14px;
        font-weight: 600;
        color: #999;
        text-align: center;
        line-height: 56px;
      }
      .allConMainOneRow {
        .LeftConRow {
          border-right: 1px solid #ddd;
          text-align: center;
          p:nth-child(1) {
            font-size: 12px;
            margin-bottom: 20px;
          }
          p:nth-child(2) {
            font-size: 16px;
          }
        }
        .LeftConOne {
          p:nth-child(2) {
            color: #006eff;
          }
        }
        .LeftConTwo {
          p:nth-child(2) {
            color: #0abf5b;
          }
        }
        .LeftConThree {
          border-right: 0;
          p:nth-child(2) {
            color: #e54545;
            span {
              color: #999;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  .allConMainTwoLeft {
    padding: 20px 0;
    .productRow1 {
      border-right: 1px solid #ddd;
      text-align: center;
      font-size: 12px;
      line-height: 106px;
      span {
        color: #006eff;
        font-size: 18px;
      }
    }
    .productRow2 {
      padding-left: 96px;
      font-size: 12px;
      p {
        margin-bottom: 12px;
        span {
          display: inline-block;
          margin-right: 10px;
        }
        span:nth-child(1) {
          width: 10px;
          height: 10px;
          border-radius: 100%;
        }
      }
      p:nth-child(1) {
        span:nth-child(1) {
          background-color: #0abf5b;
        }
        span:nth-child(3) {
          color: #0abf5b;
        }
      }
      p:nth-child(2) {
        span:nth-child(1) {
          background-color: #888;
        }
        span:nth-child(3) {
          color: #888;
        }
      }
      p:nth-child(3) {
        span:nth-child(1) {
          background-color: #e54545;
        }
        span:nth-child(3) {
          color: #e54545;
        }
      }
      p:nth-child(4) {
        span:nth-child(1) {
          background-color: #e54545;
        }
        span:nth-child(3) {
          color: #e54545;
        }
      }
    }
  }
}
.allConMainThreeTit {
  width: 100%;
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  margin-top: 20px;
  margin-bottom: 12px;
  div:nth-child(1) {
    font-size: 14px;
    font-weight: 600;
    float: left;
  }
  div:nth-child(2).rightCon {
    float: right;
    .downloadTable {
      float: left;
    }
    .rightIptSearch {
      float: left;
      width: 300px;
      height: 30px;
      margin-left: 10px;
      ::v-deep input {
        width: 100%;
        height: 30px;
        border-radius: 0;
        line-height: 30px;
      }
    }
    .searcHBthn {
      float: left;
      margin-top: 14px;
      padding: 0 16px;
      height: 30px;
      line-height: 30px;
      border-radius: 0;
    }
  }
}
.allConMainThreeCon {
  width: 100%;
  min-height: 300px;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  .chartShowTit {
    width: 100%;
    border-bottom: 1px solid #eaeaea;
    height: 35px;
    line-height: 38px;
    margin-top: 20px;
    button {
      padding: 5px 10px;
      border-bottom: 2px solid transparent;
      margin-right: 20px !important;
      border: none;
      border-radius: 0;
      font-weight: 600;
      font-size: 14px;
      color: #000;
      span {
        font-size: 12px;
        color: #888;
      }
    }
    .addColor {
      border-bottom: 2px solid #006eff;
      background-color: transparent;
      font-weight: 600;
      font-size: 14px;
      color: #000;
      span {
        font-weight: 600;
        font-size: 14px;
        color: #000;
      }
    }
  }
}
.tableOverView {
  min-height: 450px;
}
.tabListPage {
  height: 50px;
  text-align: right;
  padding-top: 8px;
  border-top: 1px solid #ddd;
}
</style>
