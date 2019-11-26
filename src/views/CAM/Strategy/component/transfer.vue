<template>
  <div class="Cam">
    <div class="container">
      <div class="container-left">
        <p>关联用户（共{{totalNum}}条）</p>
        <el-input size="mini" v-model="search" style="width:85%" @keyup.enter.native="toQuery"/>
        <el-button size="mini" class="suo" icon="el-icon-search" @click="toQuery"></el-button>
        <el-table
          class="table-left"
          ref="multipleOption"
          :data="transfer_data"
          size="small"
          height="300"
          tooltip-effect="dark"
          style="width: 100%"
          @row-click="selectedRow"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" prop="id" width="28"></el-table-column>
          <el-table-column prop="name" label="用户" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{scope.row.name}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="切换成用户组" width="200">
            <template slot="header">
              <el-dropdown trigger="click" @command="handleCommand" size="mini">
                <span style="color:#909399">
                  {{ tableTitle }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in table_options2"
                    :key="item.value"
                    :command="item.label"
                  >{{item.label}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <div v-if="scope.row.type == 'user'">用户</div>
              <div v-else-if="scope.row.type == 'group'">用户组</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="abs">
        <div>&nbsp;</div>
      </div>
      <div class="container-left">
        <span>已选择（共条）</span>
        <el-table
          class="table-left"
          ref="multipleSelected"
          :data="policiesSelectedData"
          tooltip-effect="dark"
          size="small"
          height="300"
          style="width: 100%"
        >
          <el-table-column prop="policyName" label="用户组/用户名" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{scope.row.policyName}}</p>
              <p>{{scope.row.description}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="100">
          </el-table-column>
          <el-table-column :label="$t('CAM.CAM.userGroup.colHandle')" width="50">
            &lt;!&ndash;
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, policiesSelectedData)"
                type="text"
                size="small"
              >x</el-button>
            </template>&ndash;&gt;
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // policiesSelectedData: () => []
    // policiesSelectedData: Array
  },
  data() {
    return {
      //  用户/用户组列表
      transfer_data: [{}],
      // 选定的用户列表
      transfer_data_right: [],
      
      policiesSelectedData: [],
      totalNum: "",
      search: "",
      rp: 20,
      page: 1,
      tableTitle: "切换成用户组",
      table_options2: [
        {
          value: "user",
          label: "用户"
        },
        {
          value: "group",
          label: "用户组"
        },
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList () {
      console.log('method getData')
      this.transfer_data.splice(0, this.transfer_data.length)
      this.transfer_data_right.splice(0, this.transfer_data_right.length)
      // 1.查询用户列表
      let paramsUser = {
        Version: '2019-01-16',
      }
      this.$axios.post('cam2/ListUsers', paramsUser).then(res => {
        for(let i in res.Response.Data) {
          let str = {}
          str.name = res.Response.Data[i].Name
          str.id = res.Response.Data[i].Uin
          str.type = 'user'
          this.transfer_data.push(str)
        }
      })
      // 2.查询用户组列表ListGroups
      let paramsGroup = {
        Version: '2019-01-16',
      }
      this.$axios.post('cam2/ListGroups', paramsGroup).then(res => {
        for(let i in res.Response.GroupInfo) {
          let str = {}
          str.name = res.Response.GroupInfo[i].GroupName
          str.id = res.Response.GroupInfo[i].GroupId
          str.type = 'group'
          this.transfer_data.push(str)
        }
      })
      // 3.查询策略关联的实体列表
      // let params2 = {
      //   Version: '2019-01-16',
      //   PolicyId: policy.PolicyId
      // }
      // this.$axios.post('cam2/ListEntitiesForPolicy', params2).then(res  => {
      //   console.log(res)
      // })
    },
    handleCommand(command) {
      console.log(command);
      this.tableTitle = command;
    },
    handleSelectionChange(val) {
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      this.policiesSelectedData = val;
    },
    selectedRow(row, column, event) {
      // 设置选中或者取消状态
      this.$refs.multipleOption.toggleRowSelection(row);
    },
    deleteRow(index, rows) {
      // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
      this.$refs.multipleOption.toggleRowSelection(rows[index], false);
    },
    toQuery() {
      this.init();
    },
    getDaata() {
      return this.policiesSelectedData;
    }
  }
};
</script>
<style lang="scss" scoped>
.Cam {
  .container {
    width: 96%;
    height: 270px;
    min-height: 360px;
    margin: 10px auto 0;
    background: #fff;
    padding: 20px;
    p.title,
    p.explain {
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }
    p.explain {
      font-size: 12px;
      color: #ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }
    .abs {
      display: inline-block;
      width: 100px;
      height: 300px;
      text-align: center;
    }
    .container-left {
      width: 44%;
      display: inline-block;
    }
  }
}
</style>