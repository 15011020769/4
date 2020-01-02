<template>
  <div class="wrap">
    <el-dialog title="购买短信" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false">
      <div class="dialog">
        <div class="explain">
          <p>所购短信配额没有使用限时，用完为止</p>
        </div>
        <div class="dialog-main">
          <dl>
            <dt>所属类型</dt>
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
            <dt>短信</dt>
            <dd>
              <el-input-number v-model="num" :min="1" label="描述文字" style="margin-right:10px;"></el-input-number>条
            </dd>
          </dl>
          <dl class="dl-price">
            <dt>总计费用</dt>
            <dd>
              <span>{{msgPrice}}</span>元
            </dd>
          </dl>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
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
      btnArr: ["基础告警", "云拨测告警", "自定义监控告警", "自定义消息"]
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