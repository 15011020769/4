<template>
  <div class="automatic">
    <el-dialog :visible.sync="automaticStatus.automaticDialog" :show-close="false" width="55%">
      <div slot="title" class="title-wrap">
        <span>设置自动续费</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <div class="renewdetail">
          <div>
            · 设置自动续费后，将于到期当日，
            <span style="color: #f00;">按月自动续费</span>，请确保余额充足
          </div>
          <div>
            · 若续费时有可用代金券，系统将自动使用代金券续费，
            <span style="color: #006eff;">代金券说明</span>
          </div>
          <div>· 如果您的设备今天到期，请选择手动续费</div>
          <div>· 如您在扣款日前人工续费，则系统按最新到期时间自动进行续费</div>
        </div>
        <span>
          下列实例
          <span>（共1项，其中实例1项，云硬盘0项）将 开启 自动续费</span>
        </span>
        <span class="packdown">收起详情</span>
        <el-button type="text" class="basicInfo-pack" @click="handlePack">
          <i :class="[basic?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
        </el-button>
        <div :class="[basic?'table':'']">
          <el-table
            ref="instanceTable"
            :data="instanceInfo"
            :header-cell-style="{'font-size':'12px'}"
            :row-style="tableRowStyle"
            v-if="basic"
          >
            <el-table-column prop="address" label="自动续费项">
              <template slot-scope="scope">
                <div class="detail-code">
                  <span>实例:{{scope.row.InstanceName}}</span>
                </div>
                <div>
                  <span>所属网络:{{scope.row.VirtualPrivateCloud.VpcId}}</span>
                </div>
                <div>
                  <span>内网IP:{{scope.row.PrivateIpAddresses[0]}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="当前自动续费状态">
              <template slot-scope="scope">
                <span class="text-color">{{ scope.row.InstanceState | cvmState }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="配置">
              <template slot-scope="scope">
                <div class="detail-code">
                  <div>机型:{{scope.row.InstanceType.substring(0,scope.row.InstanceType.indexOf('.'))|insttypea}}</div>
                  <div>
                    {{scope.row.CPU}}核CPU,{{scope.row.Memory}}GB
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="续费带宽">
              <template slot-scope="scope">
                <div class="detail-code">
                  <div>带宽:{{scope.row.InternetAccessible.InternetMaxBandwidthOut}}Mbps</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="到期时间">
              <template slot-scope="scope">
                <div>{{scope.row.ExpiredTime|renderTime}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="自动续费">
              <template slot-scope="scope">
                <div>{{scope.row.ExpiredTime|renderTime}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 10px;">
          <div>
            <span class="left-label">实例自动续费</span>
            <span style="display: inline-block;">
              <div>
                <el-radio v-model="renewStatus" label="NOTIFY_AND_AUTO_RENEW">启用</el-radio>
              </div>
              <div>
                <el-radio v-model="renewStatus" label="NOTIFY_AND_MANUAL_RENEW">关闭（到期后，实例将自动回收，请谨慎选择)</el-radio>
              </div>
            </span>
          </div>
        </div>
        <div style="margin-top: 10px;">
          <div>
            <span class="left-label">云硬盘选项：</span>
            <div>
              <el-checkbox v-model="checked">同时应用到已挂载的云硬盘</el-checkbox>
            </div>
          </div>
        </div>
        <div style="margin-top: 10px;" v-show="renewStatus=='NOTIFY_AND_AUTO_RENEW'">
          <div>
            <span class="left-label">每月费用：</span>
            <div>
              <span class="priceNow">
                ￥{{1}}元
                <span class="priceOld">￥62.5元</span>
              </span>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="handleCancel(true)">确定</el-button>
          <el-button size="mini" @click="handleCancel(false)">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      basic: true,
      checked: true, //应用是否挂载
      renewStatus: "",
      instanceInfo: []
    };
  },
  props: {
    automaticStatus: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
    this.instanceInfo = this.automaticStatus.InstanceItem;
    console.log(this.instanceInfo)
    this.renewStatus = this.instanceInfo.RenewFlag;
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return {
        "font-size": "12px"
      };
    },
    handlePack() {
      this.basic = !this.basic;
    },
    handleCancel(value) {
      if (value) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2"),
        };
        this.instanceInfo.forEach(function(item, index) {
          params["InstanceIds." + index] = item.InstanceId;
        });
        this.axios.post("cvm/ResetInstancesPassword", params).then(data => {
          if(data.Response) {
            this.$parent.getListData();
          }
        });
      }
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.automatic {
  ::v-deep .el-dialog__body {
    padding: 0px 20px 30px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
    }
  }
  .content {
    font-size: 12px;
    .renewdetail {
      padding: 20px;
      font-size: 12px;
      background: #e5f0ff;
      color: #003b80;
      border: 1px solid #97c7ff;
    }
    .packdown {
      color: #006eff;
    }
    .table {
      border: 1px solid #eee;
      border-bottom: none;
    }
    .left-label {
      display: inline-block;
      float: left;
      width: 100px;
    }
    .priceNow {
      font-size: 18px;
      color: #ff7800;
      .priceOld {
        margin-left: 5px;
        font-size: 12px;
        color: #a2a2a2;
        text-decoration: line-through;
      }
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>

