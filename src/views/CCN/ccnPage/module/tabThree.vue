<!--  -->
<template>
  <div class="tabThree">
    <!-- 地域间带宽 -->
    <div v-show="regionShow">
      <span>
        限速方式：{{$t("CCN.tabs.tab3tit1")}}
        <a
          @click="updateBandwidthLimitTypeVisible = true"
          style="cursor: pointer;"
        >{{$t("CCN.tabs.tab3tit2")}}</a>
      </span>
      <div class="table">
        <div class="btn">
          <el-button type="text" @click="toUpdateVisible2()">{{$t("CCN.tabs.tab3btn")}}</el-button>
        </div>
        <el-table
          :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          style="width: 100%"
          v-loading="loadShow"
        >
          <template slot="empty">{{$t("CCN.tabs.tab1no")}}</template>
          <el-table-column prop="CcnRegionBandwidthLimit.Region" label="地域A" width>
            <template slot-scope="scope">
              <p class="edit">{{ scope.row.CcnRegionBandwidthLimit.Region }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="CcnRegionBandwidthLimit.DstRegion" label="地域B" width>
            <template slot-scope="scope">
              <p class="edit">{{ scope.row.CcnRegionBandwidthLimit.DstRegion }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="CcnRegionBandwidthLimit.BandwidthLimit"
            :label="$t('CCN.tabs.tab3tr2')"
            width
          >
            <template slot-scope="scope">
              <p class="edit">{{ scope.row.CcnRegionBandwidthLimit.BandwidthLimit }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="tabListPage">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
        >
        </el-pagination>
      </div>-->
      <div class="Right-style pagstyle">
        <span
          class="pagtotal"
        >{{$t('CCN.total.gongN')}}&nbsp;{{totalItems}}&nbsp;{{$t('CCN.total.tioaN')}}</span>
        <el-pagination
          :page-size="pageSize"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="totalItems"
        ></el-pagination>
      </div>
      <!--地域间-调整带宽模态窗 -->
      <el-dialog title :visible.sync="updateVisible2" class="newDialog">
        <div>
          <table class="table-div">
            <tr class="t-head">
              <td>地域A</td>
              <td>地域B</td>
              <td>{{$t('CCN.tabs.tab3tr2')}}</td>
              <td></td>
            </tr>
            <!-- <tr class="t-body" v-for="(item, index) in formArr"> -->
            <!-- 注释掉‘添加’功能，即不能一次调整多个地域间带宽限速 -->
            <td>
              <el-select v-model="upLimits.Region" :placeholder="$t('CCN.tabs.placeh1')">
                <el-option
                  v-for="item in regionSet"
                  :key="item.Region"
                  :label="item.RegionName"
                  :value="item.Region"
                ></el-option>
              </el-select>
            </td>
            <td>
              <el-select v-model="upLimits.DstRegion" :placeholder="$t('CCN.tabs.placeh1')">
                <el-option
                  v-for="item in regionSet"
                  :key="item.Region"
                  :label="item.RegionName"
                  :value="item.Region"
                ></el-option>
              </el-select>
            </td>
            <td>
              <el-input v-model="upLimits.Limits">
                <template slot="append">Mbps</template>
              </el-input>
            </td>
            <!-- 注释掉‘添加’功能，即不能一次调整多个地域间带宽限速 -->
          </table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateLimits()">{{$t('CCN.total.sure')}}</el-button>
          <el-button @click="updateVisible2 = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 地域间-修改限速方式的模态窗 -->
      <el-dialog
        :title="$t('CCN.total.eWay')"
        :visible.sync="updateBandwidthLimitTypeVisible"
        class="formDialog"
      >
        <el-form :model="ccnPublic">
          <el-form-item :label="$t('CCN.total.eWay1')">
            <el-select v-model="ccnPublic.BandwidthLimitType" :placeholder="$t('CCN.total.eWay3')">
              <!-- <el-option :label="$t('CCN.total.eWay2')" value="INTER_REGION_LIMIT"></el-option> -->
              <el-option :label="$t('CCN.total.eWay3')" value="OUTER_REGION_LIMIT"></el-option>
            </el-select>
            <p class="edit-p">
              {{ $t('CCN.total.eWay4') }}
              <!-- <a href>工單申請</a> -->
            </p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateBandwidthLimitTypeVisible = false">取 消</el-button>
          <el-button type="primary" @click="upBandwidthLimitType(ccnPublic)">
            {{
            $t('CCN.total.sure')
            }}
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 地域出带宽 -->
    <div v-show="!regionShow">
      <span>
        限速方式：{{$t("CCN.tabs.tab3tit")}}
        <a
          @click="updateBandwidthLimitTypeVisible2 = true"
        >{{$t("CCN.tabs.tab3tit2")}}</a>
      </span>
      <div class="table">
        <div class="btn">
          <el-button type="text" @click="updateVisible = true">{{$t("CCN.tabs.tab3btn")}}</el-button>
        </div>
        <el-table
          :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          style="width: 100%"
          v-loading="loadShow"
        >
          <template slot="empty">{{$t("CCN.tabs.tab1no")}}</template>
          <el-table-column
            prop="CcnRegionBandwidthLimit.Region"
            :label="$t('CCN.tabs.tab3tr1')"
            width
          >
            <template slot-scope="scope">
              <p class="edit">{{ scope.row.CcnRegionBandwidthLimit.Region }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="CcnRegionBandwidthLimit.BandwidthLimit"
            :label="$t('CCN.tabs.tab3tr2')"
            width
          >
            <template slot-scope="scope">
              <p class="edit">{{ scope.row.CcnRegionBandwidthLimit.BandwidthLimit }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="Right-style pagstyle">
        <span
          class="pagtotal"
        >{{$t('CCN.total.gongN')}}&nbsp;{{totalItems}}&nbsp;{{$t('CCN.total.tioaN')}}</span>
        <el-pagination
          :page-size="pageSize"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="totalItems"
        ></el-pagination>
      </div>
      <!--调整带宽限速模态窗 -->
      <el-dialog title :visible.sync="updateVisible" class="updateDialog">
        <div class="transfer">
          <div class="left">
            <span>{{$t('CCN.tabs.tab3btnD')}}</span>
            <div class="region">
              <el-select v-model="upLimits.Region" placeholder>
                <el-option :label="$t('CCN.tabs.tab3R')" value="ap-taipei"></el-option>
              </el-select>
              <!-- <el-checkbox v-model="upLimits.Region">{{$t('CCN.tabs.tab3R')}}</el-checkbox> -->
            </div>
          </div>
          <div class="icon">
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="right">
            <span>{{$t('CCN.tabs.tab3btnC')}}</span>
            <div class="region">
              <div class="t-head">
                <div>{{$t('CCN.tabs.tab3tr1')}}</div>
                <div>{{$t('CCN.tabs.tab3tr2')}}</div>
              </div>
              <div class="t-body">
                <div>{{$t('CCN.tabs.tab3R')}}</div>
                <div>
                  <el-input v-model="upLimits.Limits" type="text"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateLimits()">{{$t('CCN.total.sure')}}</el-button>
          <el-button @click="updateVisible = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 地域出 修改限速方式的模态窗 -->
      <el-dialog
        :title="$t('CCN.total.eWay')"
        :visible.sync="updateBandwidthLimitTypeVisible2"
        class="formDialog"
      >
        <el-form :model="ccnPublic">
          <el-form-item :label="$t('CCN.total.eWay1')">
            <el-select v-model="ccnPublic.BandwidthLimitType" :placeholder="$t('CCN.total.eWay2')">
              <el-option :label="$t('CCN.total.eWay2')" value="INTER_REGION_LIMIT"></el-option>
              <!-- <el-option :label="$t('CCN.total.eWay3')" value="OUTER_REGION_LIMIT"></el-option> -->
            </el-select>
            <p class="edit-p">
              {{ $t('CCN.total.eWay4') }}
              <a href>工單申請</a>
            </p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateBandwidthLimitTypeVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="upBandwidthLimitType(ccnPublic)">
            {{
            $t('CCN.total.sure')
            }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import VueCookie from "vue-cookie";
import { log } from "util";
import {
  GET_CCNREGIONBANDWIDTHLIMITS,
  MODIFYCCN_REGIONBANDWIDTHLIMITSTYPE,
  REGIONS_LIST,
  SET_CCNREGIONBANDWIDTHLIMITS
} from "@/constants";
export default {
  data() {
    return {
      ccnId: "",
      regionShow: false,
      tableData: [], // 带宽限速数据列表
      ccnPublic: {},
      regionSet: [], // 地域列表
      upLimits: {
        Region: "",
        DstRegion: "",
        Limits: ""
      },
      formLabelWidth: "100px",
      // 调整带宽
      formInfoObj: {
        key: undefined
      },
      formArr: [],
      // 变更限速模式的模态窗控制元素
      updateVisible2: false,
      updateVisible: false,
      updateBandwidthLimitTypeVisible: false,
      updateBandwidthLimitTypeVisible2: false,
      // 穿梭框数据
      checked: false,
      // 分页相关
      currentPage: 1,
      totalItems: 0,
      pageSize: 10, // 分页条数
      currpage: 1, // 当前页码
      loadShow: false
    };
  },
  created() {
    this.ccnId = this.$route.query.ccnId;
    this.BandwidthLimitType = this.$route.query.BandwidthLimitType;
    if (this.BandwidthLimitType == "OUTER_REGION_LIMIT") {
      // 出口限速
      this.regionShow = false;
    } else if (this.BandwidthLimitType == "INTER_REGION_LIMIT") {
      this.regionShow = true;
    }
    this.formArr.push(this.formInfoObj);
    this.getData();
  },
  methods: {
    getData: function() {
      this.loadShow = true;
      var params = {
        Version: "2017-03-12",
        Region: localStorage.getItem('regionv2'),
        CcnId: this.ccnId
      };
      // 查询-各地域出带宽限速（DescribeCcnRegionBandwidthLimits原API中给出接口）（GetCcnRegionBandwidthLimits腾讯雲给出接口）
      this.axios.post(GET_CCNREGIONBANDWIDTHLIMITS, params).then(res => {
        this.tableData = res.Response.CcnBandwidthSet;
        this.totalItems = res.Response.TotalCount;
        this.loadShow = false;
      });
    },
    // 修改限速方式弹窗
    upBandwidthLimitType: function(ccnDetail) {
      var params = {
        Version: "2017-03-12",
        Region: localStorage.getItem('regionv2'),
        CcnId: this.ccnId,
        BandwidthLimitType: ccnDetail.BandwidthLimitType
      };
      if (ccnDetail.BandwidthLimitType == "OUTER_REGION_LIMIT") {
        // 改为出口限速
        this.regionShow = false;
      } else if (ccnDetail.BandwidthLimitType == "INTER_REGION_LIMIT") {
        this.regionShow = true;
      }
      this.axios.post(MODIFYCCN_REGIONBANDWIDTHLIMITSTYPE, params).then(res => {
        this.getData();
      });
      this.ccnPublic = {};
      this.updateBandwidthLimitTypeVisible = false;
      this.updateBandwidthLimitTypeVisible2 = false;
    },
    // 生产一个新的obj对象
    copyObj: function() {
      var des = {
        key: undefined
      };
      return des;
    },
    // 新增一行
    addRow: function() {
      var des = this.copyObj();
      this.formArr.push(des);
    },
    // 删除一行
    removeRow: function(idx) {
      this.formArr.splice(idx, 1);
    },
    // 修改地域间带宽限速-模态窗
    toUpdateVisible2: function() {
      var params = {
        Version: "2017-03-12"
      };
      this.axios.post(REGIONS_LIST, params).then(res => {
        this.regionSet = res.Response.RegionSet;
      });
      this.updateVisible2 = true;
    },
    // 修改带宽限速
    updateLimits: function() {
      var params = {
        Version: "2017-03-12",
        Region: localStorage.getItem('regionv2'),
        CcnId: this.ccnId,
        "CcnRegionBandwidthLimits.0.Region": this.upLimits.Region,
        "CcnRegionBandwidthLimits.0.BandwidthLimit": this.upLimits.Limits,
        "CcnRegionBandwidthLimits.0.DstRegion": this.upLimits.DstRegion
      };
      this.axios.post(SET_CCNREGIONBANDWIDTHLIMITS, params).then(res => {
        console.log(res);
        if (res.Response.Error == undefined) {
          this.$message({
            message: "修改成功",
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          this.$message({
            message: res.Response.Error.Message,
            type: "error",
            showClose: true,
            duration: 0
          });
        }
        this.getData();
      });
      this.updateVisible = false;
      this.updateVisible2 = false;
    },
    // 分页开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.tabThree >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  padding-left: 5px;
  width: 100% !important;
}
.tabThree {
  .t-head {
    padding: 0 !important;
    margin-bottom: 10px;
  }
  .t-head div:nth-child(2),
  .t-body div:nth-child(2) {
    margin: 0 !important;
  }
  .t-head div:nth-child(1) {
    margin: 0 !important;
    padding: 0 !important;
  }
  .t-head div:nth-child(1),
  .t-body > div:nth-child(1) {
    width: 90px;
    text-align: left;
    margin-right: 0;
  }
  span {
    color: #000;
  }
  .table {
    margin-top: 20px;
    min-height: 450px;
    padding: 20px 0 0 20px;
    background: #fff;
    .btn {
      .el-button {
        height: 30px;
        background-color: #006eff;
        color: #fff;
        border: 1px solid #006eff;
        line-height: 0px;
        border-radius: 0px;
        font-size: 12px !important;
        padding: 10px 15px;
      }
      .el-button.is-plain:hover {
        background-color: #0063e5;
        color: #fff;
        border: 1px solid #0063e5;
      }
    }
    .close_color {
      color: #e54545;
    }
    .off_color {
      color: #0abf5b;
    }
  }
  .newDialog {
    .table-div {
      width: 90%;
      padding: 5px;
      border: 1px solid #ddd;
      tr {
        width: 25%;
        a {
          text-align: center;
        }
      }
      .t-head {
        height: 45px;
      }
      .t-body {
        height: 45px;
        min-height: 200px;
      }
      .el-input {
        margin-bottom: 5px;
      }
    }
  }
  .formDialog {
    .edit-p {
      color: #e54545;
      line-height: 20px;
      margin-left: 10%;
    }
  }
  .updateDialog {
    .region {
      padding: 20px;
      box-sizing: border-box !important;
    }
    .transfer {
      height: 260px;
      .left {
        float: left;
        width: 45%;
        .region {
          min-height: 200px;
          border: 1px solid #ddd;
        }
      }
      .icon {
        display: inline-block;
        float: left;
        margin-top: 20%;
        font-size: 20px;
        font-weight: bold;
      }
      .right {
        width: 45%;
        float: left;
        .region {
          min-height: 200px;
          border: 1px solid #ddd;
          .t-head {
            display: flex;
            padding: 0 5px;
            div {
              margin-right: 40px;
            }
          }
          .t-body {
            display: flex;
            // min-height: 200px;
            div {
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
  .dialog-footer {
    margin-top: 20px;
    text-align: center;
    .el-button {
      height: 30px;
      line-height: 6px;
      border-radius: 0px;
    }
  }
  .tabListPage {
    text-align: right;
    background-color: #fff;
    border-top: 1px solid #ddd;
    padding-top: 8px;
    height: 50px;
  }
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
  border-top: 1px solid #ddd;
  background-color: #fff;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
</style>
