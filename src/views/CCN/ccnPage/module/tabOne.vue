<!--  -->
<template>
  <div class="tabOne">
    <div class="btn">
      <el-button type="text" @click="newVisible = true">{{$t("CCN.tabs.tab1new")}}</el-button>
    </div>
    <div class="table" style="margin-bottom:20px;">
      <el-table :data="tableData" style="width: 100%" v-loading="loadShow" height="450">
        <template slot="empty">{{$t("CCN.tabs.tab1no")}}</template>
        <el-table-column prop="InstanceId" :label="$t('CCN.tabs.tab1tr1')" width>
          <template slot-scope="scope">
            <!-- <a href="../CCN/index"  target="_blank">{{ scope.row.InstanceId }}</a> -->
            <a href="javascript:void(0);">{{ scope.row.InstanceId }}</a>
            <p class="edit">{{ scope.row.InstanceName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="State" :label="$t('CCN.tabs.tab1tr2')" width>
          <template slot-scope="scope">
            <div v-if="scope.row.State=='ACTIVE'" class="off_color">{{$t('CCN.tabs.hasCon')}}</div>
            <div v-else-if="scope.row.State=='PENDING'" class="off_color">{{$t('CCN.tabs.hasAp')}}</div>
            <div v-else-if="scope.row.State=='EXPIRED'" class="close_color">{{$t('CCN.tabs.hasOu')}}</div>
            <div v-else-if="scope.row.State=='REJECTED'" class="close_color">{{$t('CCN.tabs.hasJ')}}</div>
            <div
              v-else-if="scope.row.State=='DELETED'"
              class="close_color"
            >{{$t('CCN.tabs.hasDel')}}</div>
            <div v-else-if="scope.row.State=='FAILED'" class="close_color">{{$t('CCN.tabs.error1')}}</div>
            <div v-else-if="scope.row.State=='ATTACHING'" class="off_color">{{$t('CCN.tabs.con1')}}</div>
            <div
              v-else-if="scope.row.State=='DETACHING'"
              class="off_color"
            >{{$t('CCN.tabs.uncon1')}}</div>
            <div
              v-else-if="scope.row.State=='DETACHFAILED'"
              class="close_color"
            >{{$t('CCN.tabs.unconer')}}</div>
            <!-- <div v-else-if="scope.row.State==''" class="off_color"></div> -->
          </template>
        </el-table-column>
        <el-table-column prop="InstanceType" :label="$t('CCN.tabs.tab1tr3')" width>
          <template slot-scope="scope">
            <div v-if="scope.row.InstanceType=='VPC'">{{$t('CCN.tabs.sywl')}}</div>
            <div v-else-if="scope.row.InstanceType=='DIRECTCONNECT'">{{$t('CCN.tabs.zxwl')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="InstanceUin" :label="$t('CCN.tabs.tab1tr4')" width>
          <template slot-scope>{{$t('CCN.tabs.myId')}}</template>
        </el-table-column>
        <el-table-column prop="AttachedTime" :label="$t('CCN.tabs.tab1tr5')" width>
          <template slot-scope="scope">{{ scope.row.AttachedTime }}</template>
        </el-table-column>
        <el-table-column prop="InstanceRegion" :label="$t('CCN.tabs.tab1tr6')" width>
          <template slot-scope="scope">
            <div v-if="scope.row.InstanceRegion=='ap-guangzhou'">{{$t('CCN.tabs.gz')}}</div>
            <div v-else-if="scope.row.InstanceRegion=='ap-taipei'">{{$t('CCN.tabs.twtb')}}</div>
            <div v-else-if="scope.row.InstanceRegion=='ap-chengdu'">{{$t('CCN.tabs.cd')}}</div>
            <div v-else-if="scope.row.InstanceRegion=='ap-beijing'">{{$t('CCN.tabs.bj')}}</div>
            <div v-else-if="scope.row.InstanceRegion=='ap-shanghai'">{{$t('CCN.tabs.sh')}}</div>
            <div v-else>{{ scope.row.InstanceRegion }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="operate" :label="$t('CCN.tabs.tab1tr7')" width>
          <template slot-scope="scope">
            <el-button type="text" @click="delCcnIns(scope.row)">{{$t('CCN.tabs.unc')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新建关联实例模态窗 -->
    <el-dialog :title="$t('CCN.tabs.tab1')" :visible.sync="newVisible" class="newDialog">
      <el-form :model="form">
        <div>
          <span>{{$t("CCN.tabs.tab1new1")}}</span>
          <div class="body-con">
            <div class="tr-con" v-for="(item, index) in formArr" :key="index">
              <td>
                <el-select v-model="form.instanceType" :placeholder="$t('CCN.tabs.tab1new2')">
                  <el-option :label="$t('CCN.total.vpc1')" value="VPC"></el-option>
                  <el-option :label="$t('CCN.total.vpc2')" value="DIRECTCONNECT"></el-option>
                </el-select>
              </td>
              <td>
                <el-select v-model="form.instanceRegion" :placeholder="$t('CCN.tabs.tab1new4')">
                  <el-option :label="$t('CCN.total.region')" value="ap-taipei"></el-option>
                </el-select>
              </td>
              <td>
                <el-select
                  v-model="form.instanceId"
                  :placeholder="$t('CCN.tabs.select')"
                  :no-data-text="$t('CCN.total.tdno')"
                >
                  <el-option
                    v-for="(item2,index2) in vpcs"
                    :key="index2"
                    :label="item2.VpcId"
                    :value="item2.VpcId"
                  ></el-option>
                </el-select>
              </td>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="attCcnIns(form)">提交</el-button>
        <el-button @click="newVisible = false">{{$t('CCN.tabs.tab1newc')}}</el-button>
      </div>
    </el-dialog>
    <!-- 解除关联模态窗 -->
    <el-dialog :title="$t('CCN.tabs.tab1del')" :visible.sync="dialogVisible" width="40%">
      <span>{{$t('CCN.tabs.tab1del1')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doDelCcnIns()">{{$t('CCN.total.sure')}}</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueCookie from "vue-cookie";
import {
  CCN_ATTACHEDINSTANCES_LIST,
  DETACHCCN_INSTANCES,
  VPCS_LIST,
  DIRECTCONNECTGATEWAYS_LIST,
  ATTACHCCN_INSTANCES
} from "@/constants";
export default {
  data() {
    return {
      ccnId: "",
      newVisible: false,
      dialogVisible: false,
      tableData: [], // 列表数据
      // 解关联模态窗回显数据
      instance: {
        CcnId: "",
        InstanceId: "",
        InstanceRegion: "",
        InstanceType: ""
      },
      // 添加关联实例，根据私有网络/专线网络查询VPC列表
      vpcs: [],
      // 添加关联实例表单
      form: {
        instanceType: "",
        instanceRegion: localStorage.getItem('regionv2'),
        instanceId: ""
      },
      value: "",
      input: "",

      formInfoObj: {
        key: undefined
      },
      formArr: [],
      loadShow: false
    };
  },
  watch: {
    "form.instanceType": function(value) {
      // console.log(value)
      this.getInstanceIds(value);
    }
  },
  created() {
    this.ccnId = this.$route.query.ccnId;
    this.getData();
    this.formArr.push(this.formInfoObj);
  },
  methods: {
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
    // 初始化数据
    getData: function() {
      this.loadShow = true;
      var params = {
        Version: "2017-03-12",
        Region: localStorage.getItem('regionv2'),
        CcnId: this.ccnId
      };
      // 查询关联实例列表
      this.axios.post(CCN_ATTACHEDINSTANCES_LIST, params).then(res => {
        this.tableData = res.Response.InstanceSet;
        this.total = res.Response.TotalCount;
        this.loadShow = false;
      });
    },
    // 解除关联模态窗-回显数据
    delCcnIns: function(ins) {
      this.instance.CcnId = ins.CcnId;
      this.instance.InstanceId = ins.InstanceId;
      this.instance.InstanceRegion = ins.InstanceRegion;
      this.instance.InstanceType = ins.InstanceType;
      this.dialogVisible = true;
    },
    doDelCcnIns: function() {
      var params = {
        Version: "2017-03-12",
        Region: localStorage.getItem('regionv2'),
        CcnId: this.instance.CcnId,
        "Instances.0.InstanceId": this.instance.InstanceId,
        "Instances.0.InstanceRegion": this.instance.InstanceRegion,
        "Instances.0.InstanceType": this.instance.InstanceType
      };
      this.axios.post(DETACHCCN_INSTANCES, params).then(res => {
        if (res.Response.Error == undefined) {
          this.$message({
            message: "刪除成功",
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
      this.dialogVisible = false;
    },
    // 查询instanceId
    getInstanceIds: function(instanceType) {
      var params = {
        Version: "2017-03-12",
        Region: localStorage.getItem('regionv2')
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
      // 过滤已存在的实例数据(需要等待上面的接口调用完成再执行)
      setTimeout(() => {
        this.vpcs = this.vpcs.filter(item => {
          let vpcIdList = this.tableData.map(v => v.InstanceId);
          return !vpcIdList.includes(item.VpcId);
        });
      }, 1000);
    },
    // 新增关联实例
    attCcnIns: function(ins) {
      if (!ins.instanceType) {
        this.$message({
          message: "請選擇私有網路",
          showClose: true,
          duration: 0
        });
      } else if (!ins.instanceId) {
        this.$message({
          message: "請選擇VPC",
          showClose: true,
          duration: 0
        });
      } else {
        this.loading = true;
        // 关联实例
        var params = {
          Version: "2017-03-12",
          Region: localStorage.getItem('regionv2'),
          CcnId: this.ccnId,
          "Instances.0.InstanceId": ins.instanceId,
          "Instances.0.InstanceRegion": ins.instanceRegion,
          "Instances.0.InstanceType": ins.instanceType
        };
        this.axios.post(ATTACHCCN_INSTANCES, params).then(res => {
          if (res.Response.Error == undefined) {
            this.$message({
              message: "新增成功",
              type: "success",
              showClose: true,
              duration: 0
            });
          } else {
            this.$message.error(res.Response.Error.Message);
          }
          this.getData();
        });
        this.newVisible = false;
        this.form = {
          instanceType: "",
          instanceRegion: localStorage.getItem('regionv2'),
          instanceId: ""
        };
      }
    }
  }
};
</script>
<style lang="scss">
.el-select {
  .el-input__inner {
    height: 30px !important;
  }
}
</style>
<style lang='scss' scoped>
.tabOne {
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
  .table {
    margin-top: 10px;
    min-height: 450px;
    background: #fff;
    .cell {
      .el-button {
        padding: 0;
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
    span {
      color: #444;
    }
    .body-con {
      margin-top: 10px;
      .tr-con {
        display: table;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        margin-bottom: 10px;
        background-color: #f7f7f7;
      }
    }
  }
  .dialog-footer {
    text-align: center;
    .el-button {
      height: 30px;
      line-height: 6px;
      border-radius: 0px;
    }
  }
}
</style>
