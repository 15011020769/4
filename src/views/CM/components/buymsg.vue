<template>
  <div class="wrap">
    <el-dialog :title="$t('CVM.overview.gmdx')" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <div class="dialog">
        <div class="explain">
          <p>{{$t('CVM.overview.myqx')}}</p>
        </div>
        <div class="dialog-main">
          <dl>
            <dt>{{$t('CVM.overview.sslx')}}</dt>
            <dd>
              <el-button
                v-for="(item,index) in btnArr"
                :key="index"
                @click="msgBtn(index)"
                :class="liIndex == index ? 'active' : ''"
              >{{item}}</el-button>
            </dd>
          </dl>
          <dl>
            <dt>{{$t('CVM.overview.dxin')}}</dt>
            <dd>
              <el-input-number v-model="num" :min="1" :label="$t('CVM.overview.mswz')" style="margin-right:10px;"></el-input-number>{{$t('CVM.strip')}}
            </dd>
          </dl>
          <dl class="dl-price">
            <dt>{{$t('CVM.overview.zjfy')}}</dt>
            <dd>
              <span>{{msgPrice}}</span>元
            </dd>
          </dl>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">{{$t('CVM.Dashboard.qd')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "msg",
  data() {
    return {
      msgPrice: 0,
      num: 100,
      //购买短信 类型
      liIndex: 0,
      btnArr: ["基礎告警", "雲撥測告警", "自定義監控告警", "自定義消息"]
    };
  },
  props: {
    dialogVisible: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save() {
      this.$emit("save");
    },
    //类型
    msgBtn(index) {
      this.liIndex = index;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap >>> .el-button,
.wrap >>> .el-input__inner,
.wrap >>> .el-input-number__increase,
.wrap >>> .el-input-number__decrease {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wrap >>> .el-input-number__increase,
.wrap >>> .el-input-number__decrease {
  top: 5px;
  border-top: 1px #dcdfe6 solid;
  border-bottom: 1px #dcdfe6 solid;
}
.wrap {
  .dialog-main >>> .el-button {
    font-size: 12px;
    padding: 0 10px;
    box-sizing: border-box;
    margin: 0;
    margin-left: -1px;
  }
  .dialog-main {
    .dl-price {
      dd {
        span {
          font-size: 24px;
          font-weight: 700;
          color: #ed711f;
        }
      }
    }
    dl {
      display: flex;
      font-size: 12px;
      display: flex;
      align-items: center;
      margin-top: 10px;
      dt {
        width: 70px;
      }
    }
  }
  .active {
    border-color: #006eff;
    background: #fff;
    color: #006eff;
    z-index: 100;
    position: relative;
  }
}
</style>  