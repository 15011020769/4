<template>
  <div class="unbindNetwork">
    <el-dialog :visible.sync="unbindNetworkStatus.unbindNetworkDialog" :show-close="false" width="35%">
      <div slot="title" class="title-wrap">
        <span>解绑弹性网卡</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <span>请选择您要解绑的弹性网卡</span>
        <div class="renewdetail">
          <span>弹性网卡解绑后，将保留内网IP、弹性公网IP、安全组的关联关系。</span>
        </div>
        <div class="tableList">
          <el-input
            type="text"
            style="width: 100%;"
            placeholder="搜索名称,内网IP"
            suffix-icon="el-icon-search"
            size="mini"
          />
          <el-table
            ref="instanceInfo"
            :data="instanceInfo"
            :header-cell-style="{'font-size':'12px'}"
            max-height="200px"
            :row-style="tableRowStyle"
          >
            <el-table-column width="55">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.radio"></el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="网卡ID/名称">
              <template slot-scope="scope">
                <p>{{scope.row.InstanceId}}</p>
                <p>{{scope.row.InstanceId}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="所属子网"></el-table-column>
            <el-table-column prop="address" label="网卡内网IP数">
              <template slot-scope="scope">
                <p>{{scope.row.PrivateIpAddresses.length}}</p>
              </template>
            </el-table-column>
          </el-table>
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
      instanceInfo: []
    };
  },
  props: {
    unbindNetworkStatus: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
    this.instanceInfo = this.unbindNetworkStatus.InstanceItem;
  },
  computed: {},
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return {
        "font-size": "12px"
      };
    },
    //确定开机/取消
    handleCancel(value) {
      if (value) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2")
        };
      }
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.unbindNetwork {
  ::v-deep .el-dialog__body {
    padding: 0px 20px 30px;
  }
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
    span {
      font-size: 12px;
    }
    .renewdetail {
      padding: 10px 20px;
      font-size: 12px;
      background: #fff4e3;
      color: #c07400;
      border: 1px solid #ffd18b;
    }
    .tableList {
      margin-top: 5px;
      border: 1px solid #ccc;
      border-top: none;
      border-bottom: none;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
    ::v-deep .el-form-item {
      margin-bottom: 5px;
    }
    ::v-deep .el-form-item__error {
      padding-top: 0;
      top: 95%;
    }
  }
}
</style>

