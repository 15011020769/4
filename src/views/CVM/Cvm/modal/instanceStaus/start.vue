<template>
  <div class="start">
    <el-dialog :visible.sync="startStatus.startDialog" :show-close="false" width="55%">
      <div slot="title" class="title-wrap">
        <span>开机</span>
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
            max-height='200px'
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
                <a href="" @click="handleInstanceId">{{scope.row.InstanceId}}</a>
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
      instanceInfo: []  //实例列表
    };
  },
  props: {
    startStatus: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
    this.instanceInfo = this.startStatus.InstanceItem;
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
    handleInstanceId() {
      
    },
    //确定开机/取消
    handleCancel(value) {
      if (value) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2"),
        };
        this.instanceInfo.forEach(function(item, index) {
          params["InstanceIds." + index] = item.InstanceId;
        });
        this.axios.post("cvm2/StartInstances", params).then(data => {
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
.start {
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
      margin-top: 10px;
      font-size: 16px;
      font-weight: bolder;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>

