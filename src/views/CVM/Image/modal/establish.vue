<template>
  <div class="establish">
    <el-dialog :visible.sync="establishVal.establish" width="35%" :show-close="false">
      <div class="title">
        <h3>创建云主机</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <span>
          <i class="el-icon-warning"></i>
        </span>
        <p>确定使用选择的镜像创建实例？</p>
      </div>
      <div class="footer">
        <el-button type="primary">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    establishVal: {
      type: Object,
      default: () => []
    }
  },
  methods: {
    cancel() {
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.establish {
  ::v-deep .el-dialog__header {
    padding: 0px;
  }
  ::v-deep .el-dialog__body {
    padding: 0px;
  }
  ::v-deep .el-dialog__footer {
    padding: 0px;
  }
  ::v-deep .el-dialog {
    padding: 20px;
  }
  .title {
    height: 26px;
    line-height: 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    & > h3 {
      color: #333;
      font-size: 14px;
      font-weight: 700;
    }
    & > a {
      display: inline-block;
      height: 26px;
      width: 26px;
      text-align: center;
      line-height: 26px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      & > i {
        color: #888;
        font-size: 18px;
        line-height: 26px;
      }
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    height: 74px;
    line-height: 74px;
    margin-bottom: 27px;
    & > span {
      width: 74px;
      text-align: center;
      margin-right: 10px;
      & > i {
        line-height: 74px;
        font-size: 66px;
        color: #e54545;
      }
    }
    & > p {
      color: #171d25;
      font-size: 16px;
      margin-top: -8px;
      font-weight: 700;
    }
  }
  .footer {
    display: flex;
    justify-content: center;
  }
}

/* 确定--取消按钮 */
.image-tab[data-v-11d5b2e8] .el-button {
  width: 66px !important;
}
.image-tab[data-v-11d5b2e8] .el-button:nth-of-type(1) {
  border: 0;
}
.el-button--primary {
  background: #006eff !important;
}
</style>

