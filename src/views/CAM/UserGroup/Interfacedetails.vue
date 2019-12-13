<template>
  <div class="Cam">
    <div class="top">
      <i @click="backoff" class="el-icon-back"
        style="padding-right: 10px; font-size: 130%; color: #006eff; font-weight: 900; cursor:pointer;"></i>
      <span class="title-left">{{$t('CAM.userGroup.testApi')}}</span>
    </div>
    <!-- 内容 -->
    <div class="Interface">
      <!-- 用户组详情上半部分页面 start -->
      <div class="Interface-top">
        <div class="upper-side">
          <h3 class="information">{{$t('CAM.userGroup.groupTest')}}</h3>
          <el-link @click="editGroup" class="edit" type="primary">{{$t('CAM.userList.updataUser')}}</el-link>
        </div>
        <!-- 用户组详情页面 start -->
        <div v-show="flag==true">
          <el-form ref="form" :model="groupData" label-width="90px">
            <el-form-item :label="$t('CAM.userGroup.colNmae')">
              <span>{{groupData.GroupName}}</span>
            </el-form-item>
            <el-form-item :label="$t('CAM.userGroup.colRemark')">
              <span>{{groupData.Remark}}</span>
            </el-form-item>
            <el-form-item :label="$t('CAM.userGroup.colCreTime')">
              <span>{{groupData.CreateTime}}</span>
            </el-form-item>
          </el-form>
        </div>
        <!-- 用户组详情页面 end -->
        <!-- 用户组编辑页面 start -->
        <div v-show="flag==false">
          <el-form ref="form" :model="groupData" label-width="80px">
            <el-form-item :label="$t('CAM.userGroup.colNmae')">
              <el-input size="small" v-model="groupData.GroupName">{{$t('CAM.userGroup.testApi')}}</el-input><i
                class="el-icon-circle-check mark"></i>
            </el-form-item>
            <el-form-item :label="$t('CAM.userGroup.colRemark')">
              <el-input size="small" v-model="groupData.Remark"></el-input><i class="el-icon-circle-check mark"></i>
            </el-form-item>
            <el-form-item label>
              <el-button size="small" type="primary" @click="saveGroup">保存</el-button>
              <el-button size="small" @click="flag=true">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 用户组编辑页面 end -->
      </div>
      <!-- 用户组详情上半部分页面 end -->
      <!-- 用户组详情下半部分页面 start -->
      <div class="tabswitch">
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="policiesLable" name="first">
              <div class="app-cam-alert">
                <div class="app-cam-alert__info">{{$t('CAM.userGroup.polictTitle')}}</div>
              </div>
              <div class="btn">
                <el-button type="primary" @click="openPolicies" size="small">{{$t('CAM.userGroup.getPolicy')}}</el-button>
              </div>
              <div>
                <el-table :data="policiesData" style="width: 100%; border:1px solid #ddd;">
                  <el-table-column :label="$t('CAM.userList.strategyNames')" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <!-- <p>{{scope.row.PolicyName}}</p> -->
                      <el-button @click="policyDetail(scope.row)" size="mini" type="text">{{scope.row.PolicyName}}
                      </el-button>
                      <p>{{scope.row.Remark}}</p>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('CAM.userList.AssociationTime')" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span>{{ scope.row.AddTime }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('CAM.userGroup.colHandle')" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-link type="primary" @click="deletePolicies(scope.row.PolicyId)">解除</el-link>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px">
                <div>
                  <span style="font-size:12px;color:#888">共 {{totalPolicies}} 项</span>
                </div>
                <div class="block">
                  <el-pagination @size-change="handleSizeChangePolicies" @current-change="handleCurrentChangePolicies"
                    :current-page.sync="pagePolicies" :page-sizes="[10, 20, 50, 100, 200]" :page-size="rpPolicies"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalPolicies"></el-pagination>
                </div>
              </div>
              <!-- 关联策略弹出框 start -->
              <el-dialog :title="$t('CAM.userList.RelatedPolicies')" custom-class="dialogStyle" :visible.sync="dialogVisible" width="75%"
                :before-close="handleClosePolicies">
                <div class="container">
                  <div class="container-left">
                    <span>{{$t('CAM.userList.strategyTitle')}} （共{{totalNumPolicies}}条）</span>
                    <el-input placeholder="搜索" size="small"  v-model="searchPolicies" style="width:100%" @keyup.enter.native="toQueryPolicies">
                       <i slot="suffix" class="el-input__icon el-icon-search" @click="toQueryPolicies"></i>
                    </el-input>
                    <el-table class="table-left" ref="multipleOptionPolicies" :data="policiesAllData" size="small"
                      height="46vh" tooltip-effect="dark" style="width: 100%" @row-click="selectedRowPolicies"
                      @selection-change="handleSelectionChangePolicies">
                      <el-table-column type="selection" prop="PolicyId" width="29"> </el-table-column>
                      <el-table-column prop="PolicyName" :label="$t('CAM.userList.strategyNames')" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <p>{{scope.row.PolicyName}}</p>
                          <p>{{scope.row.Description}}</p>
                        </template>
                      </el-table-column>
                      <el-table-column prop="Type" :label="$t('CAM.userList.strategyChose')" width="100">
                        <template slot-scope="scope">
                          <p v-show="scope.row.Type == 1">{{$t('CAM.userList.strategySelf')}}</p>
                          <p v-show="scope.row.Type == 2">{{$t('CAM.userList.ysStrategy')}}</p>
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
                    <el-table class="table-left" ref="multipleSelected" :data="policiesSelectedData"
                      tooltip-effect="dark" size="small" height="50vh" style="width: 100%">
                      <el-table-column prop="PolicyName":label="$t('CAM.userList.strategyNames')" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <p>{{scope.row.PolicyName}}</p>
                          <p>{{scope.row.Description}}</p>
                        </template>
                      </el-table-column>
                      <el-table-column prop="Type" :label="$t('CAM.userList.strategyChose')" width="100">
                        <template slot-scope="scope">
                          <p v-show="scope.row.Type == 1">{{$t('CAM.userList.strategySelf')}}</p>
                          <p v-show="scope.row.Type == 2">{{$t('CAM.userList.ysStrategy')}}</p>
                        </template>
                      </el-table-column>
                      <el-table-column :label="$t('CAM.userGroup.colHandle')" width="50">
                        &lt;!&ndash;<template slot-scope="scope">
                          <el-button @click.native.prevent="deleteRowPolicies(scope.$index, policiesSelectedData)"
                            type="text" size="small">
                            x
                          </el-button>
                        </template>&ndash;&gt;
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addPoliciesToGroup">{{$t('CAM.userList.suerAdd')}}</el-button>
                  <el-button @click="dialogVisible = false">取 消</el-button>
                </div>
              </el-dialog>
              <!-- 关联策略弹出框 end -->
            </el-tab-pane>
            <!-- tab 用户组用户信息页面 start -->
            <el-tab-pane :label="userLabel" name="second">
              <div class="addbtn">
                <el-button @click="openUser" size="small" type="primary">添加</el-button>
                <el-button size="small" :disabled="btnVisible" @click="deleteUser">移除</el-button>
              </div>
              <div>
                <el-table ref="multipleTable" :data="owneruserData" tooltip-effect="dark"
                  style="width: 100%; border:1px solid #ddd" @selection-change="handleSelectionChangeUsers">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column  :label="$t('CAM.userGroup.colNmae')" prop="Name">
                    <template slot-scope="scope">
                      <el-button @click="userDetails(scope.row)" size="mini" type="text">{{scope.row.Name}}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="CreateTime" :label="$t('CAM.userList.createTime')">
                    <template slot-scope="scope">{{ scope.row.CreateTime }}</template>
                  </el-table-column>
                  <el-table-column prop="address" :label="$t('CAM.userList.userRemark')" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.remarks }}</template>
                  </el-table-column>
                  <el-table-column label="操作">
                    &lt;!&ndash;<template slot-scope="scope">
                      <el-button @click.native.prevent="deleteRow(scope.row.Uid)" type="text" size="small">{{$t('CAM.userGroup.removeGrop')}}
                      </el-button>
                    </template>&ndash;&gt;
                  </el-table-column>
                </el-table>
              </div>
              <div style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px">
                <div>
                  <span style="font-size:12px;color:#888">共 {{totalUser}} 项</span>
                </div>
                <div class="block">
                  <el-pagination @size-change="handleSizeChangeUser" @current-change="handleCurrentChangeUser"
                    :current-page.sync="pageUser" :page-sizes="[10, 20, 50, 100, 200]" :page-size="rpUser"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalUser"></el-pagination>
                </div>
              </div>
              <!-- dialog 用户组弹出框  start -->
              <el-dialog title="添加用戶" :visible.sync="dialogUser" width="75%" :before-close="handleCloseUser"
                custom-class="dialogStyle">
                <div class="container">
                  <div class="container-left">
                    <p>{{$t('CAM.userGroup.selection')}}({{totalNumUser}}条）</p>
                    <el-input  size="small"  v-model="searchUser" style="width:100%" @keyup.enter.native="toQueryUser">
                       <i slot="suffix" class="el-input__icon el-icon-search" @click="toQueryUser"></i>
                    </el-input>
                    <el-table class="table-left" ref="multipleOptionUser" :data="userData" size="small"
                      :height="tableHeight" tooltip-effect="dark" style="width: 100%" @row-click="selectedRow"
                      @selection-change="handleSelectionChangeUser">
                      <el-table-column type="selection" prop="Uin" width="28"> </el-table-column>
                      <el-table-column prop="Name" :label="$t('CAM.userGroup.user')" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column :label="$t('CAM.userList.userChose')" width="100">
                        <template slot-scope="scope">
                          <p>{{$t('CAM.userGroup.childUser')}}</p>
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
                    <span>{{$t('CAM.userGroup.Star')}}（{{selNum}}）</span>
                    <el-table class="table-left" ref="multipleSelected" :data="userSelData" tooltip-effect="dark"
                      size="small" :height="tableHeight" style="width: 100%">
                      <el-table-column prop="Name" :label="$t('CAM.userGroup.user')" show-overflow-tooltip> </el-table-column>
                      <el-table-column :label="$t('CAM.userList.userChose')" width="100">
                        <template slot-scope="scope">
                          <p>{{$t('CAM.userList.userChose')}}</p>
                        </template>
                      </el-table-column>
                      <el-table-column :label="$t('CAM.userGroup.colHandle')" width="50">
                        &lt;!&ndash;<template slot-scope="scope">
                          <el-button @click.native.prevent="deleteRows(scope.$index, userSelData)" type="text"
                            size="small">
                            x
                          </el-button>
                        </template>&ndash;&gt;
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogUser = false">取 消</el-button>
                  <el-button type="primary" @click="addUserToGroup">{{$t('CAM.userList.suerAdd')}}</el-button>
                </div>
              </el-dialog>
              <!-- dialog 用户组弹出框 end -->
            </el-tab-pane>
            <!-- tab 用户组用户信息页面 end -->
          </el-tabs>
        </template>
      </div>
      <!-- 用户组详情下半部分页面 end -->
    </div>
  </div>
</template>
<script>
import {GET_GROUP,DEL_USERTOGROUP,UPDATA_GROUP,GROUP_USERS,USER_LIST,GROUP_POLICY,ADD_GROUPTOLIST,POLICY_LIST,DETACH_POLICY,ATTACH_GROUP} from '@/constants'
  export default {
    data() {
      return {
        tableHeight: 300,
        flag: true,
        activeName: "first",
        dialog: false,
        dialogUser: false,
        dialogVisible: false,
        groupId: '',
        groupData: {},
        owneruserData: [],
        userRemSelData: [],
        btnVisible: true,
        userLabel: '',
        policiesLable: '',
        pagePolicies: 1,
        rpPolicies: 10,
        totalPolicies: 0,
        totalNumPolicies: 0,
        totalNumUser: 0,
        selNum: 0,
        userData: [],
        userSelData: [],
        pageUser: 1,
        rpUser: 10,
        totalUser: 0,
        policiesSelectedData: [],
        policiesData: [],
        policiesAllData: [],
        searchUser: '',
        searchPolicies: ''
      };
    },
    mounted() {
      this.groupId = this.$route.query.GroupId
      this.init()
      // this.tableHeight = window.innerHeight - this.$refs.multipleOptionPolicies.$el.offsetTop - 50;
    },
    methods: {
      // 初始化时，获取用户组信息
      init() {
        this.selectGroupPolicies()
        this.selectGroup()
      },
      // 查询用户组详情
      selectGroup() {
        let params = {
          Version: "2019-01-16"
        };
        let groupId = this.$route.query.GroupId
        if (groupId != '' && groupId != null) {
          params['GroupId'] = groupId
        }
        this.axios.post(GET_GROUP, params).then(res => {
          this.groupData = res.Response
          this.owneruserData = res.Response.UserInfo
          this.userLabel = '用户（' + this.owneruserData.length + '）'
        }).catch(error => {
          console.log(error)
        })
      },
      // 删除用户
      deleteUser(uid) {
        let params = {
          Version: "2019-01-16"
        };
        let groupId = parseInt(this.$route.query.GroupId)
        let value = this.userRemSelData // 多条子用户移除
        if (groupId != '' && value != '' && value != null) {
          for (var i = 0; i < value.length; i++) {
            params['Info.' + i + '.Uid'] = value[i].Uid
            params['Info.' + i + '.GroupId'] = groupId
          }
        } else {
          params['Info.0.Uid'] = uid
          params['Info.0.GroupId'] = groupId
        }
        this.axios.post(DEL_USERTOGROUP, params).then(data => {
          this.getUsers() // 重新加载页面
        }).catch(error => {
          console.log(error)
        })
      },
      // 编辑用户组
      editGroup() {
        this.flag = !this.flag;
        if (this.flag == true) {} else if (this.flag == false) {}
      },
      // 更新用户组
      saveGroup() {
        this.flag = !this.flag;
        let groupId = parseInt(this.$route.query.GroupId)
        let params = {
          Version: '2019-01-16',
          GroupId: groupId
        }
        if (this.groupData.GroupName != '') {
          params['GroupName'] = this.groupData.GroupName
        }
        if (this.groupData.Remark != '') {
          params['Remark'] = this.groupData.Remark
        }
        this.axios.post(UPDATA_GROUP, params).then(res => {
          this.init()
        }).catch(error => {
          console.log(error)
        })
      },
      // 获取用户组所属子用户信息
      getUsers() {
        let groupId = parseInt(this.$route.query.GroupId)
        let paramsGroup = {
          GroupId: groupId,
          Page: this.pageUser,
          Rp: this.rpUser,
          Version: '2019-01-16'
        }
        this.axios.post(GROUP_USERS, paramsGroup).then(resGroup => {
          this.owneruserData = resGroup.Response.UserInfo
          this.totalUser = resGroup.Response.TotalNum
          // this.userLabel = '用户（'+this.owneruserData.length+'）'
        }).catch(error => {
          console.log(error)
        })
      },
      // 打开用户组列表穿梭框
      openUser() {
        this.dialogUser = true
        this.userData = []
        let groupId = parseInt(this.$route.query.GroupId)
        let _this = this
        let params = {
          Version: "2019-01-16"
        }
        this.axios.post(USER_LIST, params).then(res => {
          this.userData = []
          let userAllData = res.Response.Data
          // 获取用户组管理用户
          let selUserData = []
          let paramsGroup = {
            GroupId: groupId,
            Version: '2019-01-16'
          }
          this.axios.post(GROUP_USERS, paramsGroup).then(resGroup => {
            // 不直接将子用户信息赋予用户组选择框中,是避免页面出现 过滤后的子用户信息刷新覆盖初始信息
            selUserData = resGroup.Response.UserInfo
            // 用户组拥有子用户，系统将拥有子用户从用户组添加框中去掉，避免重复选择
            if (selUserData != '') {
              for (var i = 0; i < selUserData.length; i++) {
                let ownerObj = selUserData[i]
                for (var j = 0; j < userAllData.length; j++) {
                  let allObj = userAllData[j]
                  if (allObj.Uin === ownerObj.Uin) {
                    userAllData.splice(j, 1)
                  }
                }
              }
              _this.userData = userAllData
            } else {
              _this.userData = userAllData
            }
            _this.totalNumUser = this.userData.length
          }).catch(error => {
            console.log(error)
          })
        }).catch(error => {
          console.log(error)
        })
      },
      // 添加用户到用户组
      addUserToGroup() {
        this.dialogUser = false
        let groupId = parseInt(this.$route.query.GroupId)
        let value = this.userSelData
        if (value != '') {
          let params = {
            Version: "2019-01-16"
          }
          for (var i = 0; i < value.length; i++) {
            params['Info.' + i + '.Uid'] = value[i].Uid
            params['Info.' + i + '.GroupId'] = groupId
          }
          this.axios.post(ADD_GROUPTOLIST, params).then(data => {
            this.init() // 重新加载页面
          }).catch(error => {
            console.log(error)
          })
        }
      },
      toQueryUser() {

      },
      // 从用户组移除子用户信息，单条移除
      deleteRow(uid) {
        this.deleteUser(uid)
      },
      // 子用户多选事件，移除多条用户组子用户使用
      handleSelectionChangeUsers(val) {
        //汇总选中的数据。
        if (val != '') {
          this.btnVisible = false
          this.userRemSelData = val
        } else {
          this.btnVisible = true
        }
      },
      selectedRow(row, column, event) {
        // 设置选中或者取消状态
        this.$refs.multipleOptionUser.toggleRowSelection(row)
      },
      handleSelectionChangeUser(val) {
        // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
        this.userSelData = val
        this.selNum = this.userSelData.length
      },
      // 用户组子用户分页
      handleCurrentChangeUser(e) {
        this.pageUser = e
        this.getUsers()
      },
      // 用户组子用户分页
      handleSizeChangeUser(e) {
        this.rpUser = e
        this.getUsers()
      },
      userDetails(val) {
        this.$router.push({
          path: "/detailsUser",
          query: {
            content: val.Name
          }
        })
      },
      // 查询用户关联策略信息
      selectGroupPolicies() {
        let groupId = parseInt(this.$route.query.GroupId)
        let params = {
          Version: '2019-01-16',
          Page: this.pagePolicies,
          Rp: this.rpPolicies,
          TargetGroupId: groupId
        }
        this.axios.post(GROUP_POLICY, params).then(res => {
          this.policiesData = res.Response.List
          this.policiesLable = '权限（' + this.policiesData.length + '）'
          this.totalPolicies = res.Response.TotalNum
        }).catch(error => {
          console.log(error)
        })
      },
      // 查询所有策略信息
      selectAllPolicies() {
        let params = {
          // Rp: this.rpPolicies,
          // Page: this.pagePolicies,
          Version: '2019-01-16'
          // scope:'All'
        }
        if (this.searchPolicies != null && this.searchPolicies != '') {
          params['Keyword'] = this.searchPolicies
        }
        this.axios.post(POLICY_LIST, params).then(res => {
          this.totalNumPolicies = res.Response.TotalNum
          this.policiesAllData = res.Response.List
        }).catch(error => {
          console.log(error)
        })
      },
      // 移除策略信息
      deletePolicies(policyId) {
        let groupId = parseInt(this.$route.query.GroupId)
        let params = {
          Version: '2019-01-16',
          PolicyId: policyId,
          DetachGroupId: groupId
        }
        this.axios.post(DETACH_POLICY, params).then(res => {
          this.selectGroupPolicies()
        }).catch(error => {
          console.log(error)
        })
      },
      // 打开策略信息穿梭框
      openPolicies() {
        this.dialogVisible = true
        this.selectAllPolicies()
      },
      handleSelectionChangePolicies(val) {
        // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
        this.policiesSelectedData = val
      },
      selectedRowPolicies(row, column, event) {
        // 设置选中或者取消状态
        this.$refs.multipleOptionPolicies.toggleRowSelection(row)
      },
      deleteRowPolicies(index, rows) {
        // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
        this.$refs.multipleOptionPolicies.toggleRowSelection(rows[index], false)
      },
      deleteRows(index, rows){
         this.$refs.multipleOptionUser.toggleRowSelection(rows[index], false)
      },
      // 按条件查询策略信息
      toQueryPolicies() {
        this.selectAllPolicies()
      },
      // 添加策略信息到用户组
      addPoliciesToGroup() {
        this.dialogVisible = false
        let _this = this
        let groupId = parseInt(this.$route.query.GroupId)
        let selArr = this.policiesSelectedData
        // 绑定策略到用户组
        if (groupId != '' && selArr != '') {
          let paramsArr = []
          //目前系统接口只支持单个策略绑定到用户组，不支持多个，所以循环执行策略绑定用户组接口
          for (var i = 0; i < selArr.length; i++) {
            let policiesParams = {
              Action: 'AttachGroupPolicy',
              AttachGroupId: groupId,
              PolicyId: selArr[i].PolicyId,
              Version: '2019-01-16'
            }
            _this.addPolicies(policiesParams)
          }
        }
      },
      // 添加策略信息
      addPolicies(params) {
        this.axios.post(ATTACH_GROUP, params).then(res => {
          this.selectGroupPolicies()
        }).catch(error => {
          console.log(error)
        })
      },
      // 跳转到策略详情页面
      policyDetail(policy) {
        this.$router.push({
          path: '/StrategyDetail',
          query: {
            policy: policy
          }
        });
      },
      backoff() {
        this.$router.push({
          path: "UserGroup"
        });
      },
      handleClick(tab, event) {
        if (tab.name === 'first') {
          this.pagePolicies = 1
          this.selectGroupPolicies()
        }
        if (tab.name === 'second') {
          this.pageUser
          this.getUsers()
        }
      },
      handleClosePolicies() {
         this.dialogVisible = false;
      },
      handleCloseUser() {
        this.dialogUser = false;
      },
      // 用户组策略分页
      handleCurrentChangePolicies(e) {
        this.pagePolicies = e
        this.selectGroupPolicies()
      },
      // 用户组策略分页
      handleSizeChangePolicies(e) {
        this.rpPolicies = e
        this.selectGroupPolicies()
      }
    }
  };

</script>
<style lang="scss" scope>
  .Cam {
    .top {
      height: 45px;
      line-height: 45px;
      padding: 0 20px;
      background: #fff;
      .title-left {
        font-size: 14px;
        font-weight: bolder;
      }
      .title-right {
        float: right;
        span:hover {
          color: #006eff;
          border-bottom: 1px solid #006eff;
        }
      }
    }
    .Interface {
      background-color: #f2f2f2;
      padding: 20px;
    }
    .Interface-top {
      font-size: 12px;
      width: 100%;
      padding: 20px;

      margin: 0 auto;
      background: #fff;
      margin-bottom: 20px;
    }
    .upper-side {
      height: 30px;
    }

    .upper-side .information {
      float: left;
    }

    .upper-side .edit {
      float: right;
    }

    .el-form-item {
      margin: 0;
    }

    .el-form-item__label {
      text-align: left;
    }

    .tabswitch {
      font-size: 12px;
      width: 100%;
      padding: 20px;
      margin: 0 auto;
      background: #fff;
    }

    .app-cam-alert,
    .app-cam-alert__info {
      font-size: 12px;
      line-height: inherit;
    }
    .app-cam-alert {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      position: relative;
      box-sizing: border-box;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 20px;
    }
    .btn {
      display: flex;
      width: 100%;
      align-items: center;
      height: 50px;
    }
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
        height: 600px;
        justify-content: center;
      }
      .container-right{
        display: flex;
        width:45%;
        height: 600px;
        flex-direction: column;
        justify-content: center;
      }
    }

    .block {
      text-align: right;
      margin-top: 10px;
    }

    .addbtn {
      margin-bottom: 10px;
    }

    .el-form-item__label {
      text-align: left;
    }

    .el-input__inner {
      position: relative;
    }

    .el-input {
      width: 20%;
    }

    .mark {
      color: #0ABF5B;
      margin-left: 10px;
    }

    // .fier {
    //   cursor: pointer;
    //   font-size: 130%;
    //   color: #888;
    //   position: absolute;
    //   right: 2%;
    //   top: 8%;
    // }

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

    .dialogStyle>.el-dialog__body {
      padding: 10px 20px 20px;
    }
  }

</style>
