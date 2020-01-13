<template>
  <div class="wrap">
    <el-dialog title="新建" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <div class="dialog">
        <p class="p">
          <span>分组名</span>
          <el-input v-model="input" placeholder="请输入内容"></el-input>
        </p>
        <p class="p">
          <span>分组类型</span>
          <el-cascader :options="options" clearable></el-cascader>
        </p>
        <div class="p">
          <span>添加至组</span>
          <Transfer></Transfer>
        </div>
      </div>
      <p slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import Transfer from "./transfer";
export default {
  name: "msg",
  data() {
    return {
      input: "",
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  components: {
    Transfer
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
.wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wrap >>> .el-dialog__body {
  padding: 0 20px;
}
.wrap {
  .dialog {
    .p {
      display: flex;
      margin: 15px 0;
      span {
        color: #888;
        display: inline-block;
        width: 100px;
      }
    }
  }
}

.dialog-footer {
  text-align: center;
}
</style>  