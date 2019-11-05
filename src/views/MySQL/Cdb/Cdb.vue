<template>
  <div class="Cdb">
    <div class="Title">
      <div>
        <h2>MySQL-实例列表</h2>
        <p> 云数据库帮助文档 </p>
      </div>
    </div>
    <!-- 文字介绍 -->
    <div class="Cdb-information">
      <p> 数据库专场特惠，MySQL低至2.5折起，送6个月数据传输，立即参与，更多活动请扫码腾讯云数据库公众号</p>
    </div>
    <!-- 城市列表 -->
    <div class="Cdb-City">
      <City :parm="parm"
        v-on:changeCity="changeCity"></City>
    </div>
    <!-- 工具类 -->
    <div class="Cdb-operation">
      <div>
        <el-button type="primary"
          style="height:30px;"
          size="small">新建</el-button>
      </div>
      <div>
        <search :options="options"
          v-on:search="search"></search>
      </div>
    </div>
    <!-- 表格分页 -->
    <div class="Cdb-table">
      <el-table ref="multipleTable"
        v-loading='loading'
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="ID/类型/实例名">
          <template slot-scope="scope">
            <a @click="routerTo(scope.row.InstanceId)">{{ scope.row.InstanceId }}</a>
            <p>{{ scope.row.InstanceName}} <i class="el-icon-edit"
                @click="modifyNameShow=true;Cbsdata=scope.row"></i> </p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="监控/状态/任务">
          <template slot-scope="scope">
            <a @click="routerTo(scope.row.DiskId)"> <i class="el-icon-share"></i></a>
            <div v-if="scope.row.InitFlag===0">
              未初始化
            </div>
            <div v-if="scope.row.InitFlag===1">
              <p :class="scope.row.Status===0?'blue-c':(scope.row.Status===1?'green-c':(scope.row.Status===4?'blue-c':'red-c'))">{{scope.row.Status|MYSQLFilter()}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="DiskState"
          label="可用区"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{ scope.row.Zone | Regionfilter()}}</p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="配置"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{ scope.row.DeviceType| MYSQLFilter()}}</p>
            <p>{{scope.row.Cpu}}核{{scope.row.Qps}}MB{{scope.row.Volume}}GB</p>
          </template>
        </el-table-column>

        <el-table-column prop="address"
          label="数据库版本"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p>MySQL{{ scope.row.EngineVersion}}</p>

          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="内网地址"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{scope.row.Vip}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="计费方式"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if="scope.row.PayType===1">按量计费</p>
            <p v-if="scope.row.PayType===0">包年包月</p>
          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="所属项目"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{scope.row.ProjectId}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="操作"
          width="170"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <ul class="table-operation">
              <li>
                <el-button type="text"
                  @click="snapshotShow=true;Cbsdata=scope.row">初始化</el-button>

              </li>
              <li>
                <el-button type="text">管理</el-button>
              </li>
              <li>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <p @click="restartShow=true;Cdbdata=scope.row">重启</p>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p @click="renewShow=true;Cdbdata=scope.row">续费</p>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p>升级版本</p>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p>调整配置</p>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p @click="AutrenewallShow=true;Cdbdata=scope.row">设置自动续费</p>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p>取消自动续费</p>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p>销毁/退货退费</p>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p>参数设置</p>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p @click="projectShow=true;Cdbdata=scope.row">分配至项目</p>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p @click="LabelShow=true;Cdbdata=scope.row">编辑标签</p>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p>安全组</p>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </li>
            </ul>
          </template>
        </el-table-column>

      </el-table>
      <div class="Cdb-pag">
        <el-pagination @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    <!-- 分配至项目模态框 -->
    <project v-if="projectShow"
      :projectShow='projectShow'
      :Cdbdata='Cdbdata'
      @projectShow="Modalproject"></project>
    <!-- 编辑标签模态框 -->
    <Label v-if="LabelShow"
      :LabelShow='LabelShow'
      :Cdbdata='Cdbdata'
      @LabelShow='ModalLabel'></Label>
    <!-- 重启模态框 -->
    <restart v-if="restartShow"
      :restartShow='restartShow'
      :Cdbdata='Cdbdata'
      @restartShow='Modalrestart'></restart>
    <!-- 续费模态框 -->
    <renew v-if="renewShow"
      :renewShow="renewShow"
      :Cdbdata='Cdbdata'
      @renewShow='Modalrenew'></renew>
    <!-- 设置自动续费模态框 -->
    <Autrenewal v-if="AutrenewallShow"
      :AutrenewallShow="AutrenewallShow"
      :Cdbdata='Cdbdata'
      @AutrenewallShow='ModalAutrenewall'></Autrenewal>
  </div>
