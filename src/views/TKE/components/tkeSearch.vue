 <!-- 容器搜索组件 -->
<template>
  <div class="tke-search">
    <el-form :inline="true"  size="small">
      <el-form-item v-if='typeSelect' :label="typeLabel">
        <el-select v-model='selectValue'>
          <el-option 
            v-for="item in typeOptions" 
            :key="item.value"
            :label="item.label" 
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
          <el-input v-model="inputValue" :placeholder="inputPlaceholder"></el-input>
          <el-button icon="el-icon-search" ></el-button>
          <span v-if='refreshData'>
             <i class="el-icon-refresh tke-refresh "></i>
          </span>
          <span v-if='exportData'>
            <el-tooltip class="tooltip" effect="dark" content="導出表格" placement="top">
              <i class="el-icon-download tke-download "></i>
            </el-tooltip>
          </span>
      </el-form-item>
      
      <!-- <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item> --> 
    </el-form>
  </div>
</template>

<script>
export default {
  name: "tkeSearch",
  props: {
    typeSelect: { //是否有搜索下下拉选项
      type: Boolean,
      default: false
    },
    typeLabel:{ //下拉选择标题
      required: false,
      type: String
    },
    typeOptions: { //下拉选择选项列表
      required: false,
      type: Array
    },
    typeValue: { //下拉选择选中的值
      required: false,
      type: String
    },
    inputPlaceholder:{ //输入框体提示语
      required: true,
      type: String
    },
    searchInput: { //输入框值
      required: true,
      type: String
    },
    refreshData: { //是否有刷新
      type: Boolean,
      default: false
    },
    exportData: { //是否有导出数据
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectValue: this.typeValue,
      inputValue: this.searchInput,
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

    //点击搜索按钮
    clicksearch(val) {
      this.$emit("clicksearch", val);
    }
  }
};
</script>

<style lang="scss">
 .tke-download,.tke-refresh{
      font-size: 16px;
      padding: 8px;
      color: #666;
      cursor: pointer;
  }
  .tke-search .el-form--inline .el-form-item{
    display: inline-flex;
    margin-right: 0;
    .el-form-item__content{
      display: flex;
    }
    .el-form-item__label,.el-input--small{
      font-size: 12px
    }
    .el-button--small{
      height: 32px;
    }
  }
  
  .tke-search  .el-input__inner,
  .tke-search  .el-button {
    border-radius: 0;
  }
</style>
