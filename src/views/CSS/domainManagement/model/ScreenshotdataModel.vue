<template>
  <div>
    <div>
      <el-dialog title="截圖&鑒黃配置" :visible.sync="isShow" :before-close="handleClose">
        <div class="newClear">
          <p class="tip">
            範本选择（如需添加新範本，請前往
            <a>
              【功能範本】
              <i class="el-icon-share"></i>
            </a>中進行設置）
          </p>
          <div class="tableCon">
            <el-table
              :data="ScreenshotData"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="TemplateName" label="範本名稱"></el-table-column>
              <el-table-column prop="TemplateId" label="範本ID"></el-table-column>
              <el-table-column prop="SnapshotInterval" label="截圖間隔(秒)"></el-table-column>
              <el-table-column prop="selec" label="智慧鉴黄">
                <template slot-scope="scope">{{scope.row.PornFlag === 0 ? '不開啟' : '開啟'}}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveScreenEdit">保存</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  LIVE_DESCRIBE_LIVESNAPSHOTTEMPLATES,
  LIVE_DELETELIVESNAPSHOTRULE,
  LIVE_CREATELIVESNAPSHOTRULE
} from "@/constants";
export default {
  props: {
    isShow: {
      required: false,
      type: Boolean
    },
    checkedTemplateId: {
      required: false
    }
  },
  data() {
    return {
      ScreenshotData: [], //表格
      selection: []
    };
  },
  watch: {
    isShow(newVal) {
      if (newVal === true) {
        if (this.checkedTemplateId) {
          this.$nextTick(() => {
            this.ScreenshotData.forEach(template => {
              if (template.TemplateId === this.checkedTemplateId) {
                this.$refs.multipleTable.toggleRowSelection(template, true);
              }
            });
          });
        }
      }
    }
  },
  mounted() {
    this.axios
      .post(LIVE_DESCRIBE_LIVESNAPSHOTTEMPLATES, {
        Version: "2018-08-01"
      })
      .then(({ Response }) => {
        this.ScreenshotData = Response.Templates;
      });
  },
  methods: {
    //checkbox
    handleSelectionChange(val) {
      this.selection = val;
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(val.pop());
      }
    },
    //关闭弹框
    handleClose() {
      this.$emit("closeScreenshotModel", false);
    },
    //保存
    saveScreenEdit() {
      this.axios
        .post(LIVE_DELETELIVESNAPSHOTRULE, {
          Version: "2018-08-01",
          DomainName: this.$route.params.domain,
          AppName: ""
        })
        .then(res => {
          if (this.selection.length > 0) {
            this.axios
              .post(LIVE_CREATELIVESNAPSHOTRULE, {
                Version: "2018-08-01",
                DomainName: this.$route.params.domain,
                AppName: "",
                TemplateId: this.selection[0].TemplateId
              })
              .then(() => {
                this.$emit("closeScreenshotModel", false);
              });
          } else {
            this.$emit("closeScreenshotModel", false);
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
::v-deep .el-dialog__header {
  font-size: 14px;
  font-weight: 600;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
.tip {
  font-size: 12px;
}
.tableCon {
  width: 100%;
  border: 1px solid #ddd;
}
::v-deep thead {
  .el-table-column--selection {
    .cell {
      display: none;
    }
  }
}
</style>
