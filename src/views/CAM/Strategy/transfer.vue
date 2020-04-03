<template>
  <div class="wrap">
    <div class="main" style="background:white;">
      <div class="left">
          <h3>
          關聯{{tableTitle}}
          <span>（共{{totalNum}}條）</span>
          <el-input
            :placeholder="commandObj.value === 'user' ? '支持多關鍵詞(間隔為空格)搜索用戶名/帳戶ID/備註' : '支持用戶組名稱/備註'"
            v-model="keyword"
            class="input-with-select"
            clearable
             style="margin-top: 15px;"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </h3>
        <div class="border"  style="height: 522px;">
          <el-table
            :data="data"
            max-height="520"
            class="data-table"
            ref="tableRef"
          >
            <el-table-column width="55">
              <template slot-scope="scope">
                <el-checkbox v-if="scope.row.disabled" disabled checked />
                <el-checkbox v-else @change="status => toggleuser(scope.row, scope.$index, status)" v-model="scope.row.checked" />
              </template>
            </el-table-column>
            <el-table-column label="用戶">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.disabled ? `當前${scope.row.type === 'user' ? '用戶' : '用戶組'}已被關聯，如需移除請前往詳情頁操作` : scope.row.name" placement="bottom">
                  <span>{{scope.row.name}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="類型" width="150" align="center">
              <template slot-scope="scope">
                {{scope.row.type === 'user' ? '用戶' : '用戶組'}}
              </template>
              <template slot="header">
                <el-dropdown trigger="click" @command="handleCommand" size="mini">
                  <span style="color:#909399">
                   切換成{{ commandObj.value === 'user' ? '用戶組' : '用戶'}}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in table_options2" :key="item.value" :command="item">{{item.label}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <infinite-loading
              slot="append"
              :identifier="infiniteId"
              @infinite="loadData"
              force-use-infinite-wrapper=".data-table .el-table__body-wrapper">
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </el-table>
        </div>
      </div>
      <div class="mid">
        <i class="el-icon-sort" style="transform: rotate(90deg);"></i>
      </div>
      <div class="right">
        <p class="title" style="margin-bottom: 15px;">
          <b style="font-size:13px;">{{$t('CAM.userList.choose')}}</b>
          &nbsp;({{selectedData.length}}{{$t('CAM.strip')}})
        </p>
        <div class="border" style="height: 562px;">
          <el-table :data="selectedData" style="max-height: 560px;width: 100%;overflow-y: scroll;" :empty-text="$t('CAM.strategy.zwsj')">
            <el-table-column prop="name" label="用戶名/組名"></el-table-column>
            <el-table-column label="類型" width="100">
              <template slot-scope="scope">
                {{scope.row.type === 'user' ? '子用戶' : '用戶組'}}
              </template>
              
            </el-table-column>
            <el-table-column :label="$t('CAM.userGroup.colHandle')" width="80">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">x
              </el-button>
            </template>&ndash;&gt;
          </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LIST_SUBACCOUNTS, LIST_GROUPS_V2 } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import InfiniteLoading from 'vue-infinite-loading'
