<template>
  <div>
    <div class="title_top">
      <h1>跟踪集</h1>
    </div>
    <div class="tea-content__body">
      <div class="explain">
        <p>
          <span>1. 在公测阶段，只能创建一个跟踪集，</span>
          <a href="JavaScript:;">跟踪集使用指南。</a>
        </p>
        <p>
          <span
            >2.
            当您的跟踪集为正常状态时，跟踪集会将您账号下的操作日志记录，存储到跟踪集配置的存储桶中；当您的跟踪集为关闭状态，操作日志不会存储到对应的存储桶。</span
          >
        </p>
        <p>
          <span>3. 因为记录跟踪日志，所产生的COS存储费用，将依据COS标准计费进行收取，</span>
          <a href="JavaScript:;">查看COS计费详情。</a>
        </p>
      </div>
      <div class="btn">
        <el-button :plain="true" v-if="!isDisabled" @click="Create()">创建</el-button>
        <div class="over" v-if="isDisabled">
          <el-button class="btn-dis" disabled>创建</el-button>
          <p>目前只支持创建一个跟踪集</p>
        </div>
      </div>
      <div class="tables">
        <el-table :data="tableData" style="width: 100%">
          <template slot="empty">暂无跟踪集</template>
          <el-table-column prop="name" label="名称">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text">{{
                scope.row.name
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="isMultiRegionAudit" label="全部区域">
            <template slot-scope="scope">
              <div v-if="scope.row.isMultiRegionAudit == 1">是</div>
              <div v-if="scope.row.isMultiRegionAudit == 0">否</div>
            </template>
          </el-table-column>
          <el-table-column prop="bucketName" label="COS 存储桶"></el-table-column>
          <el-table-column prop="prefix" label="日志文件前缀"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <div v-if="scope.row.status == 0" class="close_color">关闭</div>
              <div v-if="scope.row.status == 1" class="off_color">开启</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { GZJ_LIST } from '@/constants'
export default {
  data () {
    return {
      value1: '',
      input3: '',
      isDisabled: false, // 创建按钮
      visible: false,
      tableData: [] // 列表数据
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 详情页跳转
    handleClick (rows) {
      this.$router.push({
        path: '/DetailAudit',
        query: {
          AuditName: rows.name
        }
      })
    },
    // 创建
    Create () {
      this.$router.push({
        path: '/NewAudit'
      })
    },
    getData () {
      let params = {
        Version: '2019-03-19',
        Region: 'ap-guangzhou'
      }
      this.axios.post('cloudaudit/ListAudits', params).then(({ data }) => {
        console.log(data)
        this.tableData = data.auditLists
        if (this.tableData.length >= 1) {
          this.isDisabled = true
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.title_top {
  height: 50px;
  background: #fff;
  h1 {
    padding-left: 20px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 700;
  }
}
.tea-content__body {
  padding: 20px;
  .explain {
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    p {
      line-height: 20px;
    }
  }
}
.btn {
  .over {
    position: relative;
    width: 66px;
    height: 30px;
    overflow: hidden;
    & > p {
      width: 144px;
      position: absolute;
      left: 30px;
      color: #fff;
      background: rgb(29, 29, 29);
      padding: 5px 10px;
      border-radius: 5px;
      z-index: 100;
      font-size: 12px;
    }
  }
  :hover {
    overflow: visible;
  }
  .el-button {
    height: 30px;
    background-color: #006eff;
    color: #fff;
    border: 1px solid #006eff;
    line-height: 0px;
    border-radius: 0px;
    font-size: 12px !important;
  }
  .el-button.is-plain:hover {
    background-color: #0063e5;
    color: #fff;
    border: 1px solid #0063e5;
  }
  .btn-dis {
    border-color: #ddd;
    background-color: #fff;
    color: #bbb;
    cursor: not-allowed;
  }
}
.tables {
  margin-top: 10px;
  .el-table {
    font-size: 12px;
  }
  .el-table th > .cell {
    font-size: 12px;
  }

  .el-table .cell {
    height: 23px;
  }
  .el-button--text {
    height: 23px;
    line-height: 0px;
    font-size: 12px;
  }
  .el-table td:nth-of-type(2) {
    color: #006eff;
  }
  .close_color {
    color: #e54545;
  }
  .off_color {
    color: #0abf5b;
  }
}
</style>
