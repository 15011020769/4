<template>
  <el-dialog
    :title="$t('CAM.noticeSubscriptionDialog.subscription')"
    :visible.sync="visible"
    width="800px"
    :before-close="handleClose"
    destroy-on-close
    @open="handleOpen"
    @closed="handleClosed"
  >
    <div class="container">
      <div class="explain">
        <p>
          要管理不同訊息類型的接收人及接收方式可以前往
          <el-link type="primary" href="../../MGC/index.html#/message" target="_blank">訊息中心-訊息訂閱</el-link>
        </p>
      </div>
      <div class="user">
        <label class="title">{{$t('CAM.noticeSubscriptionDialog.subscriber')}}</label>
        <label class="value">{{subscriberName}}</label>
      </div>
      <div class="notice-category">
        <label class="title">{{$t('CAM.noticeSubscriptionDialog.subscribeType')}}</label>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          row-key="key"
          width="100%"
          @expand-change="handleRowExpaneChanged"
          v-loading="loading"
        >
          <el-table-column width="60">
            <template slot="header" slot-scope="scope">
              <el-checkbox v-model="isSelectAll" :indeterminate="isAllIndeterminate"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column width="220" :label="$t('CAM.noticeSubscriptionDialog.xxlx')" prop="name">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.isChecked"
                :indeterminate="scope.row.isIndeterminate"
                @change="checkboxChange(scope.row)"
              ></el-checkbox>
              <!-- <el-checkbox v-model="scope.row.isChecked"></el-checkbox> -->
              <label>{{ scope.row.name }}</label>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('CAM.noticeSubscriptionDialog.znx')"
            width="220"
            prop="stationLetterChecked"
            align="center"
          >
            <template slot-scope="scope">
              <i
                slot="suffix"
                class="icon el-icon-circle-check"
                v-show="scope.row.stationLetterChecked"
              ></i>
            </template>
          </el-table-column>

          <el-table-column :label="$t('CAM.noticeSubscriptionDialog.cz')" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-show="scope.row.children !== undefined"
                @click="handleExpand(scope.$index, scope.row)"
              >{{ scope.row.isExpanded ? $t('CAM.noticeSubscriptionDialog.unexpand') : $t('CAM.noticeSubscriptionDialog.expand') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="dialog-footer">
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
import { MODIFY_SUBSCRIPTION, GET_ALL_SUBSCRIPTION_TYPE } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import { datasource } from "./NoticeCategoryData";
let ErrTips = {
  InternalError: "內部錯誤",
  InvalidParameter: "參數錯誤",
  "InvalidParameterValue.InstanceNotExist": "實例不存在",
  "InvalidParameterValue.RepetitionValue": "已存在相同參數",
  "InvalidParameterValue.SubnetIdInvalid": "無效的子網id",
  "InvalidParameterValue.SubnetNotBelongToZone": "子網不屬於zone",
  "InvalidParameterValue.VpcIdInvalid": "無效的 Vpc Id",
  "InvalidParameterValue.WrongAction": "Action參數取值錯誤",
  "InvalidParameterValue.ZoneNotSupport": "zone不支持",
  ResourceUnavailable: "資源不可用",
  UnauthorizedOperation: "未授權操作",
  "UnsupportedOperation.BatchDelInstanceLimit": "批量刪除實例限制",
  "UnsupportedOperation.OssReject": "Oss拒絕該操作"
};
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
      expandedRow: [],
      loading: false
    };
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
  methods: {
    handleOpen() {
      this.getAllSubscription();
    },
    handleClosed() {
      this.setSelectAll(false);
      this.unexpandAll();
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

      // 管理已展开的row
      if (expanded === true) {
        this.expandedRow.push(row);
      } else {
        this.expandedRow.pop(row);
      }
    },
    handleExpand(index, row) {
      // 手动展开row
      this.$refs.multipleTable.toggleRowExpansion(row);
    },
    selectAllChecked(status) {
      // 根据参数status，遍历数据源查询所有类型的选中状态，
      // false表示查询所有的类型是否全部未选中，true表示查询所有的类型是否全部已选中
      if (this.tableData.length === 0) {
        if (status) {
          return false;
        } else {
          return true;
        }
      }

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
      });
    },
    checkboxChange(row) {
      // 除全部类型的checkbox外，其他的checkbox被点击时触发
      // 点击一级类型，直接设置二级类型是否全部选中
      // 点击二级类型，额外处理
      if (row.children === undefined) {
        // 定位在哪个一级类型
        const index = this.indexForChildKey(row.key);
        if (index !== -1) {
          // 判断这一级类型下面是否是全选状态
          const levelOne = this.tableData[index];
          if (this.isSelectAllInChildren(levelOne.children) === true) {
            levelOne.isChecked = true;
            levelOne.isIndeterminate = false;
          } else if (
            this.iisUnselectAllInChildren(levelOne.children) === true
          ) {
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
            if (child.key === key) {
              return i;
            }
          }
        }
      }
      return -1;
    },
    isIndeterminateByChildren(children) {
      if (this.isSelectAllInChildren(children) === true) {
        return false;
      } else if (this.iisUnselectAllInChildren(children) === true) {
        return false;
      } else {
        return true;
      }
    },
    isSelectAllInChildren(children) {
      // 一级类型下的二级类型是否全部被选中
      if (!Array.isArray(children) || children.length === 0) {
        return false;
      }

      for (let i = 0; i < children.length; i++) {
        if (children[i].isChecked === false) {
          return false;
        }
      }

      return true;
    },
    iisUnselectAllInChildren(children) {
      // 一级类型下的二级类型是否全部未选中
      if (!Array.isArray(children) || children.length === 0) {
        return false;
      }

      for (let i = 0; i < children.length; i++) {
        if (children[i].isChecked === true) {
          return false;
        }
      }

      return true;
    },
    getSelectedKeys() {
      // 获取所有已选中的类型的key，只筛选出子类型
      const keys = [];
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];
        if (item.children.length > 0) {
          item.children.forEach(child => {
            if (child.isChecked === true) {
              keys.push(child.key);
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
        console.log(res);
        if (res.code === 0) {
          this.$message({
            message: "訂閱成功",
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Errorr.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    isThisTypeSubscribedByUser(typeKey, types) {
      if (!Array.isArray(types)) {
        return false;
      }

      const item = types.find(element => {
        return typeKey === element.msgType;
      });

      if (
        item === undefined ||
        item.users === undefined ||
        !Array.isArray(item.users)
      ) {
        return false;
      }

      let that = this;

      const result = item.users.find(element => {
        return element.uid === that.subscriberId;
      });

      return result !== undefined;
    },
    getAllSubscription() {
      this.loading = true;

      let that = this;
      this.axios
        .post(GET_ALL_SUBSCRIPTION_TYPE)
        .then(res => {
          if (res.code === 0 && Array.isArray(res.data)) {
            const parentLength = datasource.length;
            for (let i = 0; i < parentLength; i++) {
              const parent = datasource[i];
              const childrenLength = parent.children.length;
              for (let j = 0; j < childrenLength; j++) {
                const child = parent.children[j];
                child.isChecked = that.isThisTypeSubscribedByUser(
                  child.key,
                  res.data
                );
                child.stationLetterChecked = true;
              }
              console.log(parent);

              parent.isChecked = that.isSelectAllInChildren(parent.children);
              parent.isExpanded = false;
              parent.isIndeterminate = that.isIndeterminateByChildren(
                parent.children
              );
            }

            this.tableData = datasource;
          } else {
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            if (res.Response.Error) {
              this.$message({
                message: ErrOr[res.Response.Errorr.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          }
        })
        .then(function() {
          that.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
>>> .el-table::before {
  border-bottom: none;
  height: 0px;
}

>>> .el-dialog__body {
  padding: 0;
}
>>> .el-link {
  font-size: 10px;
  line-height: 13px;
}

.title {
  vertical-align: baseline;
  color: #888;
  width: 1px;
  font-size: 12px;
}
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px 20px;
  .explain {
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    padding: 10px 30px 10px 20px;
    margin-bottom: 20px;
    border-radius: 2px;
    font-size: 10px;
    p {
      line-height: 13px;
    }
  }
  .user {
    flex: 1;
    .value {
      font-size: 12px;
      color: #444;
      margin-left: 35px;
      vertical-align: middle;
    }
  }
  .notice-category {
    display: flex;
    flex-direction: row;
    flex: 8;
    margin-top: 15px;
    justify-content: space-around;
    .title {
      margin-top: -5px;
      flex: 1;
    }
    >>> .el-table {
      flex: 9;
      border: 1px solid #eeeeee;
      margin-left: 12px;
    }
  }
  .dialog-footer {
    flex: 1;
    margin-top: 10px;
    flex-direction: row;
  }
}
</style>
