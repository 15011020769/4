<template>
  <div class="wrap">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="从策略列表中选取策略关联" name="first">
        <h3>
          策略列表
          <span>（共{{totalNum}}条）</span>
          <el-input
            placeholder="请输入策略名称"
            v-model="policyInp"
            class="input-with-select"
            @change="_policyInp"
          >
            <el-button slot="append" icon="el-icon-search" @click="_policySearch"></el-button>
          </el-input>
        </h3>
        <el-table
          :data="tableData"
          height="520"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loadmore="debounce"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="PolicyName" label="策略名" width="250"></el-table-column>
          <el-table-column label="描述" width="280">
            <template slot-scope="scope">
              <p class="omit">{{scope.row.Description}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="Attachments" label="引用次数"></el-table-column>
          <el-table-column prop="Type" label="策略类型">
            <template slot-scope="scope">
              <p>{{tacticsType[scope.row.Type]}}</p>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- <el-tab-pane label="复用现有用户策略" name="second">复用现有用户策略</el-tab-pane> -->
      <el-tab-pane label="添加至组获得随组权限" name="third">
        <h3>
          用户组列表
          <span>（共{{userNum}}条）</span>
          <el-input
            placeholder="请输入用户组名称"
            v-model="userInp"
            class="input-with-select"
            @change="_userInp"
          >
            <el-button slot="append" icon="el-icon-search" @click="_userSearch"></el-button>
          </el-input>
        </h3>
        <el-table
          :data="userData"
          height="520"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loadmore="debounce"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="GroupName" label="组名" width="250"></el-table-column>
          <el-table-column label="备注" width="280">
            <template slot-scope="scope">
              <p class="omit">{{scope.row.Remark}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="Attachments" label="已关联策略"></el-table-column>
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
      activeName: "first"
    };
  },
  props: {
    totalNum: Number,
    tableData: Array,
    userData: Array,
    userNum: Number
  },
  methods: {
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