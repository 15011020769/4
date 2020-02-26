<template>
  <div>
    <div class="wrapper">
      <div class="topTip">{{t('创建成功的日志下载任务，只保留7天；7天后日志文件将会删除，请及时下载', 'WAF.cjrwdrzxzrw')}}。</div>
      <el-card>
        <el-table :data="tableDataBegin" :empty-text="t('暂无数据', 'WAF.zwsj')">
          <el-table-column prop="ID" :label="t('序号', 'WAF.xh')" width></el-table-column>
          <el-table-column prop="Name" :label="t('任务名称', 'WAF.rwmc')" width></el-table-column>
          <el-table-column prop="Host" label="域名">
            <template slot-scope="scope">
              {{scope.row.Host === 'all' ? '全部' : scope.row.Host}}
            </template>
          </el-table-column>
          <el-table-column prop="Count" :label="t('日志条目数', 'WAF.rztms')"></el-table-column>
          <el-table-column prop="CreateTime" :label="t('创建时间', 'WAF.cjsj')">
            <template slot-scope="scope">
              {{formatTime(scope.row.CreateTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="ExpireTime" :label="t('过期时间', 'WAF.gqsj')">
            <template slot-scope="scope">
              {{formatTime(scope.row.ExpireTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="Status" :label="t('状态', 'WAF.zt')">
            <template slot-scope="scope">
              <span v-if="scope.row.Status === 1" class="completed">已完成</span>
              <span v-else class="create">{{t('创建中', 'WAF.cjz')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" :disabled="scope.row.Status === 0" size="small" @click="downLoad(scope.row)">{{t('下载', 'WAF.xz')}}</el-button>
              <el-popover
                ref="popovers"
                placement="bottom"
                width="280"
                :value="deleteVisible">
                <div class="prpoDialog">
                  <h1>{{t('确认删除', 'WAF.qrsc')}}？</h1>
                  <p>{{('删除后，将无法查询和下载', 'WAF.schjwfcx')}}</p>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" size="mini" @click="deleteVisibleSure(scope.$index)">{{t('确定', 'WAF.qd')}}</el-button>
                  <el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
                </div>
                <el-button slot="reference" style="color:#3E8EF7;" class="deleteBtn">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20, 25, 30, 35, 40, 45, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="totalItems">
        </el-pagination>
      </el-card>
    </div>
  </div>
</template>
<script>
import { DESCRIBE_ATTACK_DOWNLOAD_RECORD } from '@/constants'
import moment from 'moment';
export default {
  props: {
    active: String,
  },
  data() {
    return {
      tableDataBegin: [], //表格数据
      currentPage: 1, //当前页
      pageSize: 10, //每页长度
      totalItems: 0, //总长度
      deleteVisible:false,
    };
  },
  watch: {
    active(n) {
      if (n === 'second') {
        this.getData()
      }
    }
  },
  methods: {
    formatTime(mm) {
      return moment(mm * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    //获取数据
    getData() {
      this.axios.post(DESCRIBE_ATTACK_DOWNLOAD_RECORD, {
        Version: '2018-01-25',
      }).then(resp => {
        this.generalRespHandler(resp, ({ Records }) => {
          Records.reverse()
          this.tableDataBegin = Records
        })
      })
      this.totalItems = this.tableDataBegin.length;
    },
    // 分页开始
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //下载按钮
    downLoad(log) {
      window.open(log.Url)
    },
    //删除确定按钮
    deleteVisibleSure(index){
      console.log(this.$refs['popovers'])
      console.log(this.deleteVisible)
      // this.$refs['popovers'].addEventListener('click', function(e) {
        this.deleteVisible=false;
      // })
    },
    
  }
};
</script>
<style lang="scss" scoped>
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.topTip {
  font-size: 12px;
  line-height: inherit;
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  background: #e5f0ff;
  margin-bottom: 15px;
}
.taskListCon {
  min-height: 450px;
  background-color: #fff;
  margin-top: 20px;
}
.tabListPage {
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding-top: 8px;
  height: 50px;
}

.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  // padding: 20px;
  border-top: 1px solid #ddd;
  background-color: #fff;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.prpoDialog {
  text-align: center;
  h1 {
    margin: 15px 0;
    font-size: 14px;
    color: #000;
    font-weight: 600;
  }
  p {
    font-size: 12px;
  }
}
.deleteBtn{
  border:none;
  font-size:12px;
}
.completed {
  color: #0ABF5B;
}
.create {
  color: #FF9D00;
}
</style>