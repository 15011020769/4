<template>
  <div class="Cbs-project">
    <el-dialog :visible.sync="projectShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="600px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>分配至项目</span>
        <i class="el-icon-close"
          @click="close"></i>
      </div>

      <div class="Cbs-mountbottom"> 您已选 1台 云硬盘 <a @click="Detailshow">查看详情</a></div>
      <div v-if="Detailsshow"
        class="Cbs-mountbottom">
        <el-table :data="tableData"
          border
          style="width: 100%">
          <el-table-column prop="date"
            label="No."
            width="55">
            <template slot-scope="scope">
              1
            </template>
          </el-table-column>
          <el-table-column prop="DiskName"
            label="云硬盘名称"
            width="120">
          </el-table-column>
          <el-table-column prop="DiskId"
            label="云硬盘ID"
            width="120">
          </el-table-column>
          <el-table-column prop=""
            label="计费模式"
            width="80">
            <template slot-scope="scope">
              {{scope.row.DiskChargeType|Billingmodelfilter()}}
            </template>
          </el-table-column>
          <el-table-column prop="DeadlineTime"
            label="到期/创建时间">
            <template slot-scope="scope">
              {{scope.row.DeadlineTime}} 到期
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="Cbs-projecttable">
        <el-input placeholder="搜索项目名称/说明"
          v-model="input">
          <el-button slot="append"
            icon="el-icon-search"
            @click="search"></el-button>
        </el-input>
        <el-table :data="table1data"
          border
          height="300px"
          v-loading='loading'
          style="width: 100%">
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio class="radio"
                v-model="radio"
                :label="scope.row"
                @change='radiovalue'>&nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="projectName"
            label="项目名称">

          </el-table-column>
          <el-table-column prop="projectInfo"
            label="项目说明">

          </el-table-column>

        </el-table>
      </div>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary" :disabled=" this.Selection===''"
          @click="project">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    projectShow: Boolean,
    Cbsdata: Object
  },
  data () {
    return {
      Detailsshow: false,
      tableData: [],
      radio: '1',
      table1data: JSON.parse(localStorage.getItem('projectList')),
      loading: false,
      input: '', // 搜索
      Selection: ''
    }
  },
  components: {},
  created () {
    this.tableData.push(this.Cbsdata)
  },
  methods: {
    Detailshow () {
      this.Detailsshow = !this.Detailsshow
    },
    search () {
      var search = this.input

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
    radiovalue (data) {
      this.Selection = data
    },
    // 挂载确定
    project () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'DiskIds.0': this.Cbsdata.DiskId,
        ProjectId: this.Selection.projectId
      }
      this.axios.post('cbs2/ModifyDiskAttributes', parms).then(data => {
        if (data.Response.Error === undefined) {
          this.$emit('projectShow', false)
          this.$parent.getDataList()
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        }
      })
    },

    // 取消
    close () {
      this.$emit('projectShow', false)
    }
  }
}
</script>

<style lang="scss" >
.Cbs-project {
  a {
    cursor: pointer;
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
      cursor: pointer;
    }
  }
  .el-dialog__body {
    padding: 10px 20px 30px;
    font-size: 12px;
    line-height: 20px;
  }
  .Cbs-projecttable {
    .el-input-group > .el-input__inner {
      width: 503px;
    }
  }
  .Cbs-mountbottom {
    margin-bottom: 15px;
  }
}
</style>
