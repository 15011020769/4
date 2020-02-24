<template>
  <div>
    <div class="wrapper">
      <div class="topTip">{{t('创建成功的日志下载任务，只保留7天；7天后日志文件将会删除，请及时下载', 'WAF.cjrwdrzxzrw')}}。</div>
      <div class="taskListCon">
        <el-table :data="tableDataBegin" :empty-text="t('暂无数据', 'WAF.zwsj')">
          <el-table-column prop="ID" :label="t('序号', 'WAF.xh')" width></el-table-column>
          <el-table-column prop="Name" :label="t('任务名称', 'WAF.rwmc')" width></el-table-column>
          <el-table-column prop="Host" label="域名"></el-table-column>
          <el-table-column prop="Count" :label="t('日志条目数', 'WAF.rztms')"></el-table-column>
          <el-table-column prop="CreateTime" :label="t('创建时间', 'WAF.xh')"></el-table-column>
          <el-table-column prop="ExpireTime" :label="t('过期时间', 'WAF.gqsj')"></el-table-column>
          <el-table-column prop="Status" :label="t('状态', 'WAF.zt')"></el-table-column>
          <el-table-column prop="action" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="text" :disabled="true" size="small" @click="downLoad(scope.$index, scope.row)">{{t('下载', 'WAF.xz')}}</el-button>
              <!-- <el-button @click.native.prevent="deleteRow(scope.$index, tableDataBegin)" type="text" size="small">移除</el-button> -->
              <el-popover
                ref="popovers"
                placement="bottom"
                width="280"
                :value="deleteVisible">
                <div class="prpoDialog">
                  <h1>确认删除？</h1>
                  <p>删除后，将无法查询和下载</p>
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
      </div>
      <div class="Right-style pagstyle tabListPage">
        <span class="pagtotal">共&nbsp;{{totalItems}}&nbsp;条</span>
        <el-pagination
          :page-size="pageSize"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="totalItems"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { DESCRIBE_ATTACK_DOWNLOAD_RECORD } from '@/constants'
export default {
  data() {
    return {
      tableDataBegin: [], //表格数据
      currentPage: 1, //当前页
      pageSize: 10, //每页长度
      totalItems: 0, //总长度
      deleteVisible:false,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取数据
    getData() {
      this.axios.post(DESCRIBE_ATTACK_DOWNLOAD_RECORD, {
        Version: '2018-01-25',
      }).then(resp => {
        this.generalRespHandler(resp, ({ Records }) => {
          this.tableDataBegin = Records
        })
      })
      this.totalItems = this.tableDataBegin.length;
    },
    // 分页开始
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    //下载按钮
    downLoad() {},
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
</style>