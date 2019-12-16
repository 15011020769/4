<template>
  <div class="search-style">
    <el-select v-model="searchvalue" placeholder="請選擇" @change="changeValue" size="small">
      <el-option
        v-for="item in searchOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-input
      placeholder="請輸入IP或主機名"
      v-model="searchinput"
      size="small"
      class="input-with-select esach-inputL"
      @input="changeinput"
    ></el-input>
    <el-button
      @click="clicksearch(searchinput)"
      icon="el-icon-search"
      class="btn-style"
      size="small"
    ></el-button>
    <el-tooltip class="tooltip" effect="dark" content="導出表格" placement="top">
      <el-button @click="exportExcel" icon="el-icon-download" size="small" style="height:32px"></el-button>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  name: "SEARCH",
  props: {
    searchOptions: {
      // 地区列表
      required: true,
      type: Array
    },
    searchValue: {
      required: true,
      type: String
    },
    searchInput: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      searchvalue: this.searchValue,
      searchinput: this.searchInput
    };
  },
  methods: {
    //导出表格
    exportExcel() {
      this.$emit("exportExcel");
    },
    //选择搜索条件
    changeValue(val) {
      this.$emit("changeValue", val);
    },
    //输入时获取value
    changeinput(val) {
      this.$emit("changeinput", val);
    },
    //点击按钮获取value
    clicksearch(val) {
      this.$emit("clicksearch", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.search-style {
  display: flex;
  .esach-inputL {
    width: 300px;
  }
  .btn-style {
    height: 32px;
  }
}
</style>
