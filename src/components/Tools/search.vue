<template>
  <div>
    <el-input placeholder="请输入内容"
      v-model="searchInput"
      class="input-with-select">
      <el-select v-model="searchSelect"
        slot="prepend"
        placeholder="请选择">
        <el-option v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"></el-option>
      </el-select>
      <el-button slot="append"
        icon="el-icon-search"
        @click="search"></el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      // 下拉列表
      required: true,
      type: Array
    }
  },
  data () {
    return {
      searchInput: '', // 搜索
      searchSelect: '' // 下拉搜索
    }
  },
  created () {},
  methods: {
    search () {
      this.$emit('search', this.searchInput, this.searchSelect)
    }
  }
}
</script>

<style>
.el-input-group__prepend div.el-select .el-input__inner {
  height: 30px;
}
.el-select .el-input {
  width: 130px;
  height: 30px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  height: 30px;
}
.el-input-group > .el-input__inner {
  width: 220px;
  height: 30px;
}
</style>
