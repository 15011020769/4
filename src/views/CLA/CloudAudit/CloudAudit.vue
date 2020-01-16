<template>
  <div>
    <div class="title_top">
      <h1>{{ $t('CLA.total.czjl') }}</h1>
    </div>
    <div class="tea-content__body">
      <div class="explain">
        <span>{{ $t('CLA.total.czjlts') }}</span>
      </div>
      <div class="search">
        <div style="display:flex;">
          <div class="search_dropdown">
            <el-select class="childSelect" slot="prepend" v-model="value" @change="_select">
              <el-option
                v-for="(item,index) in this.options"
                :key="index"
                :label="item.Label"
                :value="item.Value"
              ></el-option>
            </el-select>
            <el-input :placeholder="placeholder" v-model="input3" class="inp" @input="_inpChange"></el-input>
            <el-button icon="el-icon-search" @click="seach()"></el-button>
          </div>
          <div class="date">
            <el-date-picker
              v-model="value1"
              type="daterange"
              align="right"
              unlink-panels
              :range-separator="$t('CLA.total.z')"
              :start-placeholder="$t('CLA.total.ksrq')"
              :end-placeholder="$t('CLA.total.jsrq')"
              :picker-options="pickerOptions"
              @change="seach()"
            ></el-date-picker>
          </div>
        </div>

        <div class="updates_download">
          <div class="updates">
            <i class="el-icon-refresh" @click="reload()"></i>
            <i @click="exportExcel" class="el-icon-download" style="margin-left:5px;"></i>
          </div>
        </div>
      </div>
      <div class="tab-list">
        <el-table
          :data="tableData"
          style="width: 100%"
          v-if="isRouterAlive"
          v-loading="vloading"
          :empty-text="$t('CLA.total.zwsj')"
          id="exportTable"
        >
          <el-table-column type="expand" width="27">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item :label="$t('CLA.total.fwmy')">
                  <span>{{ props.row.SecretId }}</span>
                </el-form-item>
                <el-form-item :label="$t('CLA.total.qy')">
                  <span>{{ props.row.EventRegion }}</span>
                </el-form-item>
                <el-form-item :label="$t('CLA.total.cwm')">
                  <span>{{ props.row.ErrorCode }}</span>
                </el-form-item>
                <el-form-item :label="$t('CLA.total.sj')">
                  <span>{{ props.row.EventId }}</span>
                </el-form-item>
                <el-form-item :label="$t('CLA.total.sjmc')">
                  <span>{{ props.row.EventName }}</span>
                </el-form-item>
                <el-form-item :label="$t('CLA.total.sjy')">
                  <span>{{ props.row.EventSource }}</span>
                </el-form-item>
                <el-form-item :label="$t('CLA.total.sjsj')">
                  <span>{{ props.row.EventTime }}</span>
                </el-form-item>
                <el-form-item :label="$t('CLA.total.qq')">
                  <span>{{ props.row.RequestID }}</span>
                </el-form-item>
                <el-form-item :label="$t('CLA.total.ydz')">
                  <span>{{ props.row.SourceIPAddress }}</span>
                </el-form-item>
                <el-form-item :label="$t('CLA.total.yhm')">
                  <span>{{ props.row.Username }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :label="$t('CLA.total.sjsj')" prop="EventTime"></el-table-column>
          <el-table-column :label="$t('CLA.total.yhm')" prop="Username">
            <template slot-scope="scope">
              <p style="color:#006eff">{{scope.row.Username}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('CLA.total.sjmc')" width="300">
            <template slot-scope="scope">
              <div>
                {{scope.row.EventName}}
                <span
                  v-if="!scope.row.EventNameCn == ''"
                >({{scope.row.EventNameCn}})</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('CLA.total.zylx')">
            <template slot-scope="scope">
              <div>
                {{scope.row.Resources.ResourceType}}
                <span
                  v-if="!scope.row.ResourceTypeCn == ''"
                >{{scope.row.ResourceTypeCn}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('CLA.total.zymc')" prop="Resources.ResourceName"></el-table-column>
          <div v-if="Show" slot="append" style="line-height:40px;padding:0 20px;color:#006eff;">
            <p v-show="!loading" @click="more()" style="cursor: pointer;">{{ $t('CLA.total.djjz') }}</p>
            <p v-show="loading" style="width:100%;text-align:center;">
              <i class="el-icon-loading"></i>
              {{ $t('CLA.total.jzz') }}
            </p>
          </div>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips";
import { YJS_LIST, YJS_GETATTRIBUTEKEY } from "@/constants";
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      placeholder: "請輸入內容",
      value1: "", // 日历
      startTime: "", //  搜索 --> 默认开始时间
      endTime: "", //  搜索 --> 默认结束时间
      nowtime: "", // 现在时间
      oldTime: "", // 30天前时间
      isRouterAlive: true,
      loading: false,
      Show: true, // 加载更多
      LookShow: false,
      DownShow: true,
      MaxResults: 10,
      MaxResults1: 10,
      vloading: true,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      options: [], // 下拉框数据
      value: "",
      input3: "", //搜索绑定值
      tableData: []
    };
  },
  created() {
    let myDate = new Date();
    let _nowtime = myDate.getTime() / 1000;
    this.nowtime = parseFloat(_nowtime).toFixed(); // 现在当前时间
    let lw = new Date(myDate - 1000 * 60 * 60 * 24 * 7).getTime() / 1000;
    this.oldTime = parseFloat(lw).toFixed();
    this.Loading();
    this.axios
      .post(YJS_GETATTRIBUTEKEY, {
        Version: "2019-03-19",
        Region: localStorage.getItem("regionv2")
      })
      .then(data => {
        if (data.Response.Error === undefined) {
          this.options = data.Response.AttributeKeyDetails;
        } else {
          let ErrTips = {
            "InternalError.SearchError": "內部錯誤，請聯繫開發人員"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[data.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
  },
  methods: {
    //导出表格
    exportExcel() {
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
          "操作記錄.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    _inpChange() {
      if (this.input3 === "") {
        this.Loading();
      }
    },
    _select(val) {
      if (val == "ReadOnly") {
        this.placeholder = "支持搜索關鍵字為true或false";
      } else {
        this.placeholder = "請輸入內容";
      }
      this.AttributeKey = val;
    },
    //列表数据
    Loading() {
      this.vloading = true;
      const params = {
        Version: "2019-03-19",
        Region: localStorage.getItem("regionv2"),
        EndTime: this.nowtime,
        StartTime: this.oldTime,
        MaxResults: this.MaxResults
      };
      this.axios.post(YJS_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.Events;
          this.loading = false;
          this.vloading = false;
        } else {
          let ErrTips = {
            "InternalError.SearchError": "內部錯誤，請聯繫開發人員",
            "InvalidParameter.Time":
              "必須包含開始時間和結束時間，且必須為整形時間戳（精確到秒）",
            "InvalidParameterValue.MaxResult": "單次檢索支持的最大返回條數是50",
            "InvalidParameterValue.Time": "開始時間不能大於結束時間",
            "InvalidParameterValue.attributeKey":
              "AttributeKey的有效取值範圍是:RequestId、EventName、ReadOnly、Username、ResourceType、ResourceName和AccessKeyId",
            "LimitExceeded.OverTime": "檢索支持的有效時間範圍是7天"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
          this.vloading = false;
        }
      });
    },
    //搜索
    seach() {
      if (
        this.value == "ReadOnly" &&
        this.input3 !== "true" &&
        this.input3 !== "false"
      ) {
        this.$message({
          message: "只读搜索内容为true或false",
          type: "warning",
          showClose: true,
          duration: 0
        });
      } else {
        this.vloading = true;
        let startTime = null;
        let endTime = null;
        if (this.value1 != null) {
          startTime = String(new Date(this.value1[0]).getTime() / 1000).split(
            "."
          )[0];
          endTime = String(new Date(this.value1[1]).getTime() / 1000).split(
            "."
          )[0];
          this.startTime = startTime;
          this.endTime = endTime;
        }
        let params = {
          Version: "2019-03-19",
          Region: localStorage.getItem("regionv2"),
          EndTime: this.nowtime,
          MaxResults: this.MaxResults,
          StartTime: this.oldTime
        };
        if (this.value1) {
          params["EndTime"] = endTime;
          params["StartTime"] = startTime;
        }
        params["LookupAttributes.0.AttributeKey"] = this.AttributeKey;
        params["LookupAttributes.0.AttributeValue"] = this.input3;
        this.axios.post(YJS_LIST, params).then(res => {
          if (res.Response.Error === undefined) {
            this.tableData = res.Response.Events;
            this.loading = false;
            this.vloading = false;
          } else {
            let ErrTips = {
              "InternalError.SearchError": "內部錯誤，請聯繫開發人員",
              "InvalidParameter.Time":
                "必須包含開始時間和結束時間，且必須為整形時間戳（精確到秒）",
              "InvalidParameterValue.MaxResult":
                "單次檢索支持的最大返回條數是50",
              "InvalidParameterValue.Time": "開始時間不能大於結束時間",
              "InvalidParameterValue.attributeKey":
                "AttributeKey的有效取值範圍是:RequestId、EventName、ReadOnly、Username、ResourceType、ResourceName和AccessKeyId",
              "LimitExceeded.OverTime": "檢索支持的有效時間範圍是7天"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
            this.vloading = false;
          }
        });
      }
    },
    //加载更多
    more() {
      this.loading = true;
      this.MaxResults = this.MaxResults + 10;
      this.Loading();
    },
    // 查看事件
    LookShows() {
      this.LookShow = true;
    },
    // 复制成功
    onCopy(e) {
      this.$message({
        message: "複製成功",
        type: "success",
        showClose: true,
        duration: 0
      });
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
        this.Loading();
      });
    }
  }
};
</script>
<style lang="scss">
.search_dropdown {
  width: 485px;

  .btn {
    background: white !important;
    position: absolute;
    right: 50px;
    top: 11px;
    width: 40px;
  }

  .el-select {
    .el-input__inner {
      width: 130px;
    }
  }

  .el-input__inner {
    width: 300px;
    margin-left: -1px;
  }

  .el-input-group__prepend {
    border-radius: 0px;
    width: 105px;
    height: 28px;
    background: #f2f2f2;
    border: 1px solid rgb(221, 221, 221);
  }

  .el-input-group__append {
    width: 0px;
    height: 0px;
    padding: 0px;
    border: 0px;
  }

  .el-input-group__append button.el-button {
    padding: 0px;
    margin-left: -85px;
    padding: 6px 7px;
  }
}

.date {
  .el-date-editor {
    .el-icon-date {
      margin-bottom: 8px;
    }
  }

  .el-range-separator {
    padding: 0;
    margin-bottom: 8px;
  }
}
</style>
<style lang="scss" scoped>
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
  }
}

.search {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .search_dropdown {
    display: flex;
  }

  // .inp{
  //   width: 200px;
  // }
  // .inp >>> .el-input__inner {
  //   width: 200px;
  // }
  .search_dropdown >>> .el-input__inner {
    height: 30px;
    line-height: 30px;
    border-radius: 0px;
  }

  .search_dropdown >>> .el-button {
    height: 30px;
    line-height: 30px;
    border-radius: 0px;
    padding-top: 0;
    font-size: 12px;
    margin-left: -20px;
    position: relative;
    z-index: 100;
  }

  .search_text,
  .search_dropdown {
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      border-radius: 0px;
    }

    .el-input__icon {
      line-height: 30px;
    }

    .el-input {
      width: 300px;
      border-radius: 0px;
    }
  }

  .recent {
    border: 1px solid #006eff;
    background: #fff;
    color: #006eff;
    padding: 0 20px;
    height: 28px;
    font-size: 12px;
    line-height: 28px;
    margin-left: 10px;
    cursor: pointer;
  }

  .date {
    margin-left: -30px;
  }

  .el-date-editor--daterange.el-input__inner {
    width: 287px;
    margin-left: 20px;
  }

  .el-date-editor .el-range__close-icon {
    line-height: 24px;
  }

  .updates_download {
    display: flex;
    // width: 375px;
    justify-content: flex-end;

    .updates {
      margin-right: 5px;
    }

    .download {
      margin-left: 5px;

      .el-button {
        padding: 0px;
        background: transparent;
        border: 0px;
      }

      .el-popper[x-placement^="bottom"] {
        width: 100px !important;
      }
    }

    i {
      font-size: 20px;
      cursor: pointer;
    }
  }
}

