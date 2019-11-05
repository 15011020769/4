<template>
  <div class="func-serve">
    <div class="top-title">
      <span class="title-left">函数服务</span>
      <el-select v-model="value" placeholder="" class="selectHeight" size="mini">
        <el-option
          v-for="item in addressList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span style="font-size: 12px;margin-left: 10px;">命名空间：</span>
      <el-select v-model="value1" placeholder="" size="mini">
        <el-option
          v-for="item in space"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="icontools" @click="showManagement">
        <i class="el-icon-s-tools"></i>
      </div>
      <div class="title-right">
        <a href="" target="_blank" class="helpLink">函数服务帮助文档<i class="el-icon-share"></i></a>
      </div>
    </div>
    <management :manageDialog="manageDialog" v-on:magementClose="magementClose" ></management>
    <div class="tips">
      使用过程中遇到的任何问题，欢迎加入腾讯云SCF用户群进行交流讨论。群号：537539545
      <i class="el-icon-menu">
        <div class='logo-code'>
          <div class="triangle_border_up">
            <span></span>
          </div>
          <!-- <img src="../../assets/code.png" alt=""> -->
        </div>
      </i>
    </div>
    <div class="tableTitle">
      <div style="margin-bottom: 10px;">
        <el-button type="primary" size="mini" class="auto" @click="newFunction">新建</el-button>
        <el-input
          class="search"
          size="mini"
          placeholder="请选择您要进行过滤的标签"
          v-model="searchInput">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div style="background: #fff;padding-bottom: 80px;">
        <el-table :data="tableInfo" max-height="500" :row-style="tableRowStyle" :header-cell-style='{"font-size":"12px","font-weight" : "bolder"}'>
          <el-table-column prop="functionName" sortable label="函数名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="watch" label="监控" show-overflow-tooltip min-width="100">
          </el-table-column>
          <el-table-column prop="runtime" label="运行环境" show-overflow-tooltip min-width="150">
          </el-table-column>
          <el-table-column prop="namespace" label="描述" show-overflow-tooltip min-width="150">
          </el-table-column>
          <el-table-column prop="functionId" label="标签" show-overflow-tooltip min-width="150">
          </el-table-column>
          <el-table-column label="创建时间" width="160" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.addTime}}</span>
          </template>
          </el-table-column>
          <el-table-column label="上次修改时间" width="160" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.modTime}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="id" label="操作" width="100">
          <template slot-scope="scope">
            <span class="buttonSet" @click="showDelete(scope.$index, scope.row)">删除</span>
            <span class="buttonSet" @click="showCopy(scope.$index, scope.row)">复制</span>
          </template>
          </el-table-column>
        </el-table>
        <div style="position: relative;">
          <span style="position: absolute; top:30px;left:10px;color:#171d25;font-size:12px;">共8项</span>
          <div class="pages page-wrap wrap-end" style='margin-top:30px;float: right;'>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageInfo.pageNum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pageInfo.pageSize"
              layout="sizes, prev, pager, next, jumper"
              :total="pageInfo.totalRecord">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <deleteTableRow :deleteDialog="deleteDialog" v-on:deleteClose="deleteClose"></deleteTableRow>
    <copyTableRow :copyDialog="copyDialog" v-on:copyClose="copyClose"></copyTableRow>
  </div>
</template>

