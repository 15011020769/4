<template>
  <div class="close">
    <el-dialog :visible.sync="destroyStatus.destroyDialog" :show-close="false" width="40%">
      <div slot="title" class="title-wrap">
        <span>关机</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <span>
          您已选
          <span>1</span>台 实例 ，
        </span>
        <span class="packdown">查看详情</span>
        <el-button type="text" class="basicInfo-pack" @click="handlePack">
          <i :class="[basic?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
        </el-button>
        <div :class="[basic?'table':'']">
          <el-table
            ref="instanceTable"
            :data="instanceInfo"
            :header-cell-style="{'font-size':'12px'}"
            :row-style="tableRowStyle"
            v-if="basic"
          >
            <el-table-column type="index" width="55" label="No"></el-table-column>
            <el-table-column label="实例名">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.InstanceName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实例ID">
              <template slot-scope="scope">
                <div>
                  <a href @click="handleInstanceId">{{scope.row.InstanceId}}</a>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="id" fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <span>可关机</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span>确定对选中的实例进行关机？</span>
        <div class="check-box">
          <el-checkbox v-model="shutDown"></el-checkbox>
          <span class="checkboxtext">强制关机</span>
        </div>
        <div class="message">强制关机的效果等同于关闭计算机的电源。强制关机可能会导致实例数据丢失或者文件系统损坏，请仅在实例无法正常关机的情况下使用。</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="handleCancel(true)">确定</el-button>
          <el-button size="mini" @click="handleCancel(false)">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      basic: true,
      instanceInfo: [], //实例列表
      shutDown: false
    };
  },
  props: {
    destroyStatus: {
      type: Object,
      default: () => []
    }
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return {
        "font-size": "12px"
      };
    },
    handleInstanceId() {},
    handleCancel(value) {
      if (value) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2")
        };
        this.instanceInfo.forEach(function(item, index) {
          params["InstanceIds." + index] = item.InstanceId;
        });
        this.axios.post("cvm2/TerminateInstances", params).then(data => {
          if (data.Response) {
            this.$parent.getListData();
          }
        });
      }
      this.$emit("close", false);
    },
    handlePack() {
      this.basic = !this.basic;
    }
  },
  mounted() {
    this.instanceInfo = this.destroyStatus.InstanceItem;
  }
};
</script>
<style lang="scss" scoped>
.close {
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
    }
  }
  .content {
    font-size: 12px;
    .packdown {
      color: #006eff;
    }
    .table {
      border: 1px solid #eee;
      border-bottom: none;
    }
    .check-box {
      padding: 10px 0;
      .checkboxtext {
        margin-left: 5px;
      }
    }
    .message {
      padding: 10px 20px;
      background: #e5f0ff;
      color: #003b80;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>

