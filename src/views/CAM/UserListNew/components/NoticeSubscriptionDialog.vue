<template>
  <el-dialog
    :title="$t('CAM.noticeSubscriptionDialog.subscription')"
    :visible.sync="visible"
    width="1000px"
    :before-close="handleClose"
    center
    destroy-on-close
  >
    <div class="container">
      <div class="user">
        <label class="title">{{$t('CAM.noticeSubscriptionDialog.subscriber')}}</label>
        <label class="value">{{subscriberName}}</label>
      </div>
      <div class="notice-category">
        <label class="title">{{$t('CAM.noticeSubscriptionDialog.subscribeType')}}</label>
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
              <el-checkbox v-model="isSelectAll" :indeterminate="isAllIndeterminate"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            width="300"
            :label="$t('CAM.noticeSubscriptionDialog.xxlx')"
            prop="noticeCategoryName"
          >
            <template scope="scope">
              <el-checkbox
                v-model="scope.row.isChecked"
                :indeterminate="scope.row.isIndeterminate"
                @change="checkboxChange(scope.row)"
              ></el-checkbox>
              <!-- <el-checkbox v-model="scope.row.isChecked"></el-checkbox> -->
              <label>{{ scope.row.noticeCategoryName }}</label>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('CAM.noticeSubscriptionDialog.znx')"
            width="300"
            prop="stationLetterChecked"
            align="center"
          >
            <template scope="scope">
              <i
                slot="suffix"
                class="icon el-icon-circle-check"
                v-show="scope.row.stationLetterChecked"
              ></i>
            </template>
          </el-table-column>

          <el-table-column :label="$t('CAM.noticeSubscriptionDialog.cz')" width="138">
            <template scope="scope">
              <el-button
                type="text"
                v-show="scope.row.children !== undefined"
                @click="handleExpand(scope.$index, scope.row)"
              >{{ scope.row.isExpanded ? $t('CAM.noticeSubscriptionDialog.unexpand') : $t('CAM.noticeSubscriptionDialog.expand') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{$t('CAM.noticeSubscriptionDialog.close')}}</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
        >{{$t('CAM.noticeSubscriptionDialog.confirm')}}</el-button>
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
    },
    subscriberName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tableData: [],
      expandedRow: []
    };
  },
  watch: {
    visible: function(after, before) {
      if (after === false) {
        this.setSelectAll(false);
        this.unexpandAll();
      }
    }
  },
  computed: {
    isSelectAll: {
      get: function() {
        return this.selectAllChecked(true);
      },
      set: function(newValue) {
        this.setSelectAll(newValue);
      }
    },
    isUnselectAll: function() {
      return this.selectAllChecked(false);
    },
    isAllIndeterminate: function() {
      if (this.isSelectAll === true) {
        return false;
      } else if (this.isUnselectAll === true) {
        return false;
      } else {
        return true;
      }
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      // 准备checkbox和expand数据
      datasource.forEach(item => {
        item.isChecked = false;
        item.isExpanded = false;
        item.isIndeterminate = false;
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

      if (expanded === true) {
        this.expandedRow.push(row)
      } else {
        this.expandedRow.pop(row)
      }
    },
    handleExpand(index, row) {
      console.log(row);

      this.$refs.multipleTable.toggleRowExpansion(row);
    },
    selectAllChecked(status) {
      // 根据参数status，遍历数据源查询所有类型的选中状态，
      // false表示查询所有的类型是否全部未选中，true表示查询所有的类型是否全部已选中
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i];
        if (item.isChecked === !status) {
          return false;
        }
        if (item.children.length > 0) {
          for (let j = 0; j < item.children.length; j++) {
            let child = item.children[j];
            if (child.isChecked === !status) {
              return false;
            }
          }
        }
      }

      return true;
    },
    setSelectAll(isChecked) {
      // 设置数据源全部选中
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i];
        item.isChecked = isChecked;
        item.isIndeterminate = false;
        if (item.children.length > 0) {
          item.children.forEach(child => {
            child.isChecked = isChecked;
          });
        }
      }
    },
    unexpandAll() {
      // 收起数据源中所有的二级类型
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i];
        item.isExpanded = false;
      }

      this.expandedRow.forEach(row => {
        this.$refs.multipleTable.toggleRowExpansion(row);
      })

    },
    checkboxChange(row) {
      // 除全部类型的checkbox外，其他的checkbox被点击时触发
      // 点击一级类型，直接设置二级类型是否全部选中
      // 点击二级类型，额外处理
      if (row.children === undefined) {
        // 定位在哪个一级类型
        const index = this.indexForChildKey(row.noticeCategoryKey);
        if (index !== -1) {
          // 判断这一级类型下面是否是全选状态
          const levelOne = this.tableData[index];
          if (this.isSelectAllInLevelOne(index) === true) {
            levelOne.isChecked = true;
            levelOne.isIndeterminate = false;
          } else if (this.isUnselectAllInLevelOne(index) === true) {
            levelOne.isChecked = false;
            levelOne.isIndeterminate = false;
          } else {
            levelOne.isIndeterminate = true;
          }
        }
      } else {
        row.isIndeterminate = false;
        row.children.forEach(child => {
          child.isChecked = row.isChecked;
        });
      }
    },
    indexForChildKey(key) {
      // 找到二级类型所在的一级类型的index
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i];
        if (item.children.length > 0) {
          for (let j = 0; j < item.children.length; j++) {
            let child = item.children[j];
            if (child.noticeCategoryKey === key) {
              return i;
            }
          }
        }
      }
      return -1;
    },
    isSelectAllInLevelOne(index) {
      // 一级类型下的二级类型是否全部被选中
      const levelOne = this.tableData[index];
      if (levelOne.children.length > 0) {
        for (let i = 0; i < levelOne.children.length; i++) {
          if (levelOne.children[i].isChecked === false) {
            return false;
          }
        }
      }
      return true;
    },
    isUnselectAllInLevelOne(index) {
      // 一级类型下的二级类型是否全部未选中
      const levelOne = this.tableData[index];
      if (levelOne.children.length > 0) {
        for (let i = 0; i < levelOne.children.length; i++) {
          if (levelOne.children[i].isChecked === true) {
            return false;
          }
        }
      }
      return true;
    },
    getSelectedKeys() {
      // 获取所有已选中的类型的key
      const keys = [];
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];
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
      return keys;
    },
    subscribe() {
      // 提交已勾选的消息类型
      const params = {
        Version: "2019-01-16",
        uid: this.subscriberId
      };

      const selectedKeys = this.getSelectedKeys();

      selectedKeys.forEach((item, index) => {
        params["types." + index] = item;
      });

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
