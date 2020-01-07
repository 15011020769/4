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
            <div v-else-if="scope.row.State=='DELETED'" class="close_color">{{$t('CCN.tabs.hasDel')}}</div>
            <div v-else-if="scope.row.State=='FAILED'" class="close_color">{{$t('CCN.tabs.error1')}}</div>
            <div v-else-if="scope.row.State=='ATTACHING'" class="off_color">{{$t('CCN.tabs.con1')}}</div>
            <div v-else-if="scope.row.State=='DETACHING'" class="off_color">{{$t('CCN.tabs.uncon1')}}</div>
            <div v-else-if="scope.row.State=='DETACHFAILED'" class="close_color">{{$t('CCN.tabs.unconer')}}</div>
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
                <el-select v-model="form.instanceType" :placeholder="$t('CCN.tabs.tab1new2')" @change="_instance()">
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
                <el-select v-model="form.instanceId" :placeholder="$t('CCN.total.select')" no-data-text="無數據">
                  <el-option v-if="form.instanceType=='VPC'" v-for="(item, index) in vpcs" :key="index"
                    :label="`${item.VpcId}(${item.VpcName}|${item.CidrBlock})`" :value="item.VpcId">
                  </el-option>
                  <el-option v-if="form.instanceType=='DIRECTCONNECT'" v-for="(item, index) in vpcs" :key="index"
                    :label="`${item.DirectConnectGatewayId}(${item.DirectConnectGatewayName})`"
                    :value="item.DirectConnectGatewayId">
                  </el-option>
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
  import {
    ErrorTips
  } from '@/components/ErrorTips'
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
          instanceRegion: localStorage.getItem("regionv2"),
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
      "form.instanceType"(value) {
        this.getInstanceIds(value);
      }
    },
    created() {
      this.ccnId = this.$route.query.ccnId;
      this.getData();
      this.formArr.push(this.formInfoObj);
    },
    methods: {
      // 初始化数据
      getData() {
        this.loadShow = true;
        var params = {
          Version: "2017-03-12",
          Region: localStorage.getItem("regionv2"),
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
      delCcnIns(ins) {
        this.instance.CcnId = ins.CcnId;
        this.instance.InstanceId = ins.InstanceId;
        this.instance.InstanceRegion = ins.InstanceRegion;
        this.instance.InstanceType = ins.InstanceType;
        this.dialogVisible = true;
      },
      //云联网解除关联
      doDelCcnIns() {
        var params = {
          Version: "2017-03-12",
          Region: localStorage.getItem("regionv2"),
          CcnId: this.instance.CcnId,
          "Instances.0.InstanceId": this.instance.InstanceId,
          "Instances.0.InstanceRegion": this.instance.InstanceRegion,
          "Instances.0.InstanceType": this.instance.InstanceType
        };
        this.axios.post(DETACHCCN_INSTANCES, params).then(res => {
          if (res.Response.Error == undefined) {
            this.$message({
              message: "云联网解除关联成功",
              type: "success",
              showClose: true,
              duration: 0
            });
          } else {
            let ErrTips = {
              'ResourceNotFound': '资源不存在'
            }
            let ErrOr = Object.assign(ErrorTips, ErrTips)
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          this.getData();
        });
        this.dialogVisible = false;
      },
      _instance() {
        this.form.instanceId = ""
      },
      // 查询instanceId
      getInstanceIds(instanceType) {
        var params = {
          Version: "2017-03-12",
          Region: localStorage.getItem("regionv2")
        };
        // 私有网络
        if (instanceType == "VPC") {
          this.axios.post(VPCS_LIST, params).then(res => {
            if (res.Response.Error === undefined) {
              this.vpcs = res.Response.VpcSet;
              console.log(this.vpcs)
            } else {
              let ErrTips = {
                'InvalidParameter.Coexist': '参数不支持同时指定',
                'InvalidParameterValue.Malformed': '入参格式不合法',
                'ResourceNotFound': '资源不存在'
              }
              let ErrOr = Object.assign(ErrorTips, ErrTips)
              this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          });
          // 专线网络
        } else if (instanceType == "DIRECTCONNECT") {
          const info = {
            Version: '2017-03-12',
            Region: localStorage.getItem('regionv2'),
            'Filters.0.Name': 'network-type',
            'Filters.0.Values.0': 'CCN',
          };
          this.axios.post(DIRECTCONNECTGATEWAYS_LIST, info).then(res => {
            if (res.Response.Error === undefined) {
              this.vpcs = res.Response.DirectConnectGatewaySet;
            } else {
              let ErrTips = {
                'InvalidParameter.Coexist': '参数不支持同时指定',
                'InvalidParameterValue': '参数值不合法',
                'InvalidParameterValue.Malformed': '入参格式不合法',
                'InvalidParameterValue.TooLong': '无效参数值。参数值太长'
              }
              let ErrOr = Object.assign(ErrorTips, ErrTips)
              this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
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
      attCcnIns(ins) {
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
            Region: localStorage.getItem("regionv2"),
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
            instanceRegion: localStorage.getItem("regionv2"),
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
