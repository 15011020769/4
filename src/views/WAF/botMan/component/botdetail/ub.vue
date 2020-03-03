<template>
  <div class="main_ub">
    <el-row type="flex" justify="end" class="topSearch">
      <el-input v-model="sourceIp" placeholder="请输入源ip"></el-input>
    </el-row>
    <el-card>
      <el-table :data="ubList">
        <el-table-column label="序号"  width="50">
          <template slot-scope="scope">{{ scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="SrcIp" label="访问源IP"></el-table-column>
        <el-table-column prop="date" label="预测策略">
          <template slot="header" slot-scope="scope">
            <el-dropdown trigger="click" @command="onChangeScene" size="small">
              <span>
                预测标签<i class="el-icon-arrow-down el-icon--right"></i>
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
        <el-table-column prop="date" label="异常特征" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.bot_feature.join('、')" placement="right">
              <p>{{scope.row.bot_feature | botFeatureFilter}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="Action" label="动作" width="60">
          <template slot-scope="scope">
            <span class="addRed">{{action[scope.row.Action]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Score" label="BOT得分" width="100" sortable>
          <template slot-scope="scope">
            {{scope.row.Score.Total}}
          </template>
        </el-table-column>
        <el-table-column prop="Nums" label="会话总次数" width="110" sortable></el-table-column>
        <el-table-column label="会话持续时间" width="118" sortable :formatter="formatSessionDuration">
        </el-table-column>
        <el-table-column label="平均速率" sortable width="100">
          <template slot-scope="scope">
            {{parseInt(scope.row.Stat.AvgSpeed)}}次/分
          </template>
        </el-table-column>
        <el-table-column label="最新检测时间" sortable :formatter="formatDate"></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button @click="goDetail(scope)" type="text" size="mini">查看详情</el-button>
          </template>
        </el-table-column>
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
      ubList: "", //ub列表
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
    // console.log(scene_flag_list)
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
    onChangeScene(scene) {
      
    },
    getBotUbList() {
      const params = {
        Version: "2018-01-25",
        Domain: this.domain,
        StartTs: this.times[0],
        EndTs: this.times[1],
        Skip: 0,
        Limit: 5,
      }
      this.axios.post(DESCRIBE_BOT_UB_RECORDS, params).then(resp => {
        this.generalRespHandler(resp, ({Data}) => {
          console.log(Data)
          this.ubList = Data.Res
          this.totalItems = Data.TotalCount
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
    formatDate(row) {
      return moment(row.Timestamp).format('YYYY-MM-DD HH:mm:ss')
    },
    // 换算时分秒
    formatSessionDuration(row) {
      const value = row.SessionDuration * 60
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
  .addRed {
    color: #e1504a;
  }
}
</style>