export default {
  name: "transfer",
  props: {
    policyId: String,
    visible: Boolean
  },
  data() {
    return {
      infiniteId: 1,
      selectedGroups: [],
      selectedGroupId: [],
      selectedUsers: [],
      selecteduserId: [],
      selectedData: [],
      rp: 10,
      page: 1,
      keyword: "",
      tableTitle: '用戶',
      totalNum: 0,
      data: [],
      commandObj: {
        value: "user",
        label: "用戶"
      },
      table_options2: [{
        value: "user",
        label: "用戶"
      },
      {
        value: "group",
        label: "用戶組"
      }
    ],
    };
  },
  components: {
    InfiniteLoading,
  },
  // computed: {
  //   selectedUsersWithoutPolicy() {
  //     return this.selectedUsers.filter(s => s.IsSelected !== 1)
  //   }
  // },
  watch: {
    visible(n) {
      if (n === true) {
        this.data = []
        this.page = 1
        this.selectedUsers = []
        this.selecteduserId = []
        this.selectedGroups = []
        this.selectedGroupId = []
        this.selectedData = []
        this.keyword = ''
        this.loadUsers()
      }
    }
  },
  methods: {
     handleCommand(command) {
        this.commandObj = command;
        this.tableTitle = command.label;
          this.page = 1
          this.data = []
        // 查询用户信息 // 查询用户组信息
        if (command.value === "user") {
          this.loadUsers();
        } else if (command.value === "group") {
          this.loadGroups();
        }
      },
    checkT(row) {
      if (row.isSelected === 1) {
        return false
      }
      return true
    },
    toggleuser(row, i, status) {
      if (this.commandObj.value === 'user') {
        if (status) {
          row.checked = true
          this.selecteduserId.push(row.uin)
          this.selectedUsers.push(row)
          this.selectedData.push({
            name: row.name,
            uin: row.uin,
            type: 'user',
          })
        } else {
          row.checked = false
          this.selecteduserId = this.selecteduserId.filter(uin => uin !== row.uin)
          this.selectedUsers = this.selectedUsers.filter(u => u.uin !== row.uin)
          this.selectedData = this.selectedData.filter(u => u.uin !== row.uin)
        }
      } else {
        if (status) {
          row.checked = true
          this.selectedGroupId.push(row.groupId)
          this.selectedGroups.push(row)
          this.selectedData.push({
            name: row.name,
            groupId: row.groupId,
            type: 'group',
          })
        } else {
          row.checked = false
          this.selectedGroupId = this.selectedGroupId.filter(groupId => groupId !== row.groupId)
          this.selectedGroups = this.selectedGroups.filter(g => g.groupId !== row.groupId)
          this.selectedData = this.selectedData.filter(g => g.groupId !== row.groupId)
        }
      }
    },
    deleteRow(i, row) {
      if (row.type === 'user') {
        this.data.forEach(d => {
          if (d.uin === row.uin) {
            d.checked = false
          }
        })
        this.selecteduserId = this.selecteduserId.filter(uin => uin !== row.uin)
        this.selectedUsers = this.selectedUsers.filter(u => u.uin !== row.uin)
        this.selectedData = this.selectedData.filter(u => u.uin !== row.uin)
      } else {
        this.data.forEach(d => {
          if (d.groupId === row.groupId) {
            d.checked = false
          }
        })
        this.selectedGroupId = this.selectedGroupId.filter(groupId => groupId !== row.groupId)
        this.selectedGroups = this.selectedGroups.filter(g => g.groupId !== row.groupId)
        this.selectedData = this.selectedData.filter(g => g.groupId !== row.groupId)
      }
    },
    loadData($state) {
      if (this.commandObj.value === 'user') {
        this.loadUsers($state)
      } else {
        this.loadGroups($state)
      }
    },
    loadUsers($state) {
      const param = {
        Version: '2019-01-16',
        "Type": "SubAccount",
        "Version": "2019-01-16",
        IsFilter: 2,
        "Offset": (this.page - 1) * this.rp,
        "Limit": this.rp,
        Keyword: this.keyword,
        FilterPolicyId: this.policyId,
      }
      this.axios.post(LIST_SUBACCOUNTS, param).then(res => {
        this.page += 1
        this.totalNum = res.Response.TotalNum
        const data = []
        res.Response.UserInfo.forEach(s => {
          data.push({type: 'user', uin: s.Uin, name: s.Name, disabled: s.IsSelected === 1, checked: this.selecteduserId.includes(s.Uin) })
        })
        this.data = this.data.concat(data)
        if (this.data.length === res.Response.TotalNum) {
          $state && $state.complete()
        } else {
          $state && $state.loaded()
        }
      })
    },
    loadGroups($state) {
      let params = {
        isFilter: 2,
        keyword: this.keyword,
        rp: this.rp,
        page: this.page,
        filterPolicyId: this.policyId
      };
      this.axios
        .post(LIST_GROUPS_V2, params)
        .then(res => {
          this.page += 1
          this.totalNum = res.data.totalNum
          const data = []
          res.data.groupInfo.forEach(group => {
            data.push({type: 'group', groupId: group.groupId, name: group.groupName, disabled: group.isSelected === 1, checked: this.selectedGroupId.includes(group.groupId)})
          })
          this.data = this.data.concat(data)
          if (this.data.length === Number(res.data.totalNum)) {
            $state && $state.complete()
          } else {
            $state && $state.loaded()
          }
        })
    },
    //策略搜索
    search() {
      this.data = []
      this.page = 1
      this.infiniteId += 1
    },
  }
};
</script>

<style scoped lang='scss'>
.wrap >>> .el-dropdown {
  font-size: 12px;
}
::v-deep .el-input__clear {
  position: absolute;
  right: calc(100% + 2px);
}
.wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wrap {
  margin-top: -25px;
  .title {
    margin-bottom: 5px;
    font-size: 12px;
  }
  .main {
    display: flex;
    overflow: hidden;

    .border {
      border: 1px #f2f2f2 solid;
    }
    .left {
      flex: 1;

      .seek {
        position: relative;

        p {
          position: absolute;
          z-index: 100px;
          top: 0;
          right: 0;
          display: flex;
          align-items: center;
          height: 100%;
          cursor: pointer;

          i {
            margin-right: 10px;
          }
        }
      }
    }
    .right {
      flex: 1;
    }
    .mid {
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 20px;
      }
    }
  }
}
.desc {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
::v-deep .el-table::before {
  background-color: transparent !important;
}
::v-deep th {
  padding: 0;
  line-height: 50px;
}
</style>