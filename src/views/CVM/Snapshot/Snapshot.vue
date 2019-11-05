<template>
  <div class="shot">
    <div class="Title">
      <div>
        <div class="shot-tit">
          <h2>快照</h2>
          <el-select v-model="projectId"
            @change="changeProjectId"
            placeholder="全部项目"
            size="small">
            <el-option v-for="item in projectList"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId">
            </el-option>
          </el-select>
        </div>
        <p>快照使用指南</p>
      </div>
    </div>
    <div class="shot-City">
      <!-- 城市列表 -->
      <City :parm="parm"
        v-on:changeCity="changeCity"></City>
    </div>
    <div class="shot-information">
      <p>温馨提示： </p>
      <p>1、云硬盘快照已于2019年1月22日0点启动正式商业化， 商业化后所有存量快照和新产生的快照将根据占用存储容量进行收费，详细可见 商业化公告</p>
      <p>2、您可以根据使用规划进行提前准备， </p>
      <p>
        <ul>
          <li>继续使用快照：您可以参考商业化公告里的建议调整策略，减少可能的开销 </li>
          <li>不再使用快照：建议您检查和删除所有快照和定期快照策略，避免商业化后产生费用  </li>
        </ul>
      </p>
      <p>3、定期快照功能已上线，您可指定硬盘关联到自动快照策略，每天定时定点地创建、删除快照，为您的业务保驾护航。</p>
      <p>4、请您注意：账户欠费时快照的相关操作都将被禁止。账户欠费时间达到 30 天时，账户下的所有快照都将被删除。 </p>
      <p>使用限制： </p>
      <p>1、数量限制：当前地域最多创建 192 个快照，已创建 36 个（数量配额 = 云硬盘数 * 64 + 64）</p>
    </div>
    <div class="shot-operation">
      <div>
        <el-button v-if="multipleSelection.length === 0" style="height:30px;" title="请选择你需要删除的快照" size="small" disabled>删除</el-button>
        <el-button v-if="multipleSelection.length !== 0" style="height:30px;" size="small" @click="handleDel(multipleSelection)">删除</el-button>
      </div>
      <div>
        <search :options="options"
          v-on:search="search"  class="btn-do"></search>
          <i class="el-icon-download"> </i>
      </div>

    </div>
    <div class="shot-table">
      <el-table ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="dataListLoading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="ID/名称">
          <template slot-scope="scope">
            <div class="id-name">
              <a href="javascript:void(0);" @click="$router.push({name: 'shotDetail', query: {SnapshotId: scope.row.SnapshotId}})">{{scope.row.SnapshotId}}</a>
              <p>{{ scope.row.SnapshotName}}  <i class="el-icon-edit" @click="editObj.editShow = true;editObj.shotInfo = scope.row"></i> </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="SnapshotState"
          label="状态"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p :class="scope.row.SnapshotState ==='NORMAL' ? 'green-c':'red-c'">{{ scope.row.SnapshotState| shotState()}}</p>
          </template>
        </el-table-column>
        <el-table-column label="云硬盘大小"
          show-overflow-tooltip>
           <template slot-scope="scope">
              <p>{{ scope.row.DiskSize}} G</p>
          </template>
        </el-table-column>
        <el-table-column prop="DiskUsage"
          label="快照类型"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{ scope.row.DiskUsage| Attributefilter()}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="DiskId"
          label="	关联硬盘"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <p>{{ scope.row.DiskId}} </p>
          </template>
        </el-table-column>
        <el-table-column label="硬盘挂载实例"
           width="65">
          <template slot-scope="">
              <p>-</p>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime"
          label="	创建时间"
          show-overflow-tooltip>
           <template slot-scope="scope">
              <p>{{ scope.row.CreateTime}} </p>
          </template>
        </el-table-column>
        <el-table-column label="保留时间"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <p>{{scope.row.IsPermanent === true ? '永久保留':'非永久保留'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
           <template slot-scope="scope">
              <div class="operation">
                <el-tooltip class="item" effect="light" content="关联硬盘已被隔离或删除，无法执行回滚操作" placement="top-start">
                   <el-button v-if="scope.row.DiskUsage === 'SYSTEM_DISK' " type="text" size="small" disabled>回滚</el-button>
                   <el-button v-else @click="handleBack(scope.row)" type="text" size="small" >回滚</el-button>
                </el-tooltip>
                <el-button @click="deleteFun(scope.row)" type="text" size="small">删除</el-button> </br>
                <el-tooltip class="item" effect="light" content="系统盘无法创建云硬盘" placement="top-start">
                  <el-button v-if="scope.row.DiskUsage === 'SYSTEM_DISK'"  type="text"   size="small" disabled>新建云硬盘</el-button>
                  <el-button v-else  type="text" size="small" @click="NewBuildDia()">新建云硬盘</el-button>
                </el-tooltip>
              </div>
            </template>
        </el-table-column>

      </el-table>
      <div class="shot-pag">
        <el-pagination @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <back :backVal="backVal" v-if="backVal.backshot" v-on:close="backClose"></back>
      <delshot  :shotVal="shotVal" v-if="shotVal.delshot" v-on:close="delClose"></delshot>
      <editname v-if="editObj.editShow" :editObj="editObj" @editShowVal='editShowVal'></editname>
      <!-- 新建模态框 -->
      <NewBuild :NewDialog="NewDialog" v-if="NewDialog" v-on:close="NewDialogClose"></NewBuild>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
import back from './modal/back'
import delshot from './modal/delshot'
import editname from './modal/editname'
import NewBuild from '@/views/CVM/Cbs/model/Newly/Newlybuild'
export default {
  data () {
    return {
      parm: 'FWQ', // 城市列表接口参数
      options: [ // 搜索字段
        {
          value: 'snapshot-name',
          label: '名称'
        },
        {
          value: 'snapshot-id',
          label: 'ID'
        }
      ],
      projectList: JSON.parse(localStorage.getItem('projectList')), // 项目列表
      projectId: '', // 点击下拉框获取的项目id
      tableData: [], // 表格列表数据
      multipleSelection: [], // 多选
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      dataListLoading: false, // 表格加载
      shotInfo: {},
      shotVal: {
        delshot: false, // 创建弹框显示隐藏
        shotId: '', // 传id值
        selection: ''
      },
      backVal: {
        backshot: false,
        backId: ''
      },
      editObj: {
        editShow: false,
        shotInfo: {}
      },
      NewDialog: false

    }
  },
  components: {
    back,
    delshot,
    editname,
    NewBuild
  },
  created () {
    this.getDataList()
    let allProject = {
      projectId: '',
      projectInfo: '全部项目',
      projectName: '全部项目'
    }
    this.projectList.unshift(allProject)
  },
  methods: {
    // 列表加载
    getDataList () {
      this.dataListLoading = true
      var params = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        Offset: this.pageIndex * this.pageSize - this.pageSize,
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

      this.axios.post('cbs2/DescribeSnapshots', params).then(data => {
        this.tableData = data.Response.SnapshotSet
        this.totalPage = data.Response.TotalCount
        // console.log(this.tableData)
        this.dataListLoading = false
      })
    },
    // 城市切换
    changeCity (city) {
      this.dataListLoading = false
      // 城市切换
      this.getDataList()
    },
    //  所属项目
    changeProjectId () {
      this.getDataList()
    },
    // 搜索
    search (searchInput, searchSelect) {
      if (searchInput !== '' && searchSelect !== '') {
        this.dataListLoading = true
        // console.log(searchInput, searchSelect)
        var parms = {
          Version: '2017-03-12',
          Region: this.$cookie.get('regionv2'),
          Offset: this.pageIndex * this.pageSize - this.pageSize,
          Limit: this.pageSize,
          'Filters.0.Name': searchSelect,
          'Filters.0.Values.0': searchInput
        }
        this.axios.post('cbs2/DescribeSnapshots', parms).then(data => {
          this.tableData = data.Response.SnapshotSet
          this.totalPage = data.Response.TotalCount
          this.dataListLoading = false
        })
      } else {
        this.getDataList()
      }
    },
    // 新建云硬盘
    NewBuildDia () {
      this.NewDialog = true
    },
    NewDialogClose () {
      this.NewDialog = false
    },
    // 修改名字
    editShowVal (val) {
      this.editObj.editShow = val
    },
    // 删除单个
    deleteFun (shotInfo) {
      this.$confirm('确定对选中快照进行删除?', '删除快照', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          Version: '2017-03-12',
          Region: this.$cookie.get('regionv2'),
          'SnapshotIds.0': shotInfo.SnapshotId
        }
        this.axios
          .post('cbs2/DeleteSnapshots', params)
          .then(data => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDataList()
          })
      }).catch(() => {

      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 每页数
    sizeChangeHandle (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageIndex = 1
    },
    // 当前页
    currentChangeHandle (val) {
      console.log(`当前页: ${val}`)
      this.pageIndex = val
    },
    // 回滚模态窗
    handleBack (id) {
      // console.log(id)
      this.backVal.backshot = true
      this.backVal.backId = id
    },
    backClose () {
      this.backVal.backshot = false
    },
    // 删除模态窗
    handleDel (id) {
      this.shotVal.delshot = true
      this.shotVal.shotId = this.$route.query.SnapshotId
      this.shotVal.selection = id
      // console.log(id)
    },
    delClose () {
      this.shotVal.delshot = false
    },
    // 详情页
    Details (id) {
      // console.log(id)
      this.$router.push({
        name: 'shotDetail',
        query: {
          SnapshotId: id
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.shot {
  .shot-tit{
    margin-left: 0px;
    ::v-deep .el-input__inner {
      border: 0;
    }
  }
  .shot-City{
    margin: 20px;
  }
  .shot-information {
    margin: 20px;
    line-height: 20px;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    p {
      padding-left: 20px;
      ul{
        padding-left: 25px;
        list-style: square;
      }
    }
  }
  .shot-operation {
    display: flex;
    justify-content: space-between;
    margin: 0 20px;
    .btn-do{
      float: left;
    }
    .el-icon-download{
      font-size: 18px;
      line-height: 28px;
      margin-left: 10px;
    }
  }
  .shot-table {
    margin: 20px;
    background: #fff;
    p,
    a {
      font-size: 10px;
    }
    ::v-deep .cell{
      white-space: nowrap;
    }
  }
  .shot-pag {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
