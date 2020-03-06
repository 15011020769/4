import { type } from 'os';
<template>
  <div id="renewModel">
    <div>
      <!-- :title="$t('DDOS.protectCon.renewalPrice')" -->

      <el-dialog
        class="modelDetail"
        :title="$t('DDOS.Automatic_unsealing.auto')"
        :visible.sync="renewShowModel"
        width="30%"
        :before-close="handleClose"
      >
        <div class="newClear renewList">
          <div class="newClear">
            <!-- <p>{{ $t("DDOS.AssetList.AssetListName") }}</p> -->
            <p>确定解封IP:</p>
            <p>{{ unsealingIP }}</p>
          </div>
        </div>
        <span class="bottomBtnU">
          <el-button class="nowPay" @click="handleSure">确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    RenewShow: Boolean,
    unsealingIP: {
      type: String,
      default: ''
    }

  },
  data () {
    return {
      renewIsShow: '' // 模态框
    }
  },
  computed: {
    renewShowModel () {
      return this.RenewShow
    }
  },
  methods: {
    // 确定解封
    handleSure () {
      this.renewIsShow = false
      this.$emit('sureRenewModel', this.renewIsShow)
    },
    handleClose () {
      this.renewIsShow = false
      this.$emit('closeRenewModel', this.renewIsShow)
    }
  }
}
</script>
<style lang="scss">
#renewModel {
  .newClear:after {
    display: block;
    content: "";
    clear: both;
  }
  .modelDetail {
    .el-dialog__title {
      font-size: 14px;
      font-weight: 600;
    }
  }
  .renewList {
    div {
      margin-bottom: 20px;
      font-size: 12px;
      p:nth-child(1) {
        color: #999;
        float: left;
        width: 95px;
      }
      p:nth-child(2) {
        float: left;
        width: calc(100% - 95px);
        color: #444;
        span {
          width: 64px;
          display: inline-block;
          text-align: center;
          height: 30px;
          line-height: 30px;
          color: #444;
          border: 1px solid #ddd;
          position: relative;
          i {
            position: absolute;
            top: 0;
            right: 3px;
            width: 18px;
            height: 18px;
            border-radius: 2px;
            color: #fff;
            background-color: #ff7a4b;
            text-align: center;
            line-height: 18px;
            font-style: normal;
          }
        }
        .active {
          border: 1px solid #006eff;
          color: #006eff;
        }
        .dataTimeOut {
          color: #999;
          font-size: 12px;
        }
      }
      p:nth-child(2).allMoney {
        color: #ff7a4b;
        .money {
          font-size: 26px;
          font-weight: 600;
          font-style: normal;
        }
      }
    }
  }
  .bottomBtnU {
    display: block;
    text-align: center;
    width: 100%;
    button {
      height: 30px;
      line-height: 30px;
      width: 70px;
      padding: 0;
      text-align: center;
      border-radius: 0;
      font-size: 12px;
    }
    .nowPay {
      background-color: #006eff;
      color: #fff;
    }
  }
}
</style>
