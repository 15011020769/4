<template>
  <div class="Cam">
    <div class="container">
      <div class="container-left">
        <p>{{$t('CAM.userList.listTitle')}}</p>
          <el-input :placeholder="$t('CAM.strategy.inputContent')" size="small"  v-model="search" style="width:100%" @keyup.enter.native="toQuery">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="toQuery"></i>
          </el-input>
          <el-table class="table-left" ref="multipleOption" :data="transfer_data" size="small" :height="tableHeight"
          tooltip-effect="dark" v-loading="loading" style="width: 100%" @row-click="selectedRow"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" prop="id" width="28"></el-table-column>
          <el-table-column prop="name" :label="$t('CAM.userGroup.user')" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{scope.row.name}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="type" :label="$t('CAM.strategy.switch')" width="200">
            <template slot="header">
              <el-dropdown trigger="click" @command="handleCommand" size="mini">
                <span style="color:#909399">
                  {{ tableTitle }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in table_options2" :key="item.value" :command="item">{{item.label}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <div v-if="scope.row.type == 'user'">{{$t('CAM.userGroup.user')}}</div>
              <div v-else-if="scope.row.type == 'group'">{{$t('CAM.userList.userGroup')}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="direction">
        <div class="direction-icon">
          <i class="iconfont">&#xe603;</i>
        </div>
      </div>
      <div class="container-right">
        <span>{{$t('CAM.userList.choose')}}</span>
        <el-table class="table-left" ref="multipleSelected" :data="transfer_data_right" tooltip-effect="dark"
          size="small" :height="tableHeight" style="width: 100%">
          <el-table-column prop="name" :label="$t('CAM.strategy.nameAndGroup')" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type" :label="$t('CAM.strategy.type')" width="100">
            <template slot-scope="scope">
              <p v-show="scope.row.type == 'user'">{{$t('CAM.userGroup.user')}}</p>
              <p v-show="scope.row.type == 'group'">{{$t('CAM.userGroup.title')}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('CAM.userGroup.colHandle')" width="50">
            &lt;!&ndash;
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, transfer_data_right)" type="text" size="small">x
              </el-button>
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
        tableHeight: 300,
        //  用户/用户组列表
        transfer_data: [],
        // 选定的用户列表
        transfer_data_right: [],
        transferUserData: [],
        transferGroupData: [],
        commandObj: {},
        loading: true,
        totalNum: "",
        search: "",
        rp: 20,
        page: 1,
        tableTitle: "切换成用户组",
        handoverFlag: false,
        transferArrayFlag: false,
        transferArrayTemp: [],
        table_options2: [{
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
    mounted() {
      this.tableHeight = window.innerHeight - this.$refs.multipleOption.$el.offsetTop - 50;
    },
    methods: {
      getList() {
        //系统默认加载用户list
        this.getUserList()
      },
      // 1.查询用户列表
      getUserList() {
        let _this = this
        this.commandObj = {
          value: "user",
          label: "用户"
        }
        this.transfer_data = []
        let paramsUser = {
          Action: 'ListUsers',
          Version: '2019-01-16'
        }
      //   if (this.search != null && this.search != "") {
      //   paramsUser["Keyword"] = this.search;
      // }
      if (this.search != '') {
          paramsUser['Keyword'] = this.search
        }
        this.axios.post('cam2/ListUsers', paramsUser).then(res => {
          this.transferArrayTemp = []
          for (let i = 0; i < res.Response.Data.length; i++) {
            // for(let i in res.Response.Data) {
            let str = {}
            str.name = res.Response.Data[i].Name
            str.id = res.Response.Data[i].Uin
            str.type = 'user'
            this.transfer_data.push(str)
            // 选中数据添加选中状态
            if (this.transfer_data != '' && _this.transferUserData != '') {
              for (let j = 0; j < _this.transferUserData.length; j++) {
                // for(let j in _this.transferUserData){ //不用使用此方式，vue在if判断中会出现.id找不到异常，但是实际console.log()却可以打印出id的值。
                let selObj = _this.transferUserData[j]
                if (selObj.id === str.id) {
                  // 汇总选中状态的数据到临时数组中
                  _this.transferArrayTemp.push(str)
                }
              }
            }
          }
          /**
           * 注：正常情况，toggleRowSelection()是给穿梭框左侧的列表数据赋予：单击选中状态或者双机取消选中状态，同步将选中数据展示到右侧；
           * 因为本功能需求特殊，穿梭框左侧数据是两个不同的数据，且可以相互切换显示个子的数据，但是右侧 却要保存所有选中的数据，在数据切回时要把之前选中的数据重新赋予选中状态，
           * 但是toggleRowSelection()方法只能给单条数据赋予选中状态，同时在赋予左侧选中状态时，右侧显示数据会根据toggleRowSelection()方法传递的参数同步更新，
           * 按照正常方式，会把多条选中的数据变成一条。
           * 注2：不在上面的for(j)循环中执行toggleRowSelection()方法同样是避免丢失数据。transferUserData数组是全局变量，多条数据会被toggleRowSelection()方法传递的数据替换为一条
           * 
           * 给选中的值赋予选中状态；为了保证右侧选中的数据在切回时，左侧的数据选中状态、和右侧选中的数据不丢失，使用全局数据变量和特殊标记符号来特殊处理oggleRowSelection()方法
           */
          if (_this.transferArrayTemp != '') {
            for (let k = 0; k < _this.transferArrayTemp.length; k++) {
              let selObj = _this.transferArrayTemp[k]
              // 设置替换标志
              _this.transferArrayFlag = true
              // 穿梭框左边列表设置选中状态，此方法只能设置一条，
              this.$refs.multipleOption.toggleRowSelection(selObj);
            }
            _this.transferArrayFlag = false
          }
          this.loading = false
        })
      },
      // 2.查询用户组列表ListGroups
      getGroupList() {
        let _this = this
        this.transfer_data = []
        let paramsGroup = {
          Action: 'ListGroups',
          Version: '2019-01-16',
        }
        // if (this.search != '') {
        //   paramsGroup['Keyword'] = this.search
        // }
         if (this.search != null && this.search != "") {
        paramsGroup["Keyword"] = this.search;
      }
        this.axios.post('cam2/ListGroups', paramsGroup).then(res => {
          this.transferArrayTemp = []
          for (let i = 0; i < res.Response.GroupInfo.length; i++) {
            // for(let i in res.Response.GroupInfo) { //不用使用此方式，vue在if判断中会出现.id找不到异常，但是实际console.log()却可以打印出id的值。
            let str = {}
            str.name = res.Response.GroupInfo[i].GroupName
            str.id = res.Response.GroupInfo[i].GroupId
            str.type = 'group'
            this.transfer_data.push(str)
            if (_this.transferGroupData != '') {
              for (let j = 0; j < _this.transferGroupData.length; j++) {
                // for(let j in _this.transferGroupData){ // 使用此for会出现id找不到异常，实际是可以取到值的。
                let selObj = _this.transferGroupData[j]
                if (selObj.id === str.id) {
                  // 汇总选中状态的数据到临时数组中
                  _this.transferArrayTemp.push(str)
                }
              }
            }
          }
          /**
           * 注：正常情况，toggleRowSelection()是给穿梭框左侧的列表数据赋予：单击选中状态或者双机取消选中状态，同步将选中数据展示到右侧；
           * 因为本功能需求特殊，穿梭框左侧数据是两个不同的数据，且可以相互切换显示个子的数据，但是右侧 却要保存所有选中的数据，在数据切回时要把之前选中的数据重新赋予选中状态，
           * 但是toggleRowSelection()方法只能给单条数据赋予选中状态，同时在赋予左侧选中状态时，右侧显示数据会根据toggleRowSelection()方法传递的参数同步更新，
           * 按照正常方式，会把多条选中的数据变成一条。
           * 注2：不在上面的for(j)循环中执行toggleRowSelection()方法同样是避免丢失数据。transferUserData数组是全局变量，多条数据会被toggleRowSelection()方法传递的数据替换为一条
           * 
           * 给选中的值赋予选中状态；为了保证右侧选中的数据在切回时，左侧的数据选中状态、和右侧选中的数据不丢失，使用全局数据变量和特殊标记符号来特殊处理oggleRowSelection()方法
           */
          if (_this.transferArrayTemp != '') {
            for (let k = 0; k < _this.transferArrayTemp.length; k++) {
              let selObj = _this.transferArrayTemp[k]
              // 设置替换标志
              _this.transferArrayFlag = true
              // 穿梭框左边列表设置选中状态，此方法只能设置一条，但实际会存在多条；正常单击左边列表或者双击，会给左边数据赋予选中、或者非选中状态，都是单条数据
              this.$refs.multipleOption.toggleRowSelection(selObj);
            }
            _this.transferArrayFlag = false
          }
          // this.handoverFlag = true
          this.loading = false
        })
      },
      handleCommand(command) {
        // 设置切换状态，穿梭框左侧数据重新加载时，handleSelectionChange方法中val参数是空，但实际情况在切换前，会有存在的数据，所以不能将数据置空
        this.handoverFlag = true
        // 获取选择状态对象
        this.commandObj = command
        this.tableTitle = command.label;
        // 查询用户信息
        if (command != '' && command.value === 'user') {
          this.getUserList()
        }
        // 查询用户组信息
        if (command != '' && command.value === 'group') {
          this.getGroupList()
        }
      },
      handleSelectionChange(val) {
        let _this = this
        /**
         * 注：此方法内容虽然与下面方法内容相当，但是两个方法不能合并。否则会出现穿梭框右边列表选中的值丢失
         * （如：选中的用户数据，在切换到用户组选中数据时会把用户数据覆盖掉
         * 
         * 当前选择为用户时，将用户选中的数据和用户组选中的数据合并到一起在穿梭框右侧显示
         * */
        if (this.commandObj.value != '' && this.commandObj.value === 'user') {
          // 正常的数据选择操作时取选中数据的值，用户、用户组按钮切换时不取值
          if (!_this.handoverFlag) {
            if (_this.transferArrayFlag) {
              val = _this.transferArrayTemp
            }
            _this.transferUserData = val
            // 将选中的数据清空，重新将左侧选中的值合并到数据中，避免重复数据问题
            _this.transfer_data_right = []
            if (_this.transferUserData != '') {
              _this.transfer_data_right = _this.transfer_data_right.concat(_this.transferUserData)
            }
            if (_this.transferGroupData != '') {
              _this.transfer_data_right = _this.transfer_data_right.concat(_this.transferGroupData)
            }
            _this.transferArrayFlag = false
          }
        }
        /**
         * 注：此方法内容虽然与上面方法内容相当，但是两个方法不能合并。否则会出现穿梭框右边列表选中的值丢失
         * （如：选中的用户数据，在切换到用户组选中数据时会把用户数据覆盖掉
         * 
         * 当前选择为用户组时，将用户选中的数据和用户组选中的数据合并到一起在穿梭框右侧显示
         * */
        if (this.commandObj.value != '' && this.commandObj.value === 'group') {
          // 正常的数据选择操作时取选中数据的值，用户、用户组按钮切换时不取值
          if (!_this.handoverFlag) {
            if (_this.transferArrayFlag) {
              val = _this.transferArrayTemp
            }
            _this.transferGroupData = val
            // 将选中的数据清空，重新将左侧选中的值合并到数据中，避免重复数据问题
            _this.transfer_data_right = []
            if (_this.transferUserData != '') {
              _this.transfer_data_right = _this.transfer_data_right.concat(_this.transferUserData)
            }
            if (_this.transferGroupData != '') {
              _this.transfer_data_right = _this.transfer_data_right.concat(_this.transferGroupData)
            }
            _this.transferArrayFlag = false
          }
        }
        this.handoverFlag = false
      },
      selectedRow(row, column, event) {
        // 设置选中状态
        this.$refs.multipleOption.toggleRowSelection(row);
      },
      deleteRow(index, rows) {
        let _this = this
        // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
        this.$refs.multipleOption.toggleRowSelection(rows[index], false);
        // 如果当前是用户数据，则使用如下方式实现移除右侧的用户组数据
        if (this.commandObj.value != '' && this.commandObj.value === 'user') {
          if (this.transferGroupData != '') {
            for (let i in _this.transferGroupData) {
              if (_this.transferGroupData[i] === rows[index]) {
                _this.transferGroupData.splice(i, 1)
              }
            }
          }
          // 移动右侧选中数据
          _this.transfer_data_right = []
          if (_this.transferUserData != '') {
            _this.transfer_data_right = _this.transfer_data_right.concat(_this.transferUserData)
          }
          if (_this.transferGroupData != '') {
            _this.transfer_data_right = _this.transfer_data_right.concat(_this.transferGroupData)
          }
        }
        // 如果当前是用户组数据，则使用如下方式实现移除右侧的用户数据
        if (this.commandObj.value != '' && this.commandObj.value === 'group') {
          // 移除非当前用户组左侧数据
          if (this.transferUserData != '') {
            for (let i in _this.transferUserData) {
              if (_this.transferUserData[i] === rows[index]) {
                _this.transferUserData.splice(i, 1)
              }
            }
          }
          // 移动右侧选中数据
          _this.transfer_data_right = []
          if (_this.transferUserData != '') {
            _this.transfer_data_right = _this.transfer_data_right.concat(_this.transferUserData)
          }
          if (_this.transferGroupData != '') {
            _this.transfer_data_right = _this.transfer_data_right.concat(_this.transferGroupData)
          }
        }
      },
      toQuery() {
        //如果为用户 进行搜索
        // if(this.commandObj.value != '' && this.commandObj.value === 'user'){
        //   this.getUserList()
        // }
        // 如果为用户组 进行搜索
        if (this.commandObj.value != '' && this.commandObj.value === 'group') {
          this.getGroupList()
        }
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
        if (policyId != undefined && policyId != '') {
          for (let i = 0; i < transfer_data_right.length; i++) {
            let obj = transfer_data_right[i]
            if (obj != '' && obj.type === 'user') {
              // 定义策略添加到用户params；系统接口是单条绑定，多条数据需要循环调用接口，params只能作为局部参数存在，多条数据循环时，参数会出现后一条数据会覆盖上一条数据，
              let paramsUser = {
                Action: 'AttachUserPolicy',
                Version: '2019-01-16',
                PolicyId: policyId,
                AttachUin: obj.id
              }
              _this.attachUserPolicy(paramsUser)
            }
            if (obj != '' && obj.type === 'group') {
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
        this.axios.post('cam2/AttachGroupPolicy', params).then(res => {
          console.log(res)
        })
      },
      // 绑定策略到用户
      attachUserPolicy(params) {
        this.axios.post('cam2/AttachUserPolicy', params).then(res => {
          console.log(res)
        })
      },
      // 清空数据
      clearData() {
        this.transfer_data_right = []
        this.transferUserData = []
        this.transferGroupData = []
        this.transfer_data = []
        this.transferArrayTemp = []
      },
      getHandleFlag() {
        return true
      }
    }
  };

</script>
<style lang="scss" scoped>
  .Cam {
    .container {
         width: 100%;
         display: flex;
         justify-content: center;
         align-items: center;

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

       .container-left {
        display: flex;
        flex-direction: column;
        width:45%;
        height: 500px;
        justify-content: center;
      }
      .container-right{
        display: flex;
        width:45%;
        height: 500px;
        flex-direction: column;
        justify-content: center;
      }

      .ifier {
        position: absolute;
        font-size: 130%;
        right: 2%;
        top: 8%;
      }

      .direction {
        display: table-cell;
        width: 38px;
        text-align: center;
        vertical-align: middle;
      }

      .direction-icon {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        background-repeat: no-repeat;
        background-position: inherit;
        font-size: 0;
      }
    }
  }

</style>
