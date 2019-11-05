<template>
  <div class="unBind">
    <el-dialog :visible.sync="unBindObj.unBindShow" :show-close='false'>
      <div slot="title" class="title-wrap">
        <span>解绑实例</span>
        <i class="el-icon-close" @click="close"></i>
      </div>
      <div class="body">

        <el-row class="row-margin">
          <el-col :span="4">
            <div>选择地域</div>
          </el-col>
          <el-col :span="20">
            <region-select :parm='parm' @changeSelect='changeSelect'></region-select>
          </el-col>
        </el-row>

        <el-row class="row-margin">
          <el-col :span="24">
            <div>选择实例</div>
          </el-col>
          <el-col :span="24">
            <div class="table-div">
              <el-table v-loading="tableLoading" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="selectableFun" width="55">
                </el-table-column>
                <el-table-column label="实例ID/名称">
                  <template slot-scope="scope">
                    <p>{{ scope.row.InstanceId }}</p>
                    <p>{{ scope.row.InstanceName }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <span class="text-color">{{ scope.row.InstanceState | cvmState }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="所属网络">
                </el-table-column>
                <el-table-column prop="PrivateIpAddresses[0]" label="内网IP">
                </el-table-column>
                <el-table-column prop="address" label="备注">
                  <template slot-scope="scope">
                    <span class="text-color" v-if="scope.row.InstanceState === 'STOPPED'">可以解绑</span>
                    <span class="text-color" v-else-if="scope.row.InstanceState !== 'STOPPED'">关机状态下可解绑</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RegionSelect from '@/components/Tools/RegionSelect'
export default {
  props: {
    unBindObj: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      parm: 'FWQ',
      value: '',
      tableData: [],        // 表格数据
      tableLoading: false,
      unBindArr: [],          // 该条数据已经绑定的cvm
      selectedArr: []       // 表格复选框选中的数据
    }
  },
  components: {
    RegionSelect
  },
  mounted() {
    this.getCvmList()
    this.unBindArr = this.unBindObj.sshKeyInfo.AssociatedInstanceIds
  },
  methods: {
    // 城市点击事件 触发表格更新
    changeSelect(val) {
      this.getCvmList()
    },

    // 复选框选中的值
    handleSelectionChange(val) {
      this.selectedArr = val
    },

    // table表格数据
    getCvmList() {
      this.tableLoading = true
      var params = {
        Region: this.$cookie.get('regionv2'),
        Version: "2017-03-12"
      }
      this.axios
        .post("cvm2/DescribeInstances", params)
        .then(data => {
          this.tableLoading = false
          this.tableData = []
          let cvmArr = data.Response.InstanceSet
          for (let i = 0; i < this.unBindArr.length; i++) {
            for (let j = 0; j < cvmArr.length; j++) {
              if (this.unBindArr[i] === cvmArr[j].InstanceId) {
                this.tableData.push(cvmArr[j])
              }
            }
          }
        });
    },

    // 判断表格的数据是否可选
    selectableFun(row) {
      if (row.InstanceState === 'STOPPED') {
        return true
      } else {
        return false
      }
    },

    // 提交
    submitForm() {
      var params = {
        Region: this.$cookie.get('regionv2'),
        Version: "2017-03-12",
        'KeyIds.0': this.unBindObj.sshKeyInfo.KeyId
      }
      for (let i = 0; i < this.selectedArr.length; i++) {
        params['InstanceIds.' + i] = this.selectedArr[i].InstanceId
      }
      this.axios
        .post("cvm2/DisassociateInstancesKeyPairs", params)
        .then(data => {
          setTimeout(() => {
            this.$parent.getDataList()
            this.$message({
              message: '解绑成功。解绑需要时间处理，请稍后刷新查看',
              type: 'success'
            });
          }, 2000);
          this.$emit('unBindShowVal', false);
        });
    },

    // 关闭模态框
    close() {
      this.$emit('unBindShowVal', false);
    }
  }

};
</script>

<style lang='scss' scoped>
.unBind {
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
      cursor: pointer;
    }
  }
  .body {
    .row-margin:not(:first-child) {
      margin-top: 10px;
    }
    .table-div {
      margin-top: 6px;
      border: 1px solid #eaeef5;
      .text-color {
        color: rgb(240, 98, 98);
      }
    }
  }
  .dialog-footer {
    display: block;
    text-align: center;
  }
}
</style>
