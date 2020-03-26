<template>
  <div class="newdialog">
    <div>
      <el-dialog
        title="自定義清單字段"
        :visible.sync="dialogVisible"
        width="40%"
      >
        <div class="content">
          <div class="explain" style="margin-bottom:20px;">
            <p>
              請選擇您想顯示的清單詳細訊息，最多勾選10個字段，已勾選10個
            </p>
          </div>
          <div class="checkbox">
            <el-checkbox-group v-model="checkedlist">
              <el-checkbox
                v-for="option in cities"
                :label="option"
                :key="option"
              >
                {{ option }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="save">確 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
const options = [
  "事件",
  "類型",
  "産品類型",
  "地域",
  "影響物件",
  "物件詳情",
  "狀態",
  "開始時間",
  "更新時間",
  "告警配置"
];
export default {
  data() {
    return {
      checkedlist: [
        "類型",
        "産品類型",
        "地域",
        "影響物件",
        "物件詳情",
        "狀態",
        "開始時間",
        "更新時間",
        "告警配置"
      ],
      cities: options
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
    }
  }
};
</script>
<style lang="scss" scoped>
.newdialog {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.32);
}
.checkbox >>> .el-checkbox {
  display: block;
  margin: 0;
}
.explain {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  background: #e5f0ff;
  p {
    font-size: 11px;
    line-height: 18px;
  }
}
</style>
