<template>
  <div class="main_ub">
    <el-row type="flex" justify="end" class="topSearch">
      <el-input v-model="sourceIp" placeholder="请输入源IP或策略名称"></el-input>
    </el-row>
    <el-card>
      <el-table
        :data="ucbList"
        style="width: 100%"
      >
        <el-table-column prop="date" label="序号"  width="50">
          <template slot-scope="scope">{{ scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="SrcIp" label="访问源IP"></el-table-column>
        <el-table-column prop="RuleName" label="策略名称"></el-table-column>
        <!-- <el-table-column prop="bot_feature" label="异常特征" width="120" :show-overflow-tooltip="true" :formatter="formatBotFeature"></el-table-column> -->
        <el-table-column prop="bot_feature" label="异常特征" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.bot_feature.join('、')" placement="right">
              <p>{{scope.row.bot_feature | botFeatureFilter}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="Action" label="动作" width="60">
          <template slot-scope="scope">
           {{action[scope.row.Action]}}
          </template>
        </el-table-column>
        <el-table-column prop="Score" label="BOT得分" width="100" sortable>
          <template slot-scope="scope">
            {{scope.row.Score.Total}}
          </template>
        </el-table-column>
        <el-table-column prop="Nums" label="会话总次数" width="110" sortable></el-table-column>
        <el-table-column prop="date" label="会话持续时间" width="118" sortable  :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{formatSeconds(scope.row.SessionDuration * 60)}}
          </template>
        </el-table-column>
        <el-table-column prop="date" label="平均速率" sortable width="100">
          <template slot-scope="scope">
            {{parseInt(scope.row.Stat.AvgSpeed)}}次/分
          </template>
        </el-table-column>
        <el-table-column prop="date" label="最新检测时间" width="120" sortable :formatter="formatDate">
        </el-table-column>
        <el-table-column prop="date" label="操作">
           <el-button @click="goDetail(scope)" type="text" size="mini">查看详情</el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageLimit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalItems"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import { DESCRIBE_BOT_UCB_RECORDS } from '@/constants'
import { scene_flag_list } from '../../../constants'
export default {
  data () {
    return {
      sourceIp: "",
      ucbList: [],
      currentPage: 1,//当前页
      pageLimit: 10,//每页长度
      pageSkip: 0,
      totalItems: 0,//总长度
      sceneValue: "", // 预测标签匹配字段绑定值
      scene_flag_list, // 预测标签匹配字段
      action: {'intercept': '拦截', 'monitor': '监控'},
    }
  },
  props: {
    domain: {
      type: String,
      default: "",
    },
    times: {
      type: Array,
      defaule: () => []
    }
  },
  watch: {
    domain() {
      this.getBotUcbList()
    },
    times() {
      this.getBotUcbList()
    }
  },
  mounted() {
    this.getBotUcbList()
  },
  filters: {
    botFeatureFilter(text) {
      if (text.length > 5) {
        text = text.slice(0, 5)
        return text.join('') + '...'
      }
      return text.join('')
    }
  },
  methods: {
    getBotUcbList() {
      const params = {
        Version: "2018-01-25",
        Domain: this.domain,
        StartTs: moment(this.times[0]).utc().valueOf(),
        EndTs: moment(this.times[1]).utc().valueOf(),
        Skip: this.pageSkip,
        Limit: this.pageLimit,
      }
      this.axios.post(DESCRIBE_BOT_UCB_RECORDS, params).then(resp => {
        this.generalRespHandler(resp, ({Data}) => {
          console.log(Data)
          this.ucbList = Data.Res
          this.totalItems = Data.TotalCount
        })
      })
    },
    // 查看详情
    goDetail(scope) {
      // this.$router.push({
      //   path: "/"
      // })
    },
    // 分页开始
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageLimit = val
      this.currentPage = val
      this.pageOffset = 0
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageOffset = (val - 1) * this.pageLimit
    }, 
    formatSeconds(value) {
      let secondTime = parseInt(value);// 秒
      let minuteTime = 0;// 分
      let hourTime = 0;// 小时
      if(secondTime > 60) {
        minuteTime = parseInt(secondTime / 60); 
        secondTime = parseInt(secondTime % 60); 
        if(minuteTime > 60) {
            hourTime = parseInt(minuteTime / 60);   
            minuteTime = parseInt(minuteTime % 60);
        }
      }
      let result = "" + parseInt(secondTime) + "秒";
      if(minuteTime > 0) {
          result = "" + parseInt(minuteTime) + "分" + result;
      }
      if(hourTime > 0) {
          result = "" + parseInt(hourTime) + "小时" + result;
      }
      return result;
    },
    formatDate(row) {
      return moment(row.Timestamp).format('YYYY-MM-DD HH:mm:ss')
    },
    formatBotFeature(row) {
      if (row.bot_feature.length > 5) {
        row.bot_feature = row.bot_feature.slice(0, 5)
        return row.bot_feature + '...'
      }
      return row.bot_feature
    }
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
      margin-bottom: 10px;
    }
  }
}
</style>
