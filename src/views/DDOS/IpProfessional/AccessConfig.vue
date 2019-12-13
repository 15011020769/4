<template>
  <div class="wrap">
    <HeaderCom title="接入配置" />
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <div class="box" style="padding:0 20px;">
        <el-tab-pane label="非网站业务" name="first">
          <div class="mainContent">
            <el-select
              class="ddosAttackSelect1"
              v-model="resourceId"
              @change="resourceIdChange"
              filterable
              placeholder="请输入要查询的ID或名称"
            >
              <el-option :label="resourceId" :value="resourceId"></el-option>
            </el-select>
          </div>
          <div class="mainContent">
            <div class="topCreateSelect">
              <el-button class="newCreate" @click="newCreate">新建</el-button>
              <el-dropdown trigger="click" class="ddosAttackSelect1 ddosAttackSelect2">
                <span class="el-dropdown-link">
                  批量导入
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="batchImport">导入转发规则</el-dropdown-item>
                  <el-dropdown-item disabled>导入会话保持/健康检查</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown trigger="click" class="ddosAttackSelect1 ddosAttackSelect2">
                <span class="el-dropdown-link">
                  批量导出
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="batchExport">导出转发规则</el-dropdown-item>
                  <el-dropdown-item disabled>导出会话保持/健康检查</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button class="allDeleteBtn" :disabled="true">批量删除</el-button>
            </div>
            <el-table
              class="tableListA"
              :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="RuleName" label="业务域名">
                <template slot-scope="scope">{{scope.row.RuleName}}</template>
              </el-table-column>
              <el-table-column prop="VirtualPort" label="转发协议/端口">
                <template slot-scope="scope">{{scope.row.Protocol}}/{{scope.row.VirtualPort}}</template>
              </el-table-column>
              <el-table-column prop="SourcePort" label="源站端口">
                <template slot-scope="scope">{{scope.row.SourcePort}}</template>
              </el-table-column>
              <el-table-column prop="SourceList" label="源站IP/域名">
                <template slot-scope="scope">
                  <span
                    v-for="(item, index) in scope.row.SourceList"
                    :key="index"
                  >{{scope.row.SourceList[index].Source}}({{scope.row.SourceList[index].Weight}});</span>
                </template>
              </el-table-column>
              <el-table-column prop="LbType" label="负载均衡方式">
                <template slot-scope="scope">
                  <span v-if="scope.row.LbType == 1">加权轮询</span>
                  <span v-else>{{scope.row.LbType}}</span>
                </template>
              </el-table-column>
              <el-table-column prop label="健康检查">
                <template slot-scope="scope">暂不支持</template>
              </el-table-column>
              <el-table-column prop="KeepEnable" label="会话保持">
                <template slot-scope="scope">
                  暂不支持
                  <!-- <span v-if="scope.row.KeepEnable == 0">关闭</span>
                  <span v-else-if="scope.row.KeepEnable == 1">开启</span>-->
                </template>
              </el-table-column>
              <el-table-column prop="RemoveSwitch" label="水印剥离状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.RemoveSwitch == 0">关闭</span>
                  <span v-else-if="scope.row.RemoveSwitch == 1">开启</span>
                </template>
              </el-table-column>
              <el-table-column prop="attackAction" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="editAccess(scope.row)">编辑</el-button>
                  <el-button type="text" size="small" @click="copyAccess(scope.row)">复制</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteAccess(scope.row,scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="tabListPage">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItems"
              ></el-pagination>
            </div>
            <p
              class="pContent"
            >配置规则总数为 {{ruleTotalNum}} ，已用 {{usedNum}} ，可用 {{ruleTotalNum-usedNum}}</p>
          </div>
          <!-- 新建规则弹框 -->
          <newAddRules
            :isShow="dialogVisible"
            :resourceId="resourceId"
            @addRulesSure="addRulesSure"
            @closeModel="closeModel"
          />
          <!-- 批量导入弹框 -->
          <batchImport
            :isShow1="dialogVisible1"
            :resourceId="resourceId"
            @batchImportSure="batchImportSure"
            @closeModelIpt="closeModelIpt"
          />
          <!-- 批量导出弹框 -->
          <batchExport
            :isShow2="dialogVisible2"
            :resourceId="resourceId"
            :exportText="exportText"
            @batchExportSure="batchExportSure"
            @closeModelExp="closeModelExp"
          />
          <!-- 编辑弹框 -->
          <accessConfigEdit
            :isShow3="dialogVisible3"
            :resourceId="resourceId"
            @closeEditModel="closeEditModel"
            ref="addOrUpdate"
          />
          <!-- 复制弹框 -->
          <accessConfigCopy
            :isShow4="dialogVisible4"
            :resourceId="resourceId"
            @closeCopyModel="closeCopyModel"
            ref="addOrUpdate1"
          />
          <!-- 删除弹框 -->
          <el-dialog
            class="dialogModel"
            title="添加转发规则"
            :visible.sync="dialogDelete"
            width="30%"
            :before-close="handleCloseDelete"
          >
            <p>确定删除该条转发规则？</p>
            <span class="footerBtn">
              <el-button @click="deleteSure">确定</el-button>
              <el-button @click="dialogDelete=false">取消</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>
<script>
import HeaderCom from "../../CLA/Public/Head";
import newAddRules from "./model/newAddRules";
import batchImport from "./model/batchImport";
import batchExport from "./model/batchExport";
import accessConfigEdit from "./model/accessConfigEdit";
import accessConfigCopy from "./model/accessConfigCopy";
import { RESOURCE_LIST, L4_RULES, L4DEL_CREATE, GET_ID } from "@/constants";
export default {
  data() {
    return {
      activeName: "first", //tab
      resourceId: "", //资源ID，输入要查询的ID或名称
      tableDataBegin: [], //table绑定数据，L4规则列表
      dialogVisible: false, //新建规则弹框
      dialogVisible1: false, //批量导入弹框
      dialogVisible2: false, //批量导出弹框
      exportText: "",
      // 分页
      currentPage: 1, //当前页
      pageSize: 10, //每页长度
      totalItems: 0, //总长度
      ruleTotalNum: 60, //配置规则总数
      usedNum: 0, //已用

      tableDataEnd: [],
      flag: false,
      multipleTable: [], //table ref属性
      dialogVisible3: false, //编辑弹框
      dialogVisible4: false, //复制弹框
      dialogDelete: false, //删除弹框
      deleteIndex: ""
    };
  },
  components: {
    HeaderCom: HeaderCom,
    newAddRules: newAddRules,
    batchImport: batchImport,
    batchExport: batchExport,
    accessConfigEdit: accessConfigEdit, //编辑弹框
    accessConfigCopy: accessConfigCopy //复制弹框
  },
  created() {
    this.describeResourceList();
    // this.describleL4Rules()
    this.GetID(); //获取资源的IP列表
  },
  //父页面获取L4转发规则的方法
  provide() {
    return {
      describleL4Rules: this.describleL4Rules
    };
  },
  methods: {
    // 1.1.获取资源列表
    describeResourceList() {
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      this.axios.post(RESOURCE_LIST, params).then(res => {
        // console.log(res)
      });
    },
    // 1.2.获取L4转发规则
    describleL4Rules() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.resourceId
      };
      this.axios.post(L4_RULES, params).then(res => {
        // console.log(res)
        this.tableDataBegin = res.Response.Rules;
        this.totalItems = res.Response.Total;
        this.usedNum = res.Response.Total;
      });
    },
    //获取资源的IP列表
    GetID() {
      let params = {
        Version: "2018-07-09",
        Business: "net"
      };
      this.axios.post(GET_ID, params).then(res => {
        let IpList = res.Response.Resource;
        for (let i = 0; i < IpList.length; i++) {
          this.resourceId = IpList[i].Id;
          this.describleL4Rules();
        }
      });
    },
    // 跳转新购页面
    newBuy() {
      let routeUrl = this.$router.resolve({
        path: "/choose"
      });
      window.open(routeUrl.href, "_blank");
    },

    //请输入要查询的ID或名称
    resourceIdChange() {},
    handleClick() {},
    //分页开始
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
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
    },
    //table checkbox相关事件
    handleSelectionChange(val) {
      this.multipleTable = val;
    },
    //新建按钮弹框
    newCreate() {
      this.dialogVisible = true;
    },
    //新建规则弹框确定按钮
    addRulesSure(isShowFalse) {
      // console.log(isShowFalse)
      this.dialogVisible = isShowFalse;
    },
    //弹框关闭按钮
    closeModel(isShowFalse) {
      this.dialogVisible = isShowFalse;
    },
    // 批量导入按钮
    batchImport() {
      this.dialogVisible1 = true;
    },
    // 批量导入确定按钮
    batchImportSure(isShowFalse) {
      this.dialogVisible1 = isShowFalse;
    },
    //批量导入弹框关闭按钮
    closeModelIpt(isShowFalse) {
      this.dialogVisible1 = isShowFalse;
    },
    // 批量导出按钮
    batchExport() {
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.resourceId
      };
      this.axios.post(L4_RULES, params).then(res => {
        // console.log(res)//test.cn TCP 1666 1888 1.1.1.10 80,1.1.1.20 50
        let str = "";
        let arr = [];
        arr = res.Response.Rules;
        for (let i in arr) {
          str =
            str +
            arr[i].RuleName +
            " " +
            arr[i].Protocol +
            " " +
            arr[i].VirtualPort +
            " " +
            arr[i].SourcePort;
          for (let j in arr[i].SourceList) {
            if (j > 0) {
              str = str + ",";
            }
            str =
              str +
              " " +
              arr[i].SourceList[j].Source +
              " " +
              arr[i].SourceList[j].Weight;
          }
          str = str + "\r\n";
        }
        this.exportText = str + "";
      });
      this.dialogVisible2 = true;
    },
    // 批量导出确定按钮
    batchExportSure(isShowFalse) {
      this.dialogVisible2 = isShowFalse;
    },
    //批量导出弹框关闭按钮
    closeModelExp(isShowFalse) {
      this.dialogVisible2 = isShowFalse;
    },
    //编辑列表按钮
    editAccess(scopeRow) {
      // console.log(scopeRow)//这块可以做数据回显，拿到的是那一行的数据
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(scopeRow);
      });

      this.dialogVisible3 = true;
    },
    //关闭编辑弹框
    closeEditModel(isShow) {
      this.dialogVisible3 = isShow;
    },
    //复制列表按钮
    copyAccess(scopeRow) {
      // console.log(scopeRow)//这块可以做数据回显，拿到的是那一行的数据
      this.dialogVisible4 = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate1.init(scopeRow);
      });
    },
    //关闭复制弹框
    closeCopyModel(isShow) {
      this.dialogVisible4 = isShow;
    },
    //删除按钮
    deleteAccess(scopeRow, index) {
      this.dialogDelete = true;
      this.deleteIndex = index;
    },
    //关闭删除弹框
    handleCloseDelete() {
      this.dialogDelete = false;
    },
    //删除确定按钮
    deleteSure() {
      this.dialogDelete = false;
      let params = {
        Version: "2018-07-09",
        Business: "net",
        Id: this.resourceId,
        "RuleIdList.0": this.tableDataBegin[this.deleteIndex].RuleId
      };
      // console.log(this.deleteIndex)
      // params['RuleIdList.'+0] = this.tableDataBegin[this.deleteIndex].RuleId
      this.axios.post(L4DEL_CREATE, params).then(res => {
        // console.log(res)
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.describleL4Rules();
        }
      });
      // this.tableDataBegin.splice("")
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-tabs__nav-wrap {
  background: white;
  padding: 0 15px;
  box-sizing: border-box;
}
.wrap >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  border-radius: 0;
}
.newClear {
  content: "";
  display: block;
  clear: both;
}
.statistReportTit {
  width: 100%;
  height: 84px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 12px 20px 0;
  .ReportTitH3 {
    float: left;
    font-size: 16px;
    font-weight: 600;
  }
  .ReportTitBtn {
    float: right;
    height: 32px;
    line-height: 32px;
    padding: 0;
  }
}
.mainContent {
  width: 100%;
  min-height: 100px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  margin-bottom: 20px;
  .mainConListOneIpt {
    width: 200px;
    input {
      width: 200px;
    }
  }
}
button.newCreate {
  background-color: #006eff;
  color: #fff;
  border-radius: 0;
  padding: 0;
  width: 56px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  outline: none;
  margin-right: 10px;
}
.ddosAttackSelect2 {
  width: 100px !important;
  height: 30px;
  border: 1px solid #ddd;
  text-align: center;
  line-height: 30px;
  div {
    width: 100px !important;
    input {
      width: 100px !important;
      font-size: 12px;
    }
  }
}
button.allDeleteBtn {
  width: 80px;
  border: 1px solid #ddd;
  border-radius: 0;
  height: 30px;
  text-align: center;
  line-height: 30px;
  padding: 0;
}
.pContent {
  font-size: 12px;
  color: #999;
}
.tableListA {
  min-height: 450px;
}
</style>