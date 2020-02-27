<template>
  <div class="main_ub">
    <el-row type="flex" justify="end" class="topSearch">
      <el-input v-model="sourceIp" placeholder="请输入源ip"></el-input>
    </el-row>
    <el-card>
      <el-table>
        <el-table-column prop="date" label="序号"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="date" label="访问源IP"></el-table-column>
        <el-table-column prop="date" label="预测标签"></el-table-column>
        <el-table-column prop="date" label="异常特征"></el-table-column>
        <el-table-column prop="date" label="动作"></el-table-column>
        <el-table-column prop="date" label="BOT得分" sortable></el-table-column>
        <el-table-column prop="date" label="会话总次数" sortable></el-table-column>
        <el-table-column prop="date" label="会话持续时间" sortable></el-table-column>
        <el-table-column prop="date" label="平均速率" sortable></el-table-column>
        <el-table-column prop="date" label="最新检测时间" sortable></el-table-column>
        <el-table-column prop="date" label="操作" ></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalItems"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { DESCRIBE_BOT_UB_RECORDS } from '@/constants'
import moment from 'moment'
export default {
  data () {
    return {
      sourceIp: "",
      currentPage: 1,//当前页
      pageSize: 10,//每页长度
      totalItems: 0,//总长度
    }
  },
  props: {
    domin: {
      type: String,
      default: "tfc.dhycloud.com"
    },
    times: {
      type: Array,
      defaule: () => []
    }
  },
  mounted() {
    this.getBotUbList()
  },
  methods: {
    getBotUbList() {
      const params = {
        Version: "2018-01-25",
        Domain: this.domin,
        StartTs: moment(this.times[0]).utc().valueOf(),
        EndTs: moment(this.times[1]).utc().valueOf(),
        Skip: 0,
        Limit: 5,
      }
      this.axios.post(DESCRIBE_BOT_UB_RECORDS, params).then(resp => {
        this.generalRespHandler(resp, (Response) => {
          console.log(Response)
        })
      })
    },
      // 分页开始
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    },
  }
}

</script>
<style lang='scss' scoped>
//  ::v-deep .el-table {
//     th {
//       line-height: 23px;
//       .cell {
//         height: 23px;
//         line-height: 23px;
//         // background-color: red;
//         & > div {
//           line-height: 23px;
//           padding: 0;
//         }
//       }
//     }
//   }
.main_ub {
  .topSearch {
    ::v-deep .el-input {
      width: 250px;
    }
  }
}
</style>
