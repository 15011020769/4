<template>
  <div class="Cam">
    <div class="container">
      <div class="container-left">
        <p>{{$t('CAM.userList.listTitle')}}</p>
        <el-input :placeholder="$t('CAM.strategy.inputContent')" clearable size="small" v-model="search" style="width:100%"
          @change="toQuery">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="toQuery"></i>
        </el-input>
        <el-table class="table-left" ref="multipleOption" :data="transfer_data" size="small" height="220px"
          tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
          :empty-text="$t('CAM.strategy.zwsj')">
          <el-table-column type="selection" prop="id" :selectable="checkboxT"></el-table-column>
          <el-table-column prop="name" :label="$t('CAM.userGroup.user')" show-overflow-tooltip></el-table-column>
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
          size="small" height="220px" style="width: 100%" :empty-text="$t('CAM.strategy.zwsj')">
          <el-table-column prop="name" :label="$t('CAM.strategy.nameAndGroup')" show-overflow-tooltip></el-table-column>
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
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import {
    USER_LIST,
    USER_GROUP,
    ATTACH_GROUP,
    POLICY_USER
  } from "@/constants";
  export default {
    props: {
      PolicyId: [String, Number],
      userArr: {
        type: Array
      },
      groupArr: {
        type: Array
      }
    },
    data() {
      return {
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
        json: [],
        tableTitle: "切換成用戶組",
        handoverFlag: false,
        transferArrayFlag: false,
        transferArrayTemp: [],
        table_options2: [{
            value: "user",
            label: "用戶"
          },
          {
            value: "group",
            label: "用戶組"
          }
        ]
      };
    },
    created() {
      //系统默认加载用户list
      this.getUserList();
    },
    watch: {
      groupArr(val) {
        this.getGroupList();
      },
      userArr(val) {
        this.getUserList();
      }
    },
    methods: {
      checkboxT(row, index) {
        if (row.status == 0) {
          return false;
        } else {
          return true;
        }
      },
      // 1.查询用户列表
      getUserList() {
        let _this = this;
        _this.loading = true;
        _this.transfer_data = [];
        _this.commandObj = {
          value: "user",
          label: "用戶"
        };
        let paramsUser = {
          Version: "2019-01-16"
        };
        _this.axios.post(USER_LIST, paramsUser).then(res => {
          if (res.Response.Error === undefined) {
            _this.transfer_data = res.Response.Data;
            //添加type值判断为用户还是用户组
            _this.transfer_data.forEach(item => {
              item.type = "user";
              item.name = item.Name;
              item.id = item.Uin;
            });
            this.transfer_data.forEach(item => {
              item.status = 1;
              this.userArr.forEach(val => {
                if (val.Name == item.name) {
                  item.status = 0;
                }
              });
            });
            this.json = _this.transfer_data;
            _this.loading = false;
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      // 2.查询用户组列表ListGroups
      getGroupList() {
        let _this = this;
        _this.loading = true;
        _this.transfer_data = [];
        let paramsGroup = {
          Version: "2019-01-16"
        };
        _this.axios.post(USER_GROUP, paramsGroup).then(res => {
          if (res.Response.Error === undefined) {
            _this.transferArrayTemp = [];
            _this.transfer_data = res.Response.GroupInfo;
            //添加type值判断为用户还是用户组
            _this.transfer_data.forEach(item => {
              item.type = "group";
              item.name = item.GroupName;
              item.id = item.GroupId;
            });
            this.transfer_data.forEach(item => {
              item.status = 1;
              this.groupArr.forEach(val => {
                if (val.Name == item.name) {
                  item.status = 0;
                }
              });
            });
            this.json = _this.transfer_data;
            _this.loading = false;
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      handleCommand(command) {
        // 设置切换状态，穿梭框左侧数据重新加载时，handleSelectionChange方法中val参数是空，但实际情况在切换前，会有存在的数据，所以不能将数据置空
        this.handoverFlag = true;
        // 获取选择状态对象
        this.commandObj = command;
        this.tableTitle = command.label;
        // 查询用户信息 // 查询用户组信息
        if (command.value === "user") {
          this.getUserList();
        } else if (command.value === "group") {
          this.getGroupList();
        }
      },
      handleSelectionChange(val) {
        let _this = this;
        if (this.commandObj.value != "" && this.commandObj.value === "user") {
          // 正常的数据选择操作时取选中数据的值，用户、用户组按钮切换时不取值
          if (!_this.handoverFlag) {
            if (_this.transferArrayFlag) {
              val = _this.transferArrayTemp;
            }
            _this.transferUserData = val;
            // 将选中的数据清空，重新将左侧选中的值合并到数据中，避免重复数据问题
            _this.transfer_data_right = [];
            if (_this.transferUserData != "") {
              _this.transfer_data_right = _this.transfer_data_right.concat(
                _this.transferUserData
              );
            }
            if (_this.transferGroupData != "") {
              _this.transfer_data_right = _this.transfer_data_right.concat(
                _this.transferGroupData
              );
            }
            _this.transferArrayFlag = false;
          }
        }
        if (this.commandObj.value != "" && this.commandObj.value === "group") {
          _this.handoverFlag = false
          // 正常的数据选择操作时取选中数据的值，用户、用户组按钮切换时不取值
          if (!_this.handoverFlag) {
            if (_this.transferArrayFlag) {
              val = _this.transferArrayTemp;
            }
            _this.transferGroupData = val;
            // 将选中的数据清空，重新将左侧选中的值合并到数据中，避免重复数据问题
            _this.transfer_data_right = [];
            if (_this.transferUserData != "") {
              _this.transfer_data_right = _this.transfer_data_right.concat(
                _this.transferUserData
              );
            }
            if (_this.transferGroupData != "") {
              _this.transfer_data_right = _this.transfer_data_right.concat(
                _this.transferGroupData
              );
            }
            _this.transferArrayFlag = false;
          }
        }
        this.handoverFlag = false;
      },
      selectedRow(row, column, event) {
        // 设置选中状态
        this.$refs.multipleOption.toggleRowSelection(row);
      },
      deleteRow(index, rows) {
        let _this = this;
        // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
        this.$refs.multipleOption.toggleRowSelection(rows[index], false);
        // 如果当前是用户数据，则使用如下方式实现移除右侧的用户组数据
        if (this.commandObj.value != "" && this.commandObj.value === "user") {
          if (this.transferGroupData != "") {
            for (let i in _this.transferGroupData) {
              if (_this.transferGroupData[i] === rows[index]) {
                _this.transferGroupData.splice(i, 1);
              }
            }
          }
          // 移动右侧选中数据
          _this.transfer_data_right = [];
          if (_this.transferUserData != "") {
            _this.transfer_data_right = _this.transfer_data_right.concat(
              _this.transferUserData
            );
          }
          if (_this.transferGroupData != "") {
            _this.transfer_data_right = _this.transfer_data_right.concat(
              _this.transferGroupData
            );
          }
        }
        // 如果当前是用户组数据，则使用如下方式实现移除右侧的用户数据
        if (this.commandObj.value != "" && this.commandObj.value === "group") {
          // 移除非当前用户组左侧数据
          if (this.transferUserData != "") {
            for (let i in _this.transferUserData) {
              if (_this.transferUserData[i] === rows[index]) {
                _this.transferUserData.splice(i, 1);
              }
            }
          }
          // 移动右侧选中数据
          _this.transfer_data_right = [];
          if (_this.transferUserData != "") {
            _this.transfer_data_right = _this.transfer_data_right.concat(
              _this.transferUserData
            );
          }
          if (_this.transferGroupData != "") {
            _this.transfer_data_right = _this.transfer_data_right.concat(
              _this.transferGroupData
            );
          }
        }
      },
      toQuery() {
        if (this.search == "") {
          this.transfer_data = this.json;
        } else {
          var arr = [];
          this.transfer_data.forEach(item => {
            if (item.name.includes(this.search)) {
              arr.push(item);
            }
          });
          this.transfer_data = arr;
        }
      },
      // 关联用户/用户组
      attachPolicy() {
        let _this = this;
        let transfer_data_right = this.transfer_data_right;
        if (this.transfer_data_right.length == 0) {
          this.$message({
            showClose: true,
            message: "請選中數據",
            duration: 0
          });
        } else {
          let policyId = this.PolicyId; //获取策略ID,父页面传递参数。
          if (policyId != undefined && policyId != "") {
            for (let i = 0; i < transfer_data_right.length; i++) {
              let obj = transfer_data_right[i];
              if (obj != "" && obj.type === "user") {
                // 定义策略添加到用户params；系统接口是单条绑定，多条数据需要循环调用接口，params只能作为局部参数存在，多条数据循环时，参数会出现后一条数据会覆盖上一条数据，
                let paramsUser = {
                  Action: "AttachUserPolicy",
                  Version: "2019-01-16",
                  PolicyId: policyId,
                  AttachUin: obj.id
                };
                _this.attachUserPolicy(paramsUser);
              }
              if (obj != "" && obj.type === "group") {
                // 定义策略添加到用户组params
                let paramsGroup = {
                  Version: "2019-01-16",
                  PolicyId: policyId,
                  AttachGroupId: obj.id
                };
                _this.attachGroupPolicy(paramsGroup);
              }
            }
          }
        }
      },
      // 绑定策略到用户组
      attachGroupPolicy(params) {
        this.axios.post(ATTACH_GROUP, params).then(res => {
          if (res.Response.Error === undefined) {
            this.$message({
              message: "關聯成功",
              type: "success",
              duration: 0,
              showClose: true
            });
          } else {
            let ErrTips = {
              "FailedOperation.PolicyFull": "用戶策略數超過上限",
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.AttachmentFull": "principal欄位的授權對象關聯策略數已達到上限",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法",
              "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
              "InvalidParameter.UserNotExist": "principal欄位的授權對象不存在",
              "ResourceNotFound.GroupNotExist": "用戶組不存在",
              "ResourceNotFound.PolicyIdNotFound": "PolicyId指定的資源不存在",
              "ResourceNotFound.UserNotExist": "用戶不存在"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      // 绑定策略到用户
      attachUserPolicy(params) {
        this.axios.post(POLICY_USER, params).then(res => {
          if (res.Response.Error === undefined) {
            this.$message({
              message: "關聯成功",
              type: "success",
              duration: 0,
              showClose: true
            });
          } else {
            let ErrTips = {
              "FailedOperation.PolicyFull": "用戶策略數超過上限",
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.AttachmentFull": "principal欄位的授權對象關聯策略數已達到上限",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.PolicyIdError": "輸入參數PolicyId不合法",
              "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
              "InvalidParameter.UserNotExist": "principal欄位的授權對象不存在",
              "ResourceNotFound.PolicyIdNotFound": "PolicyId指定的資源不存在",
              "ResourceNotFound.UserNotExist": "用戶不存在"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      // 清空数据
      clearData() {
        this.transfer_data_right = [];
        this.transferUserData = [];
        this.transferGroupData = [];
        this.transfer_data = [];
        this.transferArrayTemp = [];
      },
      getHandleFlag() {
        return true;
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
        width: 45%;
        height: 500px;
        justify-content: center;
      }

      .container-right {
        display: flex;
        width: 45%;
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
