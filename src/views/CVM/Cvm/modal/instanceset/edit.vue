<template>
  <div class="edit">
    <el-dialog :visible.sync="editStatus.editDialog" :show-close="false" width="55%">
      <div slot="title" class="title-wrap">
        <span>改名</span>
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
                  <span>{{scope.row.InstanceName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实例ID">
              <template slot-scope="scope">
                <div>
                  <a href="javascript:void(0);" @click="handleInstanceId">{{scope.row.InstanceId}}</a>
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
        <div class="title-Num">
          <el-form ref="projectform" :model="projectInfo" :rules="rules" label-width="100px">
            <el-form-item label="新实例名称:" prop="InstanceName">
              <el-input style="width: 200px;" size="mini" v-model="projectInfo.InstanceName"></el-input>
            </el-form-item>
          </el-form>
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
      instanceInfo: [], //实例列表
      projectInfo: {
        InstanceName: ''
      },
      rules: {
        InstanceName: [
          {
            required: true,
            message: "你还可以输入49个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    editStatus: {
      type: Object,
      default: () => []
    }
  },
  computed: {},
  mounted() {
    this.instanceInfo.push(this.editStatus.InstanceItem);
    this.projectInfo.InstanceName = this.instanceInfo[0].InstanceName; //回显名称
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
    handleCancel(val) {
      if (val) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2"),
          InstanceName: this.projectInfo.InstanceName
        };
        this.instanceInfo.forEach(function(item, index) {
          params["InstanceIds." + index] = item.InstanceId;
        });
        this.axios.post("cvm2/ModifyInstancesAttribute", params).then(data => {
          this.$parent.getListData();
          this.$emit("close", false);
        });
      }
      this.$emit("close", false);
    },
    handleInstanceId() {}
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.edit {
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
    .title-Num {
      margin-top: 10px;
      font-size: 12px;
      ::v-deep .el-form-item__label {
        font-size: 12px;
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

