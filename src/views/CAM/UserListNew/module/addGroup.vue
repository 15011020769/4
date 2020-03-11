<template>
  <div class="wrap">
    <div class="head">
      <Headcom :title="$t('CAM.userList.userAddGroup')" :backShow="true" @_back="back" />
    </div>
    <div class="policyToUser">
      <div class="step">
        <el-steps
          :active="active"
          direction="vertical"
          simple
          :space="200"
          style="margin-right: 50%"
        >
          <el-step :title="$t('CAM.userList.setGroup')"></el-step>
          <el-step :title="$t('CAM.userList.reviewUserGroup')"></el-step>
        </el-steps>
      </div>
      <div v-show="active==1" class="table">
        <div class="container">
       <div class="container-right">
          <span>用戶組清單({{userGroupTotalNum}})</span>
          <div>
            <el-input
              v-model="searchGroupValue"
              :placeholder="$t('CAM.userList.search')"
              size="small"
              class="inputSearchCl"
              clearable
              @keyup.enter.native="searchGroup"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchGroup"></i>
            </el-input>
          </div>

            <!-- @row-click="selectedRow"
            @selection-change="handleSelection" -->
          <el-table
            ref="multipleOption"
            tooltip-effect="dark"
            height="400"
            style="width: 80%; border:1px solid #ddd;"
            :data="userGroup"
            @select="toggleGroup"
            @select-all="toggleAllGroup"
            class="user-group-table"
            :empty-text="$t('CAM.strategy.zwsj')"
          >
            <el-input size="mini" style="width:20%" />
            <el-button size="mini" class="suo" icon="el-icon-search" show-overflow-tooltip></el-button>
            <el-table-column type="selection" :selectable="checkboxT"></el-table-column>
            <el-table-column :label="$t('CAM.userList.userGroup')" prop="groupName">
              <template slot-scope="scope">
                <el-tooltip effect="dark" :content="scope.row.isSelected === 1 ? '當前用戶已被關聯，如需解除關聯請前往詳情頁操作' : scope.row.groupName" placement="top">
                  <span>{{scope.row.groupName}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <infinite-loading
              slot="append"
              :identifier="userGroupInfiniteId"
              @infinite="userGroups"
              force-use-infinite-wrapper=".user-group-table .el-table__body-wrapper">
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </el-table>
        </div>

        <div class="container-left">
          <span>{{$t('CAM.userList.choose')}}({{selectedStrategiesWithoutGroup.length}})</span>
          <el-table
            ref="multipleSelected"
            tooltip-effect="dark"
            height="400"
            style="width: 80%;border:1px solid #ddd"
            :data="selectedStrategiesWithoutGroup"
            :empty-text="$t('CAM.strategy.zwsj')"
          >
            <el-table-column :label="$t('CAM.userList.userGroup')" prop="groupName"></el-table-column>
            <el-table-column :label="$t('CAM.userList.userCz')" show-overflow-tooltip>
              &lt;!&ndash;
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope)"
                  type="text"
                  size="small"
                >{{$t('CAM.userList.userRemove')}}</el-button>
              </template>&ndash;&gt;
            </el-table-column>
          </el-table>
        </div>
        </div>
        <!-- <div class="container">
          <div class="container-right">
            <span>用戶組清單</span>
            <div style="margin-top:10px;">
              <el-input
                clearable
                v-model="searchGroupValue"
                :placeholder="$t('CAM.userList.search')"
                size="small"
                class="inputSearchCl"
                @keyup.enter.native="searchGroup"
              >
                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchGroup"></i>
              </el-input>
            </div>

            <el-table
              ref="multipleOption"
              tooltip-effect="dark"
              height="400"
              style="width: 80%; border:1px solid #ddd;"
              @row-click="selectedRow"
              @selection-change="handleSelection"
              :data="userGroup"
              v-loading="loading"
              @cell-mouse-enter="userGroupEnter"
              @cell-mouse-leave="mouseleave"
              :empty-text="$t('CAM.strategy.zwsj')"
            >
              <el-input size="mini" style="width:20%" />
              <el-button size="mini" class="suo" icon="el-icon-search" show-overflow-tooltip></el-button>
              <el-table-column type="selection" :selectable="checkboxT"></el-table-column>
              <el-table-column :label="$t('CAM.userList.userGroup')" prop="GroupName">
                <template slot-scope="scope">
                  <el-tooltip v-if="scope.row.status !== 1" :content="scope.row.GroupName" effect="dark" placement="top">
                    <span>{{scope.row.GroupName}}</span>
                  </el-tooltip>
                  <span v-else>{{scope.row.GroupName}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="container-left">
            <span>用戶組清單</span>
            <el-table
              ref="multipleSelected"
              tooltip-effect="dark"
              height="400"
              style="width: 80%;border:1px solid #ddd;margin-top:10px;"
              :data="userGroupSelect"
              :empty-text="$t('CAM.strategy.zwsj')"
            >
              <el-table-column :label="$t('CAM.userList.userGroup')" prop="GroupName"></el-table-column>
              <el-table-column :label="$t('CAM.userList.userCz')" show-overflow-tooltip>
                &lt;!&ndash;
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index,userGroupSelect)"
                    type="text"
                    size="small"
                  >{{$t('CAM.userList.userRemove')}}</el-button>
                </template>&ndash;&gt;
              </el-table-column>
            </el-table>
          </div>
        </div> -->
      </div>
      <div v-show="active==2">
        <el-table style="width: 96%; margin: 0 auto;" :data="selectedStrategiesWithoutGroup" :empty-text="$t('CAM.strategy.zwsj')">
          <el-table-column :label="$t('CAM.userList.userGroup')" prop="groupName"></el-table-column>
          <el-table-column fixed="right" :label="$t('CAM.userList.userCz')">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope)"
                type="text"
                size="small"
              >{{$t('CAM.userList.userRemove')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="button">
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="prev()"
          v-if="active==2"
        >上一步</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="next()"
          v-if="active==0 || active==1"
        >下一步</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="complete()"
          v-if="active==2"
        >完成</el-button>
      </div>
    </div>
    <span class="tooltip" ref="userGroupTip">
      <div class="arrow" data-popper-arrow></div>
      當前用戶組已被關聯，如需解除關聯請前往詳情頁操作</span>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import Headcom from "../components/Head";
import { USER_GROUP, ADD_USERTOGROUP, RELATE_USER, LIST_GROUPS_V2 } from "@/constants";
import { createPopper } from '@popperjs/core/lib/popper-lite.js'
import InfiniteLoading from 'vue-infinite-loading'
export default {
  components: {
    Headcom, //头部组件
    InfiniteLoading,
  },
  data() {
    return {
      active: 1,
      searchGroupValue: "",
      userGroup: [],
      userGroupSelect: [],
      userNewGroup: [],
      groupArr: [],
      loading: true,
      userGroup1: [],
      uin: '',
      groupIds: [],
      groupRp: 10,
      groupPage: 1,
      userGroupTotalNum: 0,
      isInfiniteLoading: false,
      userGroupInfiniteId: 1,
    };
  },
  computed: {
    selectedStrategiesWithoutGroup() {
      return this.userGroupSelect.filter(s => s.isSelected !== 1)
    }
  },
  methods: {
    toggleGroup(a, b) {
      this.userGroupSelect = a
      if (this.groupIds.includes(b.groupId)) {
        this.groupIds = this.groupIds.filter(selected => selected !== b.groupId)
      } else {
        this.groupIds.push(b.groupId)
      }
    },
    toggleAllGroup(all) {
      console.log(all)
      this.userGroupSelect = all
      if (this.groupIds.length === this.userGroup.length) {
        this.groupIds = []
      } else {
        this.groupIds = all.map(g => g.groupId)
      }
    },
    userGroups($state) {
      // this.userGroup = [];
      this.isInfiniteLoading = true;
      let params = {
        isFilter: 3,
        keyword: this.searchGroupValue,
        rp: this.groupRp,
        page: this.groupPage,
        'filterUids.0': this.$route.query.Uid
      };
      this.axios
        .post(LIST_GROUPS_V2, params)
        .then(res => {
          this.groupPage += 1
          this.userGroupTotalNum = res.data.totalNum
          this.userGroup = this.userGroup.concat(res.data.groupInfo)
          res.data.groupInfo.forEach(group => {
            if (group.isSelected === 1) {
              this.groupIds.push(group.groupId)
              this.userGroupSelect.push(group)
            }
          })
          if (this.groupIds.length) {
            this.$nextTick(() => {
              this.userGroup.forEach(group => {
                if (this.groupIds.includes(group.groupId)) {
                  this.$refs.multipleOption.toggleRowSelection(group, true)
                }
              })
            })
          }
          if (this.userGroup.length === res.data.totalNum) {
            $state && $state.complete()
          } else {
            $state && $state.loaded()
          }
        })
    },
    checkboxT(row, index) {
      if (row.isSelected == 1) {
        return false;
      } else {
        return true;
      }
    },
    deleteRow({ $index, row }) {
      this.userGroupSelect = this.userGroupSelect.filter(g => g.groupId !== row.groupId)
      this.groupIds = this.groupIds.filter(groupId => groupId !== row.groupId)
      
      this.$refs.multipleOption.toggleRowSelection(this.userGroup.find(s => s.groupId === row.groupId), false)
    },
    searchGroup() {
      this.groupPage = 1
      this.userGroup = []
      this.userGroups()
    },
    complete() {
      const groups = this.selectedStrategiesWithoutGroup
        if (!groups.length) {
          return void this.$message({
            message: "請選擇用戶組",
            type: 'error',
            showClose: true,
            duration: 0
          });
        } else {
          const params = {
            Version: "2019-01-16"
          }
          const uid = this.$route.query.Uid
          groups.forEach((g, i) => {
            params[`Info.${i}.Uid`] = uid;
            params[`Info.${i}.GroupId`] = g.groupId;
          })
          this.axios.post(ADD_USERTOGROUP, params).then(res => {
            if (res.Response.Error === undefined) {
              this.$message({
                showClose: true,
                message: "添加成功",
                duration: 0,
                type: "success"
              });
              this.$router.go(-1);
            } else {
              let ErrTips = {
                "InvalidParameter.GroupNotExist": "用戶組不存在",
                "InvalidParameter.GroupUserFull":
                  "用戶組中的子用戶數量達到上限",
                "InvalidParameter.UserGroupFull":
                  "子用戶加入的用戶組數量達到上限",
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
          })
        }
    },
    prev() {
      --this.active;
      if (this.active < 0) this.active = 0;
    },
    next() {
      if (this.active++ > 3) this.active = 0;
    },
    back() {
      this.$router.go(-1);
    }
  },
  created() {
    // this.userGroups();
  }
};
</script>
<style lang="scss" scoped>
.tooltip {
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 13px;
  position: fixed;
  top: 100%;
}
.arrow,
.arrow::before {
  position: absolute;
  width: 8px;
  height: 8px;
  z-index: -1;
}

.arrow::before {
  content: '';
  transform: rotate(45deg);
  background: #333;
}

.tooltip[data-popper-placement^='top'] > .arrow {
  bottom: -4px;
}
.wrap >>> .el-form-item__label {
  text-align: left;
}
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  border-radius: 0;
  height: 30px !important;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px;
}
.policyToUser {
  width: 85%;
  background: white;
  margin: 0 auto;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  .step {
    width: 100%;
  }
  .table {
    flex: 1;
  }
  .button {
    width: 100%;
  }
  .container {
    display: flex;
    padding: 20px;
    box-sizing: border-box;
    .container-right {
      width: 70%;
      flex-direction: column;
      justify-content: center;
      margin-left: 100px;
      .inputSearchCl {
        width: 80%;
      }
    }
    .container-left {
      width: 70%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-direction: column;
    }
  }
}
.step >>> .el-steps {
  background: white;
  padding-bottom: 25px;
}
</style>