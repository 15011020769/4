<template>
  <el-dialog title="提示" :visible.sync="visible" width="1000px" :before-close="handleClose" center>
    <div class="container">
      <div class="user">
        <label class="title">消息接收人</label>
        <label class="value">周益</label>
      </div>
      <div class="notice-category">
        <label class="title">订阅消息类型</label>
        <el-table
          height="450"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          row-key="noticeCategoryKey"
          @expand-change="handleRowExpaneChanged"
        >
          <el-table-column width="60">
            <template slot="header" slot-scope="scope">
              <el-checkbox v-model="isSelectAll"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column width="300" label="消息类型" prop="noticeCategoryName">
            <template scope="scope">
              <el-checkbox v-model="scope.row.isChecked"></el-checkbox>
              <label>{{ scope.row.noticeCategoryName }}</label>
            </template>
          </el-table-column>

          <el-table-column label="站内信" width="300" prop="stationLetterChecked">
            <template scope="scope">
              &nbsp;&nbsp;&nbsp;
              <i
                slot="suffix"
                class="icon el-icon-circle-check"
                v-show="scope.row.stationLetterChecked"
              ></i>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="138">
            <template scope="scope">
              <el-button
                type="text"
                v-show="scope.row.children !== undefined"
                @click="handleExpand(scope.$index, scope.row)"
              >{{ scope.row.isExpanded ? "收起" : "展开" }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { MODIFY_SUBSCRIPTION } from "@/constants";
import { datasource } from "./NoticeCategoryData";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    subscriberId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tableData: [],
      multipleSelection: []
    };
  },
  computed: {
    isSelectAll: {
      get: function() {
        for (let i = 0; i < this.tableData.length; i++) {
          let item = this.tableData[i];
          if (item.isChecked === false) {
            return false;
          }
          if (item.children.length > 0) {
            for (let i = 0; i < item.children.length; i++) {
              let child = item.children[i];
              if (child.isChecked === false) {
                return false;
              }
            }
          }
        }

        return true;
      },
      set: function(newValue) {
        for (let i = 0; i < this.tableData.length; i++) {
          let item = this.tableData[i];
          item.isChecked = newValue;
          if (item.children.length > 0) {
            item.children.forEach(child => {
              child.isChecked = newValue;
            });
          }
        }
      }
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      datasource.forEach(item => {
        item.isChecked = false;
        item.isExpanded = false;
        item.children.forEach(child => {
          child.isChecked = false;
        });
      });

      this.tableData = datasource;
    },
    handleClose() {
      this.$emit("handleClose");
    },
    handleConfirm() {
      this.$emit("handleConfirm");
      this.subscribe();
    },
    handleRowExpaneChanged(row, expanded) {
      row.isExpanded = expanded;
    },
    handleExpand(index, row) {
      this.$refs.multipleTable.toggleRowExpansion(row);
    },
    subscribe() {
      const params = {
        Version: "2019-01-16",
        uid: this.subscriberId
      };

      let keys = [];
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i];
        if (item.isChecked === true) {
          keys.push(item.noticeCategoryKey);
        }
        if (item.children.length > 0) {
          item.children.forEach(child => {
            if (child.isChecked === true) {
              keys.push(child.noticeCategoryKey);
            }
          });
        }
      }

      this.axios.post(MODIFY_SUBSCRIPTION, params).then(res => {
        // TODO: 接口暂时无法调用
        console.log(res);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.notice-category >>> .el-table {
  display: relative;
  left: 100px;
  bottom: 20px;
  border: 1px solid #eeeeee;
}
.title {
  vertical-align: baseline;
  color: #888;
  padding-right: 20px;
  padding-top: 6px;
  padding-bottom: 6px;
  width: 1px;
  font-size: 12px;
}
.container {
  width: 100%;
  .user {
    .value {
      font-size: 12px;
      color: #444;
      margin-left: 20px;
      vertical-align: middle;
    }
  }
  .notice-category {
    width: 800px;
    margin-top: 20px;
  }
}
</style>
