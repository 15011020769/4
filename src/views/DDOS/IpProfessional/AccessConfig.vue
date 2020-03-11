<template>
<!-- 接入配置 -->
  <div class="wrap">
    <h3 class="ReportTitH3">
      {{ $t("DDOS.AccesstoCon.AccessConfig") }}
    </h3>
    <!-- 新购 -->
    <el-button class="ReportTitBtn" type="primary" @click="newBuy">{{$t('DDOS.total.new_buy')}}</el-button>
    <br/>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <div class="box" style="padding:0 20px;">
        <el-tab-pane :label="$t('DDOS.AccesstoCon.NonWebsite')" name="first">
          <div class="mainContent">
            <el-select
              class="ddosAttackSelect1"
              v-model="resourceId"
              @change="resourceIdChange"
              filterable
              :placeholder="$t('DDOS.AccesstoCon.searchAccess')"
            >
              <el-option
                v-for="(item, index) in resList"
                :label="item.Id +'/'+ item.Name"
                :value="item.Id"
                :key="index"
              ></el-option>
            </el-select>
          </div>
          <div class="mainContent" v-if="resList.length !== 0">
            <div class="topCreateSelect">
              <el-button
                class="newCreate"
                @click="newCreate"
              >{{$t('DDOS.AccesstoCon.addNewAccess')}}</el-button>
              <el-dropdown trigger="click" class="ddosAttackSelect1 ddosAttackSelect2">
                <span class="el-dropdown-link">
                  {{$t('DDOS.AccesstoCon.BulkImport')}}
                  <i
                    class="el-icon-caret-bottom el-icon--right"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="batchImport"
                  >{{$t('DDOS.AccesstoCon.Importforward')}}</el-dropdown-item>
                  <el-dropdown-item disabled>{{$t('DDOS.AccesstoCon.ImportTitle')}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown trigger="click" class="ddosAttackSelect1 ddosAttackSelect2">
                <span class="el-dropdown-link">
                  {{$t('DDOS.AccesstoCon.BulkOut')}}
                  <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="batchExport"
                  >{{$t('DDOS.AccesstoCon.ImportforwardOut')}}</el-dropdown-item>
                  <el-dropdown-item disabled>{{$t('DDOS.AccesstoCon.ImportTitleIn')}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- 批量删除 -->
              <!-- :disabled="partDelFlag" -->
              <el-button class="allDeleteBtn"  @click="partDel">{{$t('DDOS.AccesstoCon.delMoreAcc')}}</el-button>
            </div>
            <el-table
              class="tableListA"
              :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              ref="multipleTable"
              v-on:select="checkBoxClick"
              @select-all="checkBoxAll"
              @selection-change="handleSelectionChange"
              v-loading="loading"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="RuleName" :label="$t('DDOS.AccesstoCon.businessDoma')">
                <template slot-scope="scope">{{scope.row.RuleName}}</template>
              </el-table-column>
              <el-table-column prop="VirtualPort" :label="$t('DDOS.AccesstoCon.ForwardPort')">
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
                  >{{scope.row.SourceList[index].Source}}{{scope.row.SourceType == 1?'':'('+scope.row.SourceList[index].Weight+')'}};</span>
                </template>
              </el-table-column>
              <el-table-column prop="LbType" :label="$t('DDOS.AccesstoCon.LoadBalancing')">
                <template slot-scope="scope">
                  <span v-if="scope.row.LbType == 1">{{$t('DDOS.AccesstoCon.WeightedPoll')}}</span>
                  <span v-else>{{scope.row.LbType}}</span>
                </template>
              </el-table-column>
              <el-table-column prop :label="$t('DDOS.AccesstoCon.HealthCheck')">
                <template >{{$t('DDOS.AccesstoCon.Temporary')}}</template>
              </el-table-column>
              <el-table-column prop="KeepEnable" :label="$t('DDOS.AccesstoCon.KeepSession')">
                <template >{{$t('DDOS.AccesstoCon.Temporary')}}</template>
              </el-table-column>
              <el-table-column prop="RemoveSwitch" :label="$t('DDOS.AccesstoCon.WatermarkState')">
                <template slot-scope="scope">
                  <span v-if="scope.row.RemoveSwitch == 0">{{$t('DDOS.AccesstoCon.AccClose')}}</span>
                  <span v-else-if="scope.row.RemoveSwitch == 1">{{$t('DDOS.AccesstoCon.AccOpen')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="attackAction" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="editAccess(scope.row)"
                  >{{$t('DDOS.AccesstoCon.AccUpdate')}}</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="copyAccess(scope.row)"
                  >{{$t('DDOS.AccesstoCon.AccClone')}}</el-button>
                  <!-- 删除 -->
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteAccess(scope.row,scope.$index)"
                  >{{$t('DDOS.AccesstoCon.AccDel')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="Right-style pagstyle" style="display:flex;align-items:center;">
              <p
                class="pContent"
                style="margin-right:20px;"
              >{{$t('DDOS.AccesstoCon.AccSum')}} {{ruleTotalNum}} ，已用 {{usedNum}} ，可用 {{ruleTotalNum-usedNum}}</p>
              <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;{{$t('DDOS.UnsealCode.tiao')}}</span>
              <el-pagination
                :page-size="pageSize"
                :pager-count="7"
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="totalItems"
              ></el-pagination>
            </div>
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
            :title="$t('DDOS.AccesstoCon.addAcc')"
            :visible.sync="dialogDelete"
            width="30%"
            :before-close="handleCloseDelete"
          >
            <p>{{$t('DDOS.AccesstoCon.AccSureSel')}}</p>
            <span class="footerBtn">
              <el-button @click="deleteSure">{{$t('DDOS.AccesstoCon.ImSure')}}</el-button>
              <el-button @click="dialogDelete=false">取消</el-button>
            </span>
          </el-dialog>
          <!-- 批量删除弹框 -->
            <!-- :title="$t('DDOS.AccesstoCon.addAcc')" -->
          <el-dialog
            class="dialogModel"
            :title="$t('DDOS.updateddos.plsczfgz')"
            :visible.sync="dialogDelete_2"
            width="30%"
            :before-close="handleCloseDelete"
          >
            <p>{{$t('DDOS.updateddos.qdplsczfgz')}}</p>
            <span class="footerBtn">
              <el-button @click="deleteSurePart">{{$t('DDOS.AccesstoCon.ImSure')}}</el-button>
              <el-button @click="dialogDelete_2=false,partD2=[]">取消</el-button>
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
import { ErrorTips } from "@/components/ErrorTips";
export default {
  data() {
    return {
      loading: true,
      activeName: "first", //tab
      resList: [], //转化后的资源列表[id/name]
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
      dialogDelete_2:false,//批量删除弹框
      partD2:[],//接收所有要删除数据的id
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
        Region: localStorage.getItem("regionv2"),
        Business: "net"
      };
      this.axios.post(RESOURCE_LIST, params).then(res => {
        // console.log(res)
        if (res.Response.Error === undefined) {
          this.resList = [];
          const resourceList = res.Response.ServicePacks;
          if (resourceList.length === 0) {
            this.$message({
              message: '暫無服務',
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          resourceList.forEach(val => {
            const obj = {
              Id: "",
              Name: ""
            }
            val.Record.forEach(item => {
              if (item.Key == "Id") {
                obj.Id = item.Value;
              } else if (item.Key == "Name") {
                obj.Name = item.Value;
              }
            });
            this.resList.push(obj);
          });
          // 判断是从‘资产列表-资源列表’跳转的，还是目录跳转的
          if(this.$route.query.resourceId === undefined){
            this.resourceId = this.resList[0].Id;
          } else {
            this.resourceId = this.$route.query.resourceId;
          }
          if(this.resourceId == "") {
            this.loading = false;
          } else {
            this.describleL4Rules();
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
    // 1.2.获取L4转发规则
    describleL4Rules() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.resourceId
      };
      this.axios.post(L4_RULES, params).then(res => {
        this.tableDataBegin = res.Response.Rules;
        this.totalItems = res.Response.Total;
        this.usedNum = res.Response.Total;
        this.loading = false;
      });
   
    },
    //点击批量删除
    partDel(){
      if(this.partD2.length==0){
        this.$message({
          showClose: true,
          message: "請選擇刪除項",
          type: "warning"
        });
      }else{
        this.dialogDelete_2=true;
      }
    },
    //单选
    checkBoxClick(selection, row){
      if(selection.length!='0'){
        this.partD2.push(row.RuleId)
      }
    },
    //全选
    checkBoxAll(val){
        val.forEach(v=>{
          this.partD2.push(v.RuleId) 
        })
    },
    //批量删除确定按钮
   deleteSurePart() {
    this.dialogDelete_2 = false;
    let delAllId=[...new Set(this.partD2)];
    for(let i=0;i<delAllId.length;i++){
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.resourceId,
        "RuleIdList.0": delAllId[i],
      };
      this.axios.post(L4DEL_CREATE, params).then(res => {
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: res.Response.Error.Message,
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message: "刪除成功",
            type: "success"
          });
          this.describleL4Rules();
        }
      });
    }
    },
    // 跳转新购页面
    newBuy() {
      let routeUrl = this.$router.resolve({
        path: "/choose"
      });
      window.open(routeUrl.href, "_blank");
    },

    //请输入要查询的ID或名称
    resourceIdChange() {
      this.describleL4Rules();
    },
    handleClick() {},
    //分页开始
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
    },
    //table checkbox相关事件
    handleSelectionChange(val) {
      this.multipleTable = val;
    },
    //新建按钮弹框
    newCreate() {
      if(this.resourceId == "") {
        this.$message({
          showClose: true,
          message: "需要選中資源新建",
          type: "warning"
        });
        this.describleL4Rules();
      } else {
        this.dialogVisible = true;
      }
    },
    //新建规则弹框确定按钮
    addRulesSure(isShowFalse) {
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
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.resourceId
      };
      this.axios.post(L4_RULES, params).then(res => {
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
      this.dialogVisible4 = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate1.init(JSON.parse(JSON.stringify(scopeRow)));
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
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.resourceId,
        "RuleIdList.0": this.tableDataBegin[this.deleteIndex].RuleId
      };
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
            message: "刪除成功",
            type: "success"
          });
          this.describleL4Rules();
        }
      });
    }
  }
};
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
.wrap {
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  line-height: 50px;
  margin-bottom: 20px;
  .ReportTitH3 {
    float: left;
    font-size: 16px;
    font-weight: 600;
    margin-right: 20px;
  }
  .ReportTitBtn {
    float: right;
    height: 30px;
    line-height: 30px;
    padding: 0;
    margin-top: 8px;
    width: 52px;
    border-radius: 0;
    text-align: center;
    background-color: #006eff;
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
.tabListPage {
  height: 50px;
  border-top: 1px solid #ddd;
  padding-top: 8px;
  text-align: right;
}
</style>