<template>
  <div class="Cam">
    <div class="container">
      <div class="container-left">
        <p>关联用户</p>
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
                    :command="item"
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
          :data="transfer_data_right"
          tooltip-effect="dark"
          size="small"
          height="300"
          style="width: 100%"
        >
          <el-table-column prop="name" label="用户组/用户名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="100">
            <template slot-scope="scope">
              <p v-show="scope.row.type == 'user'">用户</p>
              <p v-show="scope.row.type == 'group'">用户组</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('CAM.CAM.userGroup.colHandle')" width="50">
            &lt;!&ndash;
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, transfer_data_right)"
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
    PolicyId: Number
  },
  data() {
    return {
      //  用户/用户组列表
      transfer_data: [{}],
      // 选定的用户列表
      transfer_data_right: [],
      transferUserData: [],
      transferGroupData: [],
      commandObj: {},
      totalNum: "",
      search: "",
      rp: 20,
      page: 1,
      tableTitle: "切换成用户组",
      handoverFlag: false,
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
    this.transfer_data_right = []
    this.getList()
  },
  methods: {
    getList () {
      //系统默认加载用户list
      this.getUserList()
    },
    // 1.查询用户列表
    getUserList() {
      this.commandObj = { value: "user", label: "用户" }
      console.log('getUserList*******************start*******************');
      console.log(this.transfer_data_right);
      this.transfer_data = []
      let paramsUser = {
        Action: 'ListUsers',
        Version: '2019-01-16'
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
      console.log(this.transfer_data_right);
      console.log('getUserList*******************end*******************');
    },
    // 2.查询用户组列表ListGroups
    getGroupList() {
      console.log('getGroupList==========start=====');
      console.log(this.transfer_data_right);
      this.transfer_data = []
      let paramsGroup = {
        Action: 'ListGroups',
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
      console.log(this.transfer_data_right);
      console.log('getGroupList==========end======');
    },
    handleCommand(command) {
      debugger
      this.handoverFlag = true
      this.commandObj = command
      console.log('handleCommand+++start+++++++++++');
      console.log(this.transfer_data_right);
      this.tableTitle = command.label;
      if(command!= '' && command.value === 'user'){
        this.getUserList()
      }
      if(command!= '' && command.value === 'group'){
        this.getGroupList()
      }
      console.log('handleCommand+++end+++++++++++');
    },
    handleSelectionChange(val) {
      debugger
      console.log('-------handleSelectionChange---------start-------------------------');
      console.log(this.transfer_data_right);
      if(this.commandObj.value != '' && this.commandObj.value === 'user'){
        this.transferUserData = val
      }
      if(this.commandObj.value != '' && this.commandObj.value === 'group'){
        this.transferGroupData = val
      }
      if(this.transferUserData != ''){
        this.transfer_data_right.push(this.transferUserData)
      }
      if(this.transferGroupData != ''){
        this.transfer_data_right.push(this.transferGroupData)
      }
      // if(this.handoverFlag === false){
      //   this.transfer_data_right = val;
      // }
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      // this.transfer_data_right = val;
      console.log(this.transfer_data_right);
      console.log('--------handleSelectionChange--------end-------------------------');
      this.handoverFlag = false
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
    getUserSelData() {
      return this.transfer_data_right;
    },
    // 关联用户/用户组
    attachPolicy() {
      let _this = this
      let transfer_data_right = this.transfer_data_right
      console.log(transfer_data_right)
      let policyId = this.PolicyId //获取策略ID,父页面传递参数。
      if(policyId != undefined && policyId != '') {
        for(let i=0; i < transfer_data_right.length; i++) {
          let obj = transfer_data_right[i]
          if(obj != '' && obj.type === 'user') {
            // 定义策略添加到用户params；系统接口是单条绑定，多条数据需要循环调用接口，params只能作为局部参数存在，多条数据循环时，参数会出现后一条数据会覆盖上一条数据，
            let paramsUser = {
              Action: 'AttachUserPolicy',
              Version: '2019-01-16',
              PolicyId: policyId,
              AttachUin: obj.id
            }
            _this.attachUserPolicy(paramsUser)
          }
          if(obj != '' && obj.type === 'group') {
            // 定义策略添加到用户组params
            let paramsGroup = {
              Action: 'AttachGroupPolicy',
              Version: '2019-01-16',
              PolicyId: policyId,
              AttachGroupId: obj.id
            }
            _this.attachGroupPolicy(paramsGroup)
          }
        }
      }
    },
    // 绑定策略到用户组
    attachGroupPolicy(params) {
      this.$axios.post('cam2/AttachGroupPolicy', params).then(res  => {
        console.log(res)
      })
    },
    // 绑定策略到用户
    attachUserPolicy(params) {
      this.$axios.post('cam2/AttachUserPolicy', params).then(res  => {
        console.log(res)
      })
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