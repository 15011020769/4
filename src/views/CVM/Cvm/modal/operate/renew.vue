<template>
  <div class="renew">
    <el-dialog :visible.sync="renewStatus.renewDialog" :show-close="false" width="55%">
      <div slot="title" class="title-wrap">
        <span>实例续费</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <span>
          您已选
          <span>1</span>台 实例，
        </span>
        <span class="packdown">查看详情</span>
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
            <el-table-column label="续费实例" width="150px">
              <template slot-scope="scope">
                <div class="detail-code">
                  <div>实例:{{scope.row.InstanceName}}</div>
                  <div>所属网络:{{scope.row.VirtualPrivateCloud.VpcId}}</div>
                  <div>内网IP:{{scope.row.PrivateIpAddresses[0]}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="配置" width="250px">
              <template slot-scope="scope">
                <div class="detail-code">
                  <div>机型:标准型S2,{{scope.row.CPU}}核CPU,{{scope.row.Memory}}GB内存</div>
                  <div>
                    系统盘:{{scope.row.SystemDisk.DiskSize}}GB(
                    <a>{{scope.row.SystemDisk.DiskId}}</a>)
                  </div>
                  <div>带宽:{{scope.row.InternetAccessible.InternetMaxBandwidthOut}}Mbps({{scope.row.InternetAccessible.InternetChargeType|cvmState}})</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="到期时间">
              <template slot-scope="scope">
                <div>{{scope.row.ExpiredTime|renderTime}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="续费后到期日" width="120px"></el-table-column>
          </el-table>
        </div>
        <div class="title-Num">
          <span class="title-left">续费时长:</span>
          <span class="button-groups">
            <span
              v-for="(item, index) in buttonList"
              :class="['button-time', index===currentIndex?'active':'']"
              @click="handleCheck(index, item.mounth)"
            >{{item.name}}</span>
          </span>
          <span class="other-time">其他时长</span>
        </div>
        <div class="title-Num" v-show="networkStatus">
          <span class="title-left" style="float: left;margin-top: 10px;">调整带宽:</span>
          <span style="display: inline-block;width: 80%;">
            <el-slider
              :max="1000"
              @change="slider"
              :min="0"
              :step="1"
              v-model="slidervalue"
              show-input
            ></el-slider>
          </span>
          <span style="float:right;margin-top:5px;">Mbps</span>
        </div>
        <div class="title-Num">
          <span class="title-left">优惠价:</span>
          <span class="title-pricenow">{{instancePrice.discountPrice}}元</span>
          <span class="title-price" v-show="currentIndex>2">{{instancePrice.originalPrice}} 元</span>
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
      networkStatus: false,
      slidervalue: 50,
      instanceInfo: [], //列表
      buttonList: [
        {
          index: 1,
          mounth: 1,
          name: "1个月"
        },
        {
          index: 2,
          mounth: 2,
          name: "2个月"
        },
        {
          index: 3,
          mounth: 3,
          name: "3个月"
        },
        {
          index: 4,
          mounth: 12,
          name: "1年"
        },
        {
          index: 5,
          mounth: 24,
          name: "2年"
        },
        {
          index: 6,
          mounth: 36,
          name: "3年"
        },
        {
          index: 7,
          mounth: 48,
          name: "4年"
        },
        {
          index: 8,
          mounth: 60,
          name: "5年"
        }
      ],
      currentIndex: 1, //续费时长
      //价格
      instancePrice: {
        discountPrice: 0,
        originalPrice: 0
      }
    };
  },
  props: {
    renewStatus: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
     this.instanceInfo = this.renewStatus.InstanceItem;
    if (
      this.instanceInfo[0].InternetAccessible.InternetChargeType ==
      "BANDWIDTH_PREPAID"
    ) {
      this.networkStatus = true;
    }
    this.InquiryPrice();
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
          "nstanceChargePrepaid.Period":''
        };
        this.instanceInfo.forEach(function(item, index) {
          params["InstanceIds." + index] = item.InstanceId;
        });
        this.axios.post("cvm/RenewInstances", params).then(data => {
          if(data.Response) {
            this.$parent.getListData();
          }
        });
      }
      this.$emit("close", false);
    },
    //续费时长改变
    handleCheck(index, mounth) {
      this.currentIndex = index;
      this.InquiryPrice(mounth, "");
    },
    //调整带宽
    slider() {
      this.InquiryPrice();
    },
    //询价
    InquiryPrice(time, slider) {
      var params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        "InstanceIds.0": this.instanceInfo[0].InstanceId, //主机Id
        "InstanceChargePrepaid.Period": time? time: 1 //时间
      };
      this.axios.post("cvm/InquiryPriceRenewInstances", params).then(data => {
        this.instancePrice.discountPrice = data.Response.Price.InstancePrice.DiscountPrice; //优惠价
        this.instancePrice.originalPrice = data.Response.Price.InstancePrice.OriginalPrice; //原价
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.renew {
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
    .packdown {
      color: #006eff;
    }
    .table {
      border: 1px solid #eee;
      border-bottom: none;
    }
    .title-Num {
      margin-top: 20px;
      .title-left {
        display: inline-block;
        width: 100px;
      }
      .button-groups {
        display: inline-block;
        border-right: 1px solid #ccc;
        .button-time {
          position: relative;
          display: inline-block;
          padding: 0 20px;
          border: 1px solid #ccc;
          border-right: none;
        }
        .active {
          border-color: red;
          border-right: 1px solid red;
        }
        .button-discount {
          position: absolute;
          display: inline-block;
          height: 16px;
          line-height: 16px;
          top: -12px;
          right: 0;
          padding: 0 2px;
          background: #ff7800;
          color: #fff;
        }
      }
      .other-time {
        margin-left: 5px;
        color: #006eff;
      }
      .title-pricenow {
        color: #ff7800;
        font-size: 24px;
      }
      .title-price {
        margin-left: 5px;
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

