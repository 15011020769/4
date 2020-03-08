<template>
  <div class="wrap">
    <div class="head">
      <Headcom :title="$t('CAM.userList.addUsertoStrag')" :backShow="true" @_back="back" />
    </div>
    <div class="policyToUser" v-loading="loading">
      <div class="step">
        <el-steps :active="active" direction="vertical" simple :space="200">
          <el-step :title="$t('CAM.userList.permissions')"></el-step>
          <el-step :title="$t('CAM.userList.review')"></el-step>
        </el-steps>
      </div>
      <div v-show="active==1" class="table">
        <Step3
          :groupIds="groupIds"
          :policyIds="policyIds"
          ref="step3"
        />
      </div>
      <div v-show="active==2">
        <el-table
          :data="multipleSelection"
          style="width: 96%; margin: 0 auto;"
          :empty-text="$t('CAM.strategy.zwsj')"
        >
          <el-table-column label="策略名" prop="PolicyName"></el-table-column>
          <el-table-column label="描述" prop="Description"></el-table-column>
        </el-table>
      </div>
      <div class="button">
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="prev()"
          v-if="active==2" 
        >
        {{$t('CAM.userList.prev')}}
        <!-- 上一步 -->
        </el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="next()"
          v-if="active==0 || active==1"
        >
        {{$t('CAM.userList.next')}}
        <!-- 下一步 -->
        </el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="complete()"
          v-if="active==2"
        >{{$t('CAM.userList.complete')}}
        <!-- 完成 -->
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ADD_USER,
  POLICY_LIST,
  USER_GROUP,
  POLICY_USER,
  QUERY_USER,
  ADD_USERTOGROUP,
  USER_LIST,
  QUERY_POLICY,
  GROUP_POLICY,
  RELATE_USER,
  QUERY_USER_ALLPOLICY,
  COPY_USER_POLICY,
  BATCH_OPERATE_CAM_STRATEGY,
  ADD_GROUPTOLIST,
} from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import Headcom from "../components/Head";
import Step3 from "../addUser/Tab/Step3";
export default {
  components: {
    Headcom, //头部组件
    Step3
  },
  data() {
    return {
      loading: true,
      active: 1,
      totalNum: 0,
      tableData: [],
      userData: [],
      userNums: 0,
      userDatas: [],
      multipleSelection: [],
      activeName: "first",
      emptyData: [],
      arrDataPush: [],
      policyNum: 10,
      userNum: 0,
      policyPage: 1,
      userPage: 1,
      policyArr: [],
      groupArr: [],
      pagesizes: 200,
      currpages: 1,
      policyIds: [], // 用户关联的策略ID
      groupIds: [], // 用户关联的组ID
      attachGroupIds: [], // 待綁定到用戶的用戶組id
    };
  },
  methods: {
    getStrategies(strategies=[]) {
      let ploicyParams = {
        Version: "2019-01-16",
        TargetUin: this.$route.query.Uin,
        Rp: this.pagesizes,
        Page: this.currpages,
        AttachType: 0
      }
      this.axios.post(QUERY_USER_ALLPOLICY, ploicyParams)
      .then(resp => {
        this.currpages += 1
        strategies = strategies.concat(resp.Response.PolicyList)
        if (strategies.length < resp.Response.TotalNum) {
          this.getStrategies(strategies)
        } else {
          const policyIds = []
          const groupIds = new Set()
          strategies.forEach(strategy => {
            if (strategy.Groups.length) {
              strategy.Groups.forEach(group => groupIds.add(Number(group.GroupId)))
            } else {
              policyIds.push(Number(strategy.PolicyId))
            }
          })
          this.policyIds = policyIds
          console.log(groupIds)
          this.groupIds = Array.from(groupIds)
          this.loading = false
        }
      })
    },
    //初始化用户列表数据
    init() {
      this.getStrategies()
    },
    prev() {
      --this.active;
      if (this.active < 0) this.active = 0;
    },
    next() {
      const step3Ref = this.$refs.step3
      //从策略列表中选取策略关联
      if (step3Ref.activeName == "first") {
        if (step3Ref.selectedPolicyId.join() === this.policyIds.join()) {
          this.$message({
            message: '請選擇策略',
            type: "error",
            showClose: true,
            duration: 0
          });
          return
        }
        const strategies = step3Ref.getSelectedStrategiesForStrategies()
        this.multipleSelection = strategies.filter(strategy => !this.policyIds.includes(strategy.PolicyId))
      }
      // //复用现有用户策略
      else if (step3Ref.activeName == "second") {
        if (!step3Ref.selectedUser) {
          this.$message({
            message: '請選擇用戶',
            type: "error",
            showClose: true,
            duration: 0
          });
          return
        }
        this.multipleSelection = step3Ref.getSelectedStrategiesForUser()
      }
      // //添加至组获得随机权限
      else if (step3Ref.activeName == "third") {
        if (step3Ref.selectedUserGroupId.join() === this.groupIds.join()) {
          this.$message({
            message: '請選擇用戶組',
            type: "error",
            showClose: true,
            duration: 0
          });
          return
        }
        const result = step3Ref.getSelectedStrategiesForUserGroup()
        const strategies = []
        const attachGroupIds = []
        Object.keys(result).forEach(groupId => {
          if (!this.groupIds.includes(Number(groupId))) {
            attachGroupIds.push(groupId)
            strategies.push(...result[groupId])
          }
        })
        this.attachGroupIds = attachGroupIds
        this.multipleSelection = strategies
      }
      if (this.active++ > 3) this.active = 0;
    },
    async complete() {
      const step3Ref = this.$refs.step3
      let res
      //从策略列表中选取策略关联
      if (step3Ref.activeName === "first") {
        const param = {
          Version: "2019-01-16",
          "ActionType": 1, // 绑定
          "RelateUin.0": this.$route.query.Uin
        }
        this.strategies.forEach((strategy, i) => {
          param[`StrategyId.${i}`] = strategy.PolicyId
        })
        res = await this.axios.post(BATCH_OPERATE_CAM_STRATEGY, param)
      } else if (step3Ref.activeName === "second") { // 复用现有用户策略
        const param = {
          Version: "2019-01-16",
          "FromUin": step3Ref.selectedUser, // 绑定
          "ToUin.0": this.$route.query.Uin
        }
        res = await this.axios.post(COPY_USER_POLICY, param)
      }
      // //添加至组获得随机权限
      else {
        const param = {
          Version: "2019-01-16",
        }
        this.attachGroupIds.forEach((groupId, i) => {
          param[`Info.${i}.Uid`] = this.$route.query.Uid
          param[`Info.${i}.GroupId`] = groupId
        })
        res = await this.axios.post(ADD_GROUPTOLIST, param)
      }
      if (res.Response.Error) {
        let ErrTips = {
          "InvalidParameter.GroupNotExist": "用戶組不存在",
          "InvalidParameter.GroupUserFull":
            "用戶組中的子用戶數量達到上限",
          "InvalidParameter.UserGroupFull":
            "子用戶加入的用戶組數量達到上限",
          "ResourceNotFound.UserNotExist": "用戶不存在"
        }
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        })
        this.loading = false
        return
      } else {
        this.$router.push(`/detailsUser?detailsData=${this.$route.query.Name}`)
        this.$message({
          message: '修改成功',
          type: "success",
          showClose: true,
          duration: 0
        })
      }
    },
    back() {
      this.$router.go(-1);
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
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
}
.step >>> .el-steps {
  background: white;
  padding-bottom: 25px;
}
</style>