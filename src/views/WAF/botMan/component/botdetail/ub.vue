<template>
  <div class="main_ub">
    <el-card>
      <el-table
        :data="ubList"
        row-key="Id"
        :empty-text="t('暂无数据', 'WAF.zwsj')"
        v-loading="loading"
      >
        <el-table-column
          type="selection"
          class-name="hide"
          width="1"
        />
        <el-table-column :label="t('序号', 'WAF.xh')"  width="50">
          <template slot-scope="scope">{{ scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="SrcIp" :label="t('访问源IP', 'WAF.fwyip')"></el-table-column>
        <el-table-column prop="RuleName">
          <el-dropdown slot="header" trigger="click" @command="onChangeScene" size="small">
            <span>
              {{t('预测标签', 'WAF.ycbq')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="">全部</el-dropdown-item>
              <el-dropdown-item v-for="item in scene_flag_list"
                :key="item.value" :command="item.value">
                {{item.label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <template slot-scope="scope">{{formatRuleName(scope.row.RuleName)}}</template>
        </el-table-column>
        <el-table-column prop="date" :label="t('异常特征', 'WAF.yctz')" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.bot_feature.join('、')" placement="right">
              <p>{{scope.row.bot_feature | botFeatureFilter}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="Action" :label="t('动作', 'WAF.dz')" width="60">
          <template slot-scope="scope">
            <span class="addRed">{{UCB_ACTION_LOCAL[scope.row.Action]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Score" width="100">
          <el-button type="text" slot="header" style="padding: 0; color: #444;" @click="setSort('score.total')">
            BOT 得分
            <i class="el-icon-caret-top" v-if="sort === 'score.total:1'"></i>
            <i class="el-icon-caret-bottom" v-if="sort === 'score.total:-1'"></i>
            <i class="el-icon-d-caret" v-if="!sort.includes('score.total')"></i>
          </el-button>
          <template slot-scope="scope">
            {{scope.row.Score.Total}}
          </template>
        </el-table-column>
        <el-table-column prop="Nums" width="120">
          <el-button type="text" slot="header" style="padding: 0; color: #444;" @click="setSort('nums')">
            {{t('会话总次数', 'WAF.hhzcs')}}
            <i class="el-icon-caret-top" v-if="sort === 'nums:1'"></i>
            <i class="el-icon-caret-bottom" v-if="sort === 'nums:-1'"></i>
            <i class="el-icon-d-caret" v-if="!sort.includes('nums')"></i>
          </el-button>
        </el-table-column>
        <el-table-column width="118" :formatter="formatSessionDuration">
          <el-button type="text" slot="header" style="padding: 0; color: #444;" @click="setSort('session_duration')">
            {{t('会话持续时间', 'WAF.hhcxsj')}}
            <i class="el-icon-caret-top" v-if="sort === 'session_duration:1'"></i>
            <i class="el-icon-caret-bottom" v-if="sort === 'session_duration:-1'"></i>
            <i class="el-icon-d-caret" v-if="!sort.includes('session_duration')"></i>
          </el-button>
        </el-table-column>
        <el-table-column width="100">
          <el-button type="text" slot="header" style="padding: 0; color: #444;" @click="setSort('stat.avg_speed')">
            平均速率
            <i class="el-icon-caret-top" v-if="sort === 'stat.avg_speed:1'"></i>
            <i class="el-icon-caret-bottom" v-if="sort === 'stat.avg_speed:-1'"></i>
            <i class="el-icon-d-caret" v-if="!sort.includes('stat.avg_speed')"></i>
          </el-button>
          <template slot-scope="scope">
            {{parseInt(scope.row.Stat.AvgSpeed)}}次/分
          </template>
        </el-table-column>
        <el-table-column label="最新检测时间" width="150" :formatter="formatDate">
          <el-button type="text" slot="header" style="padding: 0; color: #444;" @click="setSort('timestamp')">
            {{t('最新检测时间', 'WAF.zxjcsh')}}
            <i class="el-icon-caret-top" v-if="sort === 'timestamp:1'"></i>
            <i class="el-icon-caret-bottom" v-if="sort === 'timestamp:-1'"></i>
            <i class="el-icon-d-caret" v-if="!sort.includes('timestamp')"></i>
          </el-button>
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope="scope">
            <el-button @click="onEdit(scope)" type="text" size="mini">加黑</el-button>
            <el-button @click="goDetail(scope)" type="text" size="mini">{{t('查看详情', 'WAF.ckxq')}}</el-button>
          </template>
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
    <el-dialog
      title="添加黑IP"
      :visible.sync="addBWmodel"
      width="45%"
      destroy-on-close
      @close="ipInfo={}"
    >
      <addBlack @success="closeHBDialog" :isShow.sync="addBWmodel" :ipInfo="ipInfo"/>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import addBlack from './module/addBlack'
import { DESCRIBE_BOT_UB_RECORDS } from '@/constants'
import { scene_flag_list, UCB_ACTION_LOCAL, } from '../../../constants'
import { isValidIPAddressNew } from '@/utils' // 验证IP地址是否有效
export default {
  data () {
    return {
      ubList: [], //ub列表
      pageLimit: 10,//每页长度
      currentPage: 1,
      totalItems: 0,//总长度
      sceneValue: "", // 预测标签匹配字段绑定值
      scene_flag_list, // 预测标签匹配字段
      sort: 'timestamp:-1',
      action: '',
      loading: true,
      UCB_ACTION_LOCAL,
      addBWmodel:false, //添加黑白IP弹框
      ipInfo: {}
    }
  },
  props: {
    domain: String,
    sourceIp: String,
    id: Number,
    times: {
      type: Array,
      defaule: () => []
    }
  },
  watch: {
    domain() {
      this.init()
    },
    id() {
      this.init()
    },
    times(n, o) {
      if (n.join() !== o.join()) {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  components: {
    addBlack
  },
  filters: {
    botFeatureFilter(text) {
      if (text.length > 5) {
        text = text.slice(0, 5)
        return text.join('') + '...'
      }
      return text.join('')
    },
  },
  methods: {
    init() {
      if(this.domain) {
        this.getBotUbList()
      }
    },
    // 加黑
    onEdit({ row }) {
      this.ipInfo = {
        Domain: this.domain,
        ipAddress: row.SrcIp,
        datatime: moment().add(7, 'd'),
        timeValue: moment().add(7, 'd').format('YYYY-MM-DD 23:59:59'),
      }
      this.addBWmodel = true
    },
     //关闭
    closeHBDialog(isShow){
      this.addBWmodel = false ;
      this.ipInfo = {}
      this.getBotUbList()
    },
    setSort(key) {
      if (this.sort.includes(key)) { // 升降序
        if (this.sort.includes('-')) {
          this.sort = `${key}:1`
        } else {
          this.sort = `${key}:-1`
        }
      } else { // 换个排序字段 默认降序
        this.sort = `${key}:-1`
      }
      this.init()
    },
    onChangeScene(scene) {
      this.sceneValue = scene
      this.init()
    },
    getBotUbList() {
      this.loading = true
      const params = {
        Version: "2018-01-25",
        Domain: this.domain,
        StartTs: this.times[0],
        EndTs: this.times[1],
        Skip: (this.currentPage - 1) * this.pageLimit,
        Limit: this.pageLimit,
      }
      params.Sort = this.sort
      if (this.action) {
        params.Action = this.action
      }
      if (this.sourceIp) {
        if (isValidIPAddressNew(this.sourceIp)) {
          params.Ip = this.sourceIp
        } else {
          params.Name = this.sourceIp
        }
      }
      if (this.sceneValue) {
        params.Name = this.sceneValue
      }
      this.axios.post(DESCRIBE_BOT_UB_RECORDS, params)
      .then(resp => {
        this.generalRespHandler(resp, ({Data}) => {
          this.ubList = Data.Res
          this.totalItems = Data.TotalCount
        })
      })
      .then(() => {
        this.loading = false
      })
    },
      // 分页开始
    handleSizeChange(val) {
      this.pageLimit = val;
      this.getBotUbList()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBotUbList()
    },
    // 查看详情
    goDetail(scope) {
      this.$router.push({
        path: "/botDetail/ucb",
        query: {
          SrcIp: scope.row.SrcIp,
          domain: this.domain,
          Id: scope.row.Id
        }
      })
    },
    // 转换时间
    formatDate(row) {
      return moment(row.Timestamp).format('YYYY-MM-DD HH:mm:ss')
    },
    formatRuleName(RuleName) {
      let label = ""
      this.scene_flag_list.map(v => {
        if(v.value == RuleName) {
          label =  v.label
        }
      })
      return label
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
          result = "" + parseInt(hourTime) + "小" + this.t('时', 'WAF.hour') + result;
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
  margin-top: 20px;
  // .topSearch {
  //   ::v-deep .el-input {
  //     width: 250px;
  //   }   
  // }
  .addRed {
    color: #e1504a;
  }
}
::v-deep .hide {
  visibility: hidden;
}
</style>
