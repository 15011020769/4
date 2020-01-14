<template>
  <div>
    <div class="topConTit">
      <span class="titFont">{{$t('KMS.total.kmsList')}}</span>
      <span class="taibeiCheck">{{thisAddress}}</span>
    </div>
    <div class="mainContent">
      <KMSdialog
        :dialogVisibleKMS="dialogVisibleKMS"
        @_confirm="_confirm"
        @_cancel="_cancel"
        :KMStitle="KMStitle"
        :KMStxt="KMStxt"
        :KMSdata="KMSdata"
        :state="state"
      />
      <div class="mainContBtn newClear">
        <div class="conLeftBtn">
          <el-button @click="dialogVisible = true">{{$t('KMS.total.newCreate')}}</el-button>
          <el-button @click="_enableBtn">{{$t('KMS.total.startKms')}}</el-button>
          <el-button @click="_disableBtn">{{$t('KMS.total.stopKms')}}</el-button>
        </div>
        <el-dialog
          class="dialogModel"
          :title="$t('KMS.total.newCreateKms')"
          :visible.sync="dialogVisible"
          width="50%"
          :before-close="handleClose"
        >
          <el-form :model="createForm" label-width="100px">
            <el-form-item :label="$t('KMS.total.kmsName')">
              <el-input v-model="createForm.name"></el-input>
              <p>{{$t('KMS.total.tip1')}}</p>
            </el-form-item>
            <el-form-item :label="$t('KMS.total.descriptInfo')">
              <el-input v-model="createForm.discription" type="textarea" />
              <p>{{$t('KMS.total.tip2')}}</p>
            </el-form-item>
            <el-form-item :label="$t('KMS.total.kmsMOrigin')">
              <el-radio-group v-model="createForm.Type">
                <el-radio label="KMS"></el-radio>
                <el-radio :label="$t('KMS.total.oulCon')"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{$t('KMS.total.modelClose')}}</el-button>
            <el-button type="primary" @click="sureNewCreate">{{$t('KMS.total.modelSure')}}</el-button>
          </span>
        </el-dialog>
        <div class="conRightSearch">
          <el-input
            class="iptSearch"
            :placeholder="$t('KMS.total.placeholder1')"
            v-model="tableDataName"
            @change="inpVal"
          ></el-input>
          <button class="el-icon-search" @click="doFilter"></button>
        </div>
      </div>
      <div class="tableCoontent">
        <div class="tableList">
          <el-table
            ref="multipleTable"
            :data="tableDataBegin.slice((currpage - 1) * pagesize, currpage * pagesize)"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            height="450"
            v-loading="loading"
            :empty-text="$t('KMS.total.zwsj')"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="KeyId" :label="$t('KMS.total.label1')">
              <template slot-scope="scope">
                <a href="#" @click="todoDetails(scope.row)">{{scope.row.KeyId}}</a>
                <br />
                <span>{{ scope.row.Alias}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="KeyState" :label="$t('KMS.total.status')">
              <template slot-scope="scope">
                <span
                  :style="scope.row.KeyState=='Disabled'||scope.row.KeyState=='PendingDelete'||scope.row.KeyState=='PendingImport'?'color:#ff9d00':'color:#000'"
                >{{scope.row.KeyState=="PendingDelete"?'於'+timestampToTime(scope.row.DeletionDate)+'徹底刪除':filterState(scope.row.KeyState)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="CreateTime"
              :label="$t('KMS.total.createTime')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{timestampToTime(scope.row.CreateTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Origin" :label="$t('KMS.total.kmsOrigin')">
              <template slot-scope="scope">
                <span>{{filterKey(scope.row.Origin)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="kmsChange" :label="$t('KMS.total.kmsChange')">
              <template slot-scope="scope">
                <a
                  href="#"
                  class="aColorGree"
                  :style="scope.row.KeyState=='PendingDelete'||scope.row.KeyState=='PendingImport'||scope.row.Origin=='EXTERNAL'||scope.row.KeyRotationEnabled==true?'pointer-events:none':'color:#006eff'"
                  @click="startChange(scope.row,$event)"
                >{{$t('KMS.total.startChange')}}</a>
                <span class="spanLine">|</span>
                <a
                  href="#"
                  class="aColorGree"
                  :style="scope.row.KeyState=='PendingDelete'||scope.row.KeyState=='PendingImport'||scope.row.KeyRotationEnabled==false?'pointer-events:none':'color:#006eff'"
                  @click="startChange(scope.row,$event)"
                >{{$t('KMS.total.stopChange')}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="action" :label="$t('KMS.total.action')" class="action">
              <template slot-scope="scope">
                <a
                  href="#"
                  class="aColorGree"
                  :style="scope.row.KeyState=='Enabled'||scope.row.KeyState=='PendingDelete'||scope.row.KeyState=='PendingImport'?'pointer-events:none':'color:#006eff'"
                  @click="startKms(scope.row,$event)"
                >{{$t('KMS.total.startKms')}}</a>
                <span class="spanLine">|</span>
                <a
                  href="#"
                  class="aColorGree"
                  :style="scope.row.KeyState=='Disabled'||scope.row.KeyState=='PendingDelete'||scope.row.KeyState=='PendingImport'?'pointer-events:none':'color:#006eff'"
                  @click="startKms(scope.row,$event)"
                >{{$t('KMS.total.stopKms')}}</a>
                <br />
                <a
                  href="#"
                  class="aColorGree"
                  :style="scope.row.KeyState=='PendingDelete'?'pointer-events:none':'color:#006eff'"
                  @click="openDelete(scope.row,$event)"
                >{{$t('KMS.total.planDelete')}}</a>
                <span class="spanLine">|</span>
                <a
                  href="#"
                  class="aColorGree"
                  :style="scope.row.KeyState=='PendingDelete'?'color:#006eff':'pointer-events:none'"
                  @click="openDelete(scope.row,$event)"
                >{{$t('KMS.total.closeDelete')}}</a>
              </template>
            </el-table-column>
          </el-table>
          <stopChange
            :isShow="dialogModelChange"
            :content="doalogModelBox"
            @parentByClick="childrenShow"
            @startSure="startSure"
            @stopSure="stopSure"
          />
          <startKms
            :isShow="dialogModelKms"
            :content="doalogModelBox1"
            @parentByClick="childrenShow1"
            @startKmsSure="startKmsSure"
            @stopKmsSure="stopKmsSure"
          />
          <openDelete
            :isShow="dialogModelDelete"
            :content="doalogModelBox2"
            @parentByClick="childrenShow2"
            @openDeleteSure="openDeleteSure"
            @closeDeleteSure="closeDeleteSure"
          />
        </div>
        <el-dialog
          class="dialogModel"
          :title="$t('KMS.total.planDeleteKms')"
          :visible.sync="dialogModelOpenDelete"
          width="40%"
          :before-close="handleCloseOpenDelete"
        >
          <p class="deleteOpen">{{$t('KMS.total.tip3')}}</p>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogModelOpenDelete = false">{{$t('KMS.total.modelClose')}}</el-button>
            <el-button
              type="primary"
              @click="dialogModelOpenDelete = false"
            >{{$t('KMS.total.modelSure')}}</el-button>
          </span>
        </el-dialog>
        <div class="Right-style pagstyle">
          <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t('KMS.total.tiao')}}</span>
          <el-pagination
            :page-size="pagesize"
            :pager-count="7"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="TotalCount"
          >1</el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import stopChange from "./stopChange";
import startKms from "./startKms";
import openDelete from "./openDelete";
import KMSdialog from "./KMSdialog";
import {
  KMS_LIST,
  NEW_KMS,
  EnableKey,
  DisableKey,
  ALL_CITY
} from "@/constants";
import VueCookie from "vue-cookie";
export default {
  data() {
    return {
      loading: true,
      TotalCount: 0,
      pagesize: 10,
      currpage: 1,
      thisAddress: "台灣台北",
      //kms弹出框
      KMSchange: false,
      dialogVisibleKMS: false,
      KMStitle: "", //标题
      KMStxt: "", //文字
      KMSdata: [], //数据
      state: "", //状态
      tableDataName: "",
      tableDataBegin: [],
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      deleteIndex: "",
      deleteBegin: {},
      dialogVisible: false, //新建模态框
      allData: [
        {
          KeyId: "1235468165",
          Alias: "222",
          KeyState: "已啟用",
          CreateTime: "5696523658",
          Origin: "外部"
        }
      ],
      createForm: {
        name: "",
        discription: "",
        resource: "",
        Type: ""
      }, //
      isHaveDisable: true, // 启用密钥 是否有已禁用
      isHaveEnable: true, // 禁用密钥 是否有已启用
      changeStatus: this.$t("KMS.total.startChange"), //轮换状态默认为启用轮换
      doalogModelBox: [], //启用轮换内容框
      doalogModelBox1: [], //启用密钥内容框
      doalogModelBox2: [], //计划删除框
      dialogModelChange: false, //是否启用轮换弹框
      dialogModelKms: false, //是否启用密钥弹框
      dialogModelDelete: false, //是否计划删除
      dialogModelOpenDelete: false //计划删除如果是已启用时候的弹框
    };
  },
  components: {
    stopChange: stopChange,
    startKms: startKms,
    openDelete: openDelete,
    KMSdialog: KMSdialog
  },
  filters: {},
  created() {
    this.getData();
    this.getCity();
  },
  methods: {
    getCity() {
      this.axios.post(ALL_CITY).then(res => {
        this.thisAddress = res.data[0].zone;
      });
    },
    inpVal() {
      if (this.tableDataName == "") {
        this.getData();
      }
    },
    handleCurrentChange(val) {
      this.currpage = val;
      this.getData();
    },
    //取消
    _cancel() {
      this.dialogVisibleKMS = false;
    },
    //确定
    _confirm() {
      this.loading = true;
      this.dialogVisibleKMS = false;
      //启用
      if (!this.KMSchange) {
        this.arr.forEach(item => {
          let params = {
            Version: "2019-01-18",
            // Region: VueCookie.get("regionv2"),
            Region:localStorage.getItem("regionv2"),
            KeyId: item.KeyId
          };
          this.axios.post(EnableKey, params).then(res => {
            if (res.Response.Error === undefined) {
              this.$message({
                showClose: true,
                message: this.$t("KMS.total.startSuccess"),
                type: "success"
              });
            } else {
                let ErrTips = {
                  "InternalError": "內部錯誤",
                  "nvalidParameter": "參數錯誤",
                  "InvalidParameterValue.InvalidKeyId":"KeyId不合法",
                  "ResourceUnavailable.CmkNotFound":"CMK不存在",
                  "ResourceUnavailable.CmkStateNotSupport":"CMK 狀態不支持該操作",
                  "UnauthorizedOperation":"未授權操作"
                };
                let ErrOr = Object.assign(ErrorTips, ErrTips);
                this.$message({
                  message: ErrOr[res.Response.Error.Code],
                  type: "error",
                  showClose: true,
                  duration: 0
                });
             }
          });
        });
      }
      //禁用
      else {
        this.arr.forEach(item => {
          let params = {
            Version: "2019-01-18",
            // Region: VueCookie.get("regionv2"),
            Region:localStorage.getItem("regionv2"),
            KeyId: item.KeyId
          };

          this.axios.post(DisableKey, params).then(res => {
            if (res.Response.Error === undefined) {
              this.$message({
                showClose: true,
                message: this.$t("KMS.total.stopSuccess"),
                type: "success"
              });
            } else {
                let ErrTips = {
                    "InternalError":'內部錯誤',
                    "InvalidParameter":'參數錯誤',
                    "InvalidParameterValue.InvalidKeyId":'KeyId不合法',
                    "ResourceUnavailable.CmkNotFound":'CMK不存在',
                    "ResourceUnavailable.CmkStateNotSupport":'CMK 狀態不支持該操作',
                    "UnauthorizedOperation":'未授權操作'
                };
                let ErrOr = Object.assign(ErrorTips, ErrTips);
                this.$message({
                  message: ErrOr[res.Response.Error.Code],
                  type: "error",
                  showClose: true,
                  duration: 0
                });
            }
          });
        });
      }
      setTimeout(() => {
        this.getData();
      }, 2000);
    },
    //启用按钮
    _enableBtn() {
      var bool = false;
      var arr = [];
      this.multipleSelection.forEach(item => {
        if (item.KeyState == "Disabled") {
          bool = true;
          arr.push(item);
        }
      });
      this.arr = arr;
      if (bool) {
        this.KMStitle = this.$t("KMS.total.startKmsServer");
        this.KMStxt = this.$t("KMS.total.question1");
        this.KMSdata = arr;
        this.dialogVisibleKMS = true;
        this.KMSchange = false;
        this.state = this.$t("KMS.total.canStart");
      } else {
        this.$message(this.$t("KMS.total.noStartData"));
      }
    },
    //禁用按钮
    _disableBtn() {
      var bool = false;
      var arr = [];
      this.multipleSelection.forEach(item => {
        if (item.KeyState == "Enabled") {
          bool = true;
          arr.push(item);
        }
      });
      this.arr = arr;
      if (bool) {
        this.KMStitle = this.$t("KMS.total.stopKmsServer");
        this.KMStxt = this.$t("KMS.total.question2");
        this.KMSdata = arr;
        this.dialogVisibleKMS = true;
        this.KMSchange = true;
        this.state = this.$t("KMS.total.canStop");
      } else {
        this.$message(this.$t("KMS.total.noStartData"));
      }
    },
    //判断是否有已禁用，已启用
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (val.length != 0) {
        this.isHaveDisable = false;
      }
    },
    //获取主密钥列表
    getData() {
      this.loading = true;
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      let params = {
        Version: "2019-01-18",
        // Region: VueCookie.get("regionv2"),
        Region:localStorage.getItem("regionv2"),
        Limit: 100
      };
      //获取主密钥列表详情
      this.axios.post(KMS_LIST, params).then(res => {
        if(res.Response.Error === undefined){
            var DataList = res.Response.KeyMetadatas;
            this.TotalCount = res.Response.TotalCount;
            this.tableDataBegin = DataList;
            this.allData = DataList;
            // 将数据的长度赋值给totalItems
            this.totalItems = this.tableDataBegin.length;
            if (this.totalItems > this.pageSize) {
              for (let index = 0; index < this.pageSize; index++) {
                this.tableDataEnd.push(this.tableDataBegin[index]);
              }
            } else {
              this.tableDataEnd = this.tableDataBegin;
            }
        }else{
              let ErrTips = {
                 "InternalError":'內部錯誤',
                 "InvalidParameter":'參數錯誤',
                 "UnauthorizedOperation":'未授權操作'
              };
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
    //搜索
    doFilter() {
      this.tableDataBegin = this.allData;
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin.forEach((val, index) => {
        if (val.KeyId) {
          if (
            val.KeyId.indexOf(this.tableDataName) == 0 ||
            val.Alias.indexOf(this.tableDataName) == 0
          ) {
            this.filterTableDataEnd.push(val);
            this.tableDataBegin = this.filterTableDataEnd;
            this.TotalCount = this.tableDataBegin.length;
          } else {
            this.filterTableDataEnd.push();
            this.tableDataBegin = this.filterTableDataEnd;
            this.TotalCount = this.tableDataBegin.length;
          }
        }
      });
      //页面数据改变重新统计数据数量和当前页
      this.currpage = 1;
      this.totalItems = this.filterTableDataEnd.length;
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);

      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    //组件自带监控当前页码
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
    handleClose() {
      this.dialogVisible = false;
    },
    //计划删除如果是已启用时候的弹框关闭按钮
    handleCloseOpenDelete() {
      this.dialogModelOpenDelete = false;
    },
    //新建确定按钮
    sureNewCreate() {
      let params = {
        Version: "2019-01-18",
        // Region: VueCookie.get("regionv2"),
        Region:localStorage.getItem("regionv2"),
        Alias: this.createForm.name,
        Description: this.createForm.discription,
        Type: this.createForm.Type == "KMS" ? 1 : 2
      };
      this.axios.post(NEW_KMS, params).then(res => {
        if (res.Response.Error !== undefined) {
          this.$message({
            showClose: true,
            message: this.$t("KMS.total.noRules"),
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message: "新建成功",
            type: "success"
          });
        }
        this.getData();
        this.dialogVisible = false;
      });
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    //状态处理
    filterState(state) {
      if (state == "Enabled") {
        state = this.$t("KMS.total.alredayStart");
      } else if (state == "PendingImport") {
        state = this.$t("KMS.total.willImport");
      } else if (state == "Disabled") {
        state = this.$t("KMS.total.alredayStop");
      }
      return state;
    },
    //状态处理
    filterKey(state) {
      if (state == "EXTERNAL") {
        state = this.$t("KMS.total.oulCon");
      } else if (state == "TENCENT_KMS") {
        state = "KMS";
      }
      return state;
    },
    //跳转详情页
    todoDetails(projeatRow) {
      // console.log(projeatRow)
      let params = {
        Alias: projeatRow.Alias,
        CreateTime: this.timestampToTime(projeatRow.CreateTime),
        KeyId: projeatRow.KeyId,
        KeyState: this.filterState(projeatRow.KeyState),
        Origin: this.filterKey(projeatRow.Origin),
        address: this.thisAddress,
        KeyRotationEnabled: projeatRow.KeyRotationEnabled,
        DeletionDate: projeatRow.DeletionDate
      };
      sessionStorage.setItem("projectId", JSON.stringify(params));
      this.$router.push({
        name: "userKmsDetails"
      });
    },
    //启用轮换
    startChange(scopeRow, e) {
      this.dialogModelChange = true;
      let params = [scopeRow.Alias, scopeRow.KeyId, e.target.innerHTML];
      this.doalogModelBox = params;
    },
    //是否启动密钥服务
    startKms(scopeRow, e) {
      this.dialogModelKms = true;
      let params = [scopeRow.Alias, scopeRow.KeyId, e.target.innerHTML];
      this.doalogModelBox1 = params;
    },
    //是否计划删除
    openDelete(scopeRow, e) {
      if (scopeRow.KeyState == "Enabled") {
        this.dialogModelOpenDelete = true;
      } else {
        this.dialogModelDelete = true;
        let params = [
          scopeRow.Alias,
          this.$t("KMS.total.yu") +
            this.timestampToTime(scopeRow.DeletionDate) +
            this.$t("KMS.total.allDelete"),
          e.target.innerHTML,
          scopeRow.KeyId
        ];
        this.doalogModelBox2 = params;
      }
    },
    //轮换弹框消失
    childrenShow(trueOrFalse) {
      this.dialogModelChange = trueOrFalse;
    },
    //启动轮换确定按钮
    startSure(sureShow) {
      this.dialogModelChange = sureShow[0];
    },
    //禁用轮换确定按钮
    stopSure(sureShow) {
      this.dialogModelChange = sureShow;
    },
    //轮换弹框消失
    childrenShow1(trueOrFalse) {
      this.dialogModelKms = trueOrFalse;
    },
    //启用密钥确定按钮
    startKmsSure(sureShow) {
      this.dialogModelKms = sureShow[0];
      console.log(sureShow)
      // if (sureShow[1].Response.Error !== undefined) {
      //     this.$message({
      //       showClose: true,
      //       message: this.$t("KMS.total.noRules"),
      //       type: "error"
      //     });
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       message: "新建成功",
      //       type: "success"
      //     });
      //   }
    },
    //禁用密钥确定按钮
    stopKmsSure(sureShow) {
      this.dialogModelKms = sureShow;
    },
    //计划删除弹框消失
    childrenShow2(trueOrFalse) {
      this.dialogModelDelete = trueOrFalse;
    },
    //计划删除确定按钮
    openDeleteSure(deleteShow) {
      this.dialogModelDelete = deleteShow[0];
    },
    //取消删除确定按钮
    closeDeleteSure(deleteShow) {
      this.dialogModelDelete = deleteShow;
    }
  }
};
</script>
<style lang="scss" scoped>
.Right-style {
  display: flex;
  width: 100%;
  background: white;
  justify-content: flex-end;
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
  content: "";
  clear: both;
}
.topConTit {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  span.titFont {
    font-size: 16px;
    font-weight: 600;
  }
  span.taibeiCheck {
    width: 78px;
    height: 22px;
    text-align: center;
    line-height: 22px;
    color: #006eff;
    border: 1px solid #006eff;
    background-color: #fff;
    margin-left: 20px;
    display: inline-block;
  }
}
.mainContent {
  width: 100%;
  padding: 20px;
  .mainContBtn {
    margin-bottom: 20px;
    .conLeftBtn {
      float: left;
      button {
        height: 30px;
        border-radius: 0;
        line-height: 30px;
        padding: 0 20px;
        border: 1px solid #ddd;
      }
      button:nth-child(1) {
        background-color: #006eff;
        color: #fff;
        border: 1px solid #006eff;
      }
    }
    .conRightSearch {
      float: right;
      .iptSearch {
        width: 160px;
        border-right: 0;
        border-radius: 0;
        height: 30px;
        float: left;
        ::v-deep input.el-input__inner {
          width: 160px;
          border-radius: 0;
          font-size: 12px;
          height: 30px;
          line-height: 30px;
          border-right: 0;
          :focus {
            border: none;
            outline: none;
          }
        }
      }
      .el-icon-search {
        width: 36px;
        border-radius: 0;
        border-left: 0;
        background-color: #fff;
        height: 30px;
        outline: none;
        border: 1px solid #ddd;
        float: left;
      }
    }
  }
}
.mainContent
  .mainContBtn
  .conRightSearch
  .iptSearch
  input.el-input__inner:focus {
  border: 1px solid #ddd;
  border-right: 0;
  outline: none;
}
.tableCoontent {
  width: 100%;
  min-height: 200px;
  background-color: #fff;
  border: 1px solid #ddd;
  // padding:20px;
  .tableList {
    width: 100%;
    min-height: 350px;
    .spanLine {
      margin: 0 5px;
      color: #bbb;
    }
    table th:nth-child(7),
    table td:nth-child(7),
    table th:nth-child(6),
    table td:nth-child(6) {
      text-align: center;
    }
  }
  .tabListPage {
    width: 100%;
    padding: 12px 20px 20px;
    border-top: 1px solid #ddd;
    text-align: right;
  }
}
.dialogModel {
  p {
    font-size: 12px;
    color: #888;
    line-height: 22px;
  }
  p.deleteOpen {
    font-size: 14px;
    font-weight: 600;
    color: #000;
  }
  ::v-deep .el-dialog__title {
    font-weight: 600;
    font-size: 14px;
  }
  ::v-deep .el-form-item__label {
    font-size: 12px;
    color: #888;
    text-align: left;
  }
  ::v-deep .el-input__inner {
    width: 180px;
    height: 30px;
    line-height: 30px;
    border-radius: 0;
  }
  ::v-deep .el-textarea__inner {
    width: 80% !important;
    height: 100px;
    resize: none;
  }
}
.aColorGree {
  color: #999;
}
.atclor {
  color: #bbb;
  cursor: default;
  pointer-events: none;
}
.atclor:hover {
  color: #bbb;
  cursor: default;
  pointer-events: none;
}
.mcolor {
  color: #006eff;
}
</style>