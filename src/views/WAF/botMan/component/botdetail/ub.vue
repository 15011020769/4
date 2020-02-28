<template>
  <div class="main_ub">
    <el-row type="flex" justify="end" class="topSearch">
      <el-input v-model="sourceIp" placeholder="请输入源ip"></el-input>
    </el-row>
    <el-card>
      <el-table>
        <el-table-column prop="date" label="序号"  width="55"></el-table-column>
        <el-table-column prop="date" label="访问源IP"></el-table-column>
        <el-table-column prop="date" label="预测策略">
          <template slot="header" slot-scope="scope">
            <el-dropdown trigger="click" @command="onChangeScene" size="small">
              <span>
                预测策略<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="">全部</el-dropdown-item>
                <el-dropdown-item v-for="item in scene_flag_list"
                  :key="item.value" :command="item.label">
                  {{item.label}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="异常特征"></el-table-column>
        <el-table-column prop="date" label="动作" width="60"></el-table-column>
        <el-table-column prop="date" label="BOT得分" width="100" sortable></el-table-column>
        <el-table-column prop="date" label="会话总次数" width="110" sortable></el-table-column>
        <el-table-column prop="date" label="会话持续时间" width="118" sortable></el-table-column>
        <el-table-column prop="date" label="平均速率" sortable width="100"></el-table-column>
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
import moment from 'moment'
import { DESCRIBE_BOT_UB_RECORDS } from '@/constants'
import { scene_flag_list } from '../../../constants'
export default {
  data () {
    return {
      sourceIp: "",
      currentPage: 1,//当前页
      pageSize: 10,//每页长度
      totalItems: 0,//总长度
      sceneValue: "", // 预测标签匹配字段绑定值
      scene_flag_list, // 预测标签匹配字段
    }
  },
  props: {
    domain: {
      type: String,
      default: "tfc.dhycloud.com"
    },
    times: {
      type: Array,
      defaule: () => []
    }
  },
  watch: {
    domain() {

    }
  },
  mounted() {
    this.getBotUbList()
    console.log(scene_flag_list)
  },
  methods: {
    onChangeScene(scene) {
      // if (status === -1) {
      //   this.Status = ''
      // } else {
      //   this.Status = status
      // }
    },
    getBotUbList() {
      const params = {
        Version: "2018-01-25",
        Domain: this.domain,
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
