<template>
  <div class="Cbs">
    <!-- 头部 -->
    <div class="Title">
      <div>
        <h2>云硬盘</h2>
        <p> 云硬盘使用指南 </p>
      </div>
    </div>
    <!-- 城市列表 -->
    <div class="Cbs-City">
      <City :parm="parm"
        v-on:changeCity="changeCity"></City>
    </div>
    <!-- 文字介绍 -->
    <div class="Cbs-information">
      <p> 云硬盘快照已于2019年1月22日0点启动正式商业化，如何更好更省地使用快照保护您的数据安全，请查看 业化公告</p>
    </div>
    <!-- 工具类 -->
    <div class="Cbs-operation">
      <div>
        <el-button type="primary"
          style="height:30px;"
          size="small"
          @click="NewBuildDia()">新建</el-button>
      </div>

      <div>
        <search :options="options"
          v-on:search="search"></search>
      </div>
    </div>
    <!-- 表格分页 -->
    <div class="Cbs-table">
      <el-table ref="multipleTable"
        v-loading='loading'
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="ID/名称">
          <template slot-scope="scope">
            <a @click="routerTo(scope.row.DiskId)">{{ scope.row.DiskId }}</a>
            <p>{{ scope.row.DiskName}} <i class="el-icon-edit"
                @click="modifyNameShow=true;Cbsdata=scope.row"></i> </p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="监控">
          <template slot-scope="scope">
            <a @click="routerTo(scope.row.DiskId)"> <i class="el-icon-share"></i></a>
          </template>
        </el-table-column>
        <el-table-column prop="DiskState"
          label="状态"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p :class="scope.row.DiskState==='UNATTACHED'?'orange-c':(scope.row.DiskState==='ATTACHED'?'green-c':(scope.row.DiskState==='ATTACHING'?'blue-c':'red-c'))">{{ scope.row.DiskState | Statefilter()}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="可用区"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{ scope.row.Placement.Zone | Regionfilter()}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="属性"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{ scope.row.DiskUsage| Attributefilter()}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="配置"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{ scope.row.DiskType| Toconfigurefilter()}}</p>
            <p>{{scope.row.DiskSize}}GB</p>
          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="关联实例"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if="scope.row.InstanceId!==''">{{scope.row.InstanceId}}</p>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="计费方式"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{ scope.row.DiskChargeType| Billingmodelfilter()}}</p>
            <p>{{scope.row.DeadlineTime}}到期</p>
          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="随实例释放"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if="scope.row.DeleteWithInstance===false">不随实例释放</p>
            <p v-if="scope.row.DeleteWithInstance===true">随实例释放</p>
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
                  v-if="scope.row.DiskChargeType!=='POSTPAID_BY_HOUR' && scope.row.DeleteWithInstance===false"
                  @click="renewShow=true;Cbsdata=scope.row">续费
                </el-button>
                <el-tooltip class="item"
                  v-else-if="scope.row.DiskChargeType==='POSTPAID_BY_HOUR'"
                  effect="light"
                  content="按量计费的云硬盘无需续费，请保持账户余额充足"
                  placement="bottom-start">
                  <span>续费</span>
                </el-tooltip>
                <el-tooltip class="item"
                  v-else-if="scope.row.DeleteWithInstance===true"
                  effect="light"
                  content="与CVM一同购买的云硬盘，在CVM续费时，将一并续费"
                  placement="bottom-start">
                  <span>续费</span>
                </el-tooltip>

              </li>
              <li>
                <el-button type="text"
                  @click="snapshotShow=true;Cbsdata=scope.row">创建快照</el-button>
              </li>
              <li>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <p @click="CapacityShow=true;Cbsdata=scope.row"
                        v-if="scope.row.DiskUsage!=='SYSTEM_DISK'">扩容</p>
                      <el-tooltip class="item"
                        v-else
                        effect="light"
                        content="扩容系统盘需要前往势力控制台进行重装系统操作，建议您挂载新的数据盘或扩容原有的数据盘"
                        placement="bottom-start">
                        <span class="span-style">扩容</span>
                      </el-tooltip>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p @click="mountShow=true;Cbsdata=scope.row"
                        v-if="scope.row.DiskState==='UNATTACHED'">挂载</p>
                      <el-tooltip class="item"
                        v-else
                        effect="light"
                        content="待挂载状态才可进行挂载"
                        placement="bottom-start">
                        <span class="span-style">挂载</span>
                      </el-tooltip>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p @click="uninstallShow=true;Cbsdata=scope.row"
                        v-if="scope.row.DiskState==='ATTACHED'">卸载</p>

                      <el-tooltip class="item"
                        v-else
                        effect="light"
                        content="已挂载状态才可进行挂载"
                        placement="bottom-start">
                        <span class="span-style">卸载</span>
                      </el-tooltip>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p @click="renewalShow=true;Cbsdata=scope.row"
                        v-if="scope.row.DiskChargeType!=='POSTPAID_BY_HOUR'">设置自动续费</p>
                      <el-tooltip class="item"
                        v-else
                        effect="light"
                        content="按量计费无需自动续费"
                        placement="bottom-start">
                        <span class="span-style">设置自动续费</span>
                      </el-tooltip>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p @click="projectShow=true;Cbsdata=scope.row"
                        v-if="scope.row.DiskUsage!=='SYSTEM_DISK'">分配至项目</p>
                      <el-tooltip class="item"
                        v-else
                        effect="light"
                        content="系统盘项目跟随挂载到实例，不支持独立调整"
                        placement="bottom-start">
                        <span class="span-style">分配至项目</span>
                      </el-tooltip>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p @click="DestructionShow=true;Cbsdata=scope.row"
                        v-if="scope.row.DiskState!=='ATTACHED'">销毁/退还</p>
                      <el-tooltip class="item"
                        v-else
                        effect="light"
                        content="已挂载云硬盘不支持退还"
                        placement="bottom-start">
                        <span class="span-style">销毁/退还</span>
                      </el-tooltip>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <p @click="attributeShow=true;Cbsdata=scope.row"
                        v-if="scope.row.DiskUsage!=='SYSTEM_DISK' &&scope.row.DiskChargeType!=='PREPAID'">修改属性</p>
                      <el-tooltip class="item"
                        v-else
                        effect="light"
                        content="系统盘，包年包月数据盘不支持修改属性"
                        placement="bottom-start">
                        <span class="span-style">修改属性</span>
                      </el-tooltip>
                    </el-dropdown-item>

                    <el-dropdown-item>
                      <p @click="LabelShow=true;Cbsdata=scope.row">编辑标签</p>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </li>
            </ul>
          </template>
        </el-table-column>

      </el-table>
      <div class="Cbs-pag">
        <el-pagination @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    <!-- 新建模态框 -->
    <NewBuild :NewDialog="NewDialog"
      v-if="NewDialog"
      v-on:close="NewDialogClose"></NewBuild>
    <!-- 续费模态框 -->
    <renew v-if="renewShow"
      :renewShow="renewShow"
      :Cbsdata='Cbsdata'
      @renewShow='renewShow1'></renew>
    <!-- 创建快照模态框 -->
    <snapshot v-if="snapshotShow"
      :snapshotShow='snapshotShow'
      :Cbsdata='Cbsdata'
      @snapshotShow='snapshotShow1'></snapshot>
    <!-- 修改名字模态框 -->
    <modifyName v-if="modifyNameShow"
      :modifyNameShow='modifyNameShow'
      :Cbsdata='Cbsdata'
      @modifyNameShow='modifyNameShow1'></modifyName>
    <!-- 扩容模态框 -->
    <Capacity v-if="CapacityShow"
      :CapacityShow='CapacityShow'
      :Cbsdata='Cbsdata'
      @CapacityShow='CapacityShow1'></Capacity>
    <!-- 挂载模态框 -->
    <mount v-if="mountShow"
      :mountShow='mountShow'
      :Cbsdata='Cbsdata'
      @mountShow='mountShow1'></mount>
    <!-- 卸载模态框 -->
    <uninstall v-if="uninstallShow"
      :uninstallShow='uninstallShow'
      :Cbsdata='Cbsdata'
      @uninstallShow='uninstallShow1'> </uninstall>
    <!-- 设置自动续费模态框 -->
    <renewal v-if="renewalShow"
      :renewalShow='renewalShow'
      :Cbsdata='Cbsdata'
      @renewalShow='renewalShow1'></renewal>
    <!-- 分配至项目模态框 -->
    <project v-if="projectShow"
      :projectShow='projectShow'
      :Cbsdata='Cbsdata'
      @projectShow='projectShow1'></project>
    <!-- 修改属性模态框 -->
    <attribute v-if="attributeShow"
      :attributeShow='attributeShow'
      :Cbsdata='Cbsdata'
      @attributeShow='attributeShow1'></attribute>
    <!-- 编辑标签模态框 -->
    <Label v-if="LabelShow"
      :LabelShow='LabelShow'
      :Cbsdata='Cbsdata'
      @LabelShow='LabelShow1'></Label>
    <!-- 销毁云硬盘 -->
    <Destruction v-if="DestructionShow"
      :DestructionShow='DestructionShow'
      :Cbsdata='Cbsdata'
      @DestructionShow='DestructionShow1'></Destruction>
  </div>
