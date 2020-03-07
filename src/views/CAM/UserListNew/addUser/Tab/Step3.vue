<template>
  <div class="wrap">
    <el-tabs v-model="activeName">
      <!-- 从策略清单选取 -->
      <el-tab-pane :label="$t('CAM.userList.chooseStrage')" name="first">
        <div class="app-cam-alert">
          <div class="app-cam-alert__info">
            <h4>授權提示</h4>
            <ul class="app-cam-list app-cam-list--bullet">
              <li>如果您希望授予子賬號當前賬號下全部資源的全部訪問許可權，請單選 AdministratorAccess 即可</li>
              <li>如果您希望授予子賬號當前賬號下除去訪問管理（CAM）、費用中心以外的全部資源訪問許可權，請單選 QCloudResourceFullAccess 即可</li>
              <li>如果您希望授予子賬號當前賬號下全部資源的只讀訪問許可權，請單選 ReadOnlyAccess 即可</li>
            </ul>
          </div>
        </div>
        <h3>
          {{$t('CAM.userList.strategyTitle')}}
          <span>（共{{strategiesTotalNum - policyIds.length}}条）</span>
          <el-input
            placeholder="請輸入策略名稱/描述"
            v-model="policyInp"
            class="input-with-select"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="_policySearch"></el-button>
          </el-input>
        </h3>
        <el-table
          :data="strategies"
          max-height="520"
          style="width: 100%"
          @select="togglePolicy"
          @select-all="toggleAllPolicy"
          @cell-mouse-enter="strategyEnter"
          @cell-mouse-leave="mouseleave"
          class="strategies-table"
          ref="strategiesTable"
        >
          <el-table-column type="selection" width="55" :selectable="checkboxStrategy"></el-table-column>
          <el-table-column prop="PolicyName" :label="$t('CAM.userList.strategyNames')" width="250"></el-table-column>
          <el-table-column :label="$t('CAM.userList.descs')" width="280">
            <template slot-scope="scope">
              <p class="omit">{{scope.row.Description}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="Attachments" :label="$t('CAM.userList.useNum')"></el-table-column>
          <el-table-column prop="Type" :label="$t('CAM.userList.clType')">
            <template slot-scope="scope">
              <p>{{tacticsType[scope.row.Type]}}</p>
            </template>
          </el-table-column>
          <infinite-loading
            slot="append"
            :identifier="strategiesInfiniteId"
            @infinite="loadStrategies"
            force-use-infinite-wrapper=".strategies-table .el-table__body-wrapper">
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </el-table>
      </el-tab-pane>
      <!-- 复用现有用户策略 -->
      <el-tab-pane :label="$t('CAM.userList.userPolicies')" name="second" lazy>
        <div class="app-cam-alert">
          <div class="app-cam-alert__info">
            僅復用現有用戶的直接關聯策略，不復用現有用戶因加入用戶組而獲得的隨組關聯策略。
          </div>
        </div>
        <h3>
          {{$t('CAM.userList.listTitle')}}
          <span>（共{{userTotalNum}}{{$t('CAM.strip')}}）</span>
          <el-input
            placeholder="請輸入用戶名備註等訊息"
            v-model="userInp"
            class="input-with-select"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="_userSearch"></el-button>
          </el-input>
        </h3>
        <el-radio-group v-model="selectedUser" style="width:100%;">
          <el-table
            max-height="520"
            :data="users"
            class="user-table"
          >
            <el-table-column :label="$t('CAM.userList.userName')">
              <template slot-scope="scope">
                <el-radio :label="scope.row.Uin">{{scope.row.Name}}</el-radio>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userList.userRemark')" prop="Remark">
              <template slot-scope="scope">
                <span v-show="scope.row.Remark">{{scope.row.Remark}}</span>
                <span v-show="!scope.row.Remark">-</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userList.RelatedPolicies')">
              <template slot-scope="scope">
                <span v-if="usersStrategies[scope.$index].TotalNum > 0">
                  {{usersStrategies[scope.$index].List.map(s => s.PolicyName).join()}}
                  <span v-if="usersStrategies[scope.$index].TotalNum > 2">
                    以及 <el-button type="text" style="font-size: 12px;" @click="$router.push(`/detailsUser?detailsData=${scope.row.Name}`)">其他{{ usersStrategies[scope.$index].TotalNum - 2 }}项</el-button>
                  </span>
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <infinite-loading
              slot="append"
              @infinite="loadUser"
              :identifier="userInfiniteId"
              force-use-infinite-wrapper=".user-table .el-table__body-wrapper">
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </el-table>
        </el-radio-group>
      </el-tab-pane>
      <!-- 添加到组复用组的策略 -->
      <el-tab-pane :label="$t('CAM.userList.userToGroup')" name="third" lazy>
        <div class="app-cam-alert">
          <div class="app-cam-alert__info">
            將用戶添加至用戶組以獲得隨組關聯策略。按照工作職能創建組並賦予用戶組最小許可權，將用戶添加至擁有最小許可權的用戶組內是管理用戶許可權的最佳做法。
          </div>
        </div>
        <h3>
          {{$t('CAM.userList.userGropList')}}
          <span>（共{{userGroupsTotalNum - groupIds.length}}{{$t('CAM.strip')}}</span>
          <el-input
            :placeholder="$t('CAM.userList.searchUserGroup')"
            v-model="userGroupInp"
            class="input-with-select"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="_userGroupSearch"></el-button>
          </el-input>
        </h3>
        <el-table
          :data="userGroups"
          max-height="520"
          style="width: 100%"
          @select="toggleUserGroup"
          @select-all="toggleAllUserGroup"
          @cell-mouse-enter="userGroupEnter"
          @cell-mouse-leave="mouseleave"
          class="user-groups-table"
          ref="userGroupTable"
        >
          <el-table-column type="selection" width="55" :selectable="checkboxUserGroup"></el-table-column>
          
          <el-table-column prop="GroupName" :label="$t('CAM.userList.userName')"></el-table-column>
          <el-table-column :label="$t('CAM.userList.userRemark')">
            <template slot-scope="scope">
              <p class="omit" v-show="scope.row.Remark">{{scope.row.Remark}}</p>
              <p v-show="!scope.row.Remark">-</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('CAM.userList.RelatedPolicies')">
            <template slot-scope="scope">
              <!-- {{userGroupsStrategies[scope.$index]}} -->
              <span v-if="userGroupsStrategies[scope.$index].TotalNum > 0">
                {{userGroupsStrategies[scope.$index].List.map(s => s.PolicyName).join()}}
                <span v-if="userGroupsStrategies[scope.$index].TotalNum > 2">
                  以及 <el-button type="text" style="font-size: 12px;" @click="$router.push(`/Interfacedetails?GroupId=${scope.row.GroupId}`)">其他{{ userGroupsStrategies[scope.$index].TotalNum - 2 }}项</el-button>
                </span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <infinite-loading
            slot="append"
            :identifier="userGroupsInfiniteId"
            @infinite="loadUserGroups"
            force-use-infinite-wrapper=".user-groups-table .el-table__body-wrapper">
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <span class="tooltip" ref="userGroupTip">當前用戶組已被關聯，如需解除關聯請前往詳情頁操作</span>
    <span class="tooltip" ref="strategyTip">當前策略已被關聯，如需解除關聯請前往詳情頁操作</span>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { POLICY_LIST, USER_GROUP, USER_LIST, DESCRIBE_ATTACHED_ENTITY_POLICIES } from '@/constants'
import { createPopper } from '@popperjs/core/lib/popper-lite.js'
export default {
  name: "step3",
  props: {
    policyIds: {
      type: Array,
      default: () => []
    },
    groupIds: {
      type: Array,
      default: () => []
    }
  },
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      userGroupsInfiniteId: 1,
      userInfiniteId: 1,
      strategiesInfiniteId: 1,
      policyInp: "",
      userInp: "",
      userGroupInp: "",
      multipleSelection: [],
      selectedPolicyId: [],
      selectedUserGroupId: [],
      //策略类型转换
      tacticsType: {
        1: "自定義策略",
        2: "預設策略"
      },
      activeName: "first",
      selectedUser: "",
      strategiesRp: 10,
      strategiesPage: 1,
      usesGroupsRp: 10,
      usesGroupsPage: 1,
      usesOffset: 0,
      strategies: [],
      allUsers: [], // 所有的用戶 保持不变  搜索时从这里过滤后保存在sliceUser,再分批显示在user
      sliceUsers: [], // 滚动加载从这个里面截取
      users: [],
      userGroups: [],
      usersStrategies: [],
      userGroupsStrategies: [],
      strategiesTotalNum: 0,
      userGroupsTotalNum: 0,
      userTotalNum: 0,
      loadedUserGroups: false,
      ins: undefined,
    };
  },
  watch: {
    groupIds: {
      handler() {
        this.selectedUserGroupId = [...this.groupIds]
      },
      deep: true
    },
    policyIds: {
      handler() {
        this.selectedPolicyId = [...this.policyIds]
      },
      deep: true
    }
  },
  mounted() {
    this.loadStrategies()
    this.getAllUser()
  },
  methods: {
    strategyEnter(row, column, cell) {
      if (this.policyIds.includes(row.PolicyId)) {
        this.ins = createPopper(cell, this.$refs.strategyTip, {
          placement: 'right',
        })
      }
    },
    userGroupEnter(row, column, cell) {
      if (this.groupIds.includes(row.GroupId)) {
        this.ins = createPopper(cell, this.$refs.userGroupTip, {
          placement: 'right',
        })
      }
    },
    mouseleave(row) {
      if (this.ins) {
        this.ins.destroy()
      }
    },
    getSelectedStrategiesForStrategies() {
      return this.strategies.filter(strategy => this.selectedPolicyId.includes(strategy.PolicyId))
    },
    getSelectedStrategiesForUser() {
      const index = this.users.findIndex(user => user.Uin === this.selectedUser)
      return this.usersStrategies[index].List
    },
    getSelectedStrategiesForUserGroup() {
      const result = {} //组id: 组策略
      this.userGroups.forEach((group, i) => {
        if (this.selectedUserGroupId.includes(group.GroupId)) {
          result[group.GroupId] = this.userGroupsStrategies[i].List
        }
      })
      return result
    },
    togglePolicy(a, b) {
      if (this.selectedPolicyId.includes(b.PolicyId)) {
        this.selectedPolicyId = this.selectedPolicyId.filter(selected => selected !== b.PolicyId)
      } else {
        this.selectedPolicyId.push(b.PolicyId)
      }
    },
    toggleUserGroup(a, b) {
      if (this.selectedUserGroupId.includes(b.GroupId)) {
        this.selectedUserGroupId = this.selectedUserGroupId.filter(selected => selected !== b.GroupId)
      } else {
        this.selectedUserGroupId.push(b.GroupId)
      }
    },
    toggleAllUserGroup(all) {
      if (this.selectedUserGroupId.length === this.userGroups.length) {
        this.selectedUserGroupId = []
      } else {
        this.selectedUserGroupId = all.map(g => g.GroupId)
      }
    },
    toggleAllPolicy(all) {
      if (this.selectedPolicyId.length === this.strategies.length) {
        this.selectedPolicyId = []
      } else {
        this.selectedPolicyId = all.map(g => g.PolicyId)
      }
    },
    getAllUser() {
      this.axios.post(USER_LIST, {
        Version: '2019-01-16',
      }).then(res => {
        this.allUsers = res.Response.Data
      })
    },
    loadUser($state) {
      if (this.userInp && this.userInp.trim()) {
        this.sliceUsers = this.allUsers.filter(user => user.Name.includes(this.userInp.trim()))
      } else {
        this.sliceUsers = [...this.allUsers]
      }
      this.userTotalNum = this.sliceUsers.length
      const users = this.sliceUsers.slice(this.usesOffset, this.usesOffset + 10)
      this.usesOffset += 10
      Promise.resolve().then(() => {
        this.queryStrategiesForUsersAndUserGroups(users.map(user => user.Uin), 1, () => {
          this.users = this.users.concat(users)
          if (this.usesOffset >= this.sliceUsers.length) {
            $state && $state.complete()
          } else {
            $state && $state.loaded()
          }
        })
      })
    },
    loadStrategies($state) {
      this.axios.post(POLICY_LIST, {
        Version: '2019-01-16',
        Page: this.strategiesPage,
        Rp: this.strategiesRp,
        Keyword: this.policyInp,
        Scope: 'QCS', // 自取预设策略
      }).then(res => {
        this.strategiesPage += 1
        this.strategiesTotalNum = res.Response.TotalNum
        this.strategies = this.strategies.concat(res.Response.List)
        if (this.selectedPolicyId.length) {
          this.$nextTick(() => {
            this.strategies.forEach(strategy => {
              if (this.selectedPolicyId.includes(strategy.PolicyId)) {
                this.$refs.strategiesTable.toggleRowSelection(strategy, true)
              }
            })
          })
        }
        if (this.strategies.length === res.Response.TotalNum) {
          $state && $state.complete()
        } else {
          $state && $state.loaded()
        }
      })
    },
    loadUserGroups($state) {
      this.axios.post(USER_GROUP, {
        Version: '2019-01-16',
        Page: this.usesGroupsPage,
        Rp: this.usesGroupsRp,
        Keyword: this.userGroupInp,
      }).then(res => {
        this.usesGroupsPage += 1
        this.userGroupsTotalNum = res.Response.TotalNum
        
        this.queryStrategiesForUsersAndUserGroups(res.Response.GroupInfo.map(group => group.GroupId), 2, () => {
          this.userGroups = this.userGroups.concat(res.Response.GroupInfo)
          if (this.selectedUserGroupId.length) {
            this.$nextTick(() => {
              this.userGroups.forEach(group => {
                if (this.selectedUserGroupId.includes(group.GroupId)) {
                  this.$refs.userGroupTable.toggleRowSelection(group, true)
                }
              })
            })
          }
          if (this.userGroups.length === res.Response.TotalNum) {
            $state && $state.complete()
          } else {
            $state && $state.loaded()
          }
        })
      })
    },
    queryStrategiesForUsersAndUserGroups(ids, type, cb) {
      const params = {
        Region: 'ap-guangzhou',
        "Version": "2019-01-16",
        "Type": type,
        "Page": 1,
        "Rp": 2,
      }
      let key = 'TargetUin'
      let strategiesKey = 'usersStrategies'
      if (type === 2) {
        key = 'GroupId'
        strategiesKey = 'userGroupsStrategies'
      }
      ids.forEach((id, i) => {
        params[`${key}.${i}`] = id
      })
      this.axios.post(DESCRIBE_ATTACHED_ENTITY_POLICIES, params)
      .then(resp => {
        if (resp.Response.List) {
          this[strategiesKey] = this[strategiesKey].concat(resp.Response.List)
          cb()
        }
      })
    },
    checkboxStrategy(row, index) {
      if (this.policyIds.includes(row.PolicyId)) {
        return false
      }
      return true
    },
    checkboxUserGroup(row, index) {
      if (this.groupIds.includes(row.GroupId)) {
        return false
      }
      return true
    },
    //策略搜索
    _policySearch() {
      this.strategies = []
      this.strategiesPage = 1
      this.strategiesInfiniteId += 1
    },
    _userGroupSearch() {
      this.userGroups = []
      this.usesGroupsPage = 1
      this.userGroupsStrategies = []
      this.userGroupsInfiniteId += 1
    },
    //用户搜索
    _userSearch() {
      this.users = []
      this.usesOffset = 0
      this.usersStrategies = []
      this.userInfiniteId += 1
    },
  }
};
</script>
<style scoped lang='scss'>
.tooltip {
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 13px;
  position: fixed;
  top: 100%;
}
.wrap >>> .el-input__inner,
.wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  border-radius: 0;
  font-size: 12px;
}
.omit {
  // width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.input-with-select >>> .el-input-group__append {
  border-radius: 0;
  padding: 0 10px;
}
.input-with-select {
  width: 320px;
  float: right;
}
h3 {
  margin-top: 5px;
  margin-bottom: 20px;
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
  .app-cam-list {
    padding: 10px 0 0;
    li {
      line-height: 1.5;
      margin-bottom: 8px;
      list-style: disc;
    }
}
}
</style>