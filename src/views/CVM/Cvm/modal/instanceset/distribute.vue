<template>
  <div class="distribute">
    <el-dialog :visible.sync="distributeStatus.distributeDialog" :show-close="false" width="40%">
      <div slot="title" class="title-wrap">
        <span>分配至项目</span>
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
                  <a href @click="handleInstanceId">{{scope.row.InstanceId}}</a>
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
        <div style="margin-top: 10px;border:1px solid #ccc;border-top:none;border-bottom:none;">
          <el-input placeholder="搜索项目名称/说明" v-model="inputValue" size="mini">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
          </el-input>
          <el-table
            ref="instanceTable"
            :data="table1data"
            :header-cell-style="{'font-size':'12px'}"
            :row-style="tableRowStyle"
            v-if="basic"
            max-height="200px"
          >
            <el-table-column width="55">
              <template slot-scope="scope">
                <el-radio
                  v-model="radio"
                  :label="scope.row.projectId"
                  @change="getSelectPlan"
                >{{""}}</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="projectName" label="项目名称"></el-table-column>
            <el-table-column prop="projectInfo" label="项目说明"></el-table-column>
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
      basic: true,
      instanceInfo: [],
      table1data: JSON.parse(localStorage.getItem('projectList')),
      radio: "",
      inputValue: '',
      planChecked: ""
    };
  },
  props: {
    distributeStatus: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
    this.instanceInfo = this.distributeStatus.InstanceItem;
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
    handleInstanceId() {},
    //选择项目列表
    getSelectPlan(val) {
      this.planChecked = val.toString();
    },
    // 搜索
    handleSearch() {
      var search = this.inputValue
      if (search) {
        this.table1data = this.table1data.filter(function (product) {
          return Object.keys(product).some(function (key) {
            return (
              String(product[key])
                .toLowerCase()
                .indexOf(search) > -1
            )
          })
        })
      } else {
        this.table1data = JSON.parse(localStorage.getItem('projectList'))
      }
    },
    handleCancel(val) {
      if (val) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2"),
          ProjectId: this.planChecked
        };
        this.instanceInfo.forEach(function(item, index) {
          params["InstanceIds." + index] = item.InstanceId;
        });
        console.log(params);
        this.axios.post("cvm/ModifyInstancesProject", params).then(data => {
          if (data.Response) {
            this.$parent.getListData();
          }
        });
      }
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.distribute {
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
    font-size: 12px;
    .packdown {
      color: #006eff;
    }
    .table {
      border: 1px solid #eee;
      border-bottom: none;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>

