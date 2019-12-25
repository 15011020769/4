<template>
  <div class="wrap">
    <div class="title_top">
      <h1>{{ $t('CCN.total.title') }}</h1>
    </div>
    <div class="tea-content__body">
      <div class="btn">
        <el-button type="text" @click="dialogFormVisible = true">{{$t('CCN.total.newCreate')}}</el-button>
      </div>
    </div>
    <div class="tables">
      <el-table class="tableCon" :data="tableData" style="width: 100%" v-loading="tableload">
        <template slot="empty">{{ $t('CCN.total.tdno') }}</template>
        <el-table-column prop="CcnId" :label="$t('CCN.total.tr1')" width="130">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.CcnId }}</el-button>
            <p id="editName" class="p-name">
              {{ scope.row.CcnName }}
              <i type="text" @click="updateName(scope.row)" class="i-name">
                <i class="el-icon-edit"></i>
              </i>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="State" :label="$t('CCN.total.tr2')">
          <template slot-scope="scope">
            <div
              v-if="scope.row.State == 'AVAILABLE'"
              class="off_color"
            >{{$t('CCN.total.newCreate')}}</div>
            <div
              v-else-if="scope.row.State == 'ISOLATED'"
              class="close_color"
            >{{$t('CCN.total.glz')}}</div>
            <div v-else class="close_color">{{$t('CCN.total.newClose')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="QosLevel" :label="$t('CCN.total.tr3')">
          <template slot-scope="scope">
            <div v-if="scope.row.QosLevel == 'PT'">{{$t('CCN.total.bjnew')}}</div>
            <div v-else-if="scope.row.QosLevel == 'AU'">{{$t('CCN.total.jinnew')}}</div>
            <div v-else-if="scope.row.QosLevel == 'AG'">{{$t('CCN.total.yinnew')}}</div>
            <div v-else>{{$t('CCN.total.jinnew')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="InstanceCount" :label="$t('CCN.total.tr4')">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">
              {{
              scope.row.InstanceCount
              }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('CCN.total.tr5')">
          <template slot-scope="scope">
            <p id="editDes">
              {{ scope.row.CcnDescription }}
              <i type="text" @click="updateDes(scope.row)">
                <i class="el-icon-edit"></i>
              </i>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="InstanceChargeType" :label="$t('CCN.total.tr6')">
          <template slot-scope="scope">
            <div v-if="scope.row.InstanceChargeType == 'POSTPAID'">{{$t('CCN.total.mouthPay')}}</div>
            <!-- <div v-else-if="scope.row.InstanceChargeType=='PREPAID'">预付费</div> -->
            <div v-else>{{$t('CCN.total.mouthPay')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="BandwidthLimitType" :label="$t('CCN.total.tr7')" width="120">
          <template slot-scope="scope">
            <div class="edit" v-if="scope.row.BandwidthLimitType == 'OUTER_REGION_LIMIT'">
              {{$t('CCN.total.addressS')}}
              <i
                type="text"
                @click="updateBandwidthLimitType(scope.row)"
              >
                <i class="el-icon-edit"></i>
              </i>
            </div>
            <div class="edit" v-else-if="scope.row.BandwidthLimitType == 'INTER_REGION_LIMIT'">
              {{$t('CCN.total.addressJS')}}
              <i
                type="text"
                @click="updateBandwidthLimitType(scope.row)"
              >
                <i class="el-icon-edit"></i>
              </i>
            </div>
            <div class="edit" v-else>
              {{$t('CCN.total.addressS')}}
              <i
                type="text"
                @click="updateBandwidthLimitType(scope.row)"
              >
                <i class="el-icon-edit"></i>
              </i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" :label="$t('CCN.total.tr8')" width="200"></el-table-column>
        <el-table-column prop="operate" :label="$t('CCN.total.tr9')" width="150">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">
              {{
              $t('CCN.total.td1')
              }}
            </el-button>
            <el-button type="text" size="small" @click="deleteCcn(scope.row)">
              {{
              $t('CCN.total.td3')
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="Right-style pagstyle">
        <span
          class="pagtotal"
        >{{$t('CCN.total.gongN')}}&nbsp;{{total}}&nbsp;{{$t('CCN.total.tioaN')}}</span>
        <el-pagination
          :page-size="pagesize"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 删除的模态窗 -->
    <el-dialog :title="$t('CCN.total.del')" :visible.sync="dialogTableVisible">
      <el-table :data="gridData" v-loading="delload">
        <el-table-column property="CcnId" label="ID" width="150"></el-table-column>
        <el-table-column property="CcnName" :label="$t('CCN.total.del1')" width="200"></el-table-column>
        <el-table-column property="State" :label="$t('CCN.total.del2')">
          <template slot-scope="scope">
            <div v-if="scope.row.State == 'AVAILABLE'" class="off_color">{{$t('CCN.total.run')}}</div>
            <div
              v-else-if="scope.row.State == 'ISOLATED'"
              class="close_color"
            >{{$t('CCN.total.glz')}}</div>
            <div v-else class="close_color">{{$t('CCN.tabs.tab1newc')}}</div>
          </template>
        </el-table-column>
        <el-table-column property="InstanceCount" :label="$t('CCN.total.del3')">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">
              {{
              scope.row.InstanceCount
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="delCcn(gridData[0])">
          {{
          $t('CCN.total.sure')
          }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 新建模态窗 -->
    <el-dialog
      :title="$t('CCN.total.new')"
      :visible.sync="dialogFormVisible"
      class="newDialog"
      width="50%"
    >
      <el-form :model="form" v-loading="creatloading">
        <el-form-item :label="$t('CCN.total.new1')">
          <el-input v-model="form.CcnName" autocomplete="off" class="inputName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('CCN.total.new2')">
          <el-radio-group v-model="form.InstanceChargeType">
            <!-- <el-radio label="PREPAID">{{$t('CCN.total.mode1')}}</el-radio> -->
            <el-radio label="POSTPAID">{{ $t('CCN.total.mode2') }}</el-radio>
          </el-radio-group>
          <br />
          <span class="hint trankHint">{{ $t('CCN.total.mode3') }}</span>
        </el-form-item>
        <el-form-item :label="$t('CCN.total.new3')">
          <el-radio-group v-model="form.BandwidthLimitType">
            <el-radio label="OUTER_REGION_LIMIT">{{ $t('CCN.total.way1') }}</el-radio>
            <el-radio label="INTER_REGION_LIMIT">{{ $t('CCN.total.way2') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('CCN.total.new4')">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8 }"
            :placeholder="$t('CCN.total.desc')"
            v-model="form.CcnDescription"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('CCN.total.new5')">
          <el-radio-group v-model="form.QosLevel">
            <el-radio label="PT">{{ $t('CCN.total.ser1') }}</el-radio>
            <el-radio label="AU">{{ $t('CCN.total.ser2') }}</el-radio>
            <el-radio label="AG">{{ $t('CCN.total.ser3') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('CCN.total.new6')">
          <el-select v-model="form.instanceType" :placeholder="$t('CCN.total.vpc1')">
            <el-option :label="$t('CCN.total.vpc1')" value="VPC"></el-option>
            <el-option :label="$t('CCN.total.vpc2')" value="DIRECTCONNECT"></el-option>
            <!-- <el-option label="黑石私有网络" value="BMVPC"></el-option> -->
          </el-select>
          <el-select v-model="form.instanceRegion" :placeholder="$t('CCN.total.region')">
            <el-option :label="$t('CCN.total.region')" value="ap-taipei"></el-option>
          </el-select>
          <el-select
            v-model="form.instanceId"
            :placeholder="$t('CCN.total.select')"
            no-data-text="無數據"
          >
            <el-option
              v-for="(item, index) in vpcs"
              :key="index"
              :label="item.VpcId"
              :value="item.VpcId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createClick(form)">
          {{
          $t('CCN.total.sure')
          }}
        </el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改名称updateName模态窗 -->
    <el-dialog
      :title="$t('CCN.total.editname')"
      :visible.sync="updateNameVisible"
      class="formDialog"
    >
      <el-form :model="ccnPublic">
        <el-form-item :label="$t('CCN.total.editname2')" :label-width="formLabelWidth">
          <el-input v-model="ccnPublic.CcnName" autocomplete="off" class="inputName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel1">取 消</el-button>
        <el-button type="primary" @click="modifyCcn(ccnPublic)">
          {{
          $t('CCN.total.sure')
          }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 修改备注updateDes模态窗 -->
    <el-dialog
      :title="$t('CCN.total.editdesc')"
      :visible.sync="updateDesVisible"
      class="formDialog"
    >
      <el-form :model="ccnPublic">
        <el-form-item :label="$t('CCN.total.editdesc1')" :label-width="formLabelWidth">
          <el-input v-model="ccnPublic.CcnDescription" autocomplete="off" class="inputName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="modifyCcn(ccnPublic)">
          {{
          $t('CCN.total.sure')
          }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 修改限速方式的模态窗 -->
    <el-dialog
      :title="$t('CCN.total.eWay')"
      :visible.sync="updateBandwidthLimitTypeVisible"
      class="formDialog"
    >
      <el-form :model="ccnPublic">
        <el-form-item :label="$t('CCN.total.eWay1')">
          <el-select v-model="ccnPublic.BandwidthLimitType" placeholder>
            <el-option :label="$t('CCN.total.eWay2')" value="INTER_REGION_LIMIT"></el-option>
            <el-option :label="$t('CCN.total.eWay3')" value="OUTER_REGION_LIMIT"></el-option>
          </el-select>
          <p class="edit-p">
            {{ $t('CCN.total.eWay4') }}
            <a href>工單申請</a>
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
    <!-- 标签模态窗 -->
    <el-dialog :title="$t('CCN.total.edit')" :visible.sync="dialogTagVisible" class="editDialog">
      <span>{{ $t('CCN.total.edit0') }}</span>
      <table class="table-div">
        <tr class="t-head">
          <td>{{ $t('CCN.total.edit1') }}</td>
          <td>{{ $t('CCN.total.edit2') }}</td>
          <td>{{ $t('CCN.total.edit3') }}</td>
        </tr>
        <tr class="t-body" v-for="(item, index) in tags" :key="item">
          <td v-if="item.Key != ''">
            <el-input v-model="item.Key" autocomplete="off" class="inputKey" disabled="false"></el-input>
          </td>
          <td v-else-if="item.Key == ''">
            <el-input v-model="item.Key" autocomplete="off" class="inputKey"></el-input>
          </td>
          <td>
            <el-input v-model="item.Value" autocomplete="off" class="inputKey"></el-input>
          </td>
          <td>
            <a v-on:click="removeRow(index)" v-show="index >= 0">{{ $t('CCN.total.edit3') }}</a>
          </td>
        </tr>
      </table>

      <a v-on:click="addRow()" v-show="tags.length < 5">添加</a>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTagVisible = false">取 消</el-button>
        <el-button type="primary" @click="upTags(tags)">{{ $t('CCN.total.sure') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  CCN_LIST,
  VPCS_LIST,
  DIRECTCONNECTGATEWAYS_LIST,
  CCN_CREATE,
  ATTACHCCN_INSTANCES,
  CCN_DELETE,
  MODIFYCCN_ATTRIBUTE,
  MODIFYCCN_REGIONBANDWIDTHLIMITSTYPE,
  MODIFYRESOURCE_TAGS
} from "@/constants";
import VueCookie from "vue-cookie";
export default {
  data() {
    return {
      delload: false,
      tableload: true,
      creatloading: false,
      // ccn列表数据
      tableData: [],
      // 关联实例列表数据
      // ccnAttachedInstances: [],
      // 分页
      currentPage4: 1,
      total: 0,
      // 新建ccn模态窗需要的，根据私有网络/专线网络查询VPC列表
      vpcs: [],
      // 新建ccn表单
      form: {
        CcnName: "",
        InstanceChargeType: "POSTPAID",
        BandwidthLimitType: "OUTER_REGION_LIMIT",
        CcnDescription: "",
        QosLevel: "AU",
        instanceType: "",
        instanceRegion: VueCookie.get("regionv2"),
        instanceId: ""
      },
      formLabelWidth: "120px",
      // 删除模态窗回显数据
      gridData: [
        {
          CcnId: "",
          CcnName: "",
          InstanceCount: "",
          State: ""
        }
      ],
      // ccn对象（公用）
      ccnPublic: {},
      // 标签对象
      oldTags: [],
      tags: [],
      ccnIdOfTag: "",

      dialogTableVisible: false, // 删除模态窗
      dialogFormVisible: false, // 新建模态窗
      updateNameVisible: false, // 修改名称模态窗
      updateDesVisible: false, // 修改备注模态窗
      updateBandwidthLimitTypeVisible: false, // 修改限速方式模态窗
      dialogTagVisible: false, // 编辑模态窗
      pagesize: 10, // 分页条数
      currpage: 1 // 当前页码
    };
  },
  watch: {
    "form.instanceType": function(value) {
      this.getInstanceIds(value);
    }
  },
  created() {
    this.getData();
  },
  methods: {
    //取消修改姓名
    cancel1() {
      this.getData();
      this.updateNameVisible = false;
    },
    //取消修改备注
    cancel() {
      this.getData();
      this.updateDesVisible = false;
    },
    // 初始化CCN列表数据（包括关联实例列表数据）
    getData() {
      this.tableload = true;
      var params = {
        Version: "2017-03-12",
        Region: VueCookie.get("regionv2"),
        Offset: this.currpage * this.pagesize - this.pagesize,
        Limit: this.pagesize
      };
      this.axios.post(CCN_LIST, params).then(res => {
        this.tableData = res.Response.CcnSet;
        this.total = res.Response.TotalCount;
        this.tableload = false;
      });
    },
    // 详情页跳转(关联实例页面)
    handleClick(rows) {
      this.$router.push({
        path: "/ccnDetail",
        query: {
          ccnId: rows.CcnId,
          ccnName: rows.CcnName,
          BandwidthLimitType: rows.BandwidthLimitType
        }
      });
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
      this.getData();
    },
    // 生产一个新的obj对象
    copyObj: function() {
      var des = {
        Key: "",
        Value: ""
      };
      return des;
    },
    // 新增一行
    addRow: function() {
      var des = this.copyObj();
      this.tags.push(des);
    },
    // 删除一行
    removeRow: function(idx) {
      this.tags.splice(idx, 1);
    },
    // 查询instanceId
    getInstanceIds: function(instanceType) {
      var params = {
        Version: "2017-03-12",
        Region: VueCookie.get("regionv2")
      };
      if (instanceType == "VPC") {
        // 私有网络
        this.axios.post(VPCS_LIST, params).then(res => {
          this.vpcs = res.Response.VpcSet;
        });
      } else if (instanceType == "DIRECTCONNECT") {
        // 专线网络
        this.axios.post(DIRECTCONNECTGATEWAYS_LIST, params).then(res => {
          this.vpcs = res.Response.DirectConnectGatewaySet;
        });
      }
    },
    // 新建ccn
    createClick: function(form) {
      this.creatloading = true;
      var params = {
        Version: "2017-03-12",
        Region: VueCookie.get("regionv2"),
        CcnName: form.CcnName,
        CcnDescription: form.CcnDescription,
        QosLevel: form.QosLevel,
        InstanceChargeType: form.InstanceChargeType,
        BandwidthLimitType: form.BandwidthLimitType
      };
      this.axios.post(CCN_CREATE, params).then(res => {
        if (res.Response.Error != undefined) {
          this.$message({
            message: res.Response.Error.Message,
            showClose: true,
            duration: 0
          });
          this.creatloading = false;
        } else {
          this.$message({
            message: "新建成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.creatloading = false;
          this.dialogFormVisible = false;
          this.getData();

          // 关联实例
          var params2 = {
            Version: "2017-03-12",
            Region: VueCookie.get("regionv2"),
            CcnId: res.Response.Ccn.CcnId,
            "Instances.0.InstanceId": form.instanceId,
            "Instances.0.InstanceRegion": form.instanceRegion,
            "Instances.0.InstanceType": form.instanceType
          };
          this.axios.post(ATTACHCCN_INSTANCES, params2).then(res => {
            if (res.Response.Error) {
              this.$message({
                message: res.Response.Error.Message,
                showClose: true,
                duration: 0
              });
            }
          });
        }
      });
    },
    // 删除ccn弹窗
    deleteCcn: function(ccnDetail) {
      this.gridData[0].CcnId = ccnDetail.CcnId;
      this.gridData[0].CcnName = ccnDetail.CcnName;
      this.gridData[0].InstanceCount = ccnDetail.InstanceCount;
      this.gridData[0].State = ccnDetail.State;
      this.dialogTableVisible = true;
    },
    delCcn: function(ccnDetail) {
      this.delload = true;
      var params = {
        Version: "2017-03-12",
        Region: VueCookie.get("regionv2"),
        CcnId: ccnDetail.CcnId
      };
      this.axios.post(CCN_DELETE, params).then(res => {
        if (res.Response.Error == undefined) {
          this.$message({
            message: "删除成功",
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
        this.delload = false;
        this.getData();
        this.dialogTableVisible = false;
      });
    },
    // 修改名称弹窗
    updateName: function(ccnDetail) {
      this.ccnPublic = ccnDetail;
      this.updateNameVisible = true;
    },
    // 修改备注弹窗
    updateDes: function(ccnDetail) {
      this.ccnPublic = ccnDetail;
      this.updateDesVisible = true;
    },
    // 修改ccn公用方法
    modifyCcn: function(ccnDetail) {
      var params = {
        Version: "2017-03-12",
        Region: VueCookie.get("regionv2"),
        CcnId: ccnDetail.CcnId,
        CcnName: ccnDetail.CcnName,
        CcnDescription: ccnDetail.CcnDescription
      };
      this.axios.post(MODIFYCCN_ATTRIBUTE, params).then(res => {
        this.$message({
          message: "修改成功",
          type: "success",
          showClose: true,
          duration: 0
        });
        if (res.Response.Error != undefined) {
          this.$message({
            message: "修改失败",
            type: "error",
            showClose: true,
            duration: 0
          });
        }
        this.getData();
      });
      this.updateNameVisible = false;
      this.updateDesVisible = false;
    },
    // 修改限速方式弹窗
    updateBandwidthLimitType: function(ccnDetail) {
      this.ccnPublic = ccnDetail;
      this.updateBandwidthLimitTypeVisible = true;
    },
    upBandwidthLimitType: function(ccnDetail) {
      console.log(ccnDetail);
      var params = {
        Version: "2017-03-12",
        Region: VueCookie.get("regionv2"),
        CcnId: ccnDetail.CcnId,
        BandwidthLimitType: ccnDetail.BandwidthLimitType
      };
      this.axios.post(MODIFYCCN_REGIONBANDWIDTHLIMITSTYPE, params).then(res => {
        this.$message({
          message: "修改成功",
          type: "success",
          showClose: true,
          duration: 0
        });
        if (res.Response.Error != undefined) {
          this.$message({
            message: "修改失败",
            type: "error",
            showClose: true,
            duration: 0
          });
        }
        this.getData();
      });
      this.updateBandwidthLimitTypeVisible = false;
    },
    // 进入编辑标签模态窗
    toTags: function(ccnDetail) {
      this.ccnIdOfTag = ccnDetail.CcnId;
      this.oldTags = JSON.parse(JSON.stringify(ccnDetail.TagSet));
      this.tags = ccnDetail.TagSet;
      this.dialogTagVisible = true;
    },
    // 编辑标签
    upTags: function(tagss) {
      var params = {
        Version: "2018-08-13",
        Region: VueCookie.get("regionv2"),
        Resource:
          "qcs::vpc:ap-guangzhou:uin/100011921910:ccn/" + this.ccnIdOfTag
      };
      var newKey = [];
      for (let j = 0, len = tagss.length; j < len; j++) {
        newKey.push(tagss[j].Key);
      }
      var oldKey = [];
      for (let j = 0, len = this.oldTags.length; j < len; j++) {
        oldKey.push(this.oldTags[j].Key);
      }
      // 获取删除arr
      let delCount = 0;
      for (let j = 0, len = oldKey.length; j < len; j++) {
        if (newKey.indexOf(oldKey[j]) == -1) {
          let str = "DeleteTags." + delCount + ".TagKey";
          params[str] = oldKey[j];
          delCount++;
        }
      }
      // 获取新增arr
      let addCount = 0;
      for (let j = 0, len = newKey.length; j < len; j++) {
        if (oldKey.indexOf(newKey[j]) == -1) {
          let str1 = "ReplaceTags." + addCount + ".TagKey";
          let str2 = "ReplaceTags." + addCount + ".TagValue";
          params[str1] = newKey[j];
          params[str2] = tagss[j].Value;
          addCount++;
        }
      }
      this.axios.post(MODIFYRESOURCE_TAGS, params).then(res => {
        this.$message({
          message: "修改成功",
          type: "success",
          showClose: true,
          duration: 0
        });
        if (res.Response.Error != undefined) {
          this.$message({
            message: "修改失败",
            type: "error",
            showClose: true,
            duration: 0
          });
        }
        this.getData();
      });
      this.dialogTagVisible = false;
    }
  }
};
</script>
<style scoped lang="scss">
.wrap >>> .el-loading-mask {
  background: white !important;
}
.wrap >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.wrap >>> .el-form-item__label {
  text-align: left;
}
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
  padding: 20px 0 10px 20px;
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
    p {
      line-height: 20px;
    }
  }
}
.btn {
  .el-button {
    height: 30px;
    background-color: #006eff;
    color: #fff;
    border: 1px solid #006eff;
    line-height: 0px;
    border-radius: 0px;
    font-size: 12px !important;
    padding: 10px 20px;
  }
  .el-button.is-plain:hover {
    background-color: #0063e5;
    color: #fff;
    border: 1px solid #0063e5;
  }
}

.tables {
  margin-top: 10px;
  margin: 0 20px;
  background-color: #fff;
  .el-table {
    font-size: 12px;
    min-height: 450px;
  }
  .el-table td .cell,
  .el-table td > .cell > div,
  .el-table td > .cell > p {
    font-size: 12px;
  }
  .el-table td {
    ::v-deep .el-button {
      font-style: 12px;
    }
  }
  .el-table td > span {
    font-size: 12px;
  }
  .el-table .cell {
    position: relative;
    height: 23px;
  }
  .el-button--text {
    height: 23px;
    line-height: 0px;
  }
  .el-table td:nth-of-type(2) {
    color: #006eff;
  }
  .p-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 90px;
    .i-name {
      position: absolute;
      right: 0px;
      bottom: 12px;
    }
  }
  .close_color {
    color: #e54545;
  }
  .off_color {
    color: #0abf5b;
  }
  .el-pagination {
    float: right;
    ::v-deep .el-pagination__total {
    }
  }
  .el-popover {
    .btn-footer {
      text-align: center;
      margin: 0;
    }
    .pop-div {
      height: 40px;
    }
  }

  .el-icon-edit {
    display: none;
  }
  .el-table__row:hover {
    .el-icon-edit {
      display: inline-block;
    }
  }
  .pageList {
    height: 50px;
    background-color: #fff;
    padding-top: 8px;
    .pagtotal {
      float: right;
    }
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

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.newDialog {
  .inputName {
    width: 370px;
    float: left;
    margin-left: 30px;
  }

  .el-textarea {
    width: 370px;
    float: left;
    margin-left: 30px;
    ::v-deep .el-textarea__inner {
      height: 100px;
    }
  }
  .trankHint {
    color: #888 !important;
    font-size: 12px;
    margin-left: 10%;
  }
  .el-select {
    margin-right: 10px;
  }
}
.editDialog {
  .table-div {
    width: 90%;
    border: 1px solid #ddd;
    padding: 0 5px;
    tr {
      width: 30%;
    }
    .t-head {
      height: 45px;
      padding: 0 5px;
    }
    .t-body {
      height: 45px;
      min-height: 200px;
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

.el-dialog__wrapper {
  ::v-deep .el-dialog__title {
    font-weight: 700;
    font-size: 14px;
  }
  ::v-deep .el-radio__label {
    font-size: 12px;
    width: 90px;
    text-align: left;
  }
}
.el-form {
  ::v-deep .el-form-item__label {
    font-size: 12px;
    text-align: left;
  }
}
.el-input {
  ::v-deep .el-input__inner {
    height: 30px;
    width: 200px;
    line-height: 30px;
  }
}
.el-select {
  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
.dialog-footer {
  text-align: center;
  .el-button {
    height: 30px;
    line-height: 0;
    border-radius: 0;
  }
}
</style>
