<template>
  <div class="network">
    <el-dialog :visible.sync="networkStatus.networkDialog" :show-close="false" width="45%">
      <div slot="title" class="title-wrap">
        <span>调整网络</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <div v-show='billstatus==2' class="renewdetail">
          <div>每台实例只允许在按带宽计费与按流量计费两种模式之间转换 2次。该实例已经转换 0次，转换次数用完后将无法再转换。</div>
          <div>切换成按流量计费，按腾讯云官方退费算法进行退费。注意代金券和优惠部分不退。如果重新从按流量计费切换成按带宽计费，按重新购买带宽进行收费。
          </div>
          <div>请做好实例内部的安全防护，若被攻击产生大量流量，会增加您成本。建议您：合理设置带宽上限，或选择按带宽计费。
          </div>
          <div>带宽调整实时设定，实时生效。</div>
          <div>流量费用每小时结算一次，当账户余额不足时，两小时内将停止流量服务。</div>
        </div>
        <span>
          您已选
          <span>1</span>台 实例，
        </span>
        <span class="packdown">查看详情</span>
        <el-button type="text" class="basicInfo-pack" @click="handlePack">
          <i :class="[basic?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
        </el-button>
        <div :class="[basic?'tableList':'']">
          <el-table
            ref="instanceTable"
            :data="instanceInfo"
            :header-cell-style="{'font-size':'12px'}"
            :row-style="tableRowStyle"
            v-if="basic"
            max-height="200px"
          >
            <el-table-column type="index" width="55" label="No."></el-table-column>
            <el-table-column label="实例名">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.InstanceId}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实例ID">
              <template slot-scope="scope">
                <div>
                  <a href @click="handleInstanceId">{{scope.row.InstanceId}}</a>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="当前带宽上限">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.InstanceId}}</span>
                  Mbps
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="networkform">
          <el-form
            ref="networkform"
            :model="projectInfo"
            label-width="90px"
            :label-position="labelPosition"
          >
            <el-form-item label="网络计费模式" prop="billmodel">
              <span v-show="billstatus==1" style="font-size:12px;">
                按带宽包年包月计费
                <a href="javascript:void(0)" @click="billModelChange">切换按流量计费</a>
              </span>
              <span v-show="billstatus==2" style="font-size:12px;">
                按流量计费 (转换后将消耗一次转换机会)
              </span>
            </el-form-item>
            <el-form-item label="目标带宽" prop="billmodel" v-show="billstatus==1">
              <el-slider
                :max="1000"
                @change="slider"
                :min="0"
                :step="1"
                v-model="projectInfo.slidervalue"
                show-input
                input-size="mini"
              ></el-slider>
              <span style="display:block;font-size:12px;line-height:18px;color:#aaa;">目标带宽需大于本次升级时间段内最大带宽，降低带宽请在实例续费中操作</span>
            </el-form-item>
            <el-form-item label="生效时间" v-show="billstatus==1">
              <el-date-picker
                v-model="projectInfo.value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
              ></el-date-picker>
              <span style="display:block;font-size:12px;line-height:18px;color:#aaa;">结束时间不能超过实例到期时间，当前有效期至 2019-08-10</span >
              <span style="display:block;font-size:12px;line-height:20px;color:#aaa;"><a href="">带宽升级将立即生效</a></span>
            </el-form-item>
            <el-form-item label="需支付费用" v-show="billstatus==1">
              <span style="font-size:18px;color:#ff7800;">{{projectInfo.price}}</span>
            </el-form-item>
            <el-form-item label="目标带宽上限" v-show="billstatus==2">
              <el-slider
                :max="1000"
                @change="slider"
                :min="0"
                :step="1"
                v-model="projectInfo2.slidervalue"
                show-input
              ></el-slider>
              <span style="display:block;font-size:12px;line-height:18px;color:#aaa;"><a href="javascript:void(0)">出入带宽将按1：1限速</a></span>
            </el-form-item>
          </el-form>
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
      labelPosition: "left",
      billstatus: 1, //切换计费模式 1按带宽包年包月计费 2按流量计费
      instanceInfo: [], //实例列表
      //1按带宽包年包月计费
      projectInfo: {
        slidervalue: 1,
        value1: "",
        price: 1212,
      },
      //2按流量计费
      projectInfo2: {
        slidervalue: 1
      }
    };
  },
  props: {
    networkStatus: {
      type: Object,
      default: () => []
    }
  },
  computed: {},
  mounted() {
    this.instanceInfo = this.networkStatus.InstanceItem;
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
    handleInstanceId() {},
    // 容量发生变化
    slider() {},
    //切换按流量计费
    billModelChange() {
      this.billstatus = 2;
    },
    //确定开机/取消
    handleCancel(value) {
      if (value) {
        // var params = {
        //   Version: "2017-03-12",
        //   Region: this.$cookie.get("regionv2")
        // };
        // this.instanceInfo.forEach(function(item, index) {
        //   params["InstanceIds." + index] = item.InstanceId;
        // });
        // this.axios.post("cvm2/StartInstances", params).then(data => {});
      }
      this.$emit("close", false);
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.network {
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
      border: 1px solid #ffd18b;
      background: #fff4e3;
      color: #c07400;
      padding: 10px;
    }
    .packdown {
      color: #006eff;
    }
    .tableList {
      border: 1px solid #eee;
      border-bottom: none;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
    ::v-deep .el-form-item__label {
      font-size: 12px;
    }
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>

