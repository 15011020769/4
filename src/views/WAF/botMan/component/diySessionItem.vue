<!--
 * @Author: your name
 * @Date: 2020-02-21 19:10:46
 * @LastEditTime: 2020-02-21 19:26:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/diySessionItem.vue
 -->
<template>
  <div>
    <div>
      <div @click="onClick" style="position: relative; width: 170px;">
        <span class="match-field">{{selectInfo.label}}</span>
        <i style="position: absolute; right: 35px; top: 10px;" slot="suffix" class="el-icon-arrow-down" />
      </div>
      <div class="menu-wrapper">
        <SelectMenu :selectInfo.sync="selectInfo" :showSelectMenu.sync="showSelectMenu" v-if="showSelectMenu" class="menu-box" />
      </div>
    </div>
    <el-input :style="`visibility: ${selectInfo.argplaceholder ? '' : 'hidden'}`" style="width: 213px;" :placeholder="selectInfo.argplaceholder" />
    <el-select class="Logical-select" v-model="selectValue">
      <el-option v-for="item in selectInfo.opoptions" :label="item | labelFilter" :value="item" />
    </el-select>
    <el-input v-model="input" class="content-input" :placeholder="selectInfo.placeholder" />
    <el-button class="delete-box">删除</el-button>
  </div>
</template>

<script>
import SelectMenu from './selectMenu'
export default {
  data() {
    return {
      // showSelectMenu: false, // 控制匹配字段展示信息
      selectValue: '', // 逻辑下拉保存信息
      input: ''
    }
  },
  props: {
    showSelectMenu: false,
    selectInfo: {}
  },

  components: {
    SelectMenu
  },
  
  methods: {
    onClick() {
      console.log(this.showSelectMenu);
      this.$emit('update:showSelectMenu', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.match-field {
  display: block;
  width: 150px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  font-size: 12px;
}
.Logical-select {
  margin-left: 15px;
  width: 76px;
}
.menu-wrapper {
  position: relative;
  // width: 763px;
  // height: 500px;
  .menu-box {
    position: absolute;
    z-index: 999999;
    width: 763px;
    // height: 500px;
    background: white;
    border: 1px solid #ddd;
  }
}

.content-input {
  width: 250px; 
  font-size: 12px;
  margin-left: 10px;
}

.delete-box {
  border: none;
  background: white;
  color: #808080;
  font-size: 12px;
}
</style>