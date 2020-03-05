<template>
  <div id="urlWhitelist">
    <div class="urlWhitelist">
      <div class="urlWhitelistBtn newClear">
        <el-button class="addUrlBtn" @click="addIpBlackModel">添加IP</el-button>
        <el-button class="exportBtn" @click="importBtn">{{$t('DDOS.Proteccon_figura.Batch_import')}}</el-button>
        <el-button class="importBtn" @click="exportBtn">{{$t('DDOS.Proteccon_figura.Batch_export')}}</el-button>
        <el-button @click="deleteList">{{$t('DDOS.Proteccon_figura.Delete')}}</el-button>
        <span class="addTip">{{$t('DDOS.Proteccon_figura.Uptoadded')}}</span>
        <el-radio label="HTTP" v-model="radioHttp" value="1" class="httpRadio"></el-radio>
      </div>
      <div class="urlWhitelistTable">
        <div class="tableListUrl">
          <el-table
            :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            @selection-change="handleSelectionChange"
            style="width: 100%;margin: 18px 0 20px;"
            v-loading="loading" 
            empty-text='暫無數據'
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="IP" label="IP" width>
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.Record" :key="index">
                  <span v-if="item['Key'] == 'ip'">{{item['Value']}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="protocol" :label="$t('DDOS.Proteccon_figura.Agreement')">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.Record" :key="index">
                  <span v-if="item['Key'] == 'protocol'">{{item['Value']}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="domain" label="域名">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.Record" :key="index">
                  <span v-if="item['Key'] == 'domain'">{{item['Value']}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  @click="deleteRow(scope.row)"
                  type="text"
                  size="small"
                  style="color: red;"
                >{{$t('DDOS.AccesstoCon.AccDel')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="Right-style pagstyle">
          <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;{{$t('DDOS.UnsealCode.tiao')}}</span>
          <el-pagination
            :page-size="pageSize"
            :pager-count="7"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="totalItems"
          ></el-pagination>
        </div>
        <addIpBlackModel
          :ccResourceId="ccResourceId"
          :isShow1="dialogModel1"
          @closeModel1="closeModel1"
          @addIpBlackSure="addIpBlackSure"
        />
        <importIpBlack
          :isShow2="dialogModel2"
          @closeModel2="closeModel2"
          @importIpBlackSure="importIpBlackSure"
        />
        <exportIpBlack
          :isShow3="dialogModel3"
          :exportText="ipListString"
          @closeModel3="closeModel3"
        />
      </div>
    </div>
  </div>
</template>
<script>
import addIpBlackModel from "./model/addIpBlackModel";
import importIpBlack from "./model/importIpBlack";
import exportIpBlack from "./model/exportIpBlack";
import { CC_IPALLOWDENY, CCIPALLOWDENY_MODIFY } from "@/constants";
export default {
  props: {
    ccResourceId: String, //资源ID
    switchState: Boolean //防护状态
  },
  data() {
    return {
      loading: true,
      tableDataBegin: [], //表格数据
      method: "", //add表示添加，delete表示删除
      tableDataEnd: [], //定义一个数组
      tableSelect: [], //选中的数组
      currentPage: 1, //当前页
      pageSize: 10, //每页长度
      totalItems: 0, //总数
      filterTableDataEnd: [], //过滤后的数组
      flag: false,
      radioHttp: "HTTP", //默认HTTP
      dialogModel1: false, //添加IP弹出框
      dialogModel2: false, //批量导入IP弹出框
      dialogModel3: false, //批量导出IP弹出框
      ipListString: ""
    };
  },
  components: {
    addIpBlackModel: addIpBlackModel,
    importIpBlack: importIpBlack,
    exportIpBlack: exportIpBlack
  },
  watch: {
    ccResourceId(val) {
      this.ccResourceId = val;
      this.describeCCIpAllowDeny();
    }
  },
  created() {
    if (this.ccResourceId != undefined && this.ccResourceId != "") {
      this.describeCCIpAllowDeny();
    }
  },
  methods: {
    // 1.1.获取CC的IP黑白名单
    describeCCIpAllowDeny() {
      this.loading = true;
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.ccResourceId,
        "Type.0": "black"
      };
      this.axios.post(CC_IPALLOWDENY, params).then(res => {
        // console.log(params, res);
        this.tableDataBegin = res.Response.RecordList;
        this.totalItems = res.Response.RecordList.length;
        this.loading = false;
      });
    },
    // 1.2.添加或删除CC的IP黑白名单
    modifyCCIpAllowDeny(ipList) {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.ccResourceId,
        Method: this.method, //add表示添加，delete表示删除
        Type: "black"
      };
      for (let i = 0; i < ipList.length; i++) {
        params["IpList." + i] = ipList[i];
      }
      // console.log(params)
      if (params["IpList.0"] != undefined) {
        this.axios.post(CCIPALLOWDENY_MODIFY, params).then(res => {
          if (res.Response.Error) {
            if (this.method == "delete") {
              this.$message.error("刪除失敗");
            } else if (this.method == "add") {
              if (res.Response.Error.Code == "InvalidParameterValue") {
                this.$message.error("添加失敗，參數錯誤");
              } else {
                this.$message.error("添加失敗");
              }
            }
          } else {
            if (this.method == "delete") {
              this.$message({
                message: "刪除成功",
                type: "success"
              });
            } else if (this.method == "add") {
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
          }
        });
        setTimeout(() => {
          this.describeCCIpAllowDeny();
        }, 1000);
      }
    },
    // table行内删除
    deleteRow(obj) {
      this.$confirm("此操作將永久刪除, 是否繼續?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.method = "delete";
          let ipList = [];
          for (let i = 0; i < obj.Record.length; i++) {
            if ("ip" == obj.Record[i].Key) {
              ipList.push(obj.Record[i].Value);
            }
          }
          this.modifyCCIpAllowDeny(ipList);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消刪除"
          });
        });
    },
    //添加IP按钮
    addIpBlackModel() {
      //判断防护状态
      if (!this.switchState) {
        this.$message("該資源尚未開啟CC防護，不能添加黑白名單");
      } else if (this.switchState) {
        this.dialogModel1 = true;
      }
    },
    //关闭添加IP弹框
    closeModel1(isShow1) {
      this.dialogModel1 = isShow1;
    },
    //添加IP确定按钮
    addIpBlackSure(isShow1) {
      this.dialogModel1 = isShow1;
      setTimeout(() => {
        this.describeCCIpAllowDeny();
      }, 1000);
    },
    //批量导入按钮
    importBtn() {
      //判断防护状态
      if (!this.switchState) {
        this.$message("該資源尚未開啟CC防護，不能添加黑白名單");
      } else if (this.switchState) {
        this.dialogModel2 = true;
      }
    },
    //关闭批量导入IP弹框
    closeModel2(isShow2) {
      this.dialogModel2 = isShow2;
    },
    //确定批量导入确定按钮
    importIpBlackSure(arr) {
      this.method = "add";
      let ipList = arr[1].split("\n");
      this.modifyCCIpAllowDeny(ipList);
      this.dialogModel2 = arr[0];
    },
    //批量导出按钮
    exportBtn() {
      this.ipListString = "";
      for (let i = 0; i < this.tableDataBegin.length; i++) {
        for (let j = 0; j < this.tableDataBegin[i].Record.length; j++) {
          if ("ip" == this.tableDataBegin[i].Record[j].Key) {
            this.ipListString +=
              this.tableDataBegin[i].Record[j].Value + "\r\n";
          }
        }
      }
      this.dialogModel3 = true;
    },
    //关闭批量导入IP弹框
    closeModel3(isShow3) {
      this.dialogModel3 = isShow3;
    },
    // 批量删除
    deleteList() {
      if (this.tableSelect.length > 0) {
        this.$confirm("此操作將永久刪除, 是否繼續?", "提示", {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.method = "delete";
            let ipList = [];
            for (let i = 0; i < this.tableSelect.length; i++) {
              for (let j = 0; j < this.tableSelect[i].Record.length; j++) {
                if ("ip" == this.tableSelect[i].Record[j].Key) {
                  ipList.push(this.tableSelect[i].Record[j].Value);
                }
              }
            }
            this.modifyCCIpAllowDeny(ipList);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消刪除"
            });
          });
      } else {
        this.$message("請選擇要刪除的IP名單");
      }
    },
    //全选
    handleSelectionChange(val) {
      this.tableSelect = val;
    },
    // 分页开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    }
  }
};
</script>
<style lang="scss">
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
#urlWhitelist {
  .urlWhitelist {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .urlWhitelistBtn {
    button {
      height: 30px;
      border-radius: 0;
      padding: 0 20px;
    }
    .addUrlBtn {
      background-color: #006eff;
      color: #fff;
    }
    .addTip {
      color: #8f9297;
      font-size: 14px;
      margin-left: 25px;
    }
    .httpRadio {
      float: right;
    }
  }
  .urlWhitelistTable {
    margin-top: 10px;
    min-height: 500px;
    background-color: #fff;
    .tableListUrl {
      min-height: 450px;
    }
    .tabListPage {
      height: 50px;
      padding-top: 8px;
      border-top: 1px solid #ddd;
      text-align: right;
    }
  }
  .httpCheck {
    span:nth-child(1).checkSpan1 {
      float: left;
      font-size: 12px;
      color: #999;
      width: 40px;
    }
    span:nth-child(2).checkSpan2 {
      float: left;
      width: calc(100% - 40px);
    }
  }
  .blueTip {
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    margin: 16px 0;
  }
  .addUrlBox {
    h3 {
      font-size: 16px;
      font-weight: 100;
      margin: 10px 0 16px;
    }
    .tableUrl {
      height: 200px;
      overflow: auto;
      table {
        overflow: auto;
        width: 100%;
        .bodyCon {
          margin-bottom: 12px;
          .inputChange {
            width: 85%;
            height: 20px !important;
            input {
              width: 100%;
              height: 20px !important;
            }
          }
        }
      }
    }
    .addNewRowUrl {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      color: #fff;
      background-color: #006eff;
      width: 76px;
      text-align: center;
    }
  }
  .el-dialog__header {
    font-size: 14px;
    font-weight: 600;
    .el-dialog__title {
      font-size: 14px;
      font-weight: 600;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }
}
</style>