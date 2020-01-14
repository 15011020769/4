<!--
 * @Author: your name
 * @Date: 2020-01-10 13:56:37
 * @LastEditTime : 2020-01-11 14:09:40
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/CSS/logManagement/Select.vue
 -->
<template>
  <div class="main">
    <div @click="showSelect = true">
      <el-input 
        :placeholder="showValue | showValueFilter" 
        suffix-icon="el-icon-arrow-down" 
        readonly 
        style="width: 180px" 
        />
    </div>
    <div v-if="showSelect" class="pop-box">
      <el-row class="pop-wrap" type="flex">
        <el-col class="pop-left">
          <el-input 
            key="input" 
            style="width: 180px" 
            v-model="inputValue"
            @keydown="handleFilter"
            >
            <i @click="handleFilter" slot="suffix" class="el-icon-search" />
            </el-input>
          <ul>
            <li>
              <el-checkbox @change="handleCheckAllChange" :indeterminate="isIndeterminate" v-model="checkAll">
                全部选项
              </el-checkbox>
            </li>
            <el-checkbox-group v-model="checkedList" @change="handleCheckedCitiesChange">
              <li v-for="item in selectList" :key="item.TargetDomain">
                <el-checkbox :label="item">
                  <p class="check-text">{{item.TargetDomain}}</p>
                </el-checkbox>
              </li>
            </el-checkbox-group>
          </ul>
        </el-col>

        <el-col class="pop-right">
          <ul class="color-888">
            <li @click="allUnSelect" style="text-align: right;" class="un-selecet">
              清空所有
            </li>
            <li class="check-text" v-for="item in checkedList" :key="item.TargetDomain">
              {{item.TargetDomain}}
            </li>
          </ul>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end" class="pop-footer">
        <el-button type="primary">确定</el-button>
        <el-button @click="showSelect = false">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectList: [],
      checkAll: false,
      isIndeterminate: true,
      checkedList: [],
      showSelect: false,
      showValue: '',
      inputValue: ''
    }
  },

  props: {
    dataList: {
      type: Array,
      default: []
    }
  },

  mounted() {
    this.selectList = JSON.parse(JSON.stringify(this.dataList))
  },

  watch: {
    checkedList: function(newValue) {
      this.$emit('update:PlayDomainsParams', newValue)
    }
  },

  methods: {
    handleCheckAllChange(val) {
      this.checkedList = val ? this.selectList : [];
      this.isIndeterminate = false;
      if (val) {
        this.showValue = this.selectList.reduce((prev, next) => {
          return next.TargetDomain + ';' + prev
        }, '')
        return
      }
      this.showValue = ''
    },

    allUnSelect() {
      this.inputValue = ''
      this.showValue = ''
      this.handleFilter()
    },

    handleFilter() {
      this.checkedList = []
      this.isIndeterminate = false;
      this.checkAll = false
      if (!this.inputValue.length) {
        this.selectList = [...this.dataList]
      }
      this.selectList = this.dataList.filter(item => (
        item.TargetDomain.includes(this.inputValue)
      ))
    },

    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.showValue = value.reduce((prev, next) => {
        return next.TargetDomain + ';' + prev
      }, '')
      this.checkAll = checkedCount === this.selectList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.selectList.length;
    }
  },

  filters: {
    showValueFilter: function(val) {
      return  val.length > 0 ? val : '选择域名'
    }
  }
}
</script>

<style lang="scss" scoped>
.main >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  line-height: 30px;
  padding-top: 0;
  overflow: hidden;
  cursor: pointer;
}
.main >>> .el-input__icon {
  line-height: 0;
}
.main >>> .el-checkbox {
  height: 30px;
  display: flex;
  align-items: center;
}
.main {
  height: 100%;
  position: relative;
  .pop-box {
    position: absolute;
  }
  .pop-wrap {
    margin-top: 5px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    .el-icon-search {
      transform: translateY(50%)
    }
    .pop-left,
    .pop-right {
      border-right: 1px solid #ddd;
      height: 250px;
      overflow-x: hidden;
      overflow-y: auto;
      width: 180px;
      & > ul > li {
        cursor: pointer;
        &:hover {
          background: #f2f2f2;
        }

        & > span {
          display: block;
          color: black;
          font-size: 12px;
          line-height: 30px;
          margin-left: 0;
          padding: 0 20px 0 10px;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      & >>> .el-checkbox {
        width: 100%;
        line-height: 30px;
        padding: 0 10px;
        &:hover {
          background: #f2f2f2;
        }
      }

      & >>> .el-checkbox__label {
        font-size: 12px;
        width: 150px;
      }
    }
  }
  .pop-footer {
    padding: 10px;
    background: #fff;
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    & >>> .el-button {
      padding: 0;
      border-radius: 0;
      & > span {
        display: inline-block;
        font-size: 12px;
        padding: 10px 20px;
      }
    }
  }
  .color-888 {
    color: #888 !important;
    & > li {
      line-height: 30px;
      padding-left: 10px;
    }
  }
  .un-selecet {
    text-align: right;
    padding: 0 10px;
    color: #006eff;
  }
  .check-text {
    // background: red;
    overflow-x: hidden;
    width: 95%;
    line-height: 30px;
    height: 30px;
    text-overflow: ellipsis;
  }
}
</style>