</template>
<script>
import NewBuild from './model/Newly/Newlybuild'
import renew from './model/renew'
import snapshot from './model/snapshot'
import modifyName from './model/modifyName'
import Capacity from './model/Capacity'
import mount from './model/mount'
import uninstall from './model/uninstall'
import renewal from './model/renewal'
import project from './model/allocationproject'
import attribute from './model/attribute'
import Label from './model/Label'
import Destruction from './model/Destruction'
export default {
  data () {
    return {
      NewDialog: false,
      parm: 'FWQ', // 城市列表接口参数
      options: [
        {
          value: 'disk-usage',
          label: '云盘类型'
        },
        {
          value: 'project-id',
          label: '所属项目'
        },
        {
          value: 'disk-name',
          label: '云盘名称'
        },
        {
          value: 'disk-type',
          label: '云盘介质类型'
        },
        {
          value: 'disk-state',
          label: '云盘状态'
        },
        {
          value: 'zone',
          label: '可用区'
        }
      ],
      loading: false,
      tableData: [], // 表格列表数据
      multipleSelection: [], // 选中数据
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      renewShow: false, // 续费模态框
      snapshotShow: false, // 创建快照模态框
      modifyNameShow: false, // 修改名字模态框
      CapacityShow: false, // 扩容模态框
      mountShow: false, // 挂载模态框
      uninstallShow: false, // 卸载模态框
      renewalShow: false, // 自动续费模态框
      projectShow: false, // 分配至项目模态框
      attributeShow: false, // 修改属性模态框
      LabelShow: false, // 编辑标签模态框
      DestructionShow: false, // 销毁云主机模态框
      Cbsdata: {}
    }
  },
  components: {
    NewBuild,
    renew,
    snapshot,
    modifyName,
    Capacity,
    mount,
    uninstall,
    renewal,
    project,
    attribute,
    Label,
    Destruction
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取表格数据
    getDataList () {
      this.loading = true
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        Offset: this.pageIndex * this.pageSize - this.pageSize,
        Limit: this.pageSize
      }
      this.axios.post('cbs2/DescribeDisks', parms).then(data => {
        this.tableData = data.Response.DiskSet
        console.log(this.tableData)
        this.totalPage = data.Response.TotalCount
        this.loading = false
      })
    },
    // 搜索
    search (searchInput, searchSelect) {
      if (searchInput !== '' && searchSelect !== '') {
        this.loading = true
        console.log(searchInput, searchSelect)
        var parms = {
          Version: '2017-03-12',
          Region: this.$cookie.get('regionv2'),
          Offset: this.pageIndex * this.pageSize - this.pageSize,
          Limit: this.pageSize,
          'Filters.0.Name': searchSelect,
          'Filters.0.Values.0': searchInput
        }
        this.axios.post('cbs2/DescribeDisks', parms).then(data => {
          this.tableData = data.Response.DiskSet
          this.totalPage = data.Response.TotalCount
          this.loading = false
        })
      } else {
        this.getDataList()
      }
    },
    changeCity (city) {
      // 城市切换
      this.getDataList()
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
    routerTo (id) {
      this.$router.push({
        name: `Cbs-details`,
        query: {
          id: id
        }
      })
    },
    NewBuildDia () {
      this.NewDialog = true
    },
    NewDialogClose () {
      this.NewDialog = false
    },
    // 模态框---------------------------------关闭
    renewShow1 (val) {
      this.renewShow = val
    },
    snapshotShow1 (val) {
      this.snapshotShow = val
    },
    modifyNameShow1 (val) {
      this.modifyNameShow = val
    },
    CapacityShow1 (val) {
      this.CapacityShow = val
    },
    mountShow1 (val) {
      this.mountShow = val
    },
    uninstallShow1 (val) {
      this.uninstallShow = val
    },
    renewalShow1 (val) {
      this.renewalShow = val
    },
    projectShow1 (val) {
      this.projectShow = val
    },
    attributeShow1 (val) {
      this.attributeShow = val
    },
    LabelShow1 (val) {
      this.LabelShow = val
    },
    DestructionShow1 (val) {
      this.DestructionShow = val
    }
  }
}
</script>
<style lang="scss" scoped>
.Cbs {
  a,
  i {
    cursor: pointer;
  }
  .Cbs-information {
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
  .Cbs-City {
    margin-left: 20px;
    margin-top: 20px;
  }
  .Cbs-operation {
    display: flex;
    justify-content: space-between;
    margin: 0 20px;
  }
  .Cbs-table {
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
  .Cbs-pag {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
<style lang="scss">
.el-dropdown-menu__item {
  span {
    color: #ccc;
    cursor: no-drop;
  }
}
</style>