.daochu {
  & > a:hover {
    text-decoration: underline;
  }
}

.demo-table-expand >>> .el-form-item__label {
  font-size: 12px;
  width: 80px;
}

.demo-table-expand >>> .el-form-item__content span {
  font-size: 12px;
}

.demo-table-expand >>> .el-form-item__content a {
  font-size: 12px;
}

.tab-list .demo-table-expand label {
  color: #888 !important;
  font-size: 12px !important;
}

.tab-list {
  margin-top: 10px;
  font-size: 12px;

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .event-box {
    position: flex;
    z-index: 10001;

    .event-backdrop {
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
      background-color: #000;
      opacity: 0.5;
      overflow-y: auto;
      z-index: 1000;
    }

    .event-dialog {
      text-align: center;
      z-index: 1001;
      overflow: auto;
      white-space: nowrap;
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;

      .event-dialog-inner {
        text-align: left;
        white-space: normal;
        display: inline-block;
        vertical-align: middle;
        min-width: 420px;
        width: 800px;
        background-color: #fff;
        padding: 25px;
        box-sizing: border-box;
        box-shadow: 1px 1.73px 20px 0 rgba(0, 0, 0, 0.2);

        .event-dialog-header {
          height: 40px;
          display: flex;
          justify-content: space-between;

          & > p {
            font-weight: 700;
            margin-bottom: 14px;
            display: inline-block;
            font-size: 14px;
            line-height: 26px;
          }

          & > i {
            padding: 5px;
            height: 18px;
            cursor: pointer;
            font-size: 18px;
            font-weight: 700;
          }
        }

        .publicCon {
          .copyBox {
            & > p {
              width: 728px;
              height: 258px;
              overflow: auto;
              border: 1px solid #ddd;
              padding: 10px;
            }
          }

          .el-button--text {
            margin-left: 692px;
          }
        }
      }
    }
  }

  .more {
    height: 98px;
    line-height: 98px;
    background: #fff;
    text-align: center;
    font-size: 12px;
  }

  .el-table td {
    font-size: 12px;
    color: #444;
  }

  .tables .demo-table-expand label {
    font-size: 12px;
    color: #888;
  }

  .el-table th > .cell {
    font-size: 12px;
  }

  .el-form--inline .el-form-item__content {
    font-size: 12px;
    color: #444;
  }
}

[class^="el-icon-"] {
  margin-top: 2px;
  cursor: pointer;
}

.date .el-input__inner {
  height: 30px;
  border-radius: 0;
}

.date .el-date-editor .el-range-separator {
  line-height: 22px;
}

.date .el-date-editor .el-range__icon {
  line-height: 22px;
}

.search_dropdown .el-input__inner {
  height: 30px;
  border-radius: 0;
}

.search_dropdown .el-select .el-input .el-select__caret {
  line-height: 28px;
}
</style>