<script>
import management from './module/dialogGroups/management'
import deleteTableRow from './module/dialogGroups/deleteTableRow'
import copyTableRow from './module/dialogGroups/copyTableRow'
import { SCF_LIST } from '@/constants'
export default {
  data () {
    return {
      copyDialog: false, // 复制弹框页面
      manageDialog: false, // 命名空间
      deleteDialog: false, // 删除弹框页面
      addressList: [{
        value: '1',
        label: '广州'
      }, {
        value: '2',
        label: '上海'
      }, {
        value: '3',
        label: '香港'
      }, {
        value: '4',
        label: '北京'
      }, {
        value: '5',
        label: '成都'
      }],
      value: '1',
      space: [{
        value: '1',
        label: '广州'
      }],
      value1: '1',
      searchInput: '',
      tableInfo: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        totalRecord: 10
      }
    }
  },
  components: {
    management,
    deleteTableRow,
    copyTableRow
  },
  mounted () {
    this.getTableList()
  },
  computed: {
  },
  methods: {
    tableRowStyle ({ row, rowIndex }) {
      return {
        'font-size': '12px'
      }
    },
    showManagement () {
      this.manageDialog = true
    },
    magementClose (val) {
      this.manageDialog = false
      if (val == 1) {
        // 提交-刷新数据
      } else {
        // 关闭-不刷新数据
      }
    },
    handleSearch () {
    },
    showDelete (index, row) {
      this.deleteDialog = true
    },
    deleteClose (val) {
      this.deleteDialog = false
      if (val == 1) {
        // 提交-刷新表格
      } else {
        // 关闭-不刷新表格
      }
    },
    showCopy (index, row) {
      this.copyDialog = true
    },
    copyClose (val) {
      this.copyDialog = false
      if (val == 1) {
        // 提交-刷新表格
      } else {
        // 关闭-不刷新表格
      }
    },
    newFunction () {
      this.$router.push('/scfnewfunction')
    },
    handleSizeChange (val) {
      this.pageInfo.pageSize = val
    },
    handleCurrentChange (val) {
      this.pageInfo.pageNum = val
    },
    // 获取项目列表
    getTableList () {
      this.axios
        .get(SCF_LIST)
        .then((data) => {
          this.tableInfo = data.data.functions
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .helpLink {
    color: #333;
  }
  .helpLink:hover {
    color: #006eff;
    border-bottom: 1px solid #006eff;
  }
 .top-title {
    height: 50px;
    width: 100%;
    line-height: 50px;
    background-color: #fff;
  }
  .title-left {
    float: left;
    margin: 0 20px;
    font-weight: bolder;
    font-size: 16px;
  }
  .title-right {
    float: right;
    margin-right: 20px;
    font-size: 12px;
  }
  .icontools {
    display: inline-block;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    margin-left: 15px;
    margin-top: 5px;
    color: #888;
  }
  .icontools:hover {
    cursor: pointer;
    background: #f2f2f2;
  }
  .el-icon-s-tools {
    color: #888;
  }
  .el-select {
    width: 120px;
  }
  .el-input--suffix .el-input__inner {
    line-height: 20px!important;
  }
  .tips {
    height: 40px;
    line-height: 40px;
    margin: 20px 20px 10px 20px;
    padding-left: 20px;
    font-size: 12px;
    color: #003b80;
    background: #e5f0ff;
    border: 1px solid #97c7ff;
  }
  .el-icon-menu {
    margin-left: 3px;
    font-size: 16px;
    color: #888;
    position: relative;
    .logo-code {
      display: none;
    }
  }
  .el-icon-menu:hover {
    .logo-code {
      display:block;
    }
  }
  .tableTitle {
    padding: 0 20px;
  }
  .search {
    float: right;
    width: 250px;
    font-size: 12px;
    margin-top: 5px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bolder;
  }
  .title-wrap>i {
    font-size: 16px;
    font-weight: 900;
  }
  .logo-code {
    position: absolute;
    left: -100px;
    top: 25px;
    z-index: 1;
  }
  .triangle_border_up {
    width:0;
    height:0;
    border-width:0 10px 10px;
    border-style:solid;
    border-color:transparent transparent #fff;
    position: absolute;
    left: 100px;
    top: -6px;
  }
  .buttonSet {
    margin-right: 5px;
    font-size: 12px;
    color: #006eff;
    cursor: pointer;
  }
  .buttonSet:hover {
    border-bottom: 1px solid #006eff;
  }
  .el-icon-close {
    padding: 5px;
    color: #9c9c9c;
  }
  .el-icon-close:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
</style>
<style>
  .cell span {
    font-size: 12px;
  }
</style>
