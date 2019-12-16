<template>
  <div class="wrap">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('CAM.userList.chooseStrage')" name="first">
        <h3>
          {{$t('CAM.userList.strategyTitle')}}
          <span>（共{{totalNum}}条）</span>
          <el-input
            :placeholder="$t('CAM.userList.searchStarge')"
            v-model="policyInp"
            class="input-with-select"
            @change="_policyInp"
          >
            <el-button slot="append" icon="el-icon-search" @click="_policySearch"></el-button>
          </el-input>
        </h3>
        <el-table
          :data="tableData"
          max-height="520"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loadmore="debounce"
        >
          <el-table-column type="selection" width="55"></el-table-column>
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
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('CAM.userList.userPolicies')" name="second">
        <h3>
         {{$t('CAM.userList.listTitle')}}
          <span>（共{{userDatas.length}}条）</span>
        </h3>
        <el-radio-group v-model="radio" @change="_radio" style="width:100%;margin-top:-3px;">
          <el-table max-height="520" :data="userDatas" @selection-change="handleSelectionChange">
            <el-table-column :label="$t('CAM.userList.userName')">
              <template slot-scope="scope">
                <el-radio :label="scope.row.Name"></el-radio>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userList.userRemark')" prop="Remark">
              <template slot-scope="scope">
                <span v-show="scope.row.Remark">{{scope.row.Remark}}</span>
                <span v-show="!scope.row.Remark">-</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CAM.userList.RelatedPolicies')">
              <template slot-scope="scope" v-if="scope.row.policy">
                <div v-show="scope.row.policy.length != 0" class="omit">
                  <span v-for="(item,index) in scope.row.policy" :key="index">
                    <font style="color:#3E8EF7;cursor: pointer;">{{item.PolicyName}}</font>
                    {{index == scope.row.policy.length-1 ? '' : '、'}}
                  </span>
                </div>
                <span v-show="scope.row.policy.length == 0">-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-radio-group>
      </el-tab-pane>
      <el-tab-pane :label="$t('CAM.userList.userToGroup')" name="third">
        <h3>
          {{$t('CAM.userList.userGropList')}}
          <span>（共{{userNum}}条）</span>
          <el-input
            :placeholder="$t('CAM.userList.searchUserGroup')"
            v-model="userInp"
            class="input-with-select"
            @change="_userInp"
          >
            <el-button slot="append" icon="el-icon-search" @click="_userSearch"></el-button>
          </el-input>
        </h3>
        <el-table
          :data="userData"
          max-height="520"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loadmore="debounce"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="GroupName"  :label="$t('CAM.userList.userName')"></el-table-column>
          <el-table-column  :label="$t('CAM.userList.userRemark')">
            <template slot-scope="scope">
              <p class="omit">{{scope.row.Remark}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('CAM.userList.RelatedPolicies')">
            <template slot-scope="scope">
              <div v-show="scope.row.policy != undefined" class="omit">
                <span v-for="(item,index) in scope.row.policy" :key="index">
                  <font style="color:#3E8EF7;cursor: pointer;">{{item.PolicyName}}</font>
                  {{index == scope.row.policy.length-1 ? '' : '、'}}
                </span>
              </div>
              <span v-show="scope.row.policy == []">-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
let timer;
export default {
  name: "step3",
  data() {
    return {
      policyInp: "",
      userInp: "",
      multipleSelection: [],
      //策略类型转换
      tacticsType: {
        1: "自定义策略",
        2: "预设策略"
      },
      activeName: "first",
      radio: ""
    };
  },
  props: {
    totalNum: Number,
    tableData: Array,
    userData: Array,
    userNum: Number,
    userDatas: Array
  },
  methods: {
    //用户
    _radio() {
      this.$emit("_userRadio", this.radio);
    },
    //防抖
    debounce() {
      let that = this;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        that.$emit("loadMore", that.activeName);
        timer = undefined;
      }, 1000);
    },
    //多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("handleSelectionChange", val);
    },
    //tab切换
    handleClick() {
      this.$emit("acitiveName", this.activeName);
    },
    //策略搜索
    _policySearch() {
      this.$emit("_policySearch", this.policyInp);
    },
    _policyInp() {
      this.$emit("_policyInp", this.policyInp);
    },
    //用户组搜索
    _userSearch() {
      this.$emit("_userSearch", this.userInp);
    },
    _userInp() {
      this.$emit("_userInp", this.userInp);
    }
  }
};
</script>

<style scoped lang='scss'>
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
  width: 220px;
  float: right;
}
h3 {
  margin-top: 5px;
  margin-bottom: 20px;
}
</style>