</template>

<script>
import project from './modal/allocationproject'
import Label from './modal/Label'
import restart from './modal/restart'
import renew from './modal/renew'
import Autrenewal from './modal/Autrenewal'
export default {
  data () {
    return {
      parm: 'MYSQL', // 城市列表接口参数
      options: [
        {
          value: 'InstanceTypes.0',
          label: '实例类型'
        },
        {
          value: 'ProjectId',
          label: '项目ID'
        },
        {
          value: 'Vips.0',
          label: '内网 IP'
        },
        {
          value: 'Status.0',
          label: '实例状态'
        },
        {
          value: 'PayTypes.0',
          label: '付费类型'
        },
        {
          value: 'InstanceNames.0',
          label: '实例名称'
        }
      ],
      multipleSelection: [], // 选中数据
      loading: false, // 表格加载动画
      tableData: [], // 表格数据
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      projectShow: false, // 分配至项目模态框
      LabelShow: false, // 编辑标签模态框
      restartShow: false, // 重启模态框
      renewShow: false, // 续费模态框
      AutrenewallShow: false // 设置自动续费模态框
    }
  },
  components: {
    project,
    Label,
    restart,
    renew,
    Autrenewal
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取表格数据
    getDataList () {
      this.loading = true
      var parms = {
        Version: '2017-03-20',
        Region: this.$cookie.get('regionv2'),
        Offset: this.pageIndex * this.pageSize - this.pageSize,
        Limit: this.pageSize
      }
      this.axios.post('cdb2/DescribeDBInstances', parms).then(data => {
        this.tableData = data.Response.Items
        this.totalPage = data.Response.TotalCount
        this.loading = false
      })
    },
    // 城市切换
    changeCity (city) {
      this.getDataList()
    },
    // 搜索
    search (searchInput, searchSelect) {
      if (searchInput !== '' && searchSelect !== '') {
        this.loading = true
        var parms = {
          Version: '2017-03-20',
          Region: this.$cookie.get('regionv2'),
          Offset: this.pageIndex * this.pageSize - this.pageSize,
          Limit: this.pageSize
        }
        parms[searchSelect] = searchInput
        this.axios.post('cdb2/DescribeDBInstances', parms).then(data => {
          this.tableData = data.Response.Items
          console.log(this.tableData)
          this.totalPage = data.Response.TotalCount
          this.loading = false
        })
      } else {
        this.getDataList()
      }
    },
    handleSelectionChange (val) {
      // 表格选中
      this.multipleSelection = val
    },
    // 每页数
    sizeChangeHandle (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      console.log(`当前页: ${val}`)
      this.pageIndex = val
      this.getDataList()
    },
    // 模态框
    Modalproject (val) {
      this.projectShow = val
    },
    ModalLabel (val) {
      this.LabelShow = val
    },
    Modalrestart (val) {
      this.restartShow = val
    },
    Modalrenew (val) {
      this.renewShow = val
    },
    ModalAutrenewall (val) {
      this.AutrenewallShow = val
    }
  }
}
</script>

<style lang="scss" scoped>
.Cdb {
  a,
  i {
    cursor: pointer;
  }
  .Cdb-information {
    margin: 20px;
    height: 40px;
    line-height: 40px;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    p {
      padding-left: 20px;
    }
  }
  .Cdb-City {
    margin-left: 20px;
    margin-top: 20px;
  }
  .Cdb-operation {
    display: flex;
    justify-content: space-between;
    margin: 0 20px;
  }

  .Cdb-table {
    margin: 20px;
    background: #fff;
    p,
    a {
      font-size: 10px;
    }
    .table-operation {
      display: flex;
      justify-content: space-between;
      .el-dropdown-link {
        line-height: 40px;
        cursor: pointer;
        color: #409eff;
      }
      span {
        color: #ccc;
        line-height: 40px;
        cursor: no-drop;
      }

      .span-style {
        color: red;
      }
    }
  }
  .Cdb-pag {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
