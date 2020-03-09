<template>
  <div>
    <div>
      <el-dialog
        title="水印配置"
        :visible.sync="isShow"
        :before-close="handleClose"
      >
        <div class="newClear">
          <p class="tip">
            範本选择（如需添加新範本，請前往 【<router-link to="/watermark"
              >功能範本</router-link
            >】 <i class="el-icon-share"></i>中進行設置）
          </p>
          <div class="tableCon">
            <el-table
              :data="waterData"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column
                prop="WatermarkName"
                label="範本名稱"
              ></el-table-column>
              <el-table-column
                prop="WatermarkId"
                label="範本ID"
              ></el-table-column>
              <el-table-column prop="water" label="水印位置">
                <template slot-scope="scope">
                  {{ scope.row | position }}
                </template>
              </el-table-column>
              <el-table-column prop="action" label="操作">
                <template slot-scope="scope">
                  <a href="#" @click="previewWatermark(scope.row)">預覽</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="waterEdit">保存</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  LIVE_DESCRIBELIVEWATERMARKS,
  LIVE_DELETELIVEWATERMARKRULE,
  LIVE_CREATELIVEWATERMARKRULE
} from "@/constants";
export default {
  props: {
    isShow: {
      required: false,
      type: Boolean
    },
    checkedWatermarkId: {
      required: false
    }
  },
  filters: {
    position(b) {
      if (!b) return;
      if (b.XPosition < 50 && b.YPosition < 50) return "左上角";
      if (b.XPosition >= 50 && b.YPosition < 50) return "右上角";
      if (b.XPosition < 50 && b.YPosition >= 50) return "左下角";
      if (b.XPosition >= 50 && b.YPosition >= 50) return "右下角";
    }
  },
  data() {
    return {
      waterData: [], //表格
      selection: []
    };
  },
  watch: {
    isShow(newVal) {
      if (newVal === true) {
        console.log(this);
        if (this.checkedWatermarkId) {
          this.$nextTick(() => {
            this.waterData.forEach(water => {
              if (water.WatermarkId === this.checkedWatermarkId) {
                this.$refs.multipleTable.toggleRowSelection(water, true);
              }
            });
          });
        }
      }
    }
  },
  mounted() {
    this.axios
      .post(LIVE_DESCRIBELIVEWATERMARKS, {
        Version: "2018-08-01"
      })
      .then(({ Response }) => {
        this.waterData = Response.WatermarkList;
      });
  },
  methods: {
    previewWatermark(row) {
      console.log(row);
      this.$emit("preview", row);
    },
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
      this.$emit("closeWaterModel", false);
    },
    //保存
    waterEdit() {
      this.axios
        .post(LIVE_DELETELIVEWATERMARKRULE, {
          Version: "2018-08-01",
          DomainName: this.$route.query.Name,
          AppName: "",
          StreamName: ""
        })
        .then(res => {
          if (this.selection.length > 0) {
            this.axios
              .post(LIVE_CREATELIVEWATERMARKRULE, {
                Version: "2018-08-01",
                DomainName: this.$route.query.Name,
                AppName: "",
                StreamName: "",
                TemplateId: this.selection[0].WatermarkId
              })
              .then(() => {
                this.$emit("closeWaterModel", false);
              });
          } else {
            this.$emit("closeWaterModel", false);
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
