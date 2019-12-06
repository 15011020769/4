<template>
  <div class="wrap">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="从策略列表中选取策略关联" name="first">
        <h3 style="margin-bottom:10px;">
          策略列表
          <span>（共{{totalNum}}条）</span>
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
        <h3 style="margin-bottom:10px;">
          用户组列表
          <span>（共{{userNum}}条）</span>
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("handleSelectionChange", val);
    },
    handleClick() {
      this.$emit("acitiveName", this.activeName);
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
</style>