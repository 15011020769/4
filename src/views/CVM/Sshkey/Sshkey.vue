<template>
  <div class="Sshkey">

    <!-- 标题 -->
    <div class="Title">
      <div>
        <div class="Sshkey-tit">
          <h2>SSH密钥</h2>
          <el-select v-model="projectId" @change="changeProjectId" placeholder="全部项目" size="small">
            <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName" :value="item.projectId">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <!-- 功能按钮 -->
    <div class="Sshkey-operation">
      <div>
        <el-button type="primary" style="height:30px;" size="small" @click="createObj.createShow = true">创建秘钥</el-button>
      </div>

      <div>
        <search :options="options" v-on:search="search"></search>
      </div>
    </div>

    <!-- 表格 -->
    <div class="Sshkey-table">
      <el-table ref="multipleTable" v-loading="tableLoading" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="ID/名称">
          <template slot-scope="scope">
            <div class="id-name">
              <a href="javascript: void(0);" @click="$router.push({name: 'SshkeyDetail', query: {KeyId: scope.row.KeyId}})">{{ scope.row.KeyId }}</a>
              <p>{{ scope.row.KeyName }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="实例绑定情况" prop="AssociatedInstanceIds.length">
        </el-table-column>
        <el-table-column label="自定义镜像绑定情况">
          <template slot-scope="scope">
            <p>0</p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <p>{{ scope.row.CreatedTime | renderTime }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="ope-div">
              <span @click="bindObj.bindShow = true; bindObj.sshKeyInfo = scope.row">绑定</span>
              <span @click="unBindObj.unBindShow = true; unBindObj.sshKeyInfo = scope.row">解绑</span>
              <span @click="amendObj.amendShow = true; amendObj.sshKeyInfo = scope.row">修改</span>
              <span @click="deleteFun(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="Sshkey-pag">
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>

    <!-- 对话框 创建秘钥 -->
    <create :createObj="createObj" :projectId='projectId' @createShowVal='createShowVal'></create>

    <!-- 对话框 修改 -->
    <amend v-if="amendObj.amendShow" :amendObj="amendObj"  @amendShowVal='amendShowVal'></amend>

    <!-- 对话框 绑定 -->
    <bind v-if="bindObj.bindShow" :bindObj="bindObj" @bindShowVal='bindShowVal'></bind>

    <!-- 对话框 解绑 -->
    <un-bind v-if="unBindObj.unBindShow" :unBindObj="unBindObj" @unBindShowVal='unBindShowVal'></un-bind>

  </div>
</template>
<script>
import Create from './Dialog/Create' // 创建秘钥
import Amend from './Dialog/Amend' // 修改秘钥
import Bind from './Dialog/Bind' // 绑定
import UnBind from './Dialog/UnBind' // 解绑
export default {
  data () {
    return {
      projectList: JSON.parse(localStorage.getItem('projectList')), // 项目列表
      projectId: '', // 点击下拉框获取的项目id
      options: [
        // 搜索下拉数组
        {
          value: 'key-name',
          label: '名称'
        }
      ],
      searchName: '', // 搜索类型的名字
      searchVal: '', // 搜索类型的值
      tableData: [], // 表格列表数据
      tableLoading: false, // 表格加载动画
      currentPage: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      createObj: { // 创建
        createShow: false
      },
      amendObj: { // 修改
        amendShow: false,
        sshKeyInfo: {}
      },
      bindObj: { // 绑定
        bindShow: false,
        sshKeyInfo: {}
      },
      unBindObj: { // 解绑
        unBindShow: false,
        sshKeyInfo: {}
      }
    }
  },
  components: {
    Create,
    Amend,
    Bind,
    UnBind
  },
  created () {
    let allProject = {
      projectId: '',
      projectInfo: '全部项目',
      projectName: '全部项目'
    }
    this.projectList.unshift(allProject)
    this.getDataList()
  },
  methods: {
    // 获取Sshkey秘钥列表
    getDataList () {
      this.tableLoading = true
      var params = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        Offset: (this.currentPage - 1) * this.pageSize,
        Limit: this.pageSize
      }
      if (this.projectId !== '') {
        params['Filters.0.Name'] = 'project-id'
        params['Filters.0.Values.0'] = this.projectId
        if (this.searchName === 'key-name') {
          params['Filters.1.Name'] = 'key-name'
          params['Filters.1.Values.0'] = this.searchVal
        }
      } else {
        if (this.searchName === 'key-name') {
          params['Filters.0.Name'] = 'key-name'
          params['Filters.0.Values.0'] = this.searchVal
        }
      }

      this.axios.post('cvm2/DescribeKeyPairs', params).then(data => {
        this.tableLoading = false
        this.tableData = data.Response.KeyPairSet
        this.totalPage = data.Response.TotalCount
      })
    },

    // 更换项目事件
    changeProjectId () {
      this.getDataList()
    },

    // 搜索
    search (searchInput, searchSelect) {
      this.searchName = searchSelect
      this.searchVal = searchInput
      this.getDataList()
    },

    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.currentPage = 1
      this.getDataList()
    },

    // 当前页
    currentChangeHandle (val) {
      this.currentPage = val
      this.getDataList()
    },

    // 接收关闭创建秘钥对话框传的值
    createShowVal (val) {
      this.createObj.createShow = val
    },

    // 接收修改秘钥对话框传的值
    amendShowVal (val) {
      this.amendObj.amendShow = val
    },

    // 接收绑定秘钥对话框传的值
    bindShowVal (val) {
      this.bindObj.bindShow = val
    },

    // 解绑
    unBindShowVal (val) {
      this.unBindObj.unBindShow = val
    },

    // 删除
    deleteFun (sshKeyInfo) {
      this.$confirm('确定对选中密钥进行删除?', '删除密钥', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          Version: '2017-03-12',
          Region: this.$cookie.get('regionv2'),
          'KeyIds.0': sshKeyInfo.KeyId
        }
        this.axios
          .post('cvm2/DeleteKeyPairs', params)
          .then(data => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDataList()
          })
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Sshkey {
  .Sshkey-tit {
    margin-left: 0px;
    ::v-deep .el-input__inner {
      border: 0;
    }
  }
  .Sshkey-operation {
    display: flex;
    justify-content: space-between;
    margin: 20px 20px 10px 20px;
  }
  .Sshkey-table {
    margin: 5px 20px 20px 20px;
    background: #fff;
    .ope-div {
      span:not(:first-child) {
        margin-left: 8px;
      }
      span {
        color: #217cf3;
        cursor: pointer;
      }
    }
  }
  .Sshkey-pag {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
