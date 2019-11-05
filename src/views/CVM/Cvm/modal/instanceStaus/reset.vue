<template>
  <div class="reset">
    <el-dialog :visible.sync="resetStatus.resetDialog" :show-close="false" width="55%">
      <div slot="title" class="title-wrap">
        <span>重启实例</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <span>
          您已选
          <span>1</span>台 实例，
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
                  <span class="instance-name">{{scope.row.InstanceName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实例ID">
              <template slot-scope="scope">
                <div>
                  <span class="instance-name">{{scope.row.InstanceId}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="当前带宽上限">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.InternetAccessible.InternetMaxBandwidthOut}}</span>
                  Mbps
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span class="start-title">确定选中实例进行开机</span>
        <div>重启期间，实例将无法正常提供服务，请您做好准备，以免造成影响</div>
        <div class="check-box">
          <el-checkbox v-model="resetCheck"></el-checkbox>
          <span class="checkboxtext">强制重启</span>
        </div>
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
      resetCheck: false,
      instanceInfo: []
    };
  },
  props: {
    resetStatus: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
    this.instanceInfo = this.resetStatus.InstanceItem;
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return {
        "font-size": "12px"
      };
    },
    handlePack() {
      this.basic = !this.basic;
    },
    handleCancel(value) {
      if (value) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2"),
          // ForceReboot: this.resetCheck=="false"?'FALSE':'TRUE'
        };
        this.instanceInfo.forEach(function(item, index) {
          params["InstanceIds." + index] = item.InstanceId;
        });
        this.axios.post("cvm/RebootInstances", params).then(data => {
          if(data.Response) {
            this.$parent.getListData();
          }
        });
      }
      this.$emit("close", false);
    }
  },
};
</script>
<style lang="scss" scoped>
.reset {
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
    .start-title {
      display: inline-block;
      margin: 10px 0;
      font-size: 14px;
      font-weight: bolder;
    }
    .check-box {
      padding: 10px 0;
      .checkboxtext {
        margin-left: 5px;
      }
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>

