<template>
  <div class="wrap">
    <div class="main" style="background:white;">
      <div class="left">
          <h3>
          選擇添加的用戶
          <span>（共{{usersTotalNum}}條）</span>
          <el-input
            placeholder="請輸入用戶名/ID/備註"
            v-model="userInp"
            class="input-with-select"
            clearable
             style="margin-top: 15px;"
          >
            <el-button slot="append" icon="el-icon-search" @click="_userSearch"></el-button>
          </el-input>
        </h3>
        <div class="border"  style="height: 522px;">
          <el-table
            :data="users"
            max-height="520"
            @select="toggleuser"
            @select-all="toggleAlluser"
            class="users-table"
            ref="usersTable"
          >
            <el-table-column type="selection" width="55" :selectable="checkT"></el-table-column>
            <el-table-column label="用戶">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.IsSelected === 1 ? '當前用戶已被添加/關聯，如需移除請前往詳情頁操作' : scope.row.Name" placement="bottom">
                  <span>{{scope.row.Name}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="用戶類型" width="100">
              子用戶
            </el-table-column>
            <infinite-loading
              slot="append"
              :identifier="usersInfiniteId"
              @infinite="loadUsers"
              force-use-infinite-wrapper=".users-table .el-table__body-wrapper">
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </el-table>
        </div>
      </div>
      <div class="mid">
        <i class="el-icon-connection"></i>
      </div>
      <div class="right">
        <p class="title" style="margin-bottom: 15px;">
          <b style="font-size:13px;">{{$t('CAM.userList.choose')}}</b>
          &nbsp;({{selectedUsersWithoutGroup.length}}{{$t('CAM.strip')}})
        </p>
        <div class="border" style="height: 562px;">
          <el-table :data="selectedUsersWithoutGroup" style="max-height: 560px;width: 100%;overflow-y: scroll;" :empty-text="$t('CAM.strategy.zwsj')">
            <el-table-column prop="Name" label="用戶"></el-table-column>
            <el-table-column label="用戶類型" width="100">
              子用戶
            </el-table-column>
            <el-table-column :label="$t('CAM.userGroup.colHandle')" width="50">
            &lt;!&ndash;
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
import { LIST_SUBACCOUNTS } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import InfiniteLoading from 'vue-infinite-loading'
export default {
  name: "transfer",
  props: {
    groupIds: Array,
    visible: Boolean
  },
  data() {
    return {
      usersInfiniteId: 1,
      selectedUsers: [],
      selecteduserId: [],
      usersRp: 10,
      usersPage: 1,
      userInp: "",
      usersTotalNum: 0,
      users: [],
    };
  },
  components: {
    InfiniteLoading,
  },
  computed: {
    selectedUsersWithoutGroup() {
      return this.selectedUsers.filter(s => s.IsSelected !== 1)
    }
  },
  watch: {
    visible(n) {
      if (n === true) {
        this.users = []
        this.usersPage = 1
        this.selectedUsers = []
        this.selecteduserId = []
        this.userInp = ''
        this.loadUsers()
      }
    }
  },
  methods: {
    checkT(row) {
      if (row.IsSelected === 1) {
        return false
      }
      return true
    },
    toggleuser(a, b) {
      this.selectedUsers = a
      if (this.selecteduserId.includes(b.Uid)) {
        this.selecteduserId = this.selecteduserId.filter(selected => selected !== b.Uid)
      } else {
        this.selecteduserId.push(b.Uid)
      }
    },
    toggleAlluser(all) {
      this.selectedUsers = all
      if (this.selecteduserId.length === this.users.length) {
        this.selecteduserId = []
      } else {
        this.selecteduserId = all.map(g => g.Uid)
      }
    },
    deleteRow(i, row) {
      this.selectedUsers = this.selectedUsers.filter(s => s.Uid !== row.Uid)
      this.selecteduserId = this.selecteduserId.filter(Uid => Uid !== row.Uid)
      
      this.$refs.usersTable.toggleRowSelection(this.users.find(s => s.Uid === row.Uid), false)
    },
    loadUsers($state) {
      const param = {
        Version: '2019-01-16',
        "Type": "SubAccount",
        "Version": "2019-01-16",
        IsFilter: 3,
        "Offset": (this.usersPage - 1) * this.usersRp,
        "Limit": this.usersRp,
        Keyword: this.userInp,
      }
      this.groupIds.forEach((gid, i) => {
        param[`FilterGroups.${i}`] = gid
      })
      this.axios.post(LIST_SUBACCOUNTS, param).then(res => {
        this.usersPage += 1
        this.usersTotalNum = res.Response.TotalNum
        res.Response.UserInfo.forEach(s => {
          if (s.IsSelected) {
            this.selecteduserId.push(s.Uid)
            this.selectedUsers.push(s)
          }
        })
        this.users = this.users.concat(res.Response.UserInfo)
        if (this.selecteduserId.length) {
          this.$nextTick(() => {
            this.users.forEach(user => {
              if (this.selecteduserId.includes(user.Uid)) {
                this.$refs.usersTable.toggleRowSelection(user, true)
              }
            })
          })
        }
        if (this.users.length === res.Response.TotalNum) {
          $state && $state.complete()
        } else {
          $state && $state.loaded()
        }
      })
    },
    //策略搜索
    _userSearch() {
      this.users = []
      this.usersPage = 1
      this.usersInfiniteId += 1
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
</style>