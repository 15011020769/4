<template>
  <div>
    <div class="title_top">
      <h1>操作记录</h1>
    </div>
    <div class="tea-content__body">
      <div class="explain">
        <span>以下列表包括了过去 30 天内 API 活动的支持服务。您可以使用可用属性来筛选列表，同时您可以选择一个事件来查看更多的事件细节。</span>
        <a href="javascript:;">访问旧版操作日志</a>
      </div>
      <div class="search">
        <div class="search_dropdown">
          <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
            <el-select class="childSelect" slot="prepend" v-model="value" @change="_select">
              <el-option
                v-for="(item,index) in this.options"
                :key="index"
                :label="item.Label"
                :value="item.Value"
              ></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="seach()" class="btn"></el-button>
          </el-input>
        </div>
        <div class="date">
          <el-date-picker
            v-model="value1"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="seach()"
          ></el-date-picker>
        </div>
        <div class="updates_download">
          <div class="updates" @click="reload ()">
            <i class="el-icon-refresh"></i>
          </div>
        </div>
      </div>
      <div class="tab-list">
        <el-table :data="tableData" style="width: 100%" v-if="isRouterAlive" v-loading="vloading">
          <el-table-column type="expand" width="27">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="访问密钥">
                  <span>{{ props.row.SecretId }}</span>
                </el-form-item>
                <el-form-item label="区域">
                  <span>{{ props.row.EventRegion }}</span>
                </el-form-item>
                <el-form-item label="错误码">
                  <span>{{ props.row.ErrorCode }}</span>
                </el-form-item>
                <el-form-item label="事件 ID">
                  <span>{{ props.row.EventId }}</span>
                </el-form-item>
                <el-form-item label="事件名称">
                  <span>{{ props.row.EventName }}</span>
                </el-form-item>
                <el-form-item label="事件源">
                  <span>{{ props.row.EventSource }}</span>
                </el-form-item>
                <el-form-item label="事件时间">
                  <span>{{ props.row.EventTime }}</span>
                </el-form-item>
                <el-form-item label="请求 ID">
                  <span>{{ props.row.RequestID }}</span>
                </el-form-item>
                <el-form-item label="源 IP 地址">
                  <span>{{ props.row.SourceIPAddress }}</span>
                </el-form-item>
                <el-form-item label="用户名">
                  <span>{{ props.row.Username }}</span>
                </el-form-item>
                <el-form-item>
                  <a href="javascript:;" @click="LookShows()">查看事件</a>
                  <div class="event-box" v-if="LookShow">
                    <div class="event-backdrop"></div>
                    <div class="event-dialog">
                      <div class="event-dialog-inner">
                        <div class="event-dialog-header">
                          <p>查看事件</p>
                          <i class="el-icon-close" @click="LookShow = false"></i>
                        </div>
                        <div class="wxsmallcode-page publicCon">
                          <div class="copyBox">
                            <el-button
                              class="ml10"
                              type="text"
                              size="medium"
                              v-clipboard:copy="props.row.CloudAuditEvent"
                              v-clipboard:success="onCopy"
                              v-clipboard:error="onError"
                              :plain="true"
                            >复制代码</el-button>
                            <p>
                              <json-viewer :value=" JSON.parse(props.row.CloudAuditEvent)"></json-viewer>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="事件时间" prop="EventTime"></el-table-column>
          <el-table-column label="用户名" prop="Username">
            <template slot-scope="scope">
              <p style="color:#006eff">{{scope.row.Username}}</p>
            </template>
          </el-table-column>
          <el-table-column label="事件名称">
            <template slot-scope="scope">
              <div>
                {{scope.row.EventName}}
                <span
                  v-if="!scope.row.EventNameCn == ''"
                >({{scope.row.EventNameCn}})</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="资源类型">
            <template slot-scope="scope">
              <div>
                {{scope.row.Resources.ResourceType}}
                <span
                  v-if="!scope.row.ResourceTypeCn == ''"
                >{{scope.row.ResourceTypeCn}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="资源名称" prop="Resources.ResourceName"></el-table-column>
          <p
            v-if="Show"
            slot="append"
            style="text-align:center; line-height:80px;"
            v-loading="loading"
          >
            <a href="javascript:;" @click="more()" class="blue01">点击加载更多</a>
          </p>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { YJS_LIST, YJS_GETATTRIBUTEKEY } from "@/constants";
export default {
  data() {
    return {
      value1: "", // 日历
      startTime: "", //  搜索 --> 默认开始时间
      endTime: "", //  搜索 --> 默认结束时间
      nowtime: "", // 现在时间
      oldTime: "", // 30天前时间
      isRouterAlive: true,
      loading: false,
      Show: false, // 加载更多
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
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      options: [], // 下拉框数据
      value: "",
      input3: "",
      tableData: []
    };
  },
  created() {
    let myDate = new Date();
    let _nowtime = myDate.getTime() / 1000;
    this.nowtime = parseFloat(_nowtime).toFixed(); // 现在当前时间
    let lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30).getTime() / 1000;
    this.oldTime = parseFloat(lw).toFixed();
    this.Loading();
    this.axios
      .post(YJS_GETATTRIBUTEKEY, {
        Version: "2019-03-19",
        Region: "ap-guangzhou"
      })
      .then(data => {
        this.options = data.Response.AttributeKeyDetails;
      });
  },
  methods: {
    _select(val) {
      this.AttributeKey = val;
    },
    //列表数据
    Loading() {
      let params = {
        Version: "2019-03-19",
        Region: "ap-taipei",
        StartTime: this.oldTime, // 开始时间
        EndTime: this.nowtime, // 结束时间1558108799
        MaxResults: this.MaxResults
      };
      this.axios.post(YJS_LIST, params).then(res => {
        if (res.codeDesc == "Success") {
          this.tableData = res.data.Events;
          this.vloading = false;
        }
      });
    },
    //搜索
    seach() {
      this.vloading = true;
      let startTime = String(new Date(this.value1[0]).getTime() / 1000).split(
        "."
      )[0];
      let endTime = String(new Date(this.value1[1]).getTime() / 1000).split(
        "."
      )[0];
      let params = {
        Version: "2019-03-19",
        Region: "ap-taipei",
        EndTime: endTime == NaN ? endTime : this.nowtime,
        MaxResults: this.MaxResults,
        StartTime: startTime == NaN ? startTime : this.oldTime
      };
      params["LookupAttributes.0.AttributeKey"] = this.AttributeKey;
      params["LookupAttributes.0.AttributeValue"] = this.input3;
      this.axios.post(YJS_LIST, params).then(data => {
        if (data.codeDesc == "Success") {
          this.tableData = data.data.Events;
          this.vloading = false;
        } else {
          this.$message({
            showClose: true,
            message: data.message,
            type: "error"
          });
          this.vloading = false;
        }
        if (this.tableData.length == 0 || this.tableData.length < 10) {
          this.Show = false;
        }
      });
    },
    //加载更多
    more() {
      this.loading = true;
      this.MaxResults = this.MaxResults1 += 10;
      this.Loading();
      let startTime = new Date(this.value1[0]).getTime() / 1000;
      if (!startTime == NaN) {
        this.seach();
      }
    },
    // 查看事件
    LookShows() {
      this.LookShow = true;
    },
    // 复制成功
    onCopy(e) {
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
    // 复制失败
    onError(e) {
      this.$message({
        message: "复制失败",
        type: "error"
      });
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
        this.seach();
      });
    }
  }
};
</script>
<style lang="scss" >
.search_dropdown {
  width: 485px;
  .btn{
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
<style lang="scss" scoped >
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
  .search_dropdown {
    width: 485px;
  }
  .search_text {
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
  }
  .el-date-editor .el-range__close-icon {
    line-height: 24px;
  }
  .updates_download {
    display: flex;
    width: 375px;
